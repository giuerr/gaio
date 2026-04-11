/**
 * GAIO — Document Versioning & Redline Tracking Module
 *
 * Tracks document versions through negotiation rounds and provides
 * redline/diff capabilities for fund legal documents.
 *
 * Flow: GP Draft → LP Markup → GP Response → Agreed Form
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── Paths ───────────────────────────────────────────────────────────────────
const DATA_DIR  = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'doc-versions.json');

// ── Persistence ─────────────────────────────────────────────────────────────

function _ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
}

function _loadStore() {
  _ensureDataDir();
  if (!fs.existsSync(DATA_FILE)) return { documents: {} };
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return { documents: {} };
  }
}

function _saveStore(store) {
  _ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf8');
}

function _uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : crypto.randomBytes(16).toString('hex');
}

// ── Simple Diff Algorithm ───────────────────────────────────────────────────
// Paragraph-level diff using Longest Common Subsequence (LCS).

/**
 * Split text into paragraphs (double newline or clause headings).
 * Each paragraph keeps its leading clause ref if detectable.
 */
function _splitParagraphs(text) {
  if (!text) return [];
  return text
    .split(/\n{2,}/)
    .map(p => p.trim())
    .filter(Boolean);
}

/**
 * Try to extract a clause reference from a paragraph, e.g. "4.2" from "4.2 Management Fee".
 */
function _extractClauseRef(paragraph) {
  const m = paragraph.match(/^(\d+(?:\.\d+)*)\s/);
  return m ? m[1] : null;
}

/**
 * LCS table for two arrays of strings.
 */
function _lcsTable(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

/**
 * Back-track LCS to produce a diff sequence.
 * Returns array of { type: 'equal'|'added'|'removed', text, indexA?, indexB? }
 */
function _diffParagraphs(parasA, parasB) {
  const dp = _lcsTable(parasA, parasB);
  const ops = [];
  let i = parasA.length, j = parasB.length;

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && parasA[i - 1] === parasB[j - 1]) {
      ops.push({ type: 'equal', text: parasA[i - 1], indexA: i - 1, indexB: j - 1 });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      ops.push({ type: 'added', text: parasB[j - 1], indexB: j - 1 });
      j--;
    } else {
      ops.push({ type: 'removed', text: parasA[i - 1], indexA: i - 1 });
      i--;
    }
  }
  return ops.reverse();
}

/**
 * Pair removed+added ops that sit adjacent into 'modified' ops using simple
 * similarity heuristic (shared clause ref or >40% token overlap).
 */
function _pairModifications(ops) {
  const result = [];
  for (let k = 0; k < ops.length; k++) {
    const cur = ops[k];
    const nxt = ops[k + 1];
    if (cur.type === 'removed' && nxt && nxt.type === 'added' && _similar(cur.text, nxt.text)) {
      result.push({
        type: 'modified',
        from: cur.text,
        to: nxt.text,
        clause: _extractClauseRef(cur.text) || _extractClauseRef(nxt.text),
      });
      k++; // skip next
    } else {
      result.push({
        ...cur,
        clause: _extractClauseRef(cur.text),
      });
    }
  }
  return result;
}

function _similar(a, b) {
  const refA = _extractClauseRef(a), refB = _extractClauseRef(b);
  if (refA && refB && refA === refB) return true;
  const tokA = new Set(a.toLowerCase().split(/\s+/));
  const tokB = new Set(b.toLowerCase().split(/\s+/));
  let overlap = 0;
  for (const t of tokA) if (tokB.has(t)) overlap++;
  const union = new Set([...tokA, ...tokB]).size;
  return union > 0 && overlap / union > 0.4;
}

/**
 * Full structured diff between two texts.
 */
function _computeDiff(textA, textB) {
  const parasA = _splitParagraphs(textA);
  const parasB = _splitParagraphs(textB);
  const rawOps = _diffParagraphs(parasA, parasB);
  const paired = _pairModifications(rawOps);

  const added = [], removed = [], modified = [];
  for (const op of paired) {
    if (op.type === 'added')    added.push({ clause: op.clause, text: op.text });
    if (op.type === 'removed')  removed.push({ clause: op.clause, text: op.text });
    if (op.type === 'modified') modified.push({
      clause: op.clause,
      from: op.from,
      to: op.to,
      significance: classifyChange(op.from, op.to),
    });
  }
  return { added, removed, modified };
}

/**
 * Auto-compute a changes array suitable for version metadata.
 */
function _autoChanges(textA, textB) {
  const diff = _computeDiff(textA, textB);
  const changes = [];
  for (const m of diff.modified) {
    changes.push({
      clause: m.clause || 'unknown',
      type: 'modified',
      description: `Modified clause${m.clause ? ' ' + m.clause : ''}`,
      from: m.from.slice(0, 500),
      to: m.to.slice(0, 500),
    });
  }
  for (const a of diff.added) {
    changes.push({
      clause: a.clause || 'unknown',
      type: 'added',
      description: `Added clause${a.clause ? ' ' + a.clause : ''}`,
    });
  }
  for (const r of diff.removed) {
    changes.push({
      clause: r.clause || 'unknown',
      type: 'deleted',
      description: `Deleted clause${r.clause ? ' ' + r.clause : ''}`,
    });
  }
  return changes;
}

// ── Change Classification ───────────────────────────────────────────────────

const ECON_PATTERNS    = /\b(fee|carry|carried interest|management fee|hurdle|preferred return|clawback|waterfall|distribution|capital call|commitment|expense cap|org(?:aniz|anis)ational expense|broken[- ]deal)\b/i;
const GOV_PATTERNS     = /\b(vote|voting|removal|key[- ]man|advisory committee|LPAC|consent|quorum|supermajority|no[- ]fault|cause|suspension|dissolution|veto)\b/i;
const LEGAL_PATTERNS   = /\b(indemnif|liabilit|govern(?:ing)? law|arbitrat|jurisdict|limitation of|warranty|represent|covenant|force majeure|confidential|exclusion)\b/i;

/**
 * Classify a change between two text fragments.
 */
function classifyChange(oldText, newText) {
  const combined = (oldText || '') + ' ' + (newText || '');
  if (ECON_PATTERNS.test(combined))  return 'material_economic';
  if (GOV_PATTERNS.test(combined))   return 'material_governance';
  if (LEGAL_PATTERNS.test(combined)) return 'material_legal';

  // Check if substantive words changed or just formatting
  const norm = t => (t || '').toLowerCase().replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
  if (norm(oldText) === norm(newText)) return 'drafting';
  // Minimal word diff → clarification
  const wA = new Set(norm(oldText).split(' '));
  const wB = new Set(norm(newText).split(' '));
  let diff = 0;
  for (const w of wB) if (!wA.has(w)) diff++;
  for (const w of wA) if (!wB.has(w)) diff++;
  const total = new Set([...wA, ...wB]).size;
  if (total > 0 && diff / total < 0.15) return 'clarification';
  return 'clarification';
}

// ── Core CRUD Functions ─────────────────────────────────────────────────────

/**
 * Create a new tracked document with version 1.
 */
function createDocument(options = {}) {
  const { name, docType, jurisdiction, parties, content, label, author, dealId } = options;
  if (!name)    throw new Error('Document name is required');
  if (!content) throw new Error('Document content is required');

  const store = _loadStore();
  const id = _uuid();
  const now = new Date().toISOString();

  const doc = {
    id,
    name,
    docType:      docType || 'unknown',
    jurisdiction: jurisdiction || 'unknown',
    parties:      parties || [],
    dealId:       dealId || null,
    createdAt:    now,
    versions: [{
      version:   1,
      label:     label || 'Initial Draft',
      author:    author || 'Gaio / GP Counsel',
      timestamp: now,
      content,
      summary:   options.summary || 'Initial draft created',
      changes:   null,
    }],
    status: 'draft',
  };

  store.documents[id] = doc;
  _saveStore(store);
  return doc;
}

/**
 * Add a new version to an existing document.
 * Auto-computes changes array by diffing against previous version.
 */
function addVersion(docId, options = {}) {
  const { content, label, author, summary } = options;
  if (!content) throw new Error('Version content is required');

  const store = _loadStore();
  const doc = store.documents[docId];
  if (!doc) throw new Error(`Document not found: ${docId}`);

  const prev = doc.versions[doc.versions.length - 1];
  const changes = _autoChanges(prev.content, content);
  const now = new Date().toISOString();

  const ver = {
    version:   prev.version + 1,
    label:     label || `Version ${prev.version + 1}`,
    author:    author || 'Unknown',
    timestamp: now,
    content,
    summary:   summary || `Version ${prev.version + 1} submitted`,
    changes,
  };

  doc.versions.push(ver);
  if (doc.status === 'draft') doc.status = 'negotiating';
  _saveStore(store);
  return ver;
}

/**
 * Get full document with all versions.
 */
function getDocument(docId) {
  const store = _loadStore();
  return store.documents[docId] || null;
}

/**
 * Get just the latest version of a document.
 */
function getLatestVersion(docId) {
  const doc = getDocument(docId);
  if (!doc) return null;
  return doc.versions[doc.versions.length - 1];
}

/**
 * List documents, optionally filtered.
 */
function listDocuments(filter = {}) {
  const store = _loadStore();
  let docs = Object.values(store.documents);

  if (filter.docType)      docs = docs.filter(d => d.docType === filter.docType);
  if (filter.jurisdiction) docs = docs.filter(d => d.jurisdiction === filter.jurisdiction);
  if (filter.status)       docs = docs.filter(d => d.status === filter.status);
  if (filter.dealId)       docs = docs.filter(d => d.dealId === filter.dealId);

  return docs.map(d => ({
    id:           d.id,
    name:         d.name,
    docType:      d.docType,
    jurisdiction: d.jurisdiction,
    status:       d.status,
    dealId:       d.dealId,
    versionCount: d.versions.length,
    latestLabel:  d.versions[d.versions.length - 1].label,
    createdAt:    d.createdAt,
    updatedAt:    d.versions[d.versions.length - 1].timestamp,
  }));
}

/**
 * Update document status.
 */
function updateStatus(docId, status) {
  const allowed = ['draft', 'negotiating', 'agreed', 'executed'];
  if (!allowed.includes(status)) throw new Error(`Invalid status: ${status}. Must be: ${allowed.join(', ')}`);

  const store = _loadStore();
  const doc = store.documents[docId];
  if (!doc) throw new Error(`Document not found: ${docId}`);

  doc.status = status;
  _saveStore(store);
  return doc;
}

// ── Diff / Redline Functions ────────────────────────────────────────────────

/**
 * Compare two versions of a document.
 * Returns { added, removed, modified } with clause refs and significance.
 */
function diffVersions(docId, versionA, versionB) {
  const doc = getDocument(docId);
  if (!doc) throw new Error(`Document not found: ${docId}`);

  const verA = doc.versions.find(v => v.version === versionA);
  const verB = doc.versions.find(v => v.version === versionB);
  if (!verA) throw new Error(`Version ${versionA} not found`);
  if (!verB) throw new Error(`Version ${versionB} not found`);

  const diff = _computeDiff(verA.content, verB.content);
  // Enrich with significance
  for (const a of diff.added)   a.significance = classifyChange('', a.text);
  for (const r of diff.removed) r.significance = classifyChange(r.text, '');
  // modified already has significance from _computeDiff

  return {
    docId,
    docName: doc.name,
    fromVersion: versionA,
    fromLabel: verA.label,
    toVersion: versionB,
    toLabel: verB.label,
    added: diff.added,
    removed: diff.removed,
    modified: diff.modified,
    stats: {
      addedCount:    diff.added.length,
      removedCount:  diff.removed.length,
      modifiedCount: diff.modified.length,
      materialCount: [...diff.added, ...diff.removed, ...diff.modified]
        .filter(c => c.significance && c.significance.startsWith('material')).length,
    },
  };
}

/**
 * Generate a human-readable redline between two versions.
 * Uses [ADDED: ...], [DELETED: ...], [CHANGED: old → new] markers.
 */
function generateRedline(docId, versionA, versionB) {
  const doc = getDocument(docId);
  if (!doc) throw new Error(`Document not found: ${docId}`);

  const verA = doc.versions.find(v => v.version === versionA);
  const verB = doc.versions.find(v => v.version === versionB);
  if (!verA || !verB) throw new Error('Version not found');

  const parasA = _splitParagraphs(verA.content);
  const parasB = _splitParagraphs(verB.content);
  const rawOps = _diffParagraphs(parasA, parasB);
  const paired = _pairModifications(rawOps);

  const lines = [];
  lines.push(`REDLINE: "${doc.name}" — Version ${versionA} (${verA.label}) → Version ${versionB} (${verB.label})`);
  lines.push('='.repeat(80));
  lines.push('');

  for (const op of paired) {
    const sig = op.type === 'modified'
      ? classifyChange(op.from, op.to)
      : classifyChange(op.text || '', op.text || '');
    const sigTag = sig.startsWith('material') ? ` [${sig.toUpperCase()}]` : '';

    if (op.type === 'equal') {
      lines.push(op.text);
      lines.push('');
    } else if (op.type === 'added') {
      lines.push(`[ADDED:${sigTag} ${op.text}]`);
      lines.push('');
    } else if (op.type === 'removed') {
      lines.push(`[DELETED:${sigTag} ${op.text}]`);
      lines.push('');
    } else if (op.type === 'modified') {
      lines.push(`[CHANGED:${sigTag} ${op.from} → ${op.to}]`);
      lines.push('');
    }
  }

  return lines.join('\n');
}

// ── Negotiation Intelligence ────────────────────────────────────────────────

/**
 * Summarize the full negotiation history of a document.
 */
function getNegotiationSummary(docId) {
  const doc = getDocument(docId);
  if (!doc) throw new Error(`Document not found: ${docId}`);

  const rounds = doc.versions.length;
  // Collect all changed clauses across versions
  const clauseChangeCounts = {};
  const partyChanges = {};

  for (const ver of doc.versions) {
    if (!ver.changes) continue;
    const author = ver.author || 'Unknown';
    if (!partyChanges[author]) partyChanges[author] = { material: 0, minor: 0, concessions: [] };

    for (const ch of ver.changes) {
      const key = ch.clause || 'unknown';
      clauseChangeCounts[key] = (clauseChangeCounts[key] || 0) + 1;

      const sig = ch.from && ch.to ? classifyChange(ch.from, ch.to) : 'clarification';
      if (sig.startsWith('material')) {
        partyChanges[author].material++;
      } else {
        partyChanges[author].minor++;
      }
    }
  }

  // Contested clauses: changed more than once
  const contested = Object.entries(clauseChangeCounts)
    .filter(([, count]) => count > 1)
    .sort((a, b) => b[1] - a[1])
    .map(([clause, count]) => ({ clause, timesChanged: count }));

  // Outstanding material changes from latest version
  const latest = doc.versions[doc.versions.length - 1];
  const outstandingMaterial = (latest.changes || []).filter(ch => {
    const sig = ch.from && ch.to ? classifyChange(ch.from, ch.to) : 'clarification';
    return sig.startsWith('material');
  });

  return {
    docId,
    docName:   doc.name,
    status:    doc.status,
    rounds,
    parties:   doc.parties,
    contested,
    outstandingMaterialChanges: outstandingMaterial.length,
    outstandingChanges: outstandingMaterial.map(ch => ({
      clause:      ch.clause,
      type:        ch.type,
      description: ch.description,
    })),
    partyActivity: partyChanges,
    timeline: doc.versions.map(v => ({
      version: v.version,
      label:   v.label,
      author:  v.author,
      date:    v.timestamp,
      changeCount: v.changes ? v.changes.length : 0,
    })),
  };
}

/**
 * Track a specific clause through all versions of a document.
 */
function getClauseHistory(docId, clauseRef) {
  const doc = getDocument(docId);
  if (!doc) throw new Error(`Document not found: ${docId}`);

  const history = [];
  for (const ver of doc.versions) {
    // Find the paragraph in this version that matches the clause ref
    const paras = _splitParagraphs(ver.content);
    const match = paras.find(p => {
      const ref = _extractClauseRef(p);
      return ref === clauseRef;
    });

    // Find change records mentioning this clause
    const changeRecord = (ver.changes || []).find(ch => ch.clause === clauseRef);

    history.push({
      version:   ver.version,
      label:     ver.label,
      author:    ver.author,
      timestamp: ver.timestamp,
      text:      match || null,
      change:    changeRecord || null,
    });
  }

  return {
    docId,
    docName:   doc.name,
    clauseRef,
    history,
    timesModified: history.filter(h => h.change && h.change.type === 'modified').length,
  };
}

// ── Exports ─────────────────────────────────────────────────────────────────

module.exports = {
  createDocument,
  addVersion,
  getDocument,
  getLatestVersion,
  listDocuments,
  updateStatus,
  diffVersions,
  generateRedline,
  classifyChange,
  getNegotiationSummary,
  getClauseHistory,
};
