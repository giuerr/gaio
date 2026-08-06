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

// ─── Test harness endpoint (Agent Etna) ─────────────────────────────────
// Gaio's real surface is capability routes with structured bodies —
// engine.chat wants { messages: [...] }, so a developmental simulator
// posting the standard { message } -> { reply } shape got "messages array
// required" on every route it tried (2026-08-06: an entire simulation run
// died on HTTP 404/500 because of this shape mismatch). This adapter
// exposes the brain over the plain shape, ONLY when ETNA_AGENT_CHAT=1 is
// set (Agent Etna injects that in its sandbox); in normal production the
// flag is unset and this 404s, so the public surface is unchanged.
app.post('/api/chat', route(async (req, res) => {
  if (process.env.ETNA_AGENT_CHAT !== '1') return res.status(404).json({ error: 'Not found' });
  if (!hasLLMKey()) return res.status(503).json({ error: NO_KEY_MESSAGE });
  const message = req.body && (req.body.message || req.body.text);
  if (!message || typeof message !== 'string') return res.status(400).json({ error: 'message required' });
  const result = await engine.chat({ messages: [{ role: 'user', content: message }] });
  const reply = (result && (result.response || result.answer || result.message))
    || (result && result.blocked ? (result.reason || 'Request declined by scope guard.') : '');
  res.json({ reply: typeof reply === 'string' ? reply : JSON.stringify(reply) });
}));

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
