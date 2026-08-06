/**
 * GAIO — The General Counsel Agent
 *
 * Gaio is the General Counsel specialising in private markets, fund formation,
 * M&A, debt/credit, employment, corporate governance, and investment documentation.
 * He can draft, review, negotiate and advise on 56 legal document types across
 * 26 jurisdictions, backed by 79 official templates from 32 institutional sources.
 *
 * Jurisdictions (26): English, Delaware, Singapore, Hong Kong, Italian, French,
 *   Swedish, Danish, Spanish, German, Cayman, Luxembourg, BVI, DIFC, ADGM,
 *   Jersey, Guernsey, Irish, Swiss, Dutch, Norwegian, Finnish, Estonian, Lithuanian,
 *   Japanese, Korean
 *
 * Document categories (56 types): Fund formation & governance, Investor documents,
 *   Transaction & investment, M&A & deal, Broker & intermediary, Debt & credit,
 *   JV & partnership, Corporate governance, Employment & team, Regulatory & licensing
 */

'use strict';

const documentKB      = require('./document-kb');
const jurisdictions   = require('./jurisdictions');
const legalKB         = require('./legal-kb');
const legalCitations  = require('./legal-citations');
const dealMemory      = require('./deal-memory');
const agentBridge     = require('./agent-bridge');
const sandbox         = require('./sandbox');
const templateLibrary = require('./template-library');

// ── NANDA Principle 1: Verifiable Identity ──────────────────────────────────
// Machine-readable agent card following the A2A (Agent-to-Agent) spec.
// This is the canonical identity of Gaio — used for discovery, coordination,
// and attestation by other agents in the Antoninus/Tabularum ecosystem.

const AGENT_CARD = {
  name: 'Gaio',
  description: 'The General Counsel Agent — specialising in private markets, fund formation and investment documentation.',
  version: '3.0.0',
  protocol: 'a2a/1.0',
  owner: {
    name: 'Antoninus Global SPC',
    url: 'https://tabularum.io'
  },
  capabilities: [
    { id: 'advise',       name: 'Legal Advice',         description: 'Jurisdiction-specific legal advice with risk analysis' },
    { id: 'citedAdvise',  name: 'Cited Legal Advice',   description: 'Legal advice grounded in real citations from external legal databases' },
    { id: 'draft',        name: 'Document Drafting',    description: 'Complete execution-ready legal document drafts based on 79 official templates from 32 institutional sources' },
    { id: 'review',       name: 'Document Review',      description: 'Document review with red flag identification and market standard comparison' },
    { id: 'negotiate',    name: 'Clause Negotiation',   description: 'Clause negotiation with counter-language proposals and tactical guidance' },
    { id: 'validate',     name: 'Document Validation',  description: 'Completeness, consistency and execution-readiness checks' },
    { id: 'compare',      name: 'Redline Analysis',     description: 'Compare two document versions with material change analysis' },
    { id: 'chat',         name: 'Legal Q&A',            description: 'Multi-turn conversational legal Q&A' },
    { id: 'dealBrief',    name: 'Deal Brief',           description: 'Party obligation summary with deadline alerts and overdue analysis' },
    { id: 'dealMemory',   name: 'Deal Memory',          description: 'Track executed deals, obligations, MFN elections, side letter rights and fee arrangements' },
    { id: 'citations',    name: 'Legal Citations',      description: 'Search real legal cases, statutes and regulations across 12+ legal databases (US, UK, EU, Nordic, Baltic, Singapore, Hong Kong, Swiss, offshore)' },
    { id: 'templates',    name: 'Template Library',     description: '79 official templates from 32 institutional sources (ILPA, NVCA, Invest Europe, ESMA, SECA, OECD, SFDR, and 25 more)' },
    { id: 'compareJurisdictions', name: 'Cross-Jurisdiction Comparison', description: 'Compare legal treatment of clauses, structures, and regulatory requirements across 26 jurisdictions' },
    { id: 'docxExport',   name: 'DOCX Export',          description: 'Generate formatted Word documents with proper clause numbering, definitions, and signature blocks' },
  ],
  endpoints: [
    { path: '/gaio/agent-card',       method: 'GET',  description: 'Agent identity and capabilities (NANDA discovery)' },
    { path: '/gaio/status',            method: 'GET',  description: 'Operational status and statistics' },
    { path: '/gaio/advise',            method: 'POST', description: 'Legal advice' },
    { path: '/gaio/cited-advise',      method: 'POST', description: 'Advice with real legal citations' },
    { path: '/gaio/draft',             method: 'POST', description: 'Document drafting' },
    { path: '/gaio/review',            method: 'POST', description: 'Document review' },
    { path: '/gaio/negotiate',         method: 'POST', description: 'Clause negotiation' },
    { path: '/gaio/validate',          method: 'POST', description: 'Document validation' },
    { path: '/gaio/compare',           method: 'POST', description: 'Redline analysis' },
    { path: '/gaio/chat',              method: 'POST', description: 'Multi-turn legal Q&A' },
    { path: '/gaio/deal-brief',        method: 'POST', description: 'Party deal brief' },
    { path: '/gaio/deals',             method: 'GET',  description: 'Query executed deals' },
    { path: '/gaio/citations',         method: 'POST', description: 'Search legal citations' },
    { path: '/gaio/templates',         method: 'GET',  description: 'Template library' },
    { path: '/gaio/documents',         method: 'GET',  description: 'Supported document types' },
    { path: '/gaio/jurisdictions',     method: 'GET',  description: 'Supported jurisdictions' },
  ],
  documentTypes: Object.keys(require('./document-kb').getAllDocuments()).map(k => require('./document-kb').getAllDocuments()[k].id),
  jurisdictions: require('./jurisdictions').getAllJurisdictions().map(j => j.id),
  templateSources: Object.keys(require('./template-library').getTemplatesBySource()),
  citationSources: ['CourtListener', 'Caselaw Access Project', 'legislation.gov.uk', 'EUR-Lex', 'US Congress API', 'Federal Register', 'Lovdata (Norway)', 'Finlex (Finland)', 'Riigi Teataja (Estonia)', 'e-TAR (Lithuania)', 'Singapore Statutes Online', 'Hong Kong e-Legislation', 'Fedlex (Switzerland)'],
  security: {
    sandboxed: true,
    tenantIsolation: 'per-request',
    bridgeSigning: 'HMAC-SHA256',
    auditLog: true,
  },
  interoperability: {
    agents: ['livia', 'lucio', 'mila'],
    bridgeProtocol: 'file-based JSON messaging with HMAC-SHA256 signatures',
    messageTypes: [
      'deal_party_update', 'obligation_alert', 'legal_context',
      'crm_contact_data', 'meeting_context', 'investor_profile',
      'deal_flow', 'due_diligence_request', 'legal_dd_result', 'regulatory_flag',
      'ping', 'ack', 'error'
    ]
  },
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2026-04-04T00:00:00.000Z',
};

module.exports = {
  name: 'Gaio',
  description: 'The General Counsel Agent — specialising in private markets, fund formation and investment documentation.',
  AGENT_CARD,
  capabilities: AGENT_CARD.capabilities.map(c => c.description),
  documentKB,
  jurisdictions,
  legalKB,
  legalCitations,
  dealMemory,
  agentBridge,
  sandbox,
  templateLibrary
};

// Run directly ("node index.js") → boot the server. Render's default start
// command for this service points here rather than at server.js, and the
// library entry silently finishing was read as a crashed deploy
// ("Application exited early", 2026-08-06 — all four agents at once). The
// guard makes both entrypoints correct instead of depending on which one
// the platform was configured with. Placed after module.exports so the
// server's own require('./index') sees fully-populated exports.
if (require.main === module) {
  const app = require('./server');
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log('[boot] serving via index.js entrypoint on :' + PORT));
}
