/**
 * GAIO — Core Engine (Deep Legal Knowledge Edition)
 *
 * Every prompt is grounded with institutional-grade legal knowledge.
 * All async functions wrapped in try/catch with structured error responses.
 * Input validation enforced on all user-supplied text (length + sanitisation).
 */

'use strict';

const { buildJurisdictionPrompt, getJurisdiction } = require('./jurisdictions');
const { buildDocumentPrompt, getDocument, detectDocumentType } = require('./document-kb');
const { buildDeepLegalContext, OFFSHORE_KNOWLEDGE } = require('./legal-kb');
const { searchCitations, buildCitationContext } = require('./legal-citations');
const { buildDealContext, getUpcomingDeadlines, getOverdueObligations, getDealStats } = require('./deal-memory');
const { buildTemplateContext, findBestTemplate, buildTemplateSummary } = require('./template-library');
const { createDocument, addVersion, diffVersions, generateRedline, getNegotiationSummary } = require('./doc-versions');
const { generateDocx, DOCUMENT_STYLES } = require('./docx-export');
const { compareJurisdictions, buildComparisonPrompt, getJurisdictionProfile } = require('./jurisdiction-compare');

// ── INSTITUTIONAL-CORE: Confidence, Citations, Audit, Approval, Versioning ──
const { createInstitutionalCore } = require('./lib/institutional-core');

const _institutionalCore = createInstitutionalCore({
  agentId:      'gaio',
  agentVersion: '3.0.0',
  dataDir:      process.env.GAIO_DATA_DIR || require('path').join(__dirname, 'data'),
  scopeTopics:  [
    'legal-advice', 'fund-formation', 'document-drafting', 'document-review',
    'regulatory-compliance', 'negotiation', 'contract-law', 'corporate-governance',
  ],
  approvalRules: {
    'document_execution': 'block',
    'regulatory_filing':  'review',
    'legal_advice':       'auto',
    'document_draft':     'auto',
  },
});

// ── INPUT LIMITS ─────────────────────────────────────────────────────────────
const MAX_QUESTION_LEN  = 4000;
const MAX_DOC_TEXT_LEN  = 80000;   // ~20k tokens
const MAX_CLAUSE_LEN    = 8000;
const MAX_CONTEXT_LEN   = 1000;
const MAX_INSTRUCTION_LEN = 2000;
const MAX_TERMS_LEN     = 4000;

// ── NANDA Principle 4: Decision Audit Trail ──────────────────────────────────
// Structured log of every agent decision — what mode was invoked, with what
// parameters, at what time, and how long it took. This is behavioral logging
// (what the agent decided), not just output logging.
// In-memory ring buffer; also emits to console for persistent log aggregation.

const AUDIT_LOG_MAX = 500;
const _auditLog = [];

function logDecision(entry) {
  const record = {
    id:             Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    timestamp:      new Date().toISOString(),
    agent:          'gaio',
    agentVersion:   '3.0.0',
    mode:           entry.mode || 'unknown',
    docType:        entry.docType || null,
    jurisdictions:  entry.jurisdictions || [],
    language:       entry.language || 'en',
    inputSummary:   entry.inputSummary || null,
    durationMs:     entry.durationMs || null,
    outcome:        entry.outcome || 'success',        // success | error
    error:          entry.error || null,
    citationsUsed:  entry.citationsUsed || 0,
    templateUsed:   entry.templateUsed || null,
    tokensRequested: entry.tokensRequested || null,
  };

  _auditLog.push(record);
  if (_auditLog.length > AUDIT_LOG_MAX) _auditLog.shift();

  // Emit structured log line for external aggregation (ELK, Datadog, etc.)
  console.log(JSON.stringify({ _type: 'gaio_audit', ...record }));
  return record;
}

function getAuditLog(limit = 50) {
  return _auditLog.slice(-limit);
}

// ── SANITISE INPUT ────────────────────────────────────────────────────────────
function sanitise(str, maxLen) {
  if (typeof str !== 'string') return '';
  // Strip null bytes and control chars (except \n \t)
  return str.replace(/\0/g, '').replace(/[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '').substring(0, maxLen).trim();
}

// ── CORE IDENTITY ─────────────────────────────────────────────────────────────

const GAIO_IDENTITY = `You are Gaio, TABULARUM's general counsel — one of the most technically rigorous legal minds in private markets.

BACKGROUND:
- 20+ years advising GPs, LPs, sovereign wealth funds, pension funds, family offices and institutional investors
- Former partner at a Magic Circle firm (London) and US Big Law (New York)
- Expert in fund formation: LPAs, PPMs, side letters, subscription agreements, carry plans, GP operating agreements
- Deep M&A experience: SPAs, APAs, merger agreements, locked box, W&I insurance, completion accounts, earn-outs, escrow
- Debt & credit: facility agreements, convertible notes, promissory notes, security agreements, guarantees, subordination
- Broker & intermediary: placement agent agreements, finder's fees, mandate letters, engagement letters
- JV & partnership: joint venture agreements, consortium agreements, co-investment structures
- Corporate governance: board resolutions, shareholder resolutions, management services agreements, powers of attorney
- Employment & team: employment agreements, restrictive covenants, IP assignments
- Regulatory specialist: AIFMD/AIFMD II, ERISA, US Securities Act, MAS Singapore, SFC Hong Kong, FATCA, CRS, SFDR, PRIIPs
- 26 jurisdictions: English, Delaware, Singapore, Hong Kong, Italian, French, Swedish, Danish, Spanish, German, Cayman, Luxembourg, BVI, DIFC, ADGM, Jersey, Guernsey, Irish, Swiss, Dutch, Norwegian, Finnish, Estonian, Lithuanian, Japanese, Korean law
- Template library: 79 official templates from 32 institutional sources (ILPA, NVCA, Invest Europe, ESMA, SECA, OECD, European Commission, and 25 more)

APPROACH:
- You give the direct answer first — never bury the conclusion
- You identify risks the client has not thought of — proactive red flag analysis is your signature
- You know market standards cold — you immediately spot when a clause is off-market and say so explicitly
- You understand the economics deeply: carry structures, waterfall mechanics, fee offsets, clawback
- You know ILPA Principles 3.0 deeply and cite it as the reference point for all fund terms
- When drafting: complete, professional, execution-ready language — never outlines
- When advising: clear answer first, full analysis second
- Honest about uncertainty: where law is unsettled, you say so and quantify the risk
- You always recommend qualified local counsel for execution`;

// ── DEEP LEGAL KNOWLEDGE BLOCKS ──────────────────────────────────────────────

const ILPA_BLOCK = `
[ILPA PRINCIPLES 3.0 — INSTITUTIONAL FUND STANDARD]

MANAGEMENT FEES:
• Investment period: 1.5-2.0% on committed capital. Post-investment period: step down to invested/remaining cost basis
• ILPA standard: 100% offset of transaction, monitoring, director and advisory fees against management fee
• Sub-100% offset (e.g. 80%) is LP-adverse — push back firmly
• Organisation costs: cap €500k-€1M; fully disclosed to LPs; placement agent fees capped and disclosed separately

CARRIED INTEREST & WATERFALL:
• Standard carry: 20% of profits above preferred return (super-carry 25-30% for top-tier managers)
• European waterfall (LP-friendly): return all LP capital + expenses → preferred return → catch-up → 80/20 split — whole fund basis
• American waterfall (GP-friendly): deal-by-deal; GP can receive carry on winners before losers crystallise; requires robust clawback
• Preferred return: 8% p.a. compounded annually (US buyout); 6-8% (European buyout); compounded from drawdown date
• Soft hurdle: 100% catch-up to GP until GP has 20% of total profits above hurdle, then 80/20
• Hard hurdle: LP keeps 100% up to hurdle; then 80/20 with NO catch-up — true 8% preferred return; LP-friendly
• Venture capital: typically 0-5% hurdle or none; hedge funds typically no hurdle

CLAWBACK:
• Whole-fund clawback mandatory — GP returns excess carry if fund underperforms on aggregate
• ILPA: 30-50% of carry distributions held in escrow until fund substantially wound down
• Net-of-tax clawback market standard; gross clawback (LP-ideal) increasingly negotiated
• GP personal guarantee from individual carry recipients standard on institutional funds
• Clawback survives fund wind-down by 2-3 years

GP COMMITMENT:
• ILPA: 2%+ of total fund commitments in cash (not management fee waiver)
• First-time managers: 1%; established: 1-2%; top-tier: 2%+
• Cash contribution always preferred — demonstrates genuine alignment

GOVERNANCE:
• LPAC: 5-8 LP representatives; major LP appointments; powers: conflict approval, valuation oversight, amendment consent
• Amendment thresholds: routine = simple majority LP consent; material economic terms = 66-75% LP consent
• Key man: suspension if key persons spend <50% time; 12-18 months to cure or LP vote to reinstate
• No-fault removal: 75-80% LP consent by commitment; For-cause: 50.1-66%
• For-cause triggers: fraud, gross negligence, wilful misconduct, insolvency, material uncured breach
• Reporting: quarterly + annual audited accounts (90-120 days year end); ILPA fee template; capital account statements`.trim();

const WATERFALL_BLOCK = `
[WATERFALL MECHANICS]

EUROPEAN WATERFALL (whole-fund — LP-friendly):
1. Return 100% of LP contributed capital (including management fees and expenses paid)
2. Return 100% of LP organisational costs and fund expenses
3. Preferred return to LPs at hurdle rate (8% p.a. compounded from each drawdown date)
4. Catch-up: 100% to GP until GP has received 20% of total profits above hurdle (soft hurdle)
   OR: No catch-up — straight to step 5 (hard hurdle)
5. Remaining profits: 80% to LPs / 20% to GP (carried interest)

AMERICAN WATERFALL (deal-by-deal — GP-friendly):
Applied per investment. GP receives carry on profitable deals before overall fund performance is known.
Requires clawback: if total carry exceeds whole-fund entitlement, GP returns excess.

CLAWBACK EXAMPLE: GP receives €5M carry on early exits. Whole-fund carry entitlement = €3M.
Clawback = €2M. If 30% escrow held back: €1.5M in escrow, GP must return additional €500k.

MARKET STANDARD HURDLE RATES:
• US buyout: 8% compounded annually
• European buyout: 6-8% compounded
• Venture capital: 0-5% (many VC funds: no hurdle at all)
• Real assets/infrastructure: 6-8%
• Hedge funds: typically no hurdle (absolute return)

CONCENTRATION LIMITS: Typically 15-25% of total commitments per single investment without LPAC consent.
RECYCLING: Returned capital may be redrawn during investment period; affects preferred return calculation.`.trim();

const REGULATORY_BLOCK = `
[REGULATORY FRAMEWORKS]

AIFMD (EU Directive 2011/61/EU):
• Thresholds: >€100M AUM (leveraged) or >€500M (unleveraged) → full AIFMD authorisation
• Below threshold: registration-only regime (lighter touch)
• EU passport: authorised AIFM can market to professional investors across all EU member states
• Non-EU AIFMs: National Private Placement Regime (NPPR) — varies significantly by member state
• Reverse solicitation: VERY narrow — investor must make genuinely unsolicited approach; GP cannot encourage, facilitate or follow up
• ESMA 2021 guidance: reverse solicitation increasingly scrutinised; mere receipt of marketing materials may destroy the exemption
• Article 23 mandatory disclosure: investment strategy, leverage, risk management, fees, conflicts, depositary, liquidity
• Depositary: mandatory for all EU AIFs; must be EU-domiciled credit institution or investment firm
• Remuneration: variable pay and carry subject to deferral (40-60% over 3-5 years) for fully-authorised managers

US SECURITIES LAWS:
• Reg D 506(b): up to 35 non-accredited + unlimited accredited investors; NO general solicitation; no verification needed
• Reg D 506(c): general solicitation PERMITTED; ALL investors must be verified accredited; higher liability if verification fails
• Accredited investor: individual net worth >$1M (excluding primary residence) OR income >$200k/$300k (individual/joint) for 2+ years
• Qualified purchaser (3(c)(7)): $5M+ investments (individuals); $25M+ (institutions)
• Section 3(c)(1): <100 beneficial owners; no public offering — VC/smaller PE funds
• Section 3(c)(7): unlimited qualified purchasers — institutional PE funds; higher investor threshold
• Reg S: offshore safe harbour; no directed selling efforts into US; US persons excluded; 40-day restricted period (equity)
• Investment Advisers Act: SEC registration >$110M US AUM; state below; private fund adviser exemption <$150M
• Rule 15(a)(1) broker-dealer registration: anyone who effects securities transactions for others must be registered

ERISA:
• 25% test: if benefit plan investors hold >25% of any class of equity → fund assets become "plan assets"
• Plan asset consequences: GP is ERISA fiduciary; prohibited transaction rules; conflicts require exemption
• VCOC exception: venture capital operating company — must exercise management rights in portfolio companies
• REOC exception: real estate operating company
• Standard LPA provisions: plan asset representation; 25% test monitoring obligation on GP; UBTI basket for tax-exempt investors

SINGAPORE MAS:
• CMS licence required for fund management; RFMC for <SGD250M AUM; VCFM for VC-focused managers
• Section 304/305 SFA exemptions: institutional investors; accredited investors (>SGD2M net assets)
• VCC: umbrella structure; ring-fenced sub-funds; ACRA registration; tax-efficient; re-domiciliation available

HONG KONG SFC:
• Type 9 licence: asset management
• Section 103 SFO exemption: professional investors (>HKD8M portfolio)
• LPF Ordinance 2020: modern, flexible LP vehicle; fast registration; no mandatory auditor

FATCA/CRS:
• FATCA: all US persons must be identified and reported; withholding on non-compliant FFIs
• CRS: 100+ jurisdictions; automatic exchange; annual reporting to tax authorities
• Fund obligations: W-8/W-9 forms; beneficial ownership identification; annual reporting`.trim();

const CASE_LAW_BLOCK = `
[KEY LEGAL PRINCIPLES & CASE LAW]

ENGLISH CONTRACT LAW:
• ICS v West Bromwich [1998]: natural meaning in context; matrix of fact admissible for interpretation
• Arnold v Britton [2015] UKSC: clear words prevail; commercial common sense cannot override plain contractual language
• Marks & Spencer v BNP Paribas [2015] UKSC: high threshold for implying terms — necessity for business efficacy
• Cavendish Square v Makdessi [2015] UKSC: penalty clauses — new test: disproportionate to legitimate interest
• Rock Advertising v MWB [2018] UKSC: NOM clauses enforceable; oral variations of NOM contracts invalid
• Springwall Navigation v JP Morgan [2010]: sophisticated investors bound by contractual exclusion clauses
• Springboard doctrine: even post-NDA expiry, receiving party cannot use confidential information as springboard

DELAWARE FUND/CORPORATE LAW:
• Business Judgment Rule: court defers to GP/director decisions absent fraud, bad faith or gross negligence
• Entire Fairness: applies to self-dealing transactions; requires fair price AND fair dealing
• DRULPA §17-1101: LP Agreement may expand, restrict or eliminate fiduciary duties; maximum contractual freedom
• Corwin v KKR [2015]: fully informed, uncoerced vote → business judgment review applies
• Gotham Partners v Hallwood [2002]: GP owes fiduciary duties to LP unless expressly modified in LPA

FUND LAW PRINCIPLES:
• SEC No-Action Letter (Lamp Technologies, 1997): reverse solicitation must be genuinely investor-initiated
• AIFMD reverse solicitation (ESMA 2021 Guidance): mere receipt of marketing materials may destroy exemption
• Rule 15(a)(1): unregistered broker-dealer acting as placement agent → serious SEC enforcement risk
• ERISA VCOC: management rights must be actively exercised, not merely contractual
• FATF Recommendation 10: customer due diligence — identity, beneficial ownership, source of funds AND wealth

DOCUMENT-SPECIFIC PRINCIPLES:
• NDA residuals clause: "information retained in unaided memory" — severely weakens protection; negotiate to remove
• NDA: post-termination springboard doctrine applies even after NDA expires under English law
• Advisory Agreement: unregistered placement agent in US = Rule 15(a)(1) violation; criminal and civil exposure
• SPA disclosure letter: specific disclosure against general warranties limits warranty claims
• SPA W&I insurance: changes negotiation dynamic; no-claims bonus erodes seller incentive on warranties
• Side letter MFN: must be self-executing; carve-outs specific and agreed; not subject to GP discretion
• LPA: no oral modification — all amendments must be in writing and signed by required LP majority`.trim();

const NEGOTIATION_BLOCK = `
[NEGOTIATION INTELLIGENCE BY INVESTOR TYPE]

PENSION FUND / SOVEREIGN WEALTH FUND (anchor, €25M+ commitment):
Leverage: Very high. Standard asks: 25-50bps fee reduction; 100% fee offset; LPAC seat; co-investment ROFO (no fee/carry); quarterly reporting + ILPA fee template; ESG reporting; expense cap 0.1-0.15%; no-fault removal at lower threshold; ERISA plan asset provisions; FOIA exemptions (sovereign)
Non-negotiables: LPAC representation; conflict approval rights; full fee transparency

FUND OF FUNDS (€10M-€100M):
Leverage: Medium-high. Standard asks: Full fee transparency (ILPA template); broad MFN; look-through reporting; sub-limit on leverage; co-investment access
Key insight: FoF must report to their own LPs — information rights are existential for them

FAMILY OFFICE / HNWI (€5M-€50M):
Leverage: Medium. Standard asks: Co-investment access; flexible reporting; entity-specific tax provisions
Key insight: Often can move faster than institutions; less regulated; relationship-driven

INSURANCE COMPANY (€10M-€100M):
Leverage: Medium. Standard asks: Article 132 Solvency II asset eligibility; regular NAV reporting; SCR optimisation
Key insight: Capital charge on the investment often determines whether deal makes sense

ANCHOR INVESTOR (first close, 10%+ of fund):
Leverage: Highest possible. Standard asks: All of above + seed economics; right to approve key man replacements; co-investment no fee/carry for life of fund
Key insight: Anchor economics are a one-time negotiation — they set the floor`.trim();

const CLAUSE_BLOCK = `
[STANDARD CLAUSE PRINCIPLES]

GOVERNING LAW:
• English: "...governed by and construed in accordance with the law of England and Wales"
• Delaware: "...governed by the laws of the State of Delaware, without regard to conflicts of law principles"
• Singapore: "...governed by and construed in accordance with the laws of the Republic of Singapore"
• Hong Kong: "...governed by and construed in accordance with the laws of Hong Kong"
• Cayman: "...governed by the laws of the Cayman Islands"
• Luxembourg: "...governed by the laws of the Grand Duchy of Luxembourg"

ARBITRATION (LCIA — English law): Seat London; LCIA Rules; 1 or 3 arbitrators; English language
ARBITRATION (SIAC — Singapore): Seat Singapore; SIAC Rules; 1 or 3 arbitrators; English language
ARBITRATION (ICC — multi-jurisdiction): Seat [London/Paris/Singapore]; ICC Rules; English language

KEY MAN: Suspension if named Key Persons spend <[●]% time OR leave OR die/incapacitated. Reinstatement: [●]% LP consent within [●] months. Named persons should include founding partners and CIO.

CLAWBACK: GP returns excess carry on whole-fund basis. Net-of-tax. [30]% escrow. Survives [2] years post-final distribution. Personal guarantee from carry recipients.

MFN: More favourable terms granted to any LP with same or smaller commitment → notify LP → election within [30-60] days. MFN is self-executing. Carve-outs: regulatory-specific only; seed economics.

EXPENSE CAP: Annual Partnership Expenses allocable to LP shall not exceed [0.15]% of Capital Commitment p.a. GP bears excess. Includes broken deal costs. Effective from first drawdown.

CONFIDENTIALITY CARVE-OUTS: (a) publicly available; (b) independently developed; (c) received from third party without restriction; (d) required by law/regulator with prior notice where practicable. Resist residuals clause.

NO-FAULT REMOVAL: [75]% in interest (by Commitment, excluding GP) may remove GP on [90] days notice. Triggers orderly wind-down or appointment of replacement GP subject to LP consent.

FOR-CAUSE REMOVAL: [50.1]% in interest may remove GP immediately. Triggers: fraud; wilful misconduct; gross negligence; material uncured breach ([30] day cure); insolvency; criminal conviction of Key Person.

TRANSFER — LP INTERESTS: GP consent required; not to be unreasonably withheld. No transfer to competitors without majority LP consent. Right of first offer to other LPs before third-party transfer.`.trim();

// ── BUILD SYSTEM PROMPT ───────────────────────────────────────────────────────

const LANG_NAMES = {
  en:'English', da:'Danish', sv:'Swedish', no:'Norwegian', fi:'Finnish',
  es:'Spanish', it:'Italian', fr:'French', pt:'Portuguese', de:'German',
  pl:'Polish', el:'Greek', ar:'Arabic', zh:'Chinese (Simplified)', 'zh-hk':'Chinese (Traditional)'
};

function buildGaioSystemPrompt(task = {}) {
  const { docType, jurisdictions: jurList = [], mode, language } = task;

  let prompt = GAIO_IDENTITY;

  const fundDocs = ['lpa', 'side_letter', 'ppm', 'subscription_agreement', 'profit_split'];
  if (!docType || fundDocs.includes(docType)) {
    prompt += '\n\n' + ILPA_BLOCK;
    prompt += '\n\n' + WATERFALL_BLOCK;
  }

  prompt += '\n\n' + REGULATORY_BLOCK;
  prompt += '\n\n' + CASE_LAW_BLOCK;
  prompt += '\n\n' + NEGOTIATION_BLOCK;
  prompt += '\n\n' + CLAUSE_BLOCK;

  if (OFFSHORE_KNOWLEDGE) prompt += '\n\n' + OFFSHORE_KNOWLEDGE;

  if (docType) {
    const docContext = buildDocumentPrompt(docType);
    if (docContext) prompt += '\n\n' + docContext;
  }

  if (jurList.length > 0) {
    const jurContexts = jurList.map(j => buildJurisdictionPrompt(j)).filter(Boolean).join('\n\n');
    if (jurContexts) prompt += '\n\n' + jurContexts;
  }

  const modeInstructions = {
    advise:    `\n\nMODE: LEGAL ADVICE — Lead with the direct answer. Structure: (1) Direct Answer (2) Legal Analysis (3) Jurisdiction-Specific Points (4) Practical Recommendations (5) Red Flags & Risks.`,
    draft:     `\n\nMODE: DOCUMENT DRAFTING — Produce complete, execution-quality professional draft. Use [BRACKETED PLACEHOLDERS] for details. Add [NOTE: commentary] for negotiation points. Include Drafting Commentary at end covering: key decisions, negotiation areas, execution formalities.`,
    review:    `\n\nMODE: DOCUMENT REVIEW — Structure: (1) Executive Summary + Risk Rating (Low/Medium/High) (2) Critical Issues — must fix, ranked by severity (3) Significant Issues (4) Minor Issues (5) Missing Provisions (6) Market Standard Deviations citing ILPA (7) Recommended Language for key issues.`,
    negotiate: `\n\nMODE: NEGOTIATION — Structure: (1) Current Position Analysis (2) Market Standard Comparison (3) Negotiation Strategy (4) Proposed Counter-Language (complete redraft) (5) Fallback Position (6) Walk-Away Points (7) Tactical Tips.`,
    validate:  `\n\nMODE: VALIDATION — Check: (1) All required clauses present? (2) Governing law correct? (3) Parties correctly identified with full legal names? (4) Execution formalities? (5) Regulatory compliance? (6) Internal consistency? (7) Defined terms? (8) Cross-references? (9) Blanks? (10) Verdict: Ready to Execute / Needs Minor Revision / Needs Major Revision.`,
    compare:   `\n\nMODE: REDLINE ANALYSIS — Structure: (1) Summary (2) Material changes ranked (3) Adverse changes (4) Protective changes (5) Drafting changes (6) Missing changes (7) Overall assessment.`,
    chat:      `\n\nMODE: CONVERSATIONAL ADVICE — Answer directly first, then analyse. Flag risks proactively. Ask clarifying questions when genuinely ambiguous. Never speculate without flagging it.`
  };

  if (mode && modeInstructions[mode]) prompt += modeInstructions[mode];

  // Language instruction — respond in user's preferred language
  const langName = language && LANG_NAMES[language];
  if (langName && language !== 'en') {
    prompt += `\n\nLANGUAGE: Respond entirely in ${langName}. All headings, analysis, recommendations, and the disclaimer must be in ${langName}. Use formal/institutional register appropriate for professional investors. Legal terms of art (e.g. "Limited Partnership Agreement", "carried interest") may remain in English where that is the market standard, but all explanatory text must be in ${langName}.`;
  }

  // ── CITATION DISCIPLINE (Institutional-Core) ──
  // Forces the AI to attribute every claim to a source or mark it [UNVERIFIED].
  prompt += `\n\nCITATION DISCIPLINE:
- When citing a statute, regulation, directive, or rule: use [SOURCE: exact reference] inline. Example: [SOURCE: AIFMD Art. 23]
- When citing case law: use [SOURCE: case citation]. Example: [SOURCE: Arnold v Britton [2015] UKSC 36]
- When citing ILPA Principles or industry guidelines: use [SOURCE: guideline name]. Example: [SOURCE: ILPA Principles 3.0]
- When citing a template: use [SOURCE: template citation]. Example: [SOURCE: ILPA Model LPA v3.0]
- When making a factual claim NOT backed by a known source: prefix with [UNVERIFIED].
- Never fabricate citations. If you are unsure of the exact citation, say so explicitly.
- At the end of substantive responses, include a SOURCES USED section listing all [SOURCE: ...] references.`;

  // ── CONFIDENCE SELF-ASSESSMENT ──
  // Forces the AI to flag its own uncertainty level.
  prompt += `\n\nCONFIDENCE SELF-ASSESSMENT:
At the end of your response (before the disclaimer), include:
**Confidence:** [HIGH / MEDIUM / LOW] — one sentence explaining why.
- HIGH: well-settled law, clear authority, standard market practice
- MEDIUM: some ambiguity, jurisdiction-dependent, evolving area
- LOW: unsettled law, conflicting authority, novel issue — recommend independent verification`;

  prompt += `\n\nMANDATORY DISCLAIMER — include at end of every substantive response:\n"⚖️ This analysis is prepared by Gaio, TABULARUM's AI legal agent, for informational purposes only. It does not constitute legal advice and should not be relied upon as such. Please engage qualified legal counsel in the relevant jurisdiction before executing any document or taking any action."`;

  return prompt;
}

// ── AI CALL ───────────────────────────────────────────────────────────────────

const API_TIMEOUT_MS = 60_000;

async function callGaio(messages, task = {}, options = {}) {
  const { maxTokens = 3000 } = options;
  const apiKey = process.env.GAIO_API || process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error('callGaio: no API key configured. Set GAIO_API or ANTHROPIC_API_KEY environment variable.');

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  let res;
  try {
    res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' },
      signal: controller.signal,
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        thinking: { type: 'disabled' },
        max_tokens: maxTokens,
        system: buildGaioSystemPrompt(task),
        messages
      })
    });
  } finally {
    clearTimeout(timer);
  }

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`callGaio: AI API error ${res.status}: ${err.substring(0, 200)}`);
  }
  const data = await res.json();
  const text = data.content?.[0]?.text;
  if (!text) throw new Error('callGaio: empty response from AI API.');
  return text;
}

// ── SCOPE GUARD PRE-CHECK ─────────────────────────────────────────────────────
// Rejects requests outside Gaio's legal domain. Returns null if in-scope.

function scopeCheck(text) {
  const result = _institutionalCore.scopeGuard.check(text);
  if (!result.inScope) {
    return {
      ok: false,
      error: 'OUT_OF_SCOPE',
      message: result.message,
      suggestedAgent: result.suggestedAgent,
      topic: result.topic,
    };
  }
  return null; // in scope — proceed
}

// ── INSTITUTIONAL RESPONSE WRAPPER ────────────────────────────────────────────
// Wraps every capability response with confidence scoring, citations,
// persistent audit trail, and output versioning.

function institutionalWrap(rawResult, meta = {}) {
  const wrapped = _institutionalCore.wrapResponse(rawResult.response, {
    action:          meta.mode || 'response',
    module:          'gaio',
    inputSummary:    meta.inputSummary || '',
    model:           'claude-sonnet-5',
    durationMs:      meta.durationMs,
    userId:          meta.userId,
    sources:         meta.sources || [],
    allInputsProvided:  meta.allInputsProvided !== false,
    sourceCount:        meta.sourceCount || 0,
    withinCoreDomain:   true,
    templateGrounded:   meta.templateGrounded || false,
  });

  // Merge institutional metadata into the original result
  return {
    ...rawResult,
    confidence: wrapped.confidence,
    citations:  wrapped.citations,
    audit:      wrapped.audit,
    _meta:      wrapped._meta,
  };
}

// ── CAPABILITIES — all wrapped in try/catch ───────────────────────────────────

async function advise({ question, docType, jurisdictions = [], context = '', language, userId }) {
  const t0 = Date.now();
  try {
    question = sanitise(question, MAX_QUESTION_LEN);
    context  = sanitise(context, MAX_CONTEXT_LEN);
    if (!question) throw new Error('question is required');

    // Scope guard: reject non-legal questions
    const blocked = scopeCheck(question);
    if (blocked) return blocked;

    const autoDoc = docType || detectDocumentType(question)?.id;
    const task = { docType: autoDoc, jurisdictions, mode: 'advise', language };
    const jurNames = jurisdictions.map(j => getJurisdiction(j)?.name || j).join(', ') || 'not specified';

    const msg = [
      context ? `Context: ${context}\n` : '',
      `Legal Question: ${question}`,
      `Jurisdiction(s): ${jurNames}`,
      autoDoc ? `Document Context: ${getDocument(autoDoc)?.name || autoDoc}` : '',
      `\nProvide comprehensive advice: direct answer, full legal analysis, jurisdiction-specific points, practical recommendations, and all red flags.`
    ].filter(Boolean).join('\n');

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 2500 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'advise', docType: autoDoc, jurisdictions, language, inputSummary: question.substring(0, 120), durationMs, tokensRequested: 2500 });

    const result = { ok: true, mode: 'advise', question, jurisdictions, docType: autoDoc, response, generatedAt: new Date().toISOString() };
    return institutionalWrap(result, { mode: 'advise', inputSummary: question.substring(0, 120), durationMs, userId });
  } catch (err) {
    logDecision({ mode: 'advise', docType, jurisdictions, language, inputSummary: question?.substring(0, 120), durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO advise]', err.message);
    throw err;
  }
}

async function draft({ docType, jurisdiction, parties = {}, terms = {}, instructions = '', language, exportPath = null }) {
  const t0 = Date.now();
  try {
    instructions = sanitise(instructions, MAX_INSTRUCTION_LEN);
    const termsStr = sanitise(Object.entries(terms).map(([k,v]) => `${k}: ${v}`).join('\n'), MAX_TERMS_LEN);

    const doc = getDocument(docType);
    if (!doc) throw new Error(`Unknown document type: ${docType}`);
    const task = { docType, jurisdictions: [jurisdiction], mode: 'draft', language };
    const jurObj = getJurisdiction(jurisdiction);

    const partiesStr = Object.entries(parties).map(([r,n]) => `${sanitise(r,100)}: ${sanitise(String(n),200)}`).join('\n') || 'Use [PARTY A] and [PARTY B] placeholders';

    // Layer 1: Inject official template reference if available
    const templateContext = buildTemplateContext(docType, jurisdiction);
    const template = findBestTemplate(docType, jurisdiction);
    const templateRef = template ? `\nBase Template: ${template.citationLabel}` : '';

    const msg = [
      templateContext ? `${templateContext}\n\n` : '',
      `Draft a complete, execution-ready ${doc.name} (${doc.shortName}) governed by ${jurObj?.name || jurisdiction}.${templateRef}`,
      `\nPARTIES:\n${partiesStr}`,
      `\nKEY TERMS:\n${termsStr || 'Standard market terms'}`,
      instructions ? `\nSPECIAL INSTRUCTIONS: ${instructions}` : '',
      `\nRequirements:`,
      `- Complete professional draft — not an outline.`,
      template ? `- Follow the structure and clause architecture of the ${template.shortName}.` : '',
      template ? `- Note any departures from the base template with [NOTE: Departure from ${template.shortName} — reason: ...].` : '',
      `- All standard clauses for this document type and jurisdiction.`,
      `- [BRACKETED PLACEHOLDERS] for details to be confirmed.`,
      `- [NOTE: commentary] where parties may negotiate.`,
      `- Drafting Commentary at end: key decisions, negotiation areas, execution formalities for ${jurObj?.name || jurisdiction}.`,
    ].filter(Boolean).join('\n');

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 5000 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'draft', docType, jurisdictions: [jurisdiction], language, inputSummary: `${doc.shortName} for ${Object.values(parties)[0] || 'unnamed'}`, durationMs, templateUsed: template?.id || null, tokensRequested: 5000 });
    const result = {
      ok: true, mode: 'draft', docType, docName: doc.name, jurisdiction,
      baseTemplate: template ? { id: template.id, name: template.shortName, source: template.source, citation: template.citationLabel } : null,
      response, generatedAt: new Date().toISOString()
    };

    // Version the draft output for audit trail
    const artifactId = `${docType}-draft-${Object.values(parties)[0] || 'unnamed'}`.replace(/\s+/g, '-').toLowerCase();
    _institutionalCore.versioning.save(artifactId, response, { action: 'draft', model: 'claude-sonnet-5', confidence: null, docType });

    // DOCX export — if outputPath provided, also generate a Word document
    if (exportPath) {
      try {
        const partiesArray = Object.entries(parties).map(([role, name]) => ({ name: String(name), role }));
        result.docxPath = await generateDocx({
          title: doc.name,
          docType,
          jurisdiction,
          parties: partiesArray,
          date: new Date().toISOString().split('T')[0],
          content: response,
          outputPath: exportPath,
        });
      } catch (docxErr) {
        console.error('[GAIO draft] DOCX export failed:', docxErr.message);
        result.docxError = docxErr.message;
      }
    }

    return institutionalWrap(result, { mode: 'draft', inputSummary: `${doc.shortName}`, durationMs, templateGrounded: !!template, sourceCount: template ? 1 : 0, sources: template ? [{ type: 'TEMPLATE', title: template.shortName, reference: template.citationLabel }] : [] });
  } catch (err) {
    logDecision({ mode: 'draft', docType, jurisdictions: [jurisdiction], language, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO draft]', err.message);
    throw err;
  }
}

async function review({ docText, docType, jurisdiction, reviewerPerspective = 'balanced', language }) {
  const t0 = Date.now();
  try {
    docText = sanitise(docText, MAX_DOC_TEXT_LEN);
    if (!docText) throw new Error('docText is required');

    const autoDoc = docType || detectDocumentType(docText)?.id;
    const task = { docType: autoDoc, jurisdictions: [jurisdiction], mode: 'review', language };

    const perspMap = {
      balanced: 'balanced — identify issues for both parties',
      investor: 'LP/investor — identify GP-favourable provisions disadvantaging the investor',
      manager:  'GP/manager — identify LP-favourable provisions to push back on',
      buyer:    'buyer/acquirer — identify seller-favourable provisions',
      seller:   'seller/target — identify buyer-favourable provisions'
    };
    const perspLabel = perspMap[reviewerPerspective] || perspMap.balanced;

    const msg = `Review this ${getDocument(autoDoc)?.name || 'legal document'} from a ${perspLabel} perspective.
Governing Law: ${jurisdiction || 'as stated in document'}

DOCUMENT:\n---\n${docText}\n---

Provide: (1) Executive Summary + Risk Rating (2) Critical Issues ranked by severity (3) Significant Issues (4) Minor Issues (5) Missing Provisions (6) Market Standard Deviations — cite ILPA or market practice (7) Recommended Language for key issues (8) Overall Assessment.`;

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 4000 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'review', docType: autoDoc, jurisdictions: [jurisdiction], language, inputSummary: `${reviewerPerspective} review, ${docText.length} chars`, durationMs, tokensRequested: 4000 });
    const result = { ok: true, mode: 'review', docType: autoDoc, docName: getDocument(autoDoc)?.name, jurisdiction, reviewerPerspective, response, generatedAt: new Date().toISOString() };
    return institutionalWrap(result, { mode: 'review', inputSummary: `${reviewerPerspective} review`, durationMs });
  } catch (err) {
    logDecision({ mode: 'review', docType, jurisdictions: [jurisdiction], language, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO review]', err.message);
    throw err;
  }
}

async function negotiate({ clause, currentLanguage, position, docType, jurisdiction, context = '', language }) {
  const t0 = Date.now();
  try {
    clause          = sanitise(clause, 200);
    currentLanguage = sanitise(currentLanguage, MAX_CLAUSE_LEN);
    position        = sanitise(position, MAX_QUESTION_LEN);
    context         = sanitise(context, MAX_CONTEXT_LEN);
    if (!clause || !currentLanguage || !position) throw new Error('clause, currentLanguage and position are required');

    const task = { docType, jurisdictions: [jurisdiction], mode: 'negotiate', language };

    const msg = `Negotiation for a ${getDocument(docType)?.name || docType || 'legal agreement'} under ${jurisdiction || 'applicable'} law.

CLAUSE: ${clause}
CURRENT LANGUAGE: "${currentLanguage}"
MY POSITION: ${position}
${context ? `CONTEXT: ${context}` : ''}

Provide: (1) Current Position Analysis — precise meaning and risks (2) Market Standard Comparison (3) Negotiation Strategy (4) Proposed Counter-Language — complete redraft (5) Fallback Position (6) Walk-Away Points (7) Tactical Tips.`;

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 3000 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'negotiate', docType, jurisdictions: [jurisdiction], language, inputSummary: clause.substring(0, 120), durationMs, tokensRequested: 3000 });
    const result = { ok: true, mode: 'negotiate', clause, docType, jurisdiction, position, response, generatedAt: new Date().toISOString() };
    return institutionalWrap(result, { mode: 'negotiate', inputSummary: clause.substring(0, 120), durationMs });
  } catch (err) {
    logDecision({ mode: 'negotiate', docType, jurisdictions: [jurisdiction], language, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO negotiate]', err.message);
    throw err;
  }
}

async function validate({ docText, docType, jurisdiction, language }) {
  const t0 = Date.now();
  try {
    docText = sanitise(docText, MAX_DOC_TEXT_LEN);
    if (!docText) throw new Error('docText is required');

    const autoDoc = docType || detectDocumentType(docText)?.id;
    const task = { docType: autoDoc, jurisdictions: [jurisdiction], mode: 'validate', language };

    const msg = `Validate this ${getDocument(autoDoc)?.name || 'document'} for completeness, consistency and execution readiness under ${jurisdiction || 'applicable'} law.

DOCUMENT:\n---\n${docText}\n---

Check: (1) All required clauses present? (2) Governing law correct? (3) Parties fully identified? (4) Execution formalities for ${jurisdiction}? (5) Regulatory compliance? (6) Internal consistency? (7) Defined terms complete? (8) Cross-references? (9) Blank fields? (10) Verdict: Ready to Execute / Needs Minor Revision / Needs Major Revision.`;

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 2500 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'validate', docType: autoDoc, jurisdictions: [jurisdiction], language, inputSummary: `${docText.length} chars`, durationMs, tokensRequested: 2500 });
    const result = { ok: true, mode: 'validate', docType: autoDoc, jurisdiction, response, generatedAt: new Date().toISOString() };
    return institutionalWrap(result, { mode: 'validate', inputSummary: `${docText.length} chars`, durationMs });
  } catch (err) {
    logDecision({ mode: 'validate', docType, jurisdictions: [jurisdiction], language, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO validate]', err.message);
    throw err;
  }
}

async function compare({ originalText, revisedText, docType, jurisdiction, language }) {
  const t0 = Date.now();
  try {
    originalText = sanitise(originalText, MAX_DOC_TEXT_LEN / 2);
    revisedText  = sanitise(revisedText, MAX_DOC_TEXT_LEN / 2);
    if (!originalText || !revisedText) throw new Error('originalText and revisedText are required');

    const task = { docType, jurisdictions: [jurisdiction], mode: 'compare', language };

    const msg = `Redline analysis of two versions of a ${getDocument(docType)?.name || 'legal document'} under ${jurisdiction || 'applicable'} law.

ORIGINAL:\n---\n${originalText}\n---\nREVISED:\n---\n${revisedText}\n---

Provide: (1) Summary of all changes (2) Material changes ranked — which party benefits (3) Adverse changes — who is disadvantaged (4) Protective changes (5) Drafting changes (6) Missing changes (7) Overall assessment.`;

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 3500 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'compare', docType, jurisdictions: [jurisdiction], language, inputSummary: `${originalText.length}+${revisedText.length} chars`, durationMs, tokensRequested: 3500 });
    const result = { ok: true, mode: 'compare', docType, jurisdiction, response, generatedAt: new Date().toISOString() };
    return institutionalWrap(result, { mode: 'compare', inputSummary: `${originalText.length}+${revisedText.length} chars`, durationMs });
  } catch (err) {
    logDecision({ mode: 'compare', docType, jurisdictions: [jurisdiction], language, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO compare]', err.message);
    throw err;
  }
}

async function chat({ messages, docType, jurisdictions = [], context = '', language }) {
  const t0 = Date.now();
  try {
    if (!Array.isArray(messages) || messages.length === 0) throw new Error('messages array required');

    // Scope guard on the latest user message
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
    if (lastUserMsg) {
      const blocked = scopeCheck(String(lastUserMsg.content || ''));
      if (blocked) return blocked;
    }

    // Sanitise each message content
    const safeMessages = messages.slice(-20).map(m => ({  // limit history to last 20 turns
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: sanitise(String(m.content || ''), MAX_QUESTION_LEN)
    })).filter(m => m.content);

    const lastMsg = safeMessages[safeMessages.length - 1]?.content || '';
    const autoDoc = docType || detectDocumentType(lastMsg)?.id;
    const task = { docType: autoDoc, jurisdictions, mode: 'chat', language };

    const response = await callGaio(safeMessages, task, { maxTokens: 2000 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'chat', docType: autoDoc, jurisdictions, language, inputSummary: lastMsg.substring(0, 120), durationMs, tokensRequested: 2000 });
    const result = { ok: true, mode: 'chat', response, generatedAt: new Date().toISOString() };
    return institutionalWrap(result, { mode: 'chat', inputSummary: lastMsg.substring(0, 120), durationMs });
  } catch (err) {
    logDecision({ mode: 'chat', docType, jurisdictions, language, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO chat]', err.message);
    throw err;
  }
}

// ── CITED ADVISE (advise with real legal citations) ──────────────────────────

async function citedAdvise({ question, docType, jurisdictions = [], context = '', language }) {
  const t0 = Date.now();
  try {
    question = sanitise(question, MAX_QUESTION_LEN);
    context  = sanitise(context, MAX_CONTEXT_LEN);
    if (!question) throw new Error('question is required');

    // Search external legal databases for real citations
    const citationResult = await searchCitations(question, jurisdictions);
    const citationBlock  = buildCitationContext(citationResult.results || []);

    const autoDoc = docType || detectDocumentType(question)?.id;
    const task = { docType: autoDoc, jurisdictions, mode: 'advise', language };
    const jurNames = jurisdictions.map(j => getJurisdiction(j)?.name || j).join(', ') || 'not specified';

    const msg = [
      citationBlock ? `${citationBlock}\n\n` : '',
      context ? `Context: ${context}\n` : '',
      `Legal Question: ${question}`,
      `Jurisdiction(s): ${jurNames}`,
      autoDoc ? `Document Context: ${getDocument(autoDoc)?.name || autoDoc}` : '',
      `\nProvide comprehensive advice: direct answer, full legal analysis, jurisdiction-specific points, practical recommendations, and all red flags.`,
      citationBlock ? `\nWhere relevant, cite the real legal authorities provided above using their exact citation format and include URLs.` : ''
    ].filter(Boolean).join('\n');

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 3000 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'cited_advise', docType: autoDoc, jurisdictions, language, inputSummary: question.substring(0, 120), durationMs, citationsUsed: citationResult.resultCount || 0, tokensRequested: 3000 });

    // Convert external citations to institutional citation format
    const institutionalSources = (citationResult.results || []).map(c => ({
      type: c.type === 'case' ? 'CASE_LAW' : 'REGULATION',
      title: c.title || c.citation,
      reference: c.citation || c.title,
      url: c.url || null,
      date: c.date || null,
      jurisdiction: c.jurisdiction || null,
      excerpt: c.summary || null,
    }));

    const result = {
      ok: true, mode: 'cited_advise', question, jurisdictions, docType: autoDoc,
      citations: citationResult.results || [],
      citationCount: citationResult.resultCount || 0,
      response, generatedAt: new Date().toISOString()
    };
    return institutionalWrap(result, { mode: 'cited_advise', inputSummary: question.substring(0, 120), durationMs, sourceCount: citationResult.resultCount || 0, sources: institutionalSources });
  } catch (err) {
    logDecision({ mode: 'cited_advise', docType, jurisdictions, language, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO citedAdvise]', err.message);
    throw err;
  }
}

// ── DEAL BRIEF (party obligation summary) ────────────────────────────────────

async function dealBrief({ partyName, jurisdictions = [], language }) {
  const t0 = Date.now();
  try {
    partyName = sanitise(partyName, 200);
    if (!partyName) throw new Error('partyName is required');

    const dealContext = buildDealContext(partyName);
    const overdue     = getOverdueObligations();
    const upcoming    = getUpcomingDeadlines(30);
    const task = { jurisdictions, mode: 'advise', language };

    const msg = [
      dealContext || `No executed deals found for "${partyName}".`,
      `\nProvide a comprehensive deal brief for ${partyName}:`,
      `1. Summary of all active deals and their current status`,
      `2. Key obligations and upcoming deadlines`,
      overdue.length > 0 ? `3. URGENT: ${overdue.length} overdue obligations — analyse risk and recommend immediate actions` : '',
      upcoming.length > 0 ? `4. Upcoming deadlines in next 30 days — prioritise and advise` : '',
      `5. Side letter rights and MFN positions`,
      `6. Fee arrangements summary`,
      `7. Any red flags or compliance risks`,
    ].filter(Boolean).join('\n');

    const response = await callGaio([{ role: 'user', content: msg }], task, { maxTokens: 3000 });
    const durationMs = Date.now() - t0;
    logDecision({ mode: 'deal_brief', jurisdictions, language, inputSummary: partyName, durationMs, tokensRequested: 3000 });
    const result = {
      ok: true, mode: 'deal_brief', partyName, response,
      overdueCount: overdue.length,
      upcomingCount: upcoming.length,
      generatedAt: new Date().toISOString()
    };
    return institutionalWrap(result, { mode: 'deal_brief', inputSummary: partyName, durationMs });
  } catch (err) {
    logDecision({ mode: 'deal_brief', jurisdictions, language, inputSummary: partyName, durationMs: Date.now() - t0, outcome: 'error', error: err.message });
    console.error('[GAIO dealBrief]', err.message);
    throw err;
  }
}

// ── NANDA Principle 1: Verifiable Identity — Agent Card ──────────────────────

const AGENT_CARD = {
  name: 'Gaio',
  description: 'AI General Counsel — Institutional-grade legal advisory, document drafting, review, and negotiation for private capital markets.',
  version: '2.0.0',
  protocol: 'NANDA/1.0',
  owner: {
    name: 'Antoninus Global SPC',
    type: 'Segregated Portfolio Company',
    jurisdiction: 'Cayman Islands',
  },
  capabilities: [
    'legal-advice',
    'document-drafting',
    'document-review',
    'negotiation-strategy',
    'document-validation',
    'redline-comparison',
    'legal-chat',
    'cited-advice',
    'deal-brief',
  ],
  endpoints: {
    agentCard: '/gaio/agent-card',
    health: '/gaio/status',
  },
  interoperability: {
    agents: ['Lucio (Investment Principal)', 'Mila (Finance Principal)', 'Clara (Operations Lead)', 'Livia (Executive Assistant)'],
    protocols: ['REST/JSON', 'Express.js routes'],
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: new Date().toISOString(),
};

/**
 * Standalone DOCX export — convert any Gaio draft response into a Word document.
 * Use this when you already have a draft result and want to export it later.
 *
 * @param {Object} draftResult — the object returned by draft()
 * @param {string} outputPath — file path for the .docx
 * @param {Object} [opts] — extra options (parties array, schedules, etc.)
 * @returns {Promise<string>} — the file path written
 */
async function exportDraft(draftResult, outputPath, opts = {}) {
  if (!draftResult || !draftResult.response) {
    throw new Error('exportDraft requires a valid draft result with a response');
  }
  return generateDocx({
    title: draftResult.docName || draftResult.docType || 'Legal Document',
    docType: draftResult.docType || '',
    jurisdiction: draftResult.jurisdiction || '',
    parties: opts.parties || [],
    date: draftResult.generatedAt ? draftResult.generatedAt.split('T')[0] : new Date().toISOString().split('T')[0],
    content: draftResult.response,
    outputPath,
    ...opts,
  });
}

module.exports = { AGENT_CARD, advise, draft, review, negotiate, validate, compare, chat, citedAdvise, dealBrief, buildGaioSystemPrompt, getAuditLog, logDecision, exportDraft, generateDocx, DOCUMENT_STYLES, institutionalCore: _institutionalCore };
