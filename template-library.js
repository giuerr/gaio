/**
 * GAIO — Template Library
 *
 * Indexes official model legal documents from 32 institutional sources:
 *   ILPA  — Model LPA, Model NDA, Model Subscription Agreement
 *   NVCA  — Model SPA, Term Sheet, COI, Investors' Rights, Voting, ROFR, etc.
 *   IRS   — W-9, W-8BEN, W-8BEN-E (FATCA/CRS)
 *   ICC   — Standard Arbitration Clause
 *   FCA   — AIFMD Article 23 Disclosure Checklist
 *   Invest Europe / IPEV — Pan-European LPA, Sub, Side Letter, Co-Invest, Valuation
 *   ESMA  — AIFMD Annex IV, Passport, Pre-Marketing notifications
 *   European Commission — SFDR Annexes I-IV, PAI Statement, PRIIPs KID
 *   OECD  — CRS Individual/Entity Self-Certification
 *   LPEA / ALFI — Luxembourg SCSp LPA, Carry, Prospectus, DDQ
 *   France Invest — FPCI LPA, SLP, Subscription, Side Letter
 *   SECA  — Swiss Term Sheet, SHA, Articles, Investment Agmt, Board Regs, CLA Term Sheet
 *   BVK / AIFI / ASCRI — German, Italian, Spanish fund templates
 *   Irish Funds / CBI — Irish Sub, AML, Constitution, QIAIF
 *   AIMA  — Hedge Fund DDQ, Model Subscription
 *   CSSF  — RAIF Notification, AML Questionnaire
 *   CIMA / MAS / SFC / DFSA / FSRA — Offshore & Asian regulator forms
 *   JFSC / GFSC / BVI FSC — Channel Islands & BVI fund registration
 *   FINMA / DVCA / EFAMA — Swiss licence, Danish transparency, MiFID/ESG templates
 *
 * Each template is mapped to Gaio's document types and jurisdictions.
 * The AI drafting engine uses these as the authoritative base — customising
 * with jurisdiction-specific provisions, party details, and negotiated terms.
 *
 * Three-layer architecture:
 *   Layer 1 — Official base template (this module)
 *   Layer 2 — Jurisdiction adaptation (jurisdictions.js + legal-kb.js)
 *   Layer 3 — AI customisation (gaio-engine.js → Claude API)
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ── TEMPLATE ROOT ────────────────────────────────────────────────────────────

const TEMPLATE_DIR = path.join(__dirname, 'templates');

// ── TEMPLATE REGISTRY ────────────────────────────────────────────────────────
// Each entry maps an official document to Gaio's document types & jurisdictions.

const TEMPLATES = {

  // ─── ILPA ──────────────────────────────────────────────────────────────────

  ILPA_MODEL_LPA_WOF: {
    id: 'ilpa_model_lpa_wof',
    source: 'ILPA',
    name: 'ILPA Model Limited Partnership Agreement — Whole of Fund',
    shortName: 'ILPA Model LPA (WoF)',
    description: 'Industry-standard model LPA using European (whole-of-fund) waterfall. Developed by ~20 attorneys over 2 years. Delaware law basis, adaptable to all jurisdictions.',
    version: 'July 2020',
    file: 'ilpa/model-lpa-whole-of-fund.pdf',
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware', 'english', 'cayman', 'luxembourg', 'singapore', 'hong_kong', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    waterfall: 'european',
    tags: ['lpa', 'fund-formation', 'ilpa', 'whole-of-fund', 'european-waterfall'],
    citationLabel: 'Based on the ILPA Model Limited Partnership Agreement (Whole of Fund), July 2020',
    keyFeatures: [
      'Whole-of-fund (European) waterfall with 8% preferred return',
      'GP clawback with 30% escrow',
      'ILPA Principles 3.0 compliant governance',
      'Key man provisions with suspension mechanism',
      'No-fault removal at 75% LP consent',
      'For-cause removal at 50.1% LP consent',
      '100% management fee offset',
      'LPAC with conflict approval powers',
    ]
  },

  ILPA_MODEL_NDA: {
    id: 'ilpa_model_nda',
    source: 'ILPA',
    name: 'ILPA Model Non-Disclosure Agreement',
    shortName: 'ILPA Model NDA',
    description: 'Standard GP-LP NDA for fund due diligence and investment discussions. Reduces legal costs for both parties.',
    version: '2019',
    file: null,  // Available via ILPA site — to be fetched
    format: 'pdf',
    gaioDocTypes: ['nda'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware', 'english', 'cayman', 'luxembourg', 'singapore', 'hong_kong'],
    tags: ['nda', 'confidentiality', 'ilpa', 'fund-due-diligence'],
    citationLabel: 'Based on the ILPA Model Non-Disclosure Agreement',
    keyFeatures: [
      'Designed for GP-LP confidentiality in fund context',
      'Standard carve-outs: public info, independent development, legal requirement',
      'No residuals clause (LP-protective)',
      'Return/destruction provisions',
      'Specific performance remedy available',
    ]
  },

  ILPA_MODEL_SUBSCRIPTION: {
    id: 'ilpa_model_subscription',
    source: 'ILPA',
    name: 'ILPA Model Subscription Agreement',
    shortName: 'ILPA Model Sub Docs',
    description: 'Standard subscription documents for LP investment into PE/VC funds. Released December 2017 to streamline fundraising.',
    version: 'December 2017',
    file: null,  // Available via ILPA site — to be fetched
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware', 'english', 'cayman', 'luxembourg'],
    tags: ['subscription', 'sub-docs', 'ilpa', 'fund-formation'],
    citationLabel: 'Based on the ILPA Model Subscription Agreement, December 2017',
    keyFeatures: [
      'Investor eligibility representations (QP, accredited, professional)',
      'Source of funds / AML declarations',
      'FATCA/CRS certifications',
      'ERISA/plan asset status',
      'Acceptance of LPA terms',
    ]
  },

  ILPA_CAPITAL_CALL_GUIDANCE: {
    id: 'ilpa_capital_call_guidance',
    source: 'ILPA',
    name: 'ILPA Capital Call & Distribution Template Guidance',
    shortName: 'ILPA Capital Call Guidance',
    description: 'Standardised guidance for capital calls, distributions, and LP reporting.',
    version: 'September 2025',
    file: 'ilpa/capital-call-guidance-2025.pdf',
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: null,
    applicableJurisdictions: ['delaware', 'english', 'cayman', 'luxembourg', 'singapore', 'hong_kong', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['capital-call', 'distribution', 'reporting', 'ilpa'],
    citationLabel: 'Per ILPA Capital Call & Distribution Template v2.0, September 2025',
    keyFeatures: [
      'Standardised capital call notice format',
      'Distribution notice format',
      'LP capital account reporting',
    ]
  },

  // ─── NVCA ──────────────────────────────────────────────────────────────────

  NVCA_SPA: {
    id: 'nvca_spa',
    source: 'NVCA',
    name: 'NVCA Model Stock Purchase Agreement',
    shortName: 'NVCA SPA',
    description: 'Industry-standard stock purchase agreement for venture capital preferred stock financings.',
    version: 'October 2025',
    file: 'nvca/spa.docx',
    format: 'docx',
    gaioDocTypes: ['spa'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['spa', 'stock-purchase', 'vc-financing', 'nvca', 'preferred-stock'],
    citationLabel: 'Based on the NVCA Model Stock Purchase Agreement, October 2025',
    keyFeatures: [
      'Preferred stock purchase mechanics',
      'Representations and warranties (company and investor)',
      'Conditions to closing',
      'Indemnification provisions',
      'Disclosure schedule framework',
    ]
  },

  NVCA_TERM_SHEET: {
    id: 'nvca_term_sheet',
    source: 'NVCA',
    name: 'NVCA Model Term Sheet',
    shortName: 'NVCA Term Sheet',
    description: 'Standard term sheet for venture capital financing rounds.',
    version: 'July 2020',
    file: 'nvca/term-sheet.docx',
    format: 'docx',
    gaioDocTypes: ['lpa', 'spa'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['term-sheet', 'vc-financing', 'nvca'],
    citationLabel: 'Based on the NVCA Model Term Sheet, July 2020',
    keyFeatures: [
      'Offering terms (valuation, price per share)',
      'Charter provisions (dividends, liquidation, conversion)',
      'Investor rights (registration, information, participation)',
      'Voting and governance',
      'Employee matters (stock options, vesting)',
    ]
  },

  NVCA_COI: {
    id: 'nvca_coi',
    source: 'NVCA',
    name: 'NVCA Model Certificate of Incorporation',
    shortName: 'NVCA COI',
    description: 'Model charter document for Delaware corporations issuing preferred stock in VC financing.',
    version: 'October 2025',
    file: 'nvca/coi.docx',
    format: 'docx',
    gaioDocTypes: ['spa'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['coi', 'charter', 'incorporation', 'nvca', 'preferred-stock'],
    citationLabel: 'Based on the NVCA Model Certificate of Incorporation, October 2025',
    keyFeatures: [
      'Preferred stock designation and rights',
      'Liquidation preference mechanics',
      'Conversion provisions (mandatory and optional)',
      'Voting rights and protective provisions',
      'Anti-dilution (broad-based weighted average)',
    ]
  },

  NVCA_INVESTORS_RIGHTS: {
    id: 'nvca_investors_rights',
    source: 'NVCA',
    name: 'NVCA Model Investors\' Rights Agreement',
    shortName: 'NVCA IRA',
    description: 'Standard agreement granting registration rights, information rights, and participation rights to preferred stock investors.',
    version: 'October 2025',
    file: 'nvca/investors-rights.docx',
    format: 'docx',
    gaioDocTypes: ['side_letter', 'spa'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['investors-rights', 'registration-rights', 'information-rights', 'nvca'],
    citationLabel: 'Based on the NVCA Model Investors\' Rights Agreement, October 2025',
    keyFeatures: [
      'Demand and piggyback registration rights',
      'S-3 registration rights',
      'Information and inspection rights',
      'Right of first offer / participation rights',
      'ROFR on founder shares',
    ]
  },

  NVCA_VOTING: {
    id: 'nvca_voting',
    source: 'NVCA',
    name: 'NVCA Model Voting Agreement',
    shortName: 'NVCA Voting',
    description: 'Standard voting agreement for board composition and governance in VC-backed companies.',
    version: 'October 2025',
    file: 'nvca/voting-agreement.docx',
    format: 'docx',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['voting', 'governance', 'board-composition', 'nvca'],
    citationLabel: 'Based on the NVCA Model Voting Agreement, October 2025',
    keyFeatures: [
      'Board composition mechanics',
      'Voting commitments for board election',
      'Drag-along provisions',
      'Governance framework',
    ]
  },

  NVCA_ROFR_CO_SALE: {
    id: 'nvca_rofr_co_sale',
    source: 'NVCA',
    name: 'NVCA Model Right of First Refusal and Co-Sale Agreement',
    shortName: 'NVCA ROFR',
    description: 'Standard ROFR and co-sale (tag-along) agreement for VC transactions.',
    version: 'October 2025',
    file: 'nvca/rofr-co-sale.docx',
    format: 'docx',
    gaioDocTypes: ['spa', 'side_letter'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['rofr', 'co-sale', 'tag-along', 'nvca'],
    citationLabel: 'Based on the NVCA Model Right of First Refusal and Co-Sale Agreement, October 2025',
    keyFeatures: [
      'Right of first refusal on proposed transfers',
      'Co-sale (tag-along) rights',
      'Permitted transfers carve-outs',
      'Notice and election mechanics',
    ]
  },

  NVCA_MANAGEMENT_RIGHTS: {
    id: 'nvca_management_rights',
    source: 'NVCA',
    name: 'NVCA Model Management Rights Letter',
    shortName: 'NVCA Management Rights',
    description: 'Management rights letter for ERISA VCOC (Venture Capital Operating Company) exemption compliance.',
    version: 'July 2020',
    file: 'nvca/management-rights-letter.docx',
    format: 'docx',
    gaioDocTypes: ['advisory_agreement', 'side_letter'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['management-rights', 'erisa', 'vcoc', 'nvca'],
    citationLabel: 'Based on the NVCA Model Management Rights Letter, July 2020',
    keyFeatures: [
      'Management rights for ERISA VCOC compliance',
      'Board observation or consultation rights',
      'Information access provisions',
    ]
  },

  NVCA_INDEMNIFICATION: {
    id: 'nvca_indemnification',
    source: 'NVCA',
    name: 'NVCA Model Indemnification Agreement',
    shortName: 'NVCA Indemnification',
    description: 'Standard director/officer indemnification agreement for VC-backed companies.',
    version: 'July 2020',
    file: 'nvca/indemnification-agreement.docx',
    format: 'docx',
    gaioDocTypes: ['advisory_agreement'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['indemnification', 'director', 'officer', 'nvca'],
    citationLabel: 'Based on the NVCA Model Indemnification Agreement, July 2020',
    keyFeatures: [
      'Director and officer indemnification scope',
      'Advancement of expenses',
      'Insurance obligations',
      'Contribution provisions',
    ]
  },

  NVCA_NDA: {
    id: 'nvca_nda',
    source: 'NVCA',
    name: 'NVCA Life-Science Confidential Disclosure Agreement',
    shortName: 'NVCA CDA',
    description: 'Confidential disclosure agreement tailored for life science / biotech due diligence.',
    version: 'July 2025',
    file: 'nvca/nda-life-science.docx',
    format: 'docx',
    gaioDocTypes: ['nda'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware', 'english'],
    tags: ['nda', 'cda', 'confidentiality', 'life-science', 'nvca'],
    citationLabel: 'Based on the NVCA Life-Science Confidential Disclosure Agreement, July 2025',
    keyFeatures: [
      'Bilateral confidentiality obligations',
      'Life science / biotech specific carve-outs',
      'IP protection provisions',
      'Standard exceptions (public info, independent development)',
    ]
  },

  NVCA_LPA_CFIUS: {
    id: 'nvca_lpa_cfius',
    source: 'NVCA',
    name: 'NVCA LPA Insert Language Regarding CFIUS',
    shortName: 'NVCA CFIUS Insert',
    description: 'Model language for LPA provisions addressing CFIUS (Committee on Foreign Investment in the US) considerations.',
    version: 'July 2020',
    file: 'nvca/lpa-cfius-insert.docx',
    format: 'docx',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['cfius', 'lpa-insert', 'foreign-investment', 'nvca', 'regulatory'],
    citationLabel: 'Based on the NVCA LPA Insert Language Regarding CFIUS, July 2020',
    keyFeatures: [
      'CFIUS notification/filing obligations',
      'LP representations re foreign person status',
      'GP authority to manage CFIUS compliance',
      'Excuse/exclusion rights for CFIUS-affected investments',
    ]
  },

  // ─── IRS (FATCA/CRS) ──────────────────────────────────────────────────────

  IRS_W9: {
    id: 'irs_w9',
    source: 'IRS',
    name: 'IRS Form W-9 — Request for Taxpayer Identification Number and Certification',
    shortName: 'W-9',
    description: 'US taxpayer identification form. Required from all US persons investing in a fund.',
    version: 'March 2024',
    file: 'irs/w9.pdf',
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware'],
    tags: ['fatca', 'tax', 'w9', 'us-person', 'irs'],
    citationLabel: 'IRS Form W-9 (Rev. March 2024)',
    keyFeatures: ['TIN certification', 'Backup withholding certification', 'US person status'],
  },

  IRS_W8BEN: {
    id: 'irs_w8ben',
    source: 'IRS',
    name: 'IRS Form W-8BEN — Certificate of Foreign Status of Beneficial Owner (Individual)',
    shortName: 'W-8BEN',
    description: 'Foreign individual investor tax certification for FATCA compliance and treaty benefits.',
    version: 'October 2021',
    file: 'irs/w8ben.pdf',
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware', 'english', 'cayman', 'luxembourg', 'bvi'],
    tags: ['fatca', 'crs', 'tax', 'w8ben', 'foreign-individual', 'irs'],
    citationLabel: 'IRS Form W-8BEN (Rev. October 2021)',
    keyFeatures: ['Foreign status certification', 'Treaty benefit claims', 'FATCA status', 'Chapter 3 and 4 compliance'],
  },

  IRS_W8BENE: {
    id: 'irs_w8bene',
    source: 'IRS',
    name: 'IRS Form W-8BEN-E — Certificate of Foreign Status of Beneficial Owner (Entity)',
    shortName: 'W-8BEN-E',
    description: 'Foreign entity investor tax certification for FATCA compliance. Required from all non-US entity investors.',
    version: 'October 2021',
    file: 'irs/w8bene.pdf',
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'delaware',
    applicableJurisdictions: ['delaware', 'english', 'cayman', 'luxembourg', 'bvi', 'singapore', 'hong_kong'],
    tags: ['fatca', 'crs', 'tax', 'w8bene', 'foreign-entity', 'irs'],
    citationLabel: 'IRS Form W-8BEN-E (Rev. October 2021)',
    keyFeatures: ['Entity FATCA classification', 'Chapter 3 status', 'Chapter 4 status', 'Treaty benefits', 'Certification of beneficial ownership'],
  },

  // ─── ICC ───────────────────────────────────────────────────────────────────

  ICC_ARBITRATION_CLAUSE: {
    id: 'icc_arbitration_clause',
    source: 'ICC',
    name: 'Standard ICC Arbitration Clause',
    shortName: 'ICC Arbitration',
    description: 'The standard arbitration clause recommended by the International Chamber of Commerce for inclusion in international contracts.',
    version: '2021 Rules',
    file: 'icc/standard-arbitration-clause.txt',
    format: 'txt',
    gaioDocTypes: ['lpa', 'spa', 'nda', 'advisory_agreement', 'profit_split', 'non_circumvention'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['arbitration', 'dispute-resolution', 'icc', 'cross-border'],
    citationLabel: 'Standard ICC Arbitration Clause under the ICC Rules of Arbitration 2021',
    keyFeatures: [
      'Universal dispute resolution clause',
      'Customisable: number of arbitrators, seat, language, governing law',
      'Enforceable under New York Convention in 170+ countries',
    ]
  },

  // ─── FCA ───────────────────────────────────────────────────────────────────

  FCA_AIFMD_ARTICLE_23: {
    id: 'fca_aifmd_article_23',
    source: 'FCA',
    name: 'FCA AIFMD Marketing Annex 3 — Article 23 Disclosure Checklist',
    shortName: 'AIFMD Art. 23 Checklist',
    description: 'UK FCA checklist of mandatory pre-investment disclosures under AIFMD Article 23. Applicable template for all EU/UK-marketed AIFs.',
    version: 'Current',
    file: 'fca/aifmd-article-23-checklist.doc',
    format: 'doc',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'english',
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'luxembourg', 'ireland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['aifmd', 'article-23', 'disclosure', 'regulatory', 'fca', 'pre-investment'],
    citationLabel: 'Per FCA AIFMD Marketing Annex 3 (Article 23 Disclosure Checklist)',
    keyFeatures: [
      'Investment strategy and objectives disclosure',
      'Leverage and risk management disclosure',
      'Fees, charges, and expenses disclosure',
      'Conflicts of interest disclosure',
      'Depositary and valuation procedures',
      'Liquidity management disclosure',
    ]
  },

  // ─── INVEST EUROPE ────────────────────────────────────────────────────────

  INVEST_EUROPE_MODEL_LPA: {
    id: 'invest_europe_model_lpa',
    source: 'Invest Europe',
    name: 'Invest Europe Model Limited Partnership Agreement',
    shortName: 'Invest Europe Model LPA',
    description: 'Pan-European model LPA for private equity and venture capital funds. Reflects European market standards and regulatory frameworks.',
    version: '2019',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['lpa', 'fund-formation', 'invest-europe', 'european-pe'],
    citationLabel: 'Based on the Invest Europe Model Limited Partnership Agreement, 2019',
    keyFeatures: [
      'European-standard fund governance and LP protections',
      'AIFMD-compliant disclosure and reporting provisions',
      'Carried interest and distribution waterfall aligned to European norms',
      'Advisory committee structure and conflict management',
      'Key person and no-fault divorce provisions',
    ]
  },

  INVEST_EUROPE_MODEL_SUBSCRIPTION: {
    id: 'invest_europe_model_subscription',
    source: 'Invest Europe',
    name: 'Invest Europe Model Subscription Agreement',
    shortName: 'Invest Europe Model Sub',
    description: 'Standardised subscription agreement for European PE/VC funds, including investor representations and regulatory certifications.',
    version: '2019',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['subscription', 'invest-europe', 'fund-formation'],
    citationLabel: 'Based on the Invest Europe Model Subscription Agreement, 2019',
    keyFeatures: [
      'Investor eligibility representations for European regulatory regimes',
      'AML/KYC and beneficial ownership declarations',
      'FATCA/CRS self-certification integration',
      'AIFMD professional investor classifications',
    ]
  },

  INVEST_EUROPE_MODEL_SIDE_LETTER: {
    id: 'invest_europe_model_side_letter',
    source: 'Invest Europe',
    name: 'Invest Europe Model Side Letter Provisions',
    shortName: 'Invest Europe Side Letter',
    description: 'Model side letter provisions for European PE/VC funds, including MFN and transparency requirements.',
    version: '2019',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['side_letter'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['side-letter', 'mfn', 'invest-europe', 'european-pe'],
    citationLabel: 'Based on the Invest Europe Model Side Letter Provisions, 2019',
    keyFeatures: [
      'Most favoured nation (MFN) election mechanics',
      'Fee and expense concession framework',
      'Co-investment rights and capacity provisions',
      'Reporting and transparency enhancements',
      'Excuse and exclusion provisions for regulatory constraints',
    ]
  },

  INVEST_EUROPE_MODEL_CO_INVESTMENT: {
    id: 'invest_europe_model_co_investment',
    source: 'Invest Europe',
    name: 'Invest Europe Model Co-Investment Agreement',
    shortName: 'Invest Europe Co-Invest',
    description: 'Model co-investment agreement for European PE/VC transactions, governing deal-by-deal co-investment alongside a main fund.',
    version: '2019',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['co_investment'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['co-investment', 'invest-europe', 'deal-by-deal'],
    citationLabel: 'Based on the Invest Europe Model Co-Investment Agreement, 2019',
    keyFeatures: [
      'Co-investment allocation methodology and priority rights',
      'Fee and carry treatment for co-investors',
      'Parallel exit and drag-along provisions',
      'Information rights and reporting obligations',
    ]
  },

  INVEST_EUROPE_REPORTING_GUIDELINES: {
    id: 'invest_europe_reporting_guidelines',
    source: 'Invest Europe',
    name: 'Invest Europe Reporting Guidelines',
    shortName: 'Invest Europe Reporting',
    description: 'Standardised reporting framework for European private equity and venture capital funds, covering quarterly and annual LP reporting.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['reporting', 'invest-europe', 'lp-reporting', 'quarterly-report'],
    citationLabel: 'Per Invest Europe Reporting Guidelines (Current)',
    keyFeatures: [
      'Quarterly NAV and capital account statements',
      'IRR, TVPI, DPI, and RVPI performance metrics',
      'Portfolio company reporting templates',
      'Fee and expense disclosure standards',
      'ESG reporting integration',
    ]
  },

  // ─── IPEV ─────────────────────────────────────────────────────────────────

  IPEV_VALUATION_GUIDELINES: {
    id: 'ipev_valuation_guidelines',
    source: 'IPEV',
    name: 'IPEV Valuation Guidelines',
    shortName: 'IPEV Valuation',
    description: 'International Private Equity and Venture Capital Valuation Guidelines. Globally accepted framework for fair value measurement of PE/VC investments.',
    version: '2022',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa', 'ima'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['valuation', 'ipev', 'nav', 'fair-value', 'pe-valuation'],
    citationLabel: 'Per IPEV Valuation Guidelines, December 2022',
    keyFeatures: [
      'Fair value measurement hierarchy aligned with IFRS 13 and ASC 820',
      'Valuation techniques: market approach, income approach, replacement cost',
      'Calibration methodology for enterprise value',
      'NAV determination and reporting frequency standards',
      'Special considerations for early-stage, distressed, and fund-of-funds',
    ]
  },

  // ─── ESMA ─────────────────────────────────────────────────────────────────

  ESMA_AIFMD_ANNEX_IV: {
    id: 'esma_aifmd_annex_iv',
    source: 'ESMA',
    name: 'ESMA AIFMD Annex IV Reporting Template',
    shortName: 'AIFMD Annex IV',
    description: 'Mandatory regulatory reporting template under AIFMD Annex IV. Required for all EU AIFMs to report to national competent authorities.',
    version: 'Current',
    file: 'esma/AIFMD_Consolidated_Reporting_Template_v1.1_Revised.xlsx',
    format: 'xlsx',
    gaioDocTypes: ['compliance_manual', 'form_adv_pf'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['aifmd', 'annex-iv', 'regulatory-reporting', 'esma', 'nca'],
    citationLabel: 'Per ESMA AIFMD Annex IV Reporting Template (Current)',
    keyFeatures: [
      'AIF identification and classification data',
      'NAV, AUM, and leverage reporting',
      'Investment strategy and geographic focus breakdown',
      'Principal exposures and most important concentrations',
      'Liquidity profile and risk measures',
      'Stress testing results reporting',
    ]
  },

  ESMA_AIFMD_PASSPORT_NOTIFICATION: {
    id: 'esma_aifmd_passport_notification',
    source: 'ESMA',
    name: 'ESMA AIFMD Cross-Border Marketing Passport Notification',
    shortName: 'AIFMD Passport Notification',
    description: 'Notification form for EU AIFMs seeking to market AIFs cross-border under the AIFMD marketing passport.',
    version: 'Current',
    file: 'esma/ESMA_Final_Report_Technical_Standards_Notification_Letters.pdf',
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['aifmd', 'passport', 'cross-border', 'marketing', 'esma'],
    citationLabel: 'Per ESMA AIFMD Cross-Border Marketing Passport Notification (Current)',
    keyFeatures: [
      'Home and host member state notification requirements',
      'Fund documentation and offering materials submission',
      'Facilities arrangements for retail investors',
      'Ongoing regulatory reporting obligations',
    ]
  },

  ESMA_CBDF_PRE_MARKETING: {
    id: 'esma_cbdf_pre_marketing',
    source: 'ESMA',
    name: 'ESMA Cross-Border Distribution Pre-Marketing Notification',
    shortName: 'CBDF Pre-Marketing',
    description: 'Pre-marketing notification under Regulation (EU) 2019/1156 on cross-border distribution of collective investment undertakings.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['cbdf', 'pre-marketing', 'cross-border', 'esma', 'regulation-2019-1156'],
    citationLabel: 'Per ESMA CBDF Pre-Marketing Notification under Regulation (EU) 2019/1156',
    keyFeatures: [
      'Pre-marketing activity notification to home NCA',
      'Investor contact and material disclosure requirements',
      'Time limits for formal marketing follow-up',
      'De-notification procedures for discontinued marketing',
    ]
  },

  // ─── EUROPEAN COMMISSION (SFDR / PRIIPs) ──────────────────────────────────

  EC_SFDR_ANNEX_I_ART8: {
    id: 'ec_sfdr_annex_i_art8',
    source: 'European Commission',
    name: 'SFDR Pre-contractual Disclosure Template — Article 8 Products',
    shortName: 'SFDR Annex I (Art. 8)',
    description: 'Mandatory pre-contractual disclosure template for Article 8 (light green) financial products under the Sustainable Finance Disclosure Regulation.',
    version: 'Delegated Regulation 2022/1288',
    file: 'ec/SFDR_Annex_II_Art8_Pre_Contractual_Disclosure_Template.pdf',
    format: 'pdf',
    gaioDocTypes: ['esg_sfdr', 'ppm'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['sfdr', 'article-8', 'esg', 'pre-contractual', 'sustainable-finance'],
    citationLabel: 'Per SFDR Annex I (Delegated Regulation (EU) 2022/1288) — Article 8 Products',
    keyFeatures: [
      'Environmental and social characteristics promoted by the product',
      'Investment strategy and binding elements description',
      'Proportion of investments aligned with E/S characteristics',
      'Monitoring methodology for E/S characteristics',
      'Designated reference benchmark (if applicable)',
    ]
  },

  EC_SFDR_ANNEX_II_ART9: {
    id: 'ec_sfdr_annex_ii_art9',
    source: 'European Commission',
    name: 'SFDR Pre-contractual Disclosure Template — Article 9 Products',
    shortName: 'SFDR Annex II (Art. 9)',
    description: 'Mandatory pre-contractual disclosure template for Article 9 (dark green) financial products with sustainable investment objectives.',
    version: 'Delegated Regulation 2022/1288',
    file: 'ec/SFDR_Annex_III_Art9_Pre_Contractual_Disclosure_Template.pdf',
    format: 'pdf',
    gaioDocTypes: ['esg_sfdr', 'ppm'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['sfdr', 'article-9', 'esg', 'pre-contractual', 'sustainable-investment'],
    citationLabel: 'Per SFDR Annex II (Delegated Regulation (EU) 2022/1288) — Article 9 Products',
    keyFeatures: [
      'Sustainable investment objective description',
      'Do No Significant Harm (DNSH) assessment methodology',
      'Proportion of sustainable investments (environmental/social)',
      'Taxonomy-alignment of investments',
      'Reference benchmark designation and methodology',
    ]
  },

  EC_SFDR_ANNEX_III_PERIODIC_ART8: {
    id: 'ec_sfdr_annex_iii_periodic_art8',
    source: 'European Commission',
    name: 'SFDR Periodic Disclosure Template — Article 8 Products',
    shortName: 'SFDR Annex III Periodic (Art. 8)',
    description: 'Mandatory periodic (annual) disclosure template for Article 8 products, reporting on attainment of E/S characteristics.',
    version: 'Delegated Regulation 2022/1288',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['esg_sfdr'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['sfdr', 'article-8', 'esg', 'periodic', 'annual-disclosure'],
    citationLabel: 'Per SFDR Annex III Periodic Disclosure (Delegated Regulation (EU) 2022/1288) — Article 8',
    keyFeatures: [
      'Extent to which E/S characteristics were met',
      'Top investments and sector allocation breakdown',
      'Proportion of sustainability-related investments achieved',
      'Actions taken to meet E/S characteristics during reference period',
    ]
  },

  EC_SFDR_ANNEX_IV_PERIODIC_ART9: {
    id: 'ec_sfdr_annex_iv_periodic_art9',
    source: 'European Commission',
    name: 'SFDR Periodic Disclosure Template — Article 9 Products',
    shortName: 'SFDR Annex IV Periodic (Art. 9)',
    description: 'Mandatory periodic (annual) disclosure template for Article 9 products, reporting on sustainable investment objective attainment.',
    version: 'Delegated Regulation 2022/1288',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['esg_sfdr'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['sfdr', 'article-9', 'esg', 'periodic', 'annual-disclosure'],
    citationLabel: 'Per SFDR Annex IV Periodic Disclosure (Delegated Regulation (EU) 2022/1288) — Article 9',
    keyFeatures: [
      'Overall sustainability-related impact of the financial product',
      'Top investments and Taxonomy-aligned proportions',
      'Comparison against designated reference benchmark',
      'DNSH assessment results for the reporting period',
    ]
  },

  EC_SFDR_PAI_STATEMENT: {
    id: 'ec_sfdr_pai_statement',
    source: 'European Commission',
    name: 'SFDR Principal Adverse Impact Statement Template',
    shortName: 'SFDR PAI Statement',
    description: 'Template for entity-level statement on principal adverse impacts of investment decisions on sustainability factors.',
    version: 'Delegated Regulation 2022/1288',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['esg_sfdr', 'compliance_manual'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['sfdr', 'pai', 'esg', 'adverse-impact', 'entity-level'],
    citationLabel: 'Per SFDR PAI Statement Template (Delegated Regulation (EU) 2022/1288)',
    keyFeatures: [
      'Mandatory 18 PAI indicators (14 environmental, 4 social)',
      'Opt-in additional environmental and social indicators',
      'Description of policies to identify and prioritise PAI',
      'Engagement policies and adherence to responsible business codes',
      'Historical comparison of PAI indicators',
    ]
  },

  EC_PRIIPS_KID: {
    id: 'ec_priips_kid',
    source: 'European Commission',
    name: 'PRIIPs Key Information Document Template',
    shortName: 'PRIIPs KID',
    description: 'Key Information Document template required for packaged retail and insurance-based investment products distributed to retail investors in the EU.',
    version: 'Delegated Regulation 2017/653 (amended 2021)',
    file: 'ec/PRIIPs_KID_Delegated_Regulation_2017_653.pdf',
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['priips', 'kid', 'retail', 'pre-contractual', 'mifid'],
    citationLabel: 'Per PRIIPs KID Template (Delegated Regulation (EU) 2017/653, amended 2021)',
    keyFeatures: [
      'Standardised 3-page maximum product disclosure',
      'Summary Risk Indicator (SRI) 1-7 scale',
      'Performance scenarios (favourable, moderate, unfavourable, stress)',
      'Costs over time and composition of costs',
      'Recommended holding period and early exit penalties',
    ]
  },

  // ─── OECD (CRS) ──────────────────────────────────────────────────────────

  OECD_CRS_INDIVIDUAL: {
    id: 'oecd_crs_individual',
    source: 'OECD',
    name: 'OECD CRS Self-Certification Form — Individuals',
    shortName: 'CRS Individual Form',
    description: 'Common Reporting Standard self-certification form for individual account holders, used globally for automatic exchange of tax information.',
    version: 'Current',
    file: 'oecd/CRS_Individual_Self-Certification_Form.pdf',
    format: 'pdf',
    gaioDocTypes: ['crs_self_cert', 'subscription_agreement'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['crs', 'oecd', 'tax', 'self-certification', 'individual', 'aeoi'],
    citationLabel: 'Per OECD Common Reporting Standard Self-Certification — Individuals',
    keyFeatures: [
      'Tax residency declaration for all jurisdictions',
      'TIN (Taxpayer Identification Number) collection',
      'US indicia screening (FATCA coordination)',
      'Controlling persons identification for passive entities',
    ]
  },

  OECD_CRS_ENTITY: {
    id: 'oecd_crs_entity',
    source: 'OECD',
    name: 'OECD CRS Self-Certification Form — Entities',
    shortName: 'CRS Entity Form',
    description: 'Common Reporting Standard self-certification form for entity account holders, including financial institution classification.',
    version: 'Current',
    file: 'oecd/CRS_Entity_Self-Certification_Form.pdf',
    format: 'pdf',
    gaioDocTypes: ['crs_self_cert', 'subscription_agreement'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['crs', 'oecd', 'tax', 'self-certification', 'entity', 'aeoi'],
    citationLabel: 'Per OECD Common Reporting Standard Self-Certification — Entities',
    keyFeatures: [
      'Entity type classification (FI, active NFE, passive NFE)',
      'Tax residency declaration for all jurisdictions',
      'GIIN (Global Intermediary Identification Number) for FIs',
      'Controlling persons identification and tax residency',
      'CRS entity classification consistent with FATCA categories',
    ]
  },

  // ─── LPEA (Luxembourg) ───────────────────────────────────────────────────

  LPEA_MODEL_LPA_SCSP: {
    id: 'lpea_model_lpa_scsp',
    source: 'LPEA',
    name: 'LPEA Model LPA for Luxembourg SCSp',
    shortName: 'LPEA SCSp LPA',
    description: 'Model limited partnership agreement for Luxembourg Societe en Commandite Speciale (SCSp), the standard PE/VC vehicle in Luxembourg.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['lpa', 'scsp', 'luxembourg', 'lpea', 'fund-formation'],
    citationLabel: 'Based on the LPEA Model LPA for Luxembourg SCSp',
    keyFeatures: [
      'SCSp-specific governance structure and GP/LP roles',
      'Luxembourg commercial law compliance (1915 Law)',
      'AIFMD-compliant depositary and reporting provisions',
      'Carried interest structuring under Luxembourg tax framework',
      'CSSF regulatory requirements integration',
    ]
  },

  LPEA_CARRY_GUIDELINES: {
    id: 'lpea_carry_guidelines',
    source: 'LPEA',
    name: 'LPEA Carried Interest Guidelines',
    shortName: 'LPEA Carry Guidelines',
    description: 'Carried interest structuring guidelines for Luxembourg PE/VC funds, including tax treatment and market practice.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['carry_plan'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['carried-interest', 'carry', 'luxembourg', 'lpea', 'tax'],
    citationLabel: 'Per LPEA Carried Interest Guidelines',
    keyFeatures: [
      'Luxembourg carry structuring options (direct, carry vehicle, management equity)',
      'Tax treatment of carried interest under Luxembourg law',
      'Clawback and escrow mechanisms',
      'Vesting and good/bad leaver provisions',
      'Alignment of interest requirements',
    ]
  },

  LPEA_MODEL_SIDE_LETTER: {
    id: 'lpea_model_side_letter',
    source: 'LPEA',
    name: 'LPEA Model Side Letter for Luxembourg PE',
    shortName: 'LPEA Side Letter',
    description: 'Model side letter provisions tailored for Luxembourg PE/VC fund structures.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['side_letter'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['side-letter', 'luxembourg', 'lpea', 'mfn'],
    citationLabel: 'Based on the LPEA Model Side Letter for Luxembourg PE',
    keyFeatures: [
      'MFN provisions adapted for Luxembourg fund structures',
      'CSSF regulatory constraint carve-outs',
      'Fee and co-investment concessions',
      'Enhanced reporting and transparency rights',
    ]
  },

  // ─── ALFI (Luxembourg) ───────────────────────────────────────────────────

  ALFI_MODEL_PROSPECTUS: {
    id: 'alfi_model_prospectus',
    source: 'ALFI',
    name: 'ALFI Model Prospectus for Luxembourg Funds',
    shortName: 'ALFI Model Prospectus',
    description: 'Model prospectus/offering memorandum for Luxembourg-domiciled investment funds, aligned with CSSF requirements.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['ppm', 'prospectus', 'luxembourg', 'alfi', 'cssf'],
    citationLabel: 'Based on the ALFI Model Prospectus for Luxembourg Funds',
    keyFeatures: [
      'CSSF-compliant prospectus structure and disclosures',
      'Investment objective, policy, and restrictions sections',
      'Risk factors and investor profile',
      'Fee structure and expense allocation',
      'Subscription, redemption, and transfer procedures',
    ]
  },

  ALFI_MODEL_SUBSCRIPTION: {
    id: 'alfi_model_subscription',
    source: 'ALFI',
    name: 'ALFI Model Subscription Agreement',
    shortName: 'ALFI Sub Agreement',
    description: 'Model subscription agreement for Luxembourg-domiciled funds, including AML/KYC and regulatory declarations.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['subscription', 'luxembourg', 'alfi', 'fund-formation'],
    citationLabel: 'Based on the ALFI Model Subscription Agreement',
    keyFeatures: [
      'Luxembourg AML/KYC requirements integration',
      'FATCA/CRS self-certification incorporation',
      'Investor classification (professional, well-informed, institutional)',
      'Tax status declarations under Luxembourg law',
    ]
  },

  ALFI_DDQ: {
    id: 'alfi_ddq',
    source: 'ALFI',
    name: 'ALFI Due Diligence Questionnaire for Service Providers',
    shortName: 'ALFI DDQ',
    description: 'Due diligence questionnaire for evaluating service providers to Luxembourg funds (administrators, depositaries, auditors).',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ddq'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['ddq', 'due-diligence', 'luxembourg', 'alfi', 'service-provider'],
    citationLabel: 'Per ALFI Due Diligence Questionnaire for Service Providers',
    keyFeatures: [
      'Service provider governance and ownership structure',
      'AML/CFT compliance programme assessment',
      'Business continuity and disaster recovery evaluation',
      'IT infrastructure and cybersecurity review',
      'Regulatory status and licence verification',
    ]
  },

  // ─── FRANCE INVEST ────────────────────────────────────────────────────────

  FRANCE_INVEST_MODEL_LPA_FPCI: {
    id: 'france_invest_model_lpa_fpci',
    source: 'France Invest',
    name: 'France Invest Model LPA for French FPCI',
    shortName: 'France Invest FPCI LPA',
    description: 'Model limited partnership agreement for Fonds Professionnel de Capital Investissement (FPCI), the French professional PE vehicle.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'french',
    applicableJurisdictions: ['french'],
    tags: ['lpa', 'fpci', 'french', 'france-invest', 'fund-formation'],
    citationLabel: 'Based on the France Invest Model LPA for FPCI',
    keyFeatures: [
      'FPCI-specific regulatory structure under AMF supervision',
      'French Code Monetaire et Financier compliance',
      'Management company (SGP) governance provisions',
      'Carried interest (plus-value) tax framework under Article 150-0 B ter CGI',
      'French professional investor eligibility requirements',
    ]
  },

  FRANCE_INVEST_MODEL_SLP: {
    id: 'france_invest_model_slp',
    source: 'France Invest',
    name: 'France Invest Model SLP Agreement',
    shortName: 'France Invest SLP',
    description: 'Model agreement for Societe de Libre Partenariat (SLP), the French limited partnership structure for alternative funds.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'french',
    applicableJurisdictions: ['french'],
    tags: ['lpa', 'slp', 'french', 'france-invest', 'fund-formation'],
    citationLabel: 'Based on the France Invest Model SLP Agreement',
    keyFeatures: [
      'SLP-specific governance under Macron Law (2015)',
      'Tax transparency treatment for qualified investors',
      'AIFMD-compliant structure and depositary requirements',
      'Flexible investment strategy and leverage provisions',
    ]
  },

  FRANCE_INVEST_SUBSCRIPTION: {
    id: 'france_invest_subscription',
    source: 'France Invest',
    name: 'France Invest Model Subscription Form',
    shortName: 'France Invest Sub Form',
    description: 'Model subscription form for French PE/VC funds, including AMF regulatory declarations.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'french',
    applicableJurisdictions: ['french'],
    tags: ['subscription', 'french', 'france-invest', 'amf'],
    citationLabel: 'Based on the France Invest Model Subscription Form',
    keyFeatures: [
      'French professional/qualified investor certifications',
      'AMF regulatory declarations and representations',
      'AML/KYC under French Sapin II and EU 5AMLD',
      'FATCA/CRS self-certification',
    ]
  },

  FRANCE_INVEST_SIDE_LETTER: {
    id: 'france_invest_side_letter',
    source: 'France Invest',
    name: 'France Invest Model Side Letter',
    shortName: 'France Invest Side Letter',
    description: 'Model side letter provisions for French PE/VC fund structures.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['side_letter'],
    baseJurisdiction: 'french',
    applicableJurisdictions: ['french'],
    tags: ['side-letter', 'french', 'france-invest', 'mfn'],
    citationLabel: 'Based on the France Invest Model Side Letter',
    keyFeatures: [
      'MFN provisions under French fund law',
      'Co-investment and fee concession framework',
      'Enhanced reporting rights',
      'Regulatory constraint carve-outs for French investors',
    ]
  },

  // ─── SECA (Switzerland) ──────────────────────────────────────────────────

  SECA_MODEL_TERM_SHEET: {
    id: 'seca_model_term_sheet',
    source: 'SECA',
    name: 'SECA Model VC Term Sheet (Swiss Law)',
    shortName: 'SECA Term Sheet',
    description: 'Model venture capital term sheet under Swiss law, developed by the Swiss Private Equity & Corporate Finance Association.',
    version: 'Current',
    file: 'seca/SECA_Term_Sheet_5th_Edition_Large_Annotated.pdf',
    format: 'pdf',
    gaioDocTypes: ['lpa', 'spa'],
    baseJurisdiction: 'switzerland',
    applicableJurisdictions: ['switzerland'],
    tags: ['term-sheet', 'vc-financing', 'seca', 'swiss-law'],
    citationLabel: 'Based on the SECA Model VC Term Sheet (Swiss Law)',
    keyFeatures: [
      'Swiss AG/GmbH corporate governance framework',
      'Preferred share mechanics under Swiss CO',
      'Liquidation preference and anti-dilution provisions',
      'Board composition and protective provisions',
      'Swiss-specific tag-along and drag-along rights',
    ]
  },

  SECA_MODEL_SHA: {
    id: 'seca_model_sha',
    source: 'SECA',
    name: 'SECA Model Shareholders\' Agreement (Swiss Law)',
    shortName: 'SECA SHA',
    description: 'Model shareholders\' agreement for Swiss VC-backed companies under Swiss Code of Obligations.',
    version: 'Current',
    file: 'seca/SECA_Shareholders_Agreement_5th_Edition_Large_Annotated.pdf',
    format: 'pdf',
    gaioDocTypes: ['shareholder_agreement'],
    baseJurisdiction: 'switzerland',
    applicableJurisdictions: ['switzerland'],
    tags: ['shareholder-agreement', 'sha', 'seca', 'swiss-law'],
    citationLabel: 'Based on the SECA Model Shareholders\' Agreement (Swiss Law)',
    keyFeatures: [
      'Share transfer restrictions and pre-emption rights under Swiss CO',
      'Board nomination and governance provisions',
      'Information and inspection rights',
      'Non-compete and non-solicitation covenants',
      'Deadlock resolution mechanisms',
    ]
  },

  SECA_MODEL_ARTICLES: {
    id: 'seca_model_articles',
    source: 'SECA',
    name: 'SECA Model Articles of Association (Swiss Law)',
    shortName: 'SECA Articles',
    description: 'Model articles of association (Statuten) for Swiss VC-backed companies.',
    version: 'Current',
    file: 'seca/SECA_Articles_of_Association_DE_EN_5th_Edition_Large_Annotated.pdf',
    format: 'pdf',
    gaioDocTypes: ['articles_of_association'],
    baseJurisdiction: 'switzerland',
    applicableJurisdictions: ['switzerland'],
    tags: ['articles', 'statuten', 'seca', 'swiss-law', 'corporate-governance'],
    citationLabel: 'Based on the SECA Model Articles of Association (Swiss Law)',
    keyFeatures: [
      'Swiss AG (Aktiengesellschaft) corporate structure',
      'Share capital and authorised capital provisions',
      'Board of directors composition and powers',
      'General meeting procedures and voting rights',
      'Preferred share class provisions under Swiss CO',
    ]
  },

  SECA_INVESTMENT_AGREEMENT: {
    id: 'seca_investment_agreement',
    source: 'SECA',
    name: 'SECA Model Investment Agreement (5th Edition)',
    shortName: 'SECA Investment Agmt',
    description: 'Swiss-law model investment agreement for VC equity investments (CHF 5-20M). Annotated with commentary.',
    version: '5th Edition (June 2025)',
    file: 'seca/SECA_Investment_Agreement_5th_Edition_Large_Annotated.pdf',
    format: 'pdf',
    gaioDocTypes: ['investment_agreement', 'spa'],
    baseJurisdiction: 'switzerland',
    applicableJurisdictions: ['switzerland'],
    tags: ['investment-agreement', 'seca', 'swiss-law', 'vc-financing', 'equity'],
    citationLabel: 'Based on the SECA Model Investment Agreement, 5th Edition (June 2025)',
    keyFeatures: [
      'Equity investment mechanics for Swiss AG/GmbH',
      'Conditions precedent and closing mechanics',
      'Company and investor representations and warranties',
      'Use of proceeds and milestone provisions',
      'Annotated with legal commentary',
    ]
  },

  SECA_BOARD_REGULATIONS: {
    id: 'seca_board_regulations',
    source: 'SECA',
    name: 'SECA Model Board Regulations (5th Edition)',
    shortName: 'SECA Board Regs',
    description: 'Swiss-law model board regulations (Organisationsreglement) for VC-backed companies.',
    version: '5th Edition (June 2025)',
    file: 'seca/SECA_Board_Regulations_5th_Edition_Large_Annotated.pdf',
    format: 'pdf',
    gaioDocTypes: ['articles_of_association'],
    baseJurisdiction: 'switzerland',
    applicableJurisdictions: ['switzerland'],
    tags: ['board-regulations', 'organisationsreglement', 'seca', 'swiss-law', 'governance'],
    citationLabel: 'Based on the SECA Model Board Regulations, 5th Edition (June 2025)',
    keyFeatures: [
      'Board composition and committee structure',
      'Decision-making and reserved matters',
      'Delegation of authority',
      'Reporting and information flows',
      'Investor director rights',
    ]
  },

  SECA_CLA_TERM_SHEET: {
    id: 'seca_cla_term_sheet',
    source: 'SECA',
    name: 'SECA Model Convertible Loan Term Sheet (Long Form)',
    shortName: 'SECA CLA Term Sheet',
    description: 'Swiss-law model convertible loan agreement term sheet, long form with annotations.',
    version: 'February 2025',
    file: 'seca/SECA_CLA_Term_Sheet_Long_Form_Annotated_Feb2025.pdf',
    format: 'pdf',
    gaioDocTypes: ['investment_agreement', 'loi'],
    baseJurisdiction: 'switzerland',
    applicableJurisdictions: ['switzerland'],
    tags: ['convertible-loan', 'cla', 'term-sheet', 'seca', 'swiss-law', 'bridge-financing'],
    citationLabel: 'Based on the SECA Model Convertible Loan Term Sheet (Long Form), February 2025',
    keyFeatures: [
      'Convertible loan mechanics under Swiss CO',
      'Conversion triggers and pricing',
      'Qualified financing round definitions',
      'Maturity and repayment terms',
      'Annotated with commentary on Swiss market practice',
    ]
  },

  // ─── BVK (Germany) ────────────────────────────────────────────────────────

  BVK_MODEL_LPA: {
    id: 'bvk_model_lpa',
    source: 'BVK',
    name: 'BVK Model LPA for German GmbH & Co. KG Funds',
    shortName: 'BVK Model LPA',
    description: 'Model limited partnership agreement for German PE/VC funds structured as GmbH & Co. KG, developed by the German Private Equity Association.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'german',
    applicableJurisdictions: ['german'],
    tags: ['lpa', 'gmbh-co-kg', 'german', 'bvk', 'fund-formation'],
    citationLabel: 'Based on the BVK Model LPA for German GmbH & Co. KG Funds',
    keyFeatures: [
      'GmbH & Co. KG fund structure under German HGB',
      'BaFin KAGB regulatory compliance provisions',
      'German tax transparency and withholding treatment',
      'Limited partner and general partner rights under German law',
      'Investment restrictions and diversification requirements',
    ]
  },

  // ─── AIFI (Italy) ─────────────────────────────────────────────────────────

  AIFI_MODEL_FUND_RULES: {
    id: 'aifi_model_fund_rules',
    source: 'AIFI',
    name: 'AIFI Model Fund Rules (Regolamento del Fondo)',
    shortName: 'AIFI Fund Rules',
    description: 'Model fund rules (Regolamento) for Italian closed-end alternative investment funds, developed by the Italian PE/VC Association.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'italian',
    applicableJurisdictions: ['italian'],
    tags: ['lpa', 'regolamento', 'italian', 'aifi', 'fund-formation'],
    citationLabel: 'Based on the AIFI Model Fund Rules (Regolamento del Fondo)',
    keyFeatures: [
      'Italian FIA (Fondo di Investimento Alternativo) structure',
      'Banca d\'Italia and CONSOB regulatory compliance',
      'SGR (Societa di Gestione del Risparmio) governance framework',
      'Italian tax treatment for qualified investors',
      'Investment policy and risk management provisions',
    ]
  },

  AIFI_SUBSCRIPTION: {
    id: 'aifi_subscription',
    source: 'AIFI',
    name: 'AIFI Model Subscription Document',
    shortName: 'AIFI Subscription',
    description: 'Model subscription document for Italian PE/VC funds, including CONSOB regulatory declarations.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'italian',
    applicableJurisdictions: ['italian'],
    tags: ['subscription', 'italian', 'aifi', 'consob'],
    citationLabel: 'Based on the AIFI Model Subscription Document',
    keyFeatures: [
      'Italian professional/qualified investor classifications',
      'CONSOB and Banca d\'Italia regulatory declarations',
      'AML/KYC under Italian D.Lgs. 231/2007',
      'FATCA/CRS self-certification integration',
    ]
  },

  // ─── ASCRI (Spain) ────────────────────────────────────────────────────────

  ASCRI_MODEL_LPA: {
    id: 'ascri_model_lpa',
    source: 'ASCRI',
    name: 'ASCRI Model LPA for Spanish FCR/SCR',
    shortName: 'ASCRI Model LPA',
    description: 'Model limited partnership agreement for Spanish Fondos de Capital Riesgo (FCR) and Sociedades de Capital Riesgo (SCR).',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['lpa'],
    baseJurisdiction: 'spanish',
    applicableJurisdictions: ['spanish'],
    tags: ['lpa', 'fcr', 'scr', 'spanish', 'ascri', 'fund-formation'],
    citationLabel: 'Based on the ASCRI Model LPA for Spanish FCR/SCR',
    keyFeatures: [
      'Spanish FCR/SCR regulatory structure under CNMV supervision',
      'Ley 22/2014 compliance for venture capital entities',
      'Spanish tax incentive framework for qualifying investments',
      'Management company (SGEIC) governance provisions',
      'Investor eligibility under Spanish professional investor rules',
    ]
  },

  // ─── IRISH FUNDS ──────────────────────────────────────────────────────────

  IRISH_FUNDS_MODEL_SUBSCRIPTION: {
    id: 'irish_funds_model_subscription',
    source: 'Irish Funds',
    name: 'Irish Funds Model Subscription Agreement',
    shortName: 'Irish Funds Sub Agreement',
    description: 'Model subscription agreement for Irish-domiciled funds, including CBI qualifying/professional investor declarations.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: 'ireland',
    applicableJurisdictions: ['ireland'],
    tags: ['subscription', 'irish', 'irish-funds', 'cbi'],
    citationLabel: 'Based on the Irish Funds Model Subscription Agreement',
    keyFeatures: [
      'CBI qualifying investor fund (QIF) declarations',
      'Irish AML/KYC under Criminal Justice Acts',
      'Professional investor classification under Irish law',
      'FATCA/CRS self-certification integration',
      'Tax residency declarations for Irish withholding tax',
    ]
  },

  IRISH_FUNDS_AML_TEMPLATE: {
    id: 'irish_funds_aml_template',
    source: 'Irish Funds',
    name: 'Irish Funds AML Template Procedures',
    shortName: 'Irish Funds AML',
    description: 'Anti-money laundering template procedures for Irish fund service providers, aligned with CBI guidance.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['kyc_aml', 'compliance_manual'],
    baseJurisdiction: 'ireland',
    applicableJurisdictions: ['ireland'],
    tags: ['aml', 'kyc', 'irish', 'irish-funds', 'cbi', 'compliance'],
    citationLabel: 'Per Irish Funds AML Template Procedures',
    keyFeatures: [
      'CDD and EDD procedures under Irish Criminal Justice Act 2010',
      'Beneficial ownership identification requirements',
      'PEP screening and sanctions checking procedures',
      'Suspicious transaction reporting to Financial Intelligence Unit',
      'Staff training and awareness programme requirements',
    ]
  },

  IRISH_FUNDS_MODEL_CONSTITUTION: {
    id: 'irish_funds_model_constitution',
    source: 'Irish Funds',
    name: 'Irish Funds Model Constitution / Trust Deed',
    shortName: 'Irish Funds Constitution',
    description: 'Model constitutional document for Irish-domiciled investment funds (ICAV or unit trust).',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['articles_of_association'],
    baseJurisdiction: 'ireland',
    applicableJurisdictions: ['ireland'],
    tags: ['constitution', 'trust-deed', 'icav', 'irish', 'irish-funds'],
    citationLabel: 'Based on the Irish Funds Model Constitution / Trust Deed',
    keyFeatures: [
      'ICAV or unit trust constitutional framework',
      'CBI regulatory compliance provisions',
      'Director duties and powers under Irish law',
      'Share class mechanics and NAV calculation',
      'Redemption, subscription, and transfer procedures',
    ]
  },

  // ─── AIMA ─────────────────────────────────────────────────────────────────

  AIMA_HEDGE_FUND_DDQ: {
    id: 'aima_hedge_fund_ddq',
    source: 'AIMA',
    name: 'AIMA Hedge Fund Due Diligence Questionnaire',
    shortName: 'AIMA DDQ',
    description: 'Industry-standard due diligence questionnaire for hedge fund and alternative investment fund managers, used globally by institutional investors.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ddq', 'investor_questionnaire'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french', 'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg', 'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['ddq', 'due-diligence', 'hedge-fund', 'aima', 'institutional'],
    citationLabel: 'Per AIMA Hedge Fund Due Diligence Questionnaire (Current)',
    keyFeatures: [
      'Firm-level organisational and governance assessment',
      'Investment strategy and risk management evaluation',
      'Operational due diligence (ODD) sections',
      'Compliance and regulatory framework review',
      'Service provider and counterparty risk assessment',
      'ESG and responsible investment integration',
    ]
  },

  AIMA_MODEL_SUBSCRIPTION: {
    id: 'aima_model_subscription',
    source: 'AIMA',
    name: 'AIMA Model Subscription Document',
    shortName: 'AIMA Sub Docs',
    description: 'Model subscription document for hedge funds and alternative investment vehicles domiciled in offshore jurisdictions.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['subscription_agreement'],
    baseJurisdiction: null,
    applicableJurisdictions: ['cayman', 'bvi', 'english', 'ireland'],
    tags: ['subscription', 'hedge-fund', 'aima', 'offshore'],
    citationLabel: 'Based on the AIMA Model Subscription Document',
    keyFeatures: [
      'Investor eligibility for offshore fund structures',
      'AML/KYC declarations for Cayman/BVI/Irish regimes',
      'FATCA/CRS self-certification integration',
      'Investor representations for hedge fund risk acknowledgement',
    ]
  },

  // ─── CSSF (Luxembourg) ───────────────────────────────────────────────────

  CSSF_RAIF_NOTIFICATION: {
    id: 'cssf_raif_notification',
    source: 'CSSF',
    name: 'CSSF RAIF Notification Form',
    shortName: 'CSSF RAIF Form',
    description: 'Notification form for Reserved Alternative Investment Funds (RAIF) to the Luxembourg CSSF.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['raif', 'cssf', 'luxembourg', 'notification', 'regulatory'],
    citationLabel: 'Per CSSF RAIF Notification Form',
    keyFeatures: [
      'RAIF registration data and fund identification',
      'AIFM identification and authorisation details',
      'Investment strategy and target asset class declaration',
      'Depositary and administrator appointment confirmation',
    ]
  },

  CSSF_AML_QUESTIONNAIRE: {
    id: 'cssf_aml_questionnaire',
    source: 'CSSF',
    name: 'CSSF AML/CFT Compliance Questionnaire',
    shortName: 'CSSF AML Questionnaire',
    description: 'Anti-money laundering and counter-terrorist financing compliance questionnaire required by the Luxembourg CSSF.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['kyc_aml', 'compliance_manual'],
    baseJurisdiction: 'luxembourg',
    applicableJurisdictions: ['luxembourg'],
    tags: ['aml', 'cft', 'cssf', 'luxembourg', 'compliance'],
    citationLabel: 'Per CSSF AML/CFT Compliance Questionnaire',
    keyFeatures: [
      'AML/CFT organisational structure and governance',
      'Customer due diligence procedures assessment',
      'Risk-based approach and risk appetite framework',
      'Suspicious activity reporting procedures',
      'Staff training and awareness programmes',
    ]
  },

  // ─── CBI (Ireland) ────────────────────────────────────────────────────────

  CBI_QIAIF_APPLICATION: {
    id: 'cbi_qiaif_application',
    source: 'CBI',
    name: 'CBI QIAIF Application Pack',
    shortName: 'CBI QIAIF App',
    description: 'Qualifying Investor Alternative Investment Fund application pack for authorisation by the Central Bank of Ireland.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'ireland',
    applicableJurisdictions: ['ireland'],
    tags: ['qiaif', 'cbi', 'ireland', 'authorisation', 'regulatory'],
    citationLabel: 'Per CBI QIAIF Application Pack',
    keyFeatures: [
      'Fund structure and constitutional document submission',
      'AIFM Programme of Activity details',
      'Investment strategy and risk management framework',
      'Service provider appointments and agreements',
      'Minimum subscription threshold confirmation (EUR 100,000)',
    ]
  },

  CBI_FITNESS_PROBITY: {
    id: 'cbi_fitness_probity',
    source: 'CBI',
    name: 'CBI Fitness and Probity Individual Questionnaire (IQ)',
    shortName: 'CBI F&P IQ',
    description: 'Individual questionnaire for fitness and probity assessment required by the Central Bank of Ireland for controlled function holders.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['compliance_manual'],
    baseJurisdiction: 'ireland',
    applicableJurisdictions: ['ireland'],
    tags: ['fitness-probity', 'cbi', 'ireland', 'pcf', 'compliance'],
    citationLabel: 'Per CBI Fitness and Probity Individual Questionnaire',
    keyFeatures: [
      'Personal details and professional qualifications',
      'Employment history and regulatory record',
      'Criminal convictions and civil proceedings disclosure',
      'Competency and experience assessment for PCF roles',
    ]
  },

  // ─── CIMA (Cayman) ───────────────────────────────────────────────────────

  CIMA_PRIVATE_FUND_REG: {
    id: 'cima_private_fund_reg',
    source: 'CIMA',
    name: 'CIMA Private Fund Registration Form (PF-1)',
    shortName: 'CIMA PF-1',
    description: 'Private Fund registration form required by the Cayman Islands Monetary Authority under the Private Funds Act 2020.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'cayman',
    applicableJurisdictions: ['cayman'],
    tags: ['private-fund', 'cima', 'cayman', 'registration', 'pf-1'],
    citationLabel: 'Per CIMA Private Fund Registration Form (PF-1)',
    keyFeatures: [
      'Fund identification and structure details',
      'Investment strategy and asset class declaration',
      'Operator/AIFM and service provider appointments',
      'NAV calculation and audit arrangements',
      'Investor eligibility and minimum subscription',
    ]
  },

  CIMA_FUND_ANNUAL_RETURN: {
    id: 'cima_fund_annual_return',
    source: 'CIMA',
    name: 'CIMA Fund Annual Return (FAR)',
    shortName: 'CIMA FAR',
    description: 'Annual return filing required for all registered funds with the Cayman Islands Monetary Authority.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['compliance_manual'],
    baseJurisdiction: 'cayman',
    applicableJurisdictions: ['cayman'],
    tags: ['annual-return', 'cima', 'cayman', 'regulatory-filing'],
    citationLabel: 'Per CIMA Fund Annual Return (FAR)',
    keyFeatures: [
      'Fund AUM and NAV reporting',
      'Investor count and geographic breakdown',
      'Service provider and auditor confirmation',
      'Regulatory compliance certification',
    ]
  },

  // ─── MAS (Singapore) ─────────────────────────────────────────────────────

  MAS_CMS_LICENCE_FORM1: {
    id: 'mas_cms_licence_form1',
    source: 'MAS',
    name: 'MAS Application for Capital Markets Services Licence (Form 1)',
    shortName: 'MAS CMS Form 1',
    description: 'Application form for Capital Markets Services licence from the Monetary Authority of Singapore for fund management activities.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['compliance_manual'],
    baseJurisdiction: 'singapore',
    applicableJurisdictions: ['singapore'],
    tags: ['cms-licence', 'mas', 'singapore', 'fund-management', 'regulatory'],
    citationLabel: 'Per MAS Application for CMS Licence (Form 1)',
    keyFeatures: [
      'Applicant details and corporate structure',
      'Directors and key officers fit and proper assessment',
      'Business plan and AUM projections',
      'Risk management and compliance framework',
      'Base capital and financial resource requirements',
    ]
  },

  // ─── SFC (Hong Kong) ─────────────────────────────────────────────────────

  SFC_TYPE9_LICENCE: {
    id: 'sfc_type9_licence',
    source: 'SFC',
    name: 'SFC Type 9 Asset Management Licence Application (Form A)',
    shortName: 'SFC Type 9 Form A',
    description: 'Application for Type 9 (Asset Management) regulated activity licence from the Securities and Futures Commission of Hong Kong.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['compliance_manual'],
    baseJurisdiction: 'hong_kong',
    applicableJurisdictions: ['hong_kong'],
    tags: ['type-9', 'sfc', 'hong-kong', 'asset-management', 'licence'],
    citationLabel: 'Per SFC Type 9 Asset Management Licence Application (Form A)',
    keyFeatures: [
      'Corporation and individual licence application details',
      'Responsible officer and key personnel appointments',
      'Fit and proper assessment requirements',
      'Compliance and internal control arrangements',
      'Financial resources and professional indemnity insurance',
    ]
  },

  SFC_KFS_TEMPLATE: {
    id: 'sfc_kfs_template',
    source: 'SFC',
    name: 'SFC Key Facts Statement Template',
    shortName: 'SFC KFS',
    description: 'Key Facts Statement template required for SFC-authorised funds distributed in Hong Kong.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'hong_kong',
    applicableJurisdictions: ['hong_kong'],
    tags: ['kfs', 'sfc', 'hong-kong', 'disclosure', 'retail'],
    citationLabel: 'Per SFC Key Facts Statement Template',
    keyFeatures: [
      'Product key features summary in plain language',
      'Risk disclosure and risk indicators',
      'Fee table and ongoing charges figure',
      'Past performance presentation requirements',
      'Dealing and distribution information',
    ]
  },

  // ─── DFSA (DIFC) ─────────────────────────────────────────────────────────

  DFSA_FUND_REGISTRATION: {
    id: 'dfsa_fund_registration',
    source: 'DFSA',
    name: 'DFSA Application to Register a Domestic Fund (Form 3)',
    shortName: 'DFSA Fund Form 3',
    description: 'Application to register a domestic fund with the Dubai Financial Services Authority in the DIFC.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'difc',
    applicableJurisdictions: ['difc'],
    tags: ['fund-registration', 'dfsa', 'difc', 'domestic-fund', 'regulatory'],
    citationLabel: 'Per DFSA Application to Register a Domestic Fund (Form 3)',
    keyFeatures: [
      'Fund structure and legal form details',
      'Fund manager and operator identification',
      'Investment objectives and strategy description',
      'Eligible investor classification (qualified, professional)',
      'Custodian and administrator appointments',
    ]
  },

  // ─── FSRA (ADGM) ─────────────────────────────────────────────────────────

  FSRA_FUND_REGISTRATION: {
    id: 'fsra_fund_registration',
    source: 'FSRA',
    name: 'FSRA Fund Registration Form',
    shortName: 'FSRA Fund Registration',
    description: 'Fund registration form for the Financial Services Regulatory Authority of Abu Dhabi Global Market.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'adgm',
    applicableJurisdictions: ['adgm'],
    tags: ['fund-registration', 'fsra', 'adgm', 'regulatory'],
    citationLabel: 'Per FSRA Fund Registration Form (ADGM)',
    keyFeatures: [
      'Fund identification and legal structure',
      'Fund manager FSP licence details',
      'Investment strategy and target asset classes',
      'Qualified investor or exempt fund classification',
      'Service provider appointments and delegation arrangements',
    ]
  },

  // ─── JFSC (Jersey) ────────────────────────────────────────────────────────

  JFSC_JPF_NOTIFICATION: {
    id: 'jfsc_jpf_notification',
    source: 'JFSC',
    name: 'JFSC Jersey Private Fund Notification Form',
    shortName: 'JFSC JPF Notification',
    description: 'Notification form for Jersey Private Funds under the Jersey Private Fund regime.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'jersey',
    applicableJurisdictions: ['jersey'],
    tags: ['jpf', 'jfsc', 'jersey', 'notification', 'private-fund'],
    citationLabel: 'Per JFSC Jersey Private Fund Notification Form',
    keyFeatures: [
      'Fund identification and designated service provider details',
      'Investment strategy and eligible investor confirmation',
      'Maximum 50 investors or professional/institutional qualification',
      'Jersey-resident functionary appointment requirement',
      'AML/CFT compliance confirmation',
    ]
  },

  // ─── GFSC (Guernsey) ─────────────────────────────────────────────────────

  GFSC_PIF_REGISTRATION: {
    id: 'gfsc_pif_registration',
    source: 'GFSC',
    name: 'GFSC Private Investment Fund Registration',
    shortName: 'GFSC PIF Registration',
    description: 'Registration form for Private Investment Funds with the Guernsey Financial Services Commission.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'guernsey',
    applicableJurisdictions: ['guernsey'],
    tags: ['pif', 'gfsc', 'guernsey', 'registration', 'private-fund'],
    citationLabel: 'Per GFSC Private Investment Fund Registration',
    keyFeatures: [
      'Fund structure and vehicle type (LP, LLC, company)',
      'Licensed manager/administrator appointment',
      'Investor eligibility and maximum investor count',
      'Investment strategy and risk profile disclosure',
      'Guernsey-resident designated administrator requirement',
    ]
  },

  // ─── BVI FSC ──────────────────────────────────────────────────────────────

  BVI_PRIVATE_FUND_REG: {
    id: 'bvi_private_fund_reg',
    source: 'BVI FSC',
    name: 'BVI Private Fund Registration Form',
    shortName: 'BVI Private Fund Reg',
    description: 'Private fund registration form required by the BVI Financial Services Commission under the Securities and Investment Business Act.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['ppm'],
    baseJurisdiction: 'bvi',
    applicableJurisdictions: ['bvi'],
    tags: ['private-fund', 'bvi-fsc', 'bvi', 'registration', 'siba'],
    citationLabel: 'Per BVI FSC Private Fund Registration Form',
    keyFeatures: [
      'Fund identification and constitutional documents',
      'Investment manager and administrator details',
      'Auditor appointment confirmation',
      'Custodian/prime broker arrangements',
      'Investor eligibility (professional investors only)',
    ]
  },

  // ─── FINMA (Switzerland) ──────────────────────────────────────────────────

  FINMA_ASSET_MANAGER_LICENCE: {
    id: 'finma_asset_manager_licence',
    source: 'FINMA',
    name: 'FINMA Asset Manager of Collective Investment Schemes Licence Application',
    shortName: 'FINMA CIS Licence',
    description: 'Licence application for asset managers of collective investment schemes under the Swiss FinIA (Financial Institutions Act).',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['compliance_manual'],
    baseJurisdiction: 'switzerland',
    applicableJurisdictions: ['switzerland'],
    tags: ['finma', 'licence', 'switzerland', 'finia', 'asset-manager'],
    citationLabel: 'Per FINMA Asset Manager of CIS Licence Application',
    keyFeatures: [
      'Organisational structure and governance framework',
      'Minimum capital and financial guarantee requirements',
      'Risk management and internal control systems',
      'Fit and proper assessment for qualified participants',
      'Delegation arrangements and outsourcing controls',
    ]
  },

  // ─── DVCA (Denmark) ───────────────────────────────────────────────────────

  DVCA_TRANSPARENCY_TEMPLATE: {
    id: 'dvca_transparency_template',
    source: 'DVCA',
    name: 'DVCA Transparency Reporting Template',
    shortName: 'DVCA Transparency',
    description: 'Transparency reporting template for Danish PE/VC funds, aligned with the Danish Venture Capital Association guidelines.',
    version: 'Current',
    file: null,
    format: 'pdf',
    gaioDocTypes: ['compliance_manual'],
    baseJurisdiction: 'danish',
    applicableJurisdictions: ['danish'],
    tags: ['transparency', 'reporting', 'dvca', 'danish', 'compliance'],
    citationLabel: 'Per DVCA Transparency Reporting Template',
    keyFeatures: [
      'Active ownership and governance reporting',
      'Portfolio company financial and operational metrics',
      'ESG integration and responsible investment reporting',
      'Fund performance and fee transparency',
    ]
  },

  // ─── EFAMA ────────────────────────────────────────────────────────────────

  EFAMA_EMT: {
    id: 'efama_emt',
    source: 'EFAMA',
    name: 'EFAMA European MiFID Template (EMT)',
    shortName: 'EFAMA EMT',
    description: 'European MiFID Template for structured exchange of fund distribution data between manufacturers and distributors under MiFID II.',
    version: 'Current',
    file: 'efama/FinDatEx_EMT_V4.3_European_MiFID_Template.xlsx',
    format: 'xlsx',
    gaioDocTypes: ['ppm', 'compliance_manual'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['emt', 'mifid', 'efama', 'distribution', 'target-market'],
    citationLabel: 'Per EFAMA European MiFID Template (EMT)',
    keyFeatures: [
      'Target market identification (investor type, knowledge, risk tolerance)',
      'Cost and charges data exchange format',
      'Distribution strategy and negative target market',
      'Product governance manufacturer/distributor data sharing',
      'Standardised CSV format for automated processing',
    ]
  },

  EFAMA_EET: {
    id: 'efama_eet',
    source: 'EFAMA',
    name: 'EFAMA European ESG Template (EET)',
    shortName: 'EFAMA EET',
    description: 'European ESG Template for structured exchange of sustainability-related fund data under SFDR and Taxonomy Regulation.',
    version: 'Current',
    file: 'efama/FinDatEx_EET_V1.1_European_ESG_Template.xlsx',
    format: 'xlsx',
    gaioDocTypes: ['esg_sfdr'],
    baseJurisdiction: null,
    applicableJurisdictions: ['english', 'french', 'italian', 'german', 'spanish', 'swedish', 'danish', 'ireland', 'luxembourg', 'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian'],
    tags: ['eet', 'esg', 'efama', 'sfdr', 'taxonomy', 'sustainable-finance'],
    citationLabel: 'Per EFAMA European ESG Template (EET)',
    keyFeatures: [
      'SFDR Article 6/8/9 classification data',
      'Taxonomy-alignment percentages and PAI indicator data',
      'ESG investment proportion breakdown',
      'Sustainability preferences matching (MiFID II integration)',
      'Standardised CSV format for automated processing',
    ]
  },

};

// ── LOOKUP FUNCTIONS ─────────────────────────────────────────────────────────

/**
 * Get a template by ID.
 */
function getTemplate(id) {
  return Object.values(TEMPLATES).find(t => t.id === id) || null;
}

/**
 * Find templates matching a Gaio document type.
 */
function getTemplatesByDocType(docType) {
  return Object.values(TEMPLATES).filter(t =>
    t.gaioDocTypes.includes(docType.toLowerCase().replace(/[\s-]/g, '_'))
  );
}

/**
 * Find templates applicable to a jurisdiction.
 */
function getTemplatesByJurisdiction(jurisdiction) {
  const j = jurisdiction.toLowerCase().replace(/[\s-]/g, '_');
  return Object.values(TEMPLATES).filter(t =>
    t.applicableJurisdictions.includes(j) || t.baseJurisdiction === j
  );
}

/**
 * Find the best template for a given document type + jurisdiction combination.
 * Returns the most specific match (base jurisdiction > applicable jurisdiction).
 */
function findBestTemplate(docType, jurisdiction) {
  const dt = docType.toLowerCase().replace(/[\s-]/g, '_');
  const j  = jurisdiction ? jurisdiction.toLowerCase().replace(/[\s-]/g, '_') : null;

  const candidates = Object.values(TEMPLATES).filter(t => t.gaioDocTypes.includes(dt));
  if (candidates.length === 0) return null;

  // Prefer base jurisdiction match
  if (j) {
    const baseMatch = candidates.find(t => t.baseJurisdiction === j);
    if (baseMatch) return baseMatch;

    const applicableMatch = candidates.find(t => t.applicableJurisdictions.includes(j));
    if (applicableMatch) return applicableMatch;
  }

  // Return first match (typically ILPA for fund docs, NVCA for VC docs)
  return candidates[0];
}

/**
 * Find all templates matching a query by tag, source, or name.
 */
function searchTemplates(query) {
  const q = query.toLowerCase();
  return Object.values(TEMPLATES).filter(t =>
    t.name.toLowerCase().includes(q) ||
    t.shortName.toLowerCase().includes(q) ||
    t.source.toLowerCase().includes(q) ||
    t.tags.some(tag => tag.includes(q)) ||
    t.description.toLowerCase().includes(q)
  );
}

/**
 * Get all templates.
 */
function getAllTemplates() {
  return Object.values(TEMPLATES);
}

/**
 * Get templates grouped by source.
 */
function getTemplatesBySource() {
  const grouped = {};
  for (const t of Object.values(TEMPLATES)) {
    if (!grouped[t.source]) grouped[t.source] = [];
    grouped[t.source].push(t);
  }
  return grouped;
}

// ── FILE ACCESS ──────────────────────────────────────────────────────────────

/**
 * Get the absolute file path for a template.
 * Returns null if file is not available locally.
 */
function getTemplatePath(templateId) {
  const t = getTemplate(templateId);
  if (!t || !t.file) return null;
  const fullPath = path.join(TEMPLATE_DIR, t.file);
  return fs.existsSync(fullPath) ? fullPath : null;
}

/**
 * Read a text-based template file (txt format).
 */
function readTemplateText(templateId) {
  const filePath = getTemplatePath(templateId);
  if (!filePath) return null;
  const t = getTemplate(templateId);
  if (t.format !== 'txt') return null;
  return fs.readFileSync(filePath, 'utf8');
}

/**
 * Check which templates have local files available.
 */
function getTemplateAvailability() {
  const results = {};
  for (const t of Object.values(TEMPLATES)) {
    const filePath = t.file ? path.join(TEMPLATE_DIR, t.file) : null;
    results[t.id] = {
      id: t.id,
      name: t.shortName,
      source: t.source,
      hasFile: filePath ? fs.existsSync(filePath) : false,
      format: t.format,
      file: t.file
    };
  }
  return results;
}

// ── AI PROMPT INTEGRATION ────────────────────────────────────────────────────

/**
 * Build a template context block for injection into AI drafting prompts.
 * Tells the AI which official template to use as the base.
 */
function buildTemplateContext(docType, jurisdiction) {
  const template = findBestTemplate(docType, jurisdiction);
  if (!template) return '';

  const lines = [
    `[OFFICIAL TEMPLATE REFERENCE]`,
    `Base Template: ${template.name}`,
    `Source: ${template.source} (${template.version})`,
    `Citation: ${template.citationLabel}`,
    `Base Jurisdiction: ${template.baseJurisdiction || 'multi-jurisdiction'}`,
    '',
    'Key Features of Base Template:',
    ...template.keyFeatures.map(f => `  • ${f}`),
    '',
    'INSTRUCTION: Use this official template as the structural foundation.',
    'Maintain the same clause numbering, defined terms, and overall architecture.',
    `Adapt for ${jurisdiction || 'the requested'} jurisdiction by applying jurisdiction-specific`,
    'provisions from your legal knowledge base. Customise with the party details and',
    'negotiated terms provided. Mark any deviations from the base template with',
    '[NOTE: Departure from ${template.shortName} — reason: ...].',
  ];

  // If we have the ICC arbitration clause text, include it
  if (docType !== 'subscription_agreement') {
    const iccText = readTemplateText('icc_arbitration_clause');
    if (iccText) {
      lines.push('');
      lines.push('[STANDARD ARBITRATION CLAUSE — for inclusion in dispute resolution section]');
      lines.push(iccText.split('\n').slice(6, 14).join('\n'));  // Just the clause text
    }
  }

  return lines.join('\n');
}

/**
 * Build a summary of all available templates for a given document type.
 * Used when presenting options to the user.
 */
function buildTemplateSummary(docType) {
  const templates = getTemplatesByDocType(docType);
  if (templates.length === 0) return `No official templates available for document type: ${docType}`;

  const lines = [`Available official templates for ${docType}:\n`];
  for (const t of templates) {
    const available = t.file && fs.existsSync(path.join(TEMPLATE_DIR, t.file)) ? '✓' : '○';
    lines.push(`${available} ${t.shortName} (${t.source}, ${t.version})`);
    lines.push(`  ${t.description}`);
    lines.push(`  Jurisdictions: ${t.applicableJurisdictions.join(', ')}`);
    lines.push('');
  }
  return lines.join('\n');
}

// ── STATS ────────────────────────────────────────────────────────────────────

function getLibraryStats() {
  const all = Object.values(TEMPLATES);
  const availability = getTemplateAvailability();
  const available = Object.values(availability).filter(a => a.hasFile).length;

  return {
    totalTemplates: all.length,
    availableLocally: available,
    pendingDownload: all.length - available,
    bySources: {
      ILPA: all.filter(t => t.source === 'ILPA').length,
      NVCA: all.filter(t => t.source === 'NVCA').length,
      IRS:  all.filter(t => t.source === 'IRS').length,
      ICC:  all.filter(t => t.source === 'ICC').length,
      FCA:  all.filter(t => t.source === 'FCA').length,
      'Invest Europe': all.filter(t => t.source === 'Invest Europe').length,
      IPEV: all.filter(t => t.source === 'IPEV').length,
      ESMA: all.filter(t => t.source === 'ESMA').length,
      'European Commission': all.filter(t => t.source === 'European Commission').length,
      OECD: all.filter(t => t.source === 'OECD').length,
      LPEA: all.filter(t => t.source === 'LPEA').length,
      ALFI: all.filter(t => t.source === 'ALFI').length,
      'France Invest': all.filter(t => t.source === 'France Invest').length,
      SECA: all.filter(t => t.source === 'SECA').length,
      BVK:  all.filter(t => t.source === 'BVK').length,
      AIFI: all.filter(t => t.source === 'AIFI').length,
      ASCRI: all.filter(t => t.source === 'ASCRI').length,
      'Irish Funds': all.filter(t => t.source === 'Irish Funds').length,
      AIMA: all.filter(t => t.source === 'AIMA').length,
      CSSF: all.filter(t => t.source === 'CSSF').length,
      CBI:  all.filter(t => t.source === 'CBI').length,
      CIMA: all.filter(t => t.source === 'CIMA').length,
      MAS:  all.filter(t => t.source === 'MAS').length,
      SFC:  all.filter(t => t.source === 'SFC').length,
      DFSA: all.filter(t => t.source === 'DFSA').length,
      FSRA: all.filter(t => t.source === 'FSRA').length,
      JFSC: all.filter(t => t.source === 'JFSC').length,
      GFSC: all.filter(t => t.source === 'GFSC').length,
      'BVI FSC': all.filter(t => t.source === 'BVI FSC').length,
      FINMA: all.filter(t => t.source === 'FINMA').length,
      DVCA: all.filter(t => t.source === 'DVCA').length,
      EFAMA: all.filter(t => t.source === 'EFAMA').length,
    },
    byDocType: {
      lpa: getTemplatesByDocType('lpa').length,
      spa: getTemplatesByDocType('spa').length,
      nda: getTemplatesByDocType('nda').length,
      side_letter: getTemplatesByDocType('side_letter').length,
      subscription_agreement: getTemplatesByDocType('subscription_agreement').length,
      ppm: getTemplatesByDocType('ppm').length,
      advisory_agreement: getTemplatesByDocType('advisory_agreement').length,
      profit_split: getTemplatesByDocType('profit_split').length,
      non_circumvention: getTemplatesByDocType('non_circumvention').length,
    }
  };
}

// ── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  TEMPLATES,
  TEMPLATE_DIR,

  // Lookups
  getTemplate,
  getTemplatesByDocType,
  getTemplatesByJurisdiction,
  findBestTemplate,
  searchTemplates,
  getAllTemplates,
  getTemplatesBySource,

  // File access
  getTemplatePath,
  readTemplateText,
  getTemplateAvailability,

  // AI integration
  buildTemplateContext,
  buildTemplateSummary,

  // Stats
  getLibraryStats,
};
