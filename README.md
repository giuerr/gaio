# Gaio — General Counsel

AI General Counsel specialising in private markets, fund formation, M&A, debt/credit, employment, corporate governance and investment documentation.

- **Slug:** `gaio`
- **Entry:** [`index.js`](./index.js)
- **Coverage:** 56 legal document types across 26 jurisdictions, backed by 79 official templates from 32 institutional sources.

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
