# GAIO BUILD PLAN — Fund Lawyer Agent

## Overview

Gaio is TABULARUM's AI fund lawyer. This plan structures the complete build-out
of Gaio's capabilities across all jurisdictions and document types, executed in
four phases with clear milestones.

**Target:** 28 document types across 26 jurisdictions = 728 document-jurisdiction
combinations, each with full knowledge base, drafting capability, review/redline,
negotiation intelligence, and compliance validation.

---

## PHASE 0 — Jurisdiction Consolidation

**Goal:** Bring all 20 jurisdictions to institutional depth before building documents.

### Current State (13 jurisdictions)

| Tier | Jurisdictions | Action |
|------|--------------|--------|
| Deep (A) | Cayman, Luxembourg, BVI | Maintain — already institutional-grade |
| Solid (B) | English, Delaware, Singapore, Hong Kong | Upgrade to A-tier depth |
| Moderate (C) | Germany, Italy, France, Spain, Sweden | Upgrade to B-tier minimum |
| Light (D) | Denmark | Upgrade to B-tier minimum |

### New Jurisdictions to Add (7)

| Jurisdiction | ID | Why | Priority |
|---|---|---|---|
| UAE — DIFC | `difc` | Gulf LP base, DIFC fund vehicles, English common law courts | HIGH |
| UAE — ADGM | `adgm` | Abu Dhabi fund hub, FSRA regulation, competing with DIFC | HIGH |
| Jersey | `jersey` | Major offshore fund domicile, JFSC, EU NPPR marketing | HIGH |
| Guernsey | `guernsey` | Alternative to Jersey, GFSC, PIF regime | MEDIUM |
| Ireland | `ireland` | Largest EU fund domicile for UCITS, ICAV, Section 110, CBI | HIGH |
| Switzerland | `switzerland` | Major LP base (pension, family offices), FINMA, LP-KmGK | MEDIUM |
| Netherlands | `netherlands` | Holding company hub, FGR, Dutch CV, participation exemption | MEDIUM |

### Consolidation Steps

```
Step 0.1  Add 7 new jurisdictions to jurisdictions.js (deep knowledge for each)
Step 0.2  Upgrade English, Delaware, Singapore, HK to A-tier
          - Add fund structure detail blocks (like Cayman's elpKey)
          - Add tax regime blocks (like Luxembourg's taxRegime)
          - Add regulatory deep dives
Step 0.3  Upgrade Italy, France, Germany, Spain, Sweden, Denmark to B-tier
          - Expand from 8 to 15+ features each
          - Add fund structure details
          - Add jurisdiction-specific regulatory requirements
Step 0.4  Add cross-jurisdiction comparison tables
          - Cayman vs Luxembourg vs Ireland vs Jersey (fund domicile)
          - DIFC vs ADGM (UAE comparison)
          - English vs Delaware (governing law for SPAs)
Step 0.5  Update legal-kb.js regulatory blocks
          - Add DIFC/ADGM regulatory framework
          - Add Jersey/Guernsey funds law
          - Add Irish CBI requirements
          - Add FINMA/CISA framework
          - Add AFM/Dutch regulatory framework
Step 0.6  Test: every jurisdiction returns complete context for every document type
```

### Milestone: 20 jurisdictions, all at B-tier or above

---

## PHASE 1 — Core Fund Formation Documents (8 new types)

**Goal:** A GP can launch a fund using only Gaio-drafted documents.

| # | Document Type | ID | Complexity | Template Source |
|---|---|---|---|---|
| 1 | Investment Management Agreement | `ima` | HIGH | Custom (no standard model) |
| 2 | GP Operating Agreement | `gp_operating_agreement` | HIGH | Custom / Delaware LLC template |
| 3 | Articles of Association / COI | `articles_of_association` | HIGH | NVCA COI (expand multi-jur) |
| 4 | KYC/AML Attestation Forms | `kyc_aml` | MEDIUM | FATF guidelines |
| 5 | Carried Interest / Mgmt Equity Plans | `carry_plan` | HIGH | Custom |
| 6 | Co-Investment Agreements | `co_investment` | HIGH | Custom |
| 7 | Disclosure Letters | `disclosure_letter` | MEDIUM | Custom (SPA companion) |
| 8 | ESG / SFDR Disclosure | `esg_sfdr` | HIGH | Invest Europe / SFDR templates |

### For each document type, build:

```
1. Knowledge Base Entry (document-kb.js)
   - id, name, shortName, aliases
   - purpose (2-3 sentences)
   - types/variations
   - keyClauses (8-15 per document, each with name + description)
   - redFlags (5-10 per document)
   - negotiationTips (4-8 per document)
   - jurisdictionNotes (key differences across 20 jurisdictions)

2. Legal Knowledge (legal-kb.js)
   - Market standard terms table (standard / LP-friendly / GP-friendly / red line)
   - Regulatory requirements per jurisdiction
   - Case law principles applicable to this document type
   - Negotiation intelligence by counterparty type

3. Template Reference (template-library.js)
   - Link to official template where available
   - Citation label
   - Key features of base template
   - Applicable jurisdictions

4. Engine Integration (gaio-engine.js)
   - Document type detection in detectDocumentType()
   - Drafting mode prompt construction
   - Review mode prompt construction
   - Negotiation mode prompt construction

5. Testing
   - Draft test for 3 jurisdictions (Cayman, English, Luxembourg)
   - Review test with sample document
   - Negotiation test with sample clause
```

### Phase 1 Build Order

```
1.1  IMA — because it's the agreement between the fund and the manager
1.2  GP Operating Agreement — governs the GP entity itself
1.3  Articles of Association / COI — corporate constitution documents
1.4  Carried Interest / Management Equity Plans — GP economics
1.5  Co-Investment Agreements — co-invest SPV documentation
1.6  Disclosure Letters — SPA companion, needed for M&A capability
1.7  KYC/AML Attestation Forms — investor onboarding compliance
1.8  ESG / SFDR Disclosure — mandatory EU regulatory disclosure
```

### Milestone: 17 document types (9 existing + 8 new), all across 20 jurisdictions

---

## PHASE 2 — Transaction & Lifecycle Documents (6 new types)

**Goal:** Gaio handles the full fund lifecycle — from launch through secondaries.

| # | Document Type | ID | Complexity | Template Source |
|---|---|---|---|---|
| 9 | Shareholder Agreements | `shareholder_agreement` | HIGH | Custom |
| 10 | Transfer Agreements (secondary) | `transfer_agreement` | HIGH | Custom |
| 11 | Letter of Intent (LOI) | `loi` | LOW | Custom |
| 12 | Investment Agreements (direct deals) | `investment_agreement` | HIGH | Custom |
| 13 | Service Provider Contracts | `service_provider` | MEDIUM | Custom |
| 14 | Marketing & Distribution Agreements | `distribution_agreement` | MEDIUM | Custom |

### Phase 2 Build Order

```
2.1  Shareholder Agreements — portfolio company governance
2.2  Transfer Agreements — LP secondary market sales
2.3  Investment Agreements — direct deal documentation
2.4  Service Provider Contracts — admin, custodian, auditor, legal
2.5  Marketing & Distribution Agreements — fund distribution
2.6  LOI — pre-transaction letters of intent
```

### Milestone: 23 document types across 20 jurisdictions

---

## PHASE 3 — Regulatory & Compliance Documents (5 new types)

**Goal:** Gaio handles regulatory filings and internal compliance.

| # | Document Type | ID | Complexity | Template Source |
|---|---|---|---|---|
| 15 | Form ADV / Form PF | `form_adv_pf` | HIGH | SEC templates |
| 16 | Compliance Manual | `compliance_manual` | HIGH | Custom |
| 17 | Form D / Reg D Filing | `form_d` | MEDIUM | SEC template |
| 18 | Investor Questionnaire | `investor_questionnaire` | LOW | ILPA DDQ |
| 19 | CRS Self-Certification | `crs_self_cert` | MEDIUM | OECD template |

### Phase 3 Build Order

```
3.1  Compliance Manual — internal policies and procedures
3.2  Form ADV / Form PF — US SEC investment adviser registration
3.3  Investor Questionnaire — LP due diligence and suitability
3.4  Form D / Reg D Filing — US securities offering filing
3.5  CRS Self-Certification — global tax reporting self-cert
```

### Milestone: 28 document types across 20 jurisdictions

---

## PHASE 4 — Tabularum Integration & Production Hardening

**Goal:** Everything synced to Tabularum, API routes live, frontend updated.

```
4.1  Sync all Gaio modules to Tabularum backend/src/agents/gaio/
4.2  Add new API routes for:
     - /gaio/cited-advise (legal citations)
     - /gaio/deal-brief (deal memory)
     - /gaio/deals/* (deal CRUD)
     - /gaio/templates (template library)
     - /gaio/obligations (obligation tracking)
4.3  Update frontend tabularum-gaio.html
     - Add template selection to drafting UI
     - Add deal memory dashboard
     - Add obligation tracker with deadline alerts
     - Add citation toggle on advise tab
4.4  Set GAIO_API environment variable on Render
4.5  Production testing across all document types and jurisdictions
4.6  Performance: cache system prompts, lazy-load jurisdiction blocks
```

---

## QUALITY STANDARDS

Every document type × jurisdiction combination must meet these criteria:

1. **Knowledge Base:** Minimum 8 key clauses, 5 red flags, 4 negotiation tips
2. **Jurisdiction Accuracy:** Correct governing law, regulatory body, execution formalities
3. **Market Standard:** Terms aligned with ILPA 3.0 / market practice
4. **Template Grounding:** Official template cited where available
5. **Cross-Reference:** Related documents linked (e.g., LPA ↔ Side Letter ↔ Sub Docs)
6. **Disclaimer:** Jurisdiction-specific legal disclaimer on every output

---

## METRICS

| Metric | Phase 0 | Phase 1 | Phase 2 | Phase 3 | Phase 4 |
|--------|---------|---------|---------|---------|---------|
| Jurisdictions | 20 | 20 | 20 | 20 | 20 |
| Document Types | 9 | 17 | 23 | 28 | 28 |
| Doc × Jur Combinations | 180 | 340 | 460 | 560 | 560 |
| Official Templates | 17 | 25+ | 30+ | 35+ | 35+ |
| API Endpoints | 12 | 12 | 12 | 12 | 20+ |

---

## CURRENT PROGRESS

- [x] Phase 0.1 — 7 new jurisdictions added (DIFC, ADGM, Jersey, Guernsey, Ireland, Switzerland, Netherlands)
- [x] Phase 0.2 — English, Delaware, Singapore, HK upgraded to A-tier (16+ features, deep detail blocks)
- [x] Phase 0.3 — Italy, France, Germany, Spain, Sweden, Denmark upgraded to B-tier (14+ features)
- [ ] Phase 0.4 — Cross-jurisdiction comparisons
- [ ] Phase 0.5 — Legal-kb.js regulatory expansion
- [ ] Phase 0.6 — Integration testing
- [x] Phase 1 — All 8 new document types built (IMA, GP OpAg, Articles/COI, KYC/AML, Carry Plan, Co-Invest, Disclosure Letter, ESG/SFDR)
- [x] Phase 2 — 6 transaction & lifecycle docs built (SHA, Transfer Agmt, LOI, Investment Agmt, Service Provider, Distribution Agmt)
- [x] Phase 3 — 5 regulatory & compliance docs built (Form ADV/PF, Compliance Manual, Form D, Investor Q, CRS Self-Cert)
- [x] Phase 4 — Tabularum integration complete: 31 API endpoints, backend synced, routes updated
- [ ] Phase 0.4 — Cross-jurisdiction comparison tables (future enhancement)
- [ ] Phase 0.5 — Legal-kb.js regulatory expansion for new jurisdictions (future enhancement)
- [ ] Phase 3 — Regulatory & Compliance documents (5 types)
- [ ] Phase 4 — Tabularum integration
