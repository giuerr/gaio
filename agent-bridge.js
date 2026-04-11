/**
 * GAIO — Agent Bridge (Inter-Agent Communication)
 *
 * Allows Gaio to communicate with other Antoninus/Tabularum agents:
 * - Clara (Operations Lead): receive contact/CRM data, push deal party info
 * - Lucio (Investment Principal): receive deal flow, push legal context
 * - Mila (Finance Principal): receive fund data, push legal context
 * - Livia (Executive Assistant): scheduling, task coordination
 * - Future agents: extensible protocol
 *
 * Communication protocol:
 * - Each agent exposes a message inbox (JSON file in shared location or HTTP endpoint)
 * - Messages are structured with sender, recipient, type, payload, timestamp
 * - Gaio can SEND legal context to other agents and RECEIVE CRM/deal data
 * - All data flowing through the bridge is scoped to the current tenant sandbox
 *
 * Security:
 * - Messages are signed with a shared secret (AGENT_BRIDGE_SECRET env var)
 * - Payload is validated before processing
 * - No raw filesystem paths are shared — only structured data
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const crypto = require('crypto');

// ── AGENT REGISTRY ───────────────────────────────────────────────────────────

const AGENTS = {
  gaio: {
    id: 'gaio',
    name: 'Gaio',
    role: 'General Counsel',
    capabilities: ['legal-advice', 'document-drafting', 'deal-tracking', 'citation-search'],
    inboxDir: path.join(__dirname, 'data', 'bridge', 'inbox'),
    outboxDir: path.join(__dirname, 'data', 'bridge', 'outbox'),
  },
  livia: {
    id: 'livia',
    name: 'Livia',
    role: 'Executive Assistant',
    capabilities: ['crm-lookup', 'contact-management', 'meeting-scheduling', 'telegram-messaging'],
    // Livia's inbox — Gaio writes here, Livia reads
    inboxDir: null,  // Set via configureBridge() or env var
  },
  lucio: {
    id: 'lucio',
    name: 'Lucio',
    role: 'Investment Principal',
    capabilities: ['deal-sourcing', 'market-intelligence', 'portfolio-analysis', 'valuation'],
    inboxDir: null,
  },
  mila: {
    id: 'mila',
    name: 'Mila',
    role: 'Finance Principal',
    capabilities: ['fund-accounting', 'reporting', 'compliance', 'investor-relations'],
    inboxDir: null,
  }
};

// ── MESSAGE SCHEMA ───────────────────────────────────────────────────────────
// {
//   id:        string (UUID),
//   from:      string (agent ID),
//   to:        string (agent ID),
//   type:      string (message type),
//   payload:   object (structured data),
//   tenantId:  string (sandbox scope),
//   timestamp: string (ISO),
//   signature: string (HMAC-SHA256 of payload)
// }

// ── MESSAGE TYPES ────────────────────────────────────────────────────────────

const MESSAGE_TYPES = {
  // Gaio -> Livia
  DEAL_PARTY_UPDATE:    'deal_party_update',       // New deal party info for CRM
  OBLIGATION_ALERT:     'obligation_alert',         // Upcoming deadline or overdue alert
  LEGAL_CONTEXT:        'legal_context',            // Legal context for a contact

  // Livia -> Gaio
  CRM_CONTACT_DATA:     'crm_contact_data',         // Contact/company info from CRM
  MEETING_CONTEXT:      'meeting_context',           // Upcoming meeting context
  INVESTOR_PROFILE:     'investor_profile',          // Investor profile for negotiation

  // Lucio -> Gaio
  DEAL_FLOW:            'deal_flow',                 // New deal opportunity
  DUE_DILIGENCE_REQ:    'due_diligence_request',     // Request for legal DD

  // Gaio -> Lucio
  LEGAL_DD_RESULT:      'legal_dd_result',           // Legal DD findings
  REGULATORY_FLAG:      'regulatory_flag',           // Regulatory issue flagged

  // Generic
  PING:                 'ping',
  ACK:                  'ack',
  ERROR:                'error',
};

// ── BRIDGE CONFIG ────────────────────────────────────────────────────────────

let _bridgeSecret = process.env.AGENT_BRIDGE_SECRET || null;
let _configured   = false;

function configureBridge(config = {}) {
  if (config.secret) _bridgeSecret = config.secret;

  // Register agent inbox paths
  if (config.liviaInbox) AGENTS.livia.inboxDir = config.liviaInbox;
  if (config.lucioInbox) AGENTS.lucio.inboxDir = config.lucioInbox;
  if (config.milaInbox) AGENTS.mila.inboxDir = config.milaInbox;

  // Ensure Gaio's inbox/outbox dirs exist
  for (const dir of [AGENTS.gaio.inboxDir, AGENTS.gaio.outboxDir]) {
    if (dir && !fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  _configured = true;
  return { ok: true, agents: Object.keys(AGENTS) };
}

// ── SIGNING ──────────────────────────────────────────────────────────────────

function _signPayload(payload) {
  if (!_bridgeSecret) return 'unsigned';
  return crypto.createHmac('sha256', _bridgeSecret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

function verifySignature(message) {
  if (!_bridgeSecret) return true;   // No secret = skip verification (dev mode)
  const expected = _signPayload(message.payload);
  return message.signature === expected;
}

// ── SEND MESSAGE ─────────────────────────────────────────────────────────────

function sendMessage(to, type, payload, tenantId = 'default') {
  const agent = AGENTS[to];
  if (!agent) throw new Error(`Unknown agent: ${to}`);

  const message = {
    id:        crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(36) + Math.random().toString(36).slice(2),
    from:      'gaio',
    to:        to,
    type:      type,
    payload:   payload,
    tenantId:  tenantId,
    timestamp: new Date().toISOString(),
    signature: _signPayload(payload)
  };

  // Write to recipient's inbox if path is configured
  if (agent.inboxDir) {
    if (!fs.existsSync(agent.inboxDir)) fs.mkdirSync(agent.inboxDir, { recursive: true });
    const msgFile = path.join(agent.inboxDir, `${message.id}.json`);
    fs.writeFileSync(msgFile, JSON.stringify(message, null, 2), 'utf8');
  }

  // Also save to Gaio's outbox for audit trail
  if (AGENTS.gaio.outboxDir) {
    if (!fs.existsSync(AGENTS.gaio.outboxDir)) fs.mkdirSync(AGENTS.gaio.outboxDir, { recursive: true });
    const outFile = path.join(AGENTS.gaio.outboxDir, `${message.id}.json`);
    fs.writeFileSync(outFile, JSON.stringify(message, null, 2), 'utf8');
  }

  return { ok: true, messageId: message.id, to, type };
}

// ── RECEIVE MESSAGES ─────────────────────────────────────────────────────────

function receiveMessages(options = {}) {
  const inboxDir = AGENTS.gaio.inboxDir;
  if (!inboxDir || !fs.existsSync(inboxDir)) return [];

  const files = fs.readdirSync(inboxDir).filter(f => f.endsWith('.json'));
  const messages = [];

  for (const file of files) {
    try {
      const msg = JSON.parse(fs.readFileSync(path.join(inboxDir, file), 'utf8'));

      // Filter by type if specified
      if (options.type && msg.type !== options.type) continue;
      // Filter by sender
      if (options.from && msg.from !== options.from) continue;
      // Filter by tenant
      if (options.tenantId && msg.tenantId !== options.tenantId) continue;

      // Verify signature
      if (!verifySignature(msg)) {
        console.warn(`[GAIO bridge] Invalid signature on message ${msg.id} — skipping`);
        continue;
      }

      messages.push({ ...msg, _file: file });
    } catch {
      // Skip malformed messages
    }
  }

  return messages.sort((a, b) => (a.timestamp || '').localeCompare(b.timestamp || ''));
}

/**
 * Process and delete a message after handling it.
 */
function acknowledgeMessage(messageId) {
  const inboxDir = AGENTS.gaio.inboxDir;
  if (!inboxDir) return;

  const files = fs.readdirSync(inboxDir).filter(f => f.endsWith('.json'));
  for (const file of files) {
    if (file.startsWith(messageId) || file === `${messageId}.json`) {
      fs.unlinkSync(path.join(inboxDir, file));
      return { ok: true, messageId };
    }
  }
  return { ok: false, error: 'Message not found' };
}

// ── CONVENIENCE: SEND DEAL PARTY TO LIVIA CRM ───────────────────────────────

function notifyLiviaDealParty(deal, tenantId) {
  return sendMessage('livia', MESSAGE_TYPES.DEAL_PARTY_UPDATE, {
    dealId:       deal.id,
    documentType: deal.documentType,
    documentName: deal.documentName,
    parties:      deal.parties,
    keyTerms:     deal.keyTerms,
    executionDate: deal.executionDate,
    jurisdiction:  deal.jurisdiction
  }, tenantId);
}

function notifyLiviaObligationAlert(obligation, deal, tenantId) {
  return sendMessage('livia', MESSAGE_TYPES.OBLIGATION_ALERT, {
    dealId:       deal.id,
    documentName: deal.documentName,
    obligation: {
      party:       obligation.party,
      description: obligation.description,
      deadline:    obligation.recurring?.nextDue || obligation.deadline,
      status:      obligation.status,
      type:        obligation.type
    }
  }, tenantId);
}

// ── CONVENIENCE: RECEIVE CRM DATA FROM LIVIA ────────────────────────────────

function getLiviaContactData(tenantId) {
  return receiveMessages({
    from: 'livia',
    type: MESSAGE_TYPES.CRM_CONTACT_DATA,
    tenantId
  });
}

function getLiviaInvestorProfiles(tenantId) {
  return receiveMessages({
    from: 'livia',
    type: MESSAGE_TYPES.INVESTOR_PROFILE,
    tenantId
  });
}

// ── CONVENIENCE: LUCIO DEAL FLOW ─────────────────────────────────────────────

function getLucioDealFlow(tenantId) {
  return receiveMessages({
    from: 'lucio',
    type: MESSAGE_TYPES.DEAL_FLOW,
    tenantId
  });
}

function sendLegalDDResult(payload, tenantId) {
  return sendMessage('lucio', MESSAGE_TYPES.LEGAL_DD_RESULT, payload, tenantId);
}

// ── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  // Config
  configureBridge,
  AGENTS,
  MESSAGE_TYPES,

  // Core messaging
  sendMessage,
  receiveMessages,
  acknowledgeMessage,
  verifySignature,

  // Livia integration
  notifyLiviaDealParty,
  notifyLiviaObligationAlert,
  getLiviaContactData,
  getLiviaInvestorProfiles,

  // Lucio integration
  getLucioDealFlow,
  sendLegalDDResult,
};
