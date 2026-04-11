/**
 * GAIO — Deal Memory (Post-Execution Document Management)
 *
 * Tracks executed deals, party obligations, deadlines, MFN elections,
 * side letter rights and fee arrangements using a local JSON file store.
 *
 * Every party's full position is queryable so Gaio can reference prior
 * agreements when advising, drafting or negotiating.
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── ID GENERATION ────────────────────────────────────────────────────────────

function generateId() {
  try { return require('crypto').randomUUID(); }
  catch { return Date.now().toString(36) + Math.random().toString(36).slice(2); }
}

// ── STORE ────────────────────────────────────────────────────────────────────

const DEFAULT_STORE_PATH = path.join(__dirname, 'data', 'deals.json');

let _store     = null;
let _storePath = null;

const MAX_DEALS = 10000;
const MAX_OBLIGATIONS_PER_DEAL = 500;
const EMPTY_STORE = { version: 1, lastUpdated: null, deals: {} };

function initStore(filePath) {
  _storePath = filePath || DEFAULT_STORE_PATH;

  // Ensure directory exists
  const dir = path.dirname(_storePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(_storePath)) {
    try {
      _store = JSON.parse(fs.readFileSync(_storePath, 'utf8'));
      if (!_store.deals) _store.deals = {};
    } catch {
      _store = { ...EMPTY_STORE };
    }
  } else {
    _store = { ...EMPTY_STORE };
    _writeStore();
  }
  return _store;
}

function _ensureStore() {
  if (!_store) initStore();
}

function _writeStore() {
  _store.lastUpdated = new Date().toISOString();
  const tmp = _storePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(_store, null, 2), 'utf8');
  fs.renameSync(tmp, _storePath);
}

// ── VALIDATION ───────────────────────────────────────────────────────────────

function requireStr(val, name) {
  if (typeof val !== 'string' || !val.trim()) throw new Error(`${name} is required`);
  return val.trim();
}

// ── DEAL CRUD ────────────────────────────────────────────────────────────────

function addDeal(record) {
  if (!record || typeof record !== 'object') throw new Error('addDeal: record object is required.');
  _ensureStore();
  const id = generateId();
  const now = new Date().toISOString();

  const deal = {
    id,
    createdAt: now,
    updatedAt: now,
    status: record.status || 'executed',

    // Core
    documentType:  requireStr(record.documentType, 'documentType'),
    documentName:  record.documentName || '',
    jurisdiction:  record.jurisdiction || '',
    governingLaw:  record.governingLaw || '',
    executionDate: record.executionDate || now.substring(0, 10),
    effectiveDate: record.effectiveDate || null,
    expiryDate:    record.expiryDate || null,

    // Parties
    parties: Array.isArray(record.parties) ? record.parties.map(p => ({
      name: requireStr(p.name, 'party name'),
      role: p.role || '',
      entity: p.entity || ''
    })) : [],

    // Key terms (flexible key-value)
    keyTerms: record.keyTerms || {},

    // Sub-collections
    obligations:      [],
    mfnElections:     [],
    sideLetterRights: [],
    feeArrangements:  [],

    notes: record.notes || ''
  };

  if (Object.keys(_store.deals).length >= MAX_DEALS) {
    throw new Error(`addDeal: maximum deal limit (${MAX_DEALS}) reached. Archive or delete old deals first.`);
  }
  _store.deals[id] = deal;
  _writeStore();
  return { ok: true, dealId: id, deal };
}

function getDeal(dealId) {
  _ensureStore();
  const deal = _store.deals[dealId];
  return deal || null;
}

function updateDeal(dealId, updates) {
  _ensureStore();
  const deal = _store.deals[dealId];
  if (!deal) throw new Error(`updateDeal: deal ${dealId} not found.`);

  const immutable = new Set(['id', 'createdAt', 'obligations', 'mfnElections', 'sideLetterRights', 'feeArrangements']);
  for (const [k, v] of Object.entries(updates)) {
    if (!immutable.has(k)) deal[k] = v;
  }
  deal.updatedAt = new Date().toISOString();
  _writeStore();
  return { ok: true, deal };
}

function deleteDeal(dealId) {
  _ensureStore();
  if (!_store.deals[dealId]) throw new Error(`deleteDeal: deal ${dealId} not found.`);
  delete _store.deals[dealId];
  _writeStore();
  return { ok: true };
}

// ── DEAL QUERIES ─────────────────────────────────────────────────────────────

function queryDeals(filters = {}) {
  _ensureStore();
  let deals = Object.values(_store.deals);

  if (filters.party) {
    const p = filters.party.toLowerCase();
    deals = deals.filter(d => d.parties.some(pt => pt.name.toLowerCase().includes(p)));
  }
  if (filters.docType) {
    const dt = filters.docType.toLowerCase();
    deals = deals.filter(d => d.documentType.toLowerCase() === dt);
  }
  if (filters.jurisdiction) {
    const j = filters.jurisdiction.toLowerCase();
    deals = deals.filter(d => d.jurisdiction.toLowerCase() === j);
  }
  if (filters.status) {
    deals = deals.filter(d => d.status === filters.status);
  }
  if (filters.fromDate) {
    deals = deals.filter(d => (d.executionDate || '') >= filters.fromDate);
  }
  if (filters.toDate) {
    deals = deals.filter(d => (d.executionDate || '') <= filters.toDate);
  }

  return deals;
}

// ── OBLIGATIONS ──────────────────────────────────────────────────────────────

function addObligation(dealId, obligation) {
  _ensureStore();
  if (!dealId) throw new Error('addObligation: dealId is required.');
  if (!obligation || typeof obligation !== 'object') throw new Error('addObligation: obligation object is required.');
  const deal = _store.deals[dealId];
  if (!deal) throw new Error(`addObligation: deal ${dealId} not found.`);

  const obl = {
    id:          generateId(),
    party:       requireStr(obligation.party, 'party'),
    description: requireStr(obligation.description, 'description'),
    type:        obligation.type || 'contractual',     // reporting | financial | governance | regulatory | contractual
    deadline:    obligation.deadline || null,
    recurring:   obligation.recurring || null,          // { frequency: 'quarterly', nextDue: '2026-06-30' }
    status:      obligation.status || 'active',
    conditions:  obligation.conditions || '',
    createdAt:   new Date().toISOString(),
    completedAt: null
  };

  if (deal.obligations.length >= MAX_OBLIGATIONS_PER_DEAL) {
    throw new Error(`addObligation: deal ${dealId} has reached the maximum of ${MAX_OBLIGATIONS_PER_DEAL} obligations.`);
  }
  deal.obligations.push(obl);
  deal.updatedAt = new Date().toISOString();
  _writeStore();
  return { ok: true, dealId, obligationId: obl.id, obligation: obl };
}

function updateObligation(dealId, obligationId, updates) {
  _ensureStore();
  if (!dealId) throw new Error('updateObligation: dealId is required.');
  if (!obligationId) throw new Error('updateObligation: obligationId is required.');
  const deal = _store.deals[dealId];
  if (!deal) throw new Error(`updateObligation: deal ${dealId} not found.`);

  const obl = deal.obligations.find(o => o.id === obligationId);
  if (!obl) throw new Error(`updateObligation: obligation ${obligationId} not found in deal ${dealId}.`);

  for (const [k, v] of Object.entries(updates)) {
    if (k !== 'id' && k !== 'createdAt') obl[k] = v;
  }

  // If completing a recurring obligation, auto-create next occurrence
  if (updates.status === 'completed' && obl.recurring) {
    obl.completedAt = new Date().toISOString();
    const next = _advanceDate(obl.recurring.nextDue || obl.deadline, obl.recurring.frequency);
    if (next) {
      obl.recurring.nextDue = next;
      // Create new obligation for next period
      const nextObl = {
        id:          generateId(),
        party:       obl.party,
        description: obl.description,
        type:        obl.type,
        deadline:    next,
        recurring:   { frequency: obl.recurring.frequency, nextDue: next },
        status:      'active',
        conditions:  obl.conditions,
        createdAt:   new Date().toISOString(),
        completedAt: null
      };
      deal.obligations.push(nextObl);
    }
  }

  deal.updatedAt = new Date().toISOString();
  _writeStore();
  return { ok: true, obligation: obl };
}

function _advanceDate(dateStr, frequency) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;

  switch (frequency) {
    case 'weekly':    d.setDate(d.getDate() + 7); break;
    case 'monthly':   d.setMonth(d.getMonth() + 1); break;
    case 'quarterly': d.setMonth(d.getMonth() + 3); break;
    case 'annually':  d.setFullYear(d.getFullYear() + 1); break;
    default: return null;
  }
  return d.toISOString().substring(0, 10);
}

function queryObligations(filters = {}) {
  _ensureStore();
  const results = [];

  for (const deal of Object.values(_store.deals)) {
    if (filters.dealId && deal.id !== filters.dealId) continue;

    for (const obl of deal.obligations) {
      if (filters.party && !obl.party.toLowerCase().includes(filters.party.toLowerCase())) continue;
      if (filters.type && obl.type !== filters.type) continue;
      if (filters.status && obl.status !== filters.status) continue;

      const effectiveDeadline = obl.recurring?.nextDue || obl.deadline;
      if (filters.deadlineBefore && (!effectiveDeadline || effectiveDeadline > filters.deadlineBefore)) continue;
      if (filters.deadlineAfter && (!effectiveDeadline || effectiveDeadline < filters.deadlineAfter)) continue;

      results.push({ ...obl, dealId: deal.id, documentName: deal.documentName, documentType: deal.documentType });
    }
  }

  return results.sort((a, b) => {
    const da = a.recurring?.nextDue || a.deadline || '9999';
    const db = b.recurring?.nextDue || b.deadline || '9999';
    return da.localeCompare(db);
  });
}

function getUpcomingDeadlines(daysAhead = 30) {
  const today  = new Date();
  const cutoff = new Date(today);
  cutoff.setDate(cutoff.getDate() + daysAhead);

  return queryObligations({
    status: 'active',
    deadlineBefore: cutoff.toISOString().substring(0, 10),
    deadlineAfter:  today.toISOString().substring(0, 10)
  });
}

function getOverdueObligations() {
  const today = new Date().toISOString().substring(0, 10);
  _ensureStore();
  const results = [];

  for (const deal of Object.values(_store.deals)) {
    for (const obl of deal.obligations) {
      if (obl.status !== 'active') continue;
      const effectiveDeadline = obl.recurring?.nextDue || obl.deadline;
      if (effectiveDeadline && effectiveDeadline < today) {
        results.push({ ...obl, dealId: deal.id, documentName: deal.documentName, documentType: deal.documentType });
      }
    }
  }

  return results.sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
}

// ── MFN ELECTIONS ────────────────────────────────────────────────────────────

function addMFNElection(dealId, election) {
  _ensureStore();
  if (!dealId) throw new Error('addMFNElection: dealId is required.');
  if (!election || typeof election !== 'object') throw new Error('addMFNElection: election object is required.');
  const deal = _store.deals[dealId];
  if (!deal) throw new Error(`addMFNElection: deal ${dealId} not found.`);

  const mfn = {
    id:               generateId(),
    electedBy:        requireStr(election.electedBy, 'electedBy'),
    electedRight:     requireStr(election.electedRight, 'electedRight'),
    sourceLP:         election.sourceLP || 'anonymised',
    electionDate:     election.electionDate || new Date().toISOString().substring(0, 10),
    electionDeadline: election.electionDeadline || null,
    status:           election.status || 'pending'    // pending | elected | declined
  };

  deal.mfnElections.push(mfn);
  deal.updatedAt = new Date().toISOString();
  _writeStore();
  return { ok: true, dealId, mfnId: mfn.id, election: mfn };
}

// ── SIDE LETTER RIGHTS ───────────────────────────────────────────────────────

function addSideLetterRight(dealId, right) {
  _ensureStore();
  if (!dealId) throw new Error('addSideLetterRight: dealId is required.');
  if (!right || typeof right !== 'object') throw new Error('addSideLetterRight: right object is required.');
  const deal = _store.deals[dealId];
  if (!deal) throw new Error(`addSideLetterRight: deal ${dealId} not found.`);

  const slr = {
    id:       generateId(),
    party:    requireStr(right.party, 'party'),
    right:    requireStr(right.right, 'right'),
    category: right.category || 'contractual',   // governance | fee | reporting | co-investment | regulatory | transfer
    details:  right.details || '',
    status:   right.status || 'active'            // active | exercised | expired
  };

  deal.sideLetterRights.push(slr);
  deal.updatedAt = new Date().toISOString();
  _writeStore();
  return { ok: true, dealId, rightId: slr.id, right: slr };
}

// ── FEE ARRANGEMENTS ─────────────────────────────────────────────────────────

function addFeeArrangement(dealId, arrangement) {
  _ensureStore();
  if (!dealId) throw new Error('addFeeArrangement: dealId is required.');
  if (!arrangement || typeof arrangement !== 'object') throw new Error('addFeeArrangement: arrangement object is required.');
  const deal = _store.deals[dealId];
  if (!deal) throw new Error(`addFeeArrangement: deal ${dealId} not found.`);

  const fee = {
    id:             generateId(),
    party:          requireStr(arrangement.party, 'party'),
    type:           arrangement.type || 'custom',   // management_fee_discount | carry_reduction | expense_cap | fee_offset | custom
    description:    requireStr(arrangement.description, 'description'),
    terms:          arrangement.terms || '',
    effectiveFrom:  arrangement.effectiveFrom || null,
    effectiveUntil: arrangement.effectiveUntil || null
  };

  deal.feeArrangements.push(fee);
  deal.updatedAt = new Date().toISOString();
  _writeStore();
  return { ok: true, dealId, feeId: fee.id, arrangement: fee };
}

// ── BUILD DEAL CONTEXT FOR AI PROMPT ─────────────────────────────────────────

function buildDealContext(partyName) {
  if (!partyName) return '';
  _ensureStore();

  const deals = queryDeals({ party: partyName });
  if (deals.length === 0) return '';

  const sections = [];

  sections.push(`[DEAL MEMORY — ${partyName.toUpperCase()}]`);
  sections.push(`Gaio has records of ${deals.length} deal(s) involving this party.\n`);

  for (const deal of deals) {
    const partyRoles = deal.parties.map(p => `${p.name} (${p.role})`).join(', ');
    const lines = [
      `DEAL: ${deal.documentName || deal.documentType} [${deal.id.substring(0, 8)}]`,
      `  Status: ${deal.status} | Type: ${deal.documentType} | Jurisdiction: ${deal.jurisdiction}`,
      `  Executed: ${deal.executionDate || 'n/a'} | Effective: ${deal.effectiveDate || 'n/a'} | Expires: ${deal.expiryDate || 'n/a'}`,
      `  Parties: ${partyRoles}`,
    ];

    // Key terms
    const termEntries = Object.entries(deal.keyTerms || {});
    if (termEntries.length > 0) {
      lines.push('  Key Terms:');
      for (const [k, v] of termEntries) lines.push(`    • ${k}: ${v}`);
    }

    // Active obligations
    const activeObls = deal.obligations.filter(o => o.status === 'active' && o.party.toLowerCase().includes(partyName.toLowerCase()));
    if (activeObls.length > 0) {
      lines.push(`  Active Obligations (${activeObls.length}):`);
      for (const o of activeObls) {
        const deadline = o.recurring?.nextDue || o.deadline || 'ongoing';
        lines.push(`    • [${o.type}] ${o.description} — due: ${deadline} ${o.conditions ? `(${o.conditions})` : ''}`);
      }
    }

    // Side letter rights
    const activeRights = deal.sideLetterRights.filter(r => r.status === 'active' && r.party.toLowerCase().includes(partyName.toLowerCase()));
    if (activeRights.length > 0) {
      lines.push(`  Side Letter Rights (${activeRights.length}):`);
      for (const r of activeRights) lines.push(`    • [${r.category}] ${r.right} — ${r.details}`);
    }

    // MFN elections
    const mfns = deal.mfnElections.filter(m => m.electedBy.toLowerCase().includes(partyName.toLowerCase()));
    if (mfns.length > 0) {
      lines.push(`  MFN Elections (${mfns.length}):`);
      for (const m of mfns) lines.push(`    • ${m.electedRight} — status: ${m.status}`);
    }

    // Fee arrangements
    const fees = deal.feeArrangements.filter(f => f.party.toLowerCase().includes(partyName.toLowerCase()));
    if (fees.length > 0) {
      lines.push(`  Fee Arrangements (${fees.length}):`);
      for (const f of fees) lines.push(`    • [${f.type}] ${f.description} — ${f.terms}`);
    }

    sections.push(lines.join('\n'));
  }

  // Overdue alerts
  const overdue = getOverdueObligations().filter(o => o.party.toLowerCase().includes(partyName.toLowerCase()));
  if (overdue.length > 0) {
    sections.push(`⚠️ OVERDUE OBLIGATIONS (${overdue.length}):`);
    for (const o of overdue) {
      sections.push(`  • ${o.description} — was due: ${o.recurring?.nextDue || o.deadline} [${o.documentName || o.dealId}]`);
    }
  }

  // Upcoming deadlines (next 30 days)
  const upcoming = getUpcomingDeadlines(30).filter(o => o.party.toLowerCase().includes(partyName.toLowerCase()));
  if (upcoming.length > 0) {
    sections.push(`📅 UPCOMING DEADLINES (next 30 days, ${upcoming.length}):`);
    for (const o of upcoming) {
      sections.push(`  • ${o.description} — due: ${o.recurring?.nextDue || o.deadline} [${o.documentName || o.dealId}]`);
    }
  }

  return sections.join('\n\n');
}

// ── GET ALL DEALS (for summary/export) ───────────────────────────────────────

function getAllDeals() {
  _ensureStore();
  return Object.values(_store.deals);
}

function getDealStats() {
  _ensureStore();
  const deals = Object.values(_store.deals);
  const totalObligations = deals.reduce((sum, d) => sum + d.obligations.length, 0);
  const activeObligations = deals.reduce((sum, d) => sum + d.obligations.filter(o => o.status === 'active').length, 0);
  const overdue = getOverdueObligations().length;
  const upcoming = getUpcomingDeadlines(30).length;

  return {
    totalDeals: deals.length,
    byStatus: { executed: deals.filter(d => d.status === 'executed').length, pending: deals.filter(d => d.status === 'pending').length, terminated: deals.filter(d => d.status === 'terminated').length },
    totalObligations,
    activeObligations,
    overdueObligations: overdue,
    upcomingDeadlines30d: upcoming,
    totalMFNElections: deals.reduce((sum, d) => sum + d.mfnElections.length, 0),
    totalSideLetterRights: deals.reduce((sum, d) => sum + d.sideLetterRights.length, 0),
    totalFeeArrangements: deals.reduce((sum, d) => sum + d.feeArrangements.length, 0),
  };
}

// ── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  // Store
  initStore,

  // Deal CRUD
  addDeal,
  getDeal,
  updateDeal,
  deleteDeal,
  queryDeals,
  getAllDeals,
  getDealStats,

  // Obligations
  addObligation,
  updateObligation,
  queryObligations,
  getUpcomingDeadlines,
  getOverdueObligations,

  // MFN / Side Letters / Fees
  addMFNElection,
  addSideLetterRight,
  addFeeArrangement,

  // AI integration
  buildDealContext
};
