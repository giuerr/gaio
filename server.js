/**
 * GAIO — Standalone server
 *
 * Runs Gaio as an independent service, with no dependency on the Tabularum
 * platform. Exposes the legal engine's core capabilities over HTTP.
 *
 *   PORT               listen port (default 3300)
 *   OPENROUTER_API_KEY required by the engine's AI-backed capabilities
 *   ANTHROPIC_API_KEY  fallback provider, used only when OpenRouter is absent
 *   ALLOWED_ORIGINS    comma-separated CORS whitelist (default: same-origin only)
 */

'use strict';

require('dotenv').config();

const express = require('express');
const cors    = require('cors');

const { hasLLMKey, NO_KEY_MESSAGE } = require('./llm-client');
const gaio   = require('./index');
const engine = require('./gaio-engine');

const { AGENT_CARD } = gaio;

const app = express();
// Legal documents are large; the engine's review/compare paths take full text.
app.use(express.json({ limit: '512kb' }));

const origins = (process.env.ALLOWED_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
if (origins.length) app.use(cors({ origin: origins }));

/** Wrap a handler so a rejection becomes a 500 rather than an unhandled rejection. */
function route(handler) {
  return (req, res) => Promise.resolve(handler(req, res)).catch((e) => {
    console.error(`[gaio] ${req.method} ${req.path} failed:`, e.message);
    if (!res.headersSent) res.status(500).json({ error: 'Request failed.' });
  });
}

// ── Identity & health ───────────────────────────────────────────────────────

app.get('/health', (_req, res) => {
  res.json({
    ok: true,
    agent: 'gaio',
    version: AGENT_CARD.version,
    ai: hasLLMKey(),
  });
});

app.get('/agent-card', (_req, res) => res.json(AGENT_CARD));

app.get('/status', (_req, res) => {
  res.json({
    ok: true,
    agent: AGENT_CARD.name,
    version: AGENT_CARD.version,
    capabilities: AGENT_CARD.capabilities.map(c => c.id),
    jurisdictions: Object.keys(gaio.jurisdictions.JURISDICTIONS || {}).length,
    documentTypes: Object.keys(gaio.documentKB.DOCUMENTS || {}).length,
  });
});

// ── Reference data (no AI key required) ─────────────────────────────────────

app.get('/jurisdictions', (_req, res) => {
  res.json({ ok: true, jurisdictions: Object.keys(gaio.jurisdictions.JURISDICTIONS || {}) });
});

app.get('/document-types', (_req, res) => {
  res.json({ ok: true, documentTypes: Object.keys(gaio.documentKB.DOCUMENTS || {}) });
});

app.get('/templates', (_req, res) => {
  res.json({ ok: true, templates: gaio.templateLibrary.getAllTemplates() });
});

// ── Engine capabilities ─────────────────────────────────────────────────────
// Each maps to the correspondingly named export on gaio-engine. The engine
// owns validation and its own prompt-injection boundary.

for (const capability of ['advise', 'citedAdvise', 'draft', 'review', 'negotiate', 'validate', 'compare', 'chat', 'dealBrief']) {
  app.post(`/${capability}`, route(async (req, res) => {
    if (!hasLLMKey()) {
      return res.status(503).json({ error: NO_KEY_MESSAGE });
    }
    const result = await engine[capability](req.body || {});
    res.json({ ok: true, result });
  }));
}

const PORT = process.env.PORT || 3300;

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Gaio — General Counsel v${AGENT_CARD.version} listening on ${PORT}`);
    if (!hasLLMKey()) {
      console.warn('No LLM key set — AI capabilities are disabled. Set OPENROUTER_API_KEY.');
    }
  });
}

module.exports = app;
