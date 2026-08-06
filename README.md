# Gaio — General Counsel

AI General Counsel specialising in private markets, fund formation, M&A, debt/credit, employment, corporate governance and investment documentation.

- **Slug:** `gaio`
- **Entry:** [`index.js`](./index.js)
- **Coverage:** 56 legal document types across 26 jurisdictions, backed by 79 official templates from 32 institutional sources.

## Three layers

| Layer | Location |
|---|---|
| **Core** (this folder) | [`agents/gaio/`](.) — agent card, legal KB, jurisdictions, templates, DOCX export |
| **Backend HTTP** | [`backend/src/agents/gaio/`](../../backend/src/agents/gaio) — `route.js`, engine, KB, deal memory |
| **Frontend page** | [`frontend/tabularum-gaio.html`](../../frontend/tabularum-gaio.html) |
| **Frontend JS** | [`frontend/js/pages/gaio.js`](../../frontend/js/pages/gaio.js) |

## Capabilities

- **Advise** — jurisdiction-specific legal advice with risk analysis ([`gaio-engine.js`](./gaio-engine.js))
- **Cited advise** — grounded in real citations ([`legal-citations.js`](./legal-citations.js), [`legal-kb.js`](./legal-kb.js))
- **Draft** — execution-ready documents from the official template library ([`template-library.js`](./template-library.js), [`templates/`](./templates))
- **Review / validate / negotiate** — red-flag detection, market-standard comparison, counter-language proposals
- **Jurisdiction compare** — side-by-side legal regime analysis ([`jurisdiction-compare.js`](./jurisdiction-compare.js), [`jurisdictions.js`](./jurisdictions.js))
- **Deal memory** — persistent per-deal knowledge ([`deal-memory.js`](./deal-memory.js), [`data/deals.json`](./data/deals.json))
- **DOCX export** — institutional-style document generation ([`docx-export.js`](./docx-export.js), [`doc-versions.js`](./doc-versions.js))
- **Inter-agent bridge** — coordination with Lucio / Mila / Clara ([`agent-bridge.js`](./agent-bridge.js))
- **Sandbox** — isolated execution for untrusted inputs ([`sandbox.js`](./sandbox.js))

## Jurisdictions

English, Delaware, Singapore, Hong Kong, Italian, French, Swedish, Danish, Spanish, German, Cayman, Luxembourg, BVI, DIFC, ADGM, Jersey, Guernsey, Irish, Swiss, Dutch, Norwegian, Finnish, Estonian, Lithuanian, Japanese, Korean.

## Template sources

EC, ESMA, EFAMA, FCA, ICC, ILPA, IRS, NVCA, OECD, SECA — see [`templates/`](./templates) for the full library.

## Dependencies

- Shared institutional layer: [`packages/institutional-core`](../../packages/institutional-core)
- Node ≥ 18

See [`BUILD-PLAN.md`](./BUILD-PLAN.md) for the active roadmap.

## Connecting a simulator or harness (Agent Etna)

This agent exposes the same surface every Tabularum agent does, so a harness
needs no per-agent knowledge:

| | |
|---|---|
| `GET /health` | liveness, and whether a model is reachable |
| `GET /agent-card` | identity |
| `GET /tools` | the callable contract, as JSON Schema |
| `POST /task` | `{ goal }` — runs the reasoning loop, returns the answer and the full trace |
| `POST /chat` | the same loop, conversational shape |
| `POST /v1/chat/completions` | the same, in OpenAI response shape |

The chat endpoints accept `goal`, `task`, `message`, `input`, `prompt`,
`query`, `text`, `question`, `content`, or an OpenAI-style `messages` array,
and answer `400` naming what they accept rather than `500` when a body has
none of them. The reply is under `response`, and mirrored as `reply` and
`content`.

`/api/chat` is deliberately left to this repository's own handler.

### It runs with no configuration

The service boots and answers with nothing set at all, which is what a sandbox
gives it. Without a model key the reasoning endpoints return `ok: false` and
`stopReason: "no_llm_key"` rather than failing to start, so a harness sees a
live agent that is unconfigured instead of a dead process.

Set `OPENROUTER_API_KEY` to make it think.

### Authentication

`/task` and `/chat` run the model, so they are gated as soon as any of
`AGENT_TASK_TOKEN`, `AGENT_PASSWORD` or `DASHBOARD_PASSWORD` is set. The secret
may arrive as `Authorization: Bearer <secret>`, `X-Agent-Password` or
`X-Api-Key`.

With none of them set the endpoints are open. That is what makes a zero-config
sandbox work — and why any deployment reachable from the internet should set
one, or it is an unauthenticated endpoint spending your inference credit.
