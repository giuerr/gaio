/**
 * GAIO — Document Knowledge Base
 *
 * Structured knowledge of every document type Gaio can handle.
 * Each document type includes: purpose, key clauses, standard positions,
 * red flags to watch for, and negotiation guidance.
 */

'use strict';

const DOCUMENTS = {

  NDA: {
    id: 'nda',
    name: 'Non-Disclosure Agreement',
    shortName: 'NDA',
    aliases: ['confidentiality agreement', 'CDA', 'confidential disclosure agreement'],
    purpose: 'Protects confidential information shared between parties during due diligence, negotiations or business discussions.',
    types: ['Unilateral (one-way)', 'Mutual (bilateral)', 'Multilateral'],
    keyClauses: [
      { name: 'Definition of Confidential Information', description: 'Broadly defined but with standard carve-outs: publicly available, independently developed, received from third parties, required by law.' },
      { name: 'Permitted Purpose', description: 'Strictly limit use of information to the stated transaction or purpose only.' },
      { name: 'Permitted Disclosees', description: 'Affiliates, advisors, employees on need-to-know basis; all bound by equivalent obligations.' },
      { name: 'Term', description: 'Typically 2-5 years for general commercial; up to 10 years for trade secrets; indefinite for truly sensitive information.' },
      { name: 'Return/Destruction', description: 'Return or certified destruction on request or termination; right to retain for legal compliance purposes.' },
      { name: 'No Licence', description: 'Receiving confidential information confers no IP licence or rights.' },
      { name: 'Remedies', description: 'Specific performance and injunctive relief explicitly available — damages alone inadequate.' },
      { name: 'Residual Knowledge', description: 'Watch for: broad residuals clause allowing use of information "retained in unaided memory" — generally resist this.' },
    ],
    redFlags: [
      'Overly broad residuals clause',
      'No expiry on confidentiality obligations',
      'Weak definition of permitted purpose',
      'No injunctive relief provision',
      'Missing carve-outs for regulatory disclosure',
      'No limitation on sublicensing',
    ],
    negotiationTips: [
      'For investors: insist on mutual NDA before sharing deal information',
      'For fund managers: ensure NDA covers portfolio company information',
      'Always include a carve-out for legally required disclosure (with notice where possible)',
      'Specify governing law and dispute resolution forum',
    ]
  },

  NON_CIRCUMVENTION: {
    id: 'non_circumvention',
    name: 'Non-Circumvention Agreement',
    shortName: 'NCA',
    aliases: ['non-circumvention', 'NCNDA', 'non-disclosure non-circumvention'],
    purpose: 'Prevents a party from bypassing an intermediary to deal directly with introduced contacts, protecting the introducer\'s economic interest.',
    keyClauses: [
      { name: 'Protected Contacts', description: 'Clear definition of who constitutes a "protected contact" — introduced party, their affiliates, related entities.' },
      { name: 'Circumvention Events', description: 'Exhaustive list: direct contact, indirect approaches through affiliates, third-party introductions to avoid the obligation.' },
      { name: 'Commission/Fee Trigger', description: 'Precise definition of when the fee is earned — on signing, on closing, on first payment.' },
      { name: 'Term', description: 'Typically 2-5 years; must survive termination of any related agreement.' },
      { name: 'Scope of Transactions', description: 'Cover not just the initial deal but follow-on transactions, extensions, and related opportunities.' },
      { name: 'Remedy', description: 'Commission equivalent to what would have been earned; plus damages; injunctive relief.' },
    ],
    redFlags: [
      'Vague definition of "circumvention"',
      'No survival clause past termination',
      'Missing follow-on transaction coverage',
      'Overly short term',
      'No specific remedy for breach',
    ],
    negotiationTips: [
      'Combine with NDA for full protection',
      'Intermediaries should insist on a list of specific protected contacts',
      'Consider a tail period after termination for deals in pipeline',
    ]
  },

  ADVISORY_AGREEMENT: {
    id: 'advisory_agreement',
    name: 'Advisory Agreement',
    shortName: 'AA',
    aliases: ['consulting agreement', 'broker agreement', 'finder\'s fee agreement', 'placement agent agreement'],
    purpose: 'Governs the relationship with brokers, consultants, placement agents and advisors — defining scope of services, fees and compliance obligations.',
    keyClauses: [
      { name: 'Scope of Services', description: 'Precisely defined — introductions only, or broader advisory? Exclusivity vs. non-exclusivity?' },
      { name: 'Fee Structure', description: 'Success fee (% of capital raised); retainer; milestone payments. Must comply with applicable financial promotion and broker-dealer rules.' },
      { name: 'Regulatory Compliance', description: 'Critical: advisor must represent and warrant regulatory status. In UK: FCA authorisation. In US: FINRA broker-dealer registration or exemption.' },
      { name: 'Tail Period', description: 'Typically 12-24 months — fees owed if investor introduced during term closes after termination.' },
      { name: 'Exclusivity', description: 'Exclusive vs. non-exclusive in defined geographies or investor categories.' },
      { name: 'Expenses', description: 'Pre-approval required for expenses above threshold. Cap on reimbursable expenses.' },
      { name: 'Anti-Bribery', description: 'Express representations re FCPA / UK Bribery Act compliance; right to terminate for breach.' },
      { name: 'Indemnification', description: 'Mutual indemnification for own representations and actions.' },
    ],
    redFlags: [
      'Unregistered broker acting as placement agent in regulated jurisdiction',
      'No cap on expenses',
      'Overly broad tail period with no carve-outs',
      'No anti-bribery / FCPA representations',
      'Unclear trigger for fee payment',
      'No representation on regulatory status',
    ],
    negotiationTips: [
      'Always verify regulatory status before signing — critical risk in US (SEC/FINRA)',
      'Cap the tail period; exclude investors already in the fund\'s pipeline',
      'Define "capital introduced" precisely — committed, drawn, or paid-in?',
    ]
  },

  PROFIT_SPLIT: {
    id: 'profit_split',
    name: 'Profit Split Agreement',
    shortName: 'PSA',
    aliases: ['profit sharing agreement', 'revenue share', 'co-investment profit share'],
    purpose: 'Governs how profits from a deal, fund or business venture are split between parties, particularly in co-investment or joint venture contexts.',
    keyClauses: [
      { name: 'Waterfall / Distribution Mechanics', description: 'Return of capital first; then preferred return (hurdle); then carried interest / profit split. Precise percentages and order.' },
      { name: 'Profit Definition', description: 'Net profit after expenses, management fees, taxes? Gross or net proceeds? Must be exhaustively defined.' },
      { name: 'Calculation Date & Frequency', description: 'When is profit calculated — deal-by-deal or whole fund? Annual, quarterly, on exit?' },
      { name: 'Clawback', description: 'If early distributions exceed final entitlement — clawback obligation with interest.' },
      { name: 'Expenses Deduction', description: 'What expenses are deducted before profit is calculated? Cap or pre-approval required?' },
      { name: 'Tax Gross-Up', description: 'Is profit split gross or net of applicable taxes? Who bears withholding taxes?' },
      { name: 'Audit Rights', description: 'Right to audit books and records supporting profit calculations.' },
    ],
    redFlags: [
      'Vague definition of "profit"',
      'No clawback mechanism',
      'No audit rights',
      'Asymmetric information — one party controls calculation',
      'No dispute resolution for calculation disputes',
      'Missing expense deduction caps',
    ],
    negotiationTips: [
      'Always insist on precise waterfall mechanics with worked examples',
      'Insist on independent audit rights',
      'Consider escrow for disputed profit split amounts',
    ]
  },

  LPA: {
    id: 'lpa',
    name: 'Limited Partnership Agreement',
    shortName: 'LPA',
    aliases: ['fund agreement', 'partnership agreement', 'fund LPA'],
    purpose: 'The constitutional document of a limited partnership fund — governs the relationship between the General Partner (GP) and Limited Partners (LPs), including investment strategy, fees, governance and distributions.',
    keyClauses: [
      { name: 'Investment Strategy & Restrictions', description: 'Permitted investments, geographic focus, sector limits, concentration limits, co-investment rights.' },
      { name: 'Capital Commitments & Drawdowns', description: 'Capital call mechanics, drawdown notice period (typically 5-10 business days), default provisions.' },
      { name: 'Management Fee', description: 'Typically 1.5-2% p.a. on committed capital (investment period) / invested capital (post-investment period). Offset provisions.' },
      { name: 'Carried Interest', description: 'Typically 20% of profits above preferred return. Deal-by-deal or whole fund. Clawback provisions.' },
      { name: 'Preferred Return (Hurdle)', description: 'Typically 6-8% p.a. compounding. Hard or soft hurdle. Catch-up provision.' },
      { name: 'LP Advisory Committee (LPAC)', description: 'Composition, quorum, voting thresholds. Conflict approval powers. Valuation oversight.' },
      { name: 'Key Man Provision', description: 'Named key persons; suspension of investment period if key person leaves or is incapacitated.' },
      { name: 'No-Fault Removal of GP', description: 'Typically requires 75-80% LP vote; triggers winding down or appointment of replacement GP.' },
      { name: 'For-Cause Removal of GP', description: 'Lower threshold — typically 50-66% LP vote; triggers on GP fraud, breach, insolvency.' },
      { name: 'Transfer Restrictions', description: 'LP interests not freely transferable — GP consent required; right of first refusal; no transfer to competitors.' },
      { name: 'Side Letters', description: 'Reference to side letter rights — most favoured nation (MFN) provisions.' },
      { name: 'Reporting', description: 'Quarterly reports; annual audited accounts; ILPA guidelines compliance.' },
      { name: 'Excuse/Exclusion Rights', description: 'LP rights to be excused or excluded from specific investments for legal or regulatory reasons.' },
    ],
    redFlags: [
      'GP clawback with no security or escrow',
      'No key man provision',
      'Weak or absent for-cause removal rights',
      'Management fee on committed capital for full fund life (not switching to invested)',
      'No MFN provision in side letter framework',
      'Broad GP discretion on valuations without LPAC oversight',
      'No excuse/exclusion rights for LPs',
      'Overly broad GP indemnification',
    ],
    negotiationTips: [
      'ILPA Principles 3.0 — standard LP negotiation reference',
      'Push for whole-fund carry rather than deal-by-deal where possible',
      'Insist on hard clawback escrow (typically 30-33% of carry distributions)',
      'Negotiate fee offset provisions — portfolio company fees credited to management fee',
      'MFN provision should be automatic and self-executing',
    ]
  },

  PPM: {
    id: 'ppm',
    name: 'Private Placement Memorandum',
    shortName: 'PPM',
    aliases: ['offering memorandum', 'OM', 'information memorandum'],
    purpose: 'The primary disclosure document for a private fund offering — provides investors with all material information about the fund, its strategy, risks, terms and management team.',
    keyClauses: [
      { name: 'Executive Summary', description: 'Fund overview, strategy, target return, fund size, key terms.' },
      { name: 'Investment Strategy', description: 'Detailed strategy, target sectors, geographies, investment criteria, portfolio construction.' },
      { name: 'Risk Factors', description: 'Comprehensive risk disclosure — market, liquidity, leverage, regulatory, key person, conflicts of interest. Must be thorough and specific.' },
      { name: 'Management Team', description: 'Track record, biographies, prior funds, attribution of returns.' },
      { name: 'Fund Terms Summary', description: 'Mirror of LPA key terms — fees, carry, hurdle, term, governance.' },
      { name: 'Conflicts of Interest', description: 'Full disclosure of all actual and potential conflicts — co-investments, cross-fund investments, GP affiliate transactions.' },
      { name: 'Subscription Process', description: 'How to invest, minimum commitment, closing schedule, investor eligibility.' },
      { name: 'Tax Considerations', description: 'Jurisdiction-specific tax treatment — generally high-level with reference to individual advice.' },
      { name: 'Regulatory Disclosures', description: 'Applicable regulatory framework; investor eligibility criteria (QIB, professional investor, HNWI).' },
      { name: 'Legal Disclaimers', description: 'Forward-looking statements; no guarantee of returns; past performance disclaimer.' },
    ],
    redFlags: [
      'Track record not properly attributed to specific GP principals',
      'Inadequate risk factor disclosure',
      'Undisclosed conflicts of interest',
      'Inconsistency between PPM and LPA terms',
      'Missing investor eligibility criteria',
      'No legends on forward-looking statements',
    ],
    negotiationTips: [
      'PPM is a disclosure document — accuracy is paramount; liability for material misstatements',
      'Legal review essential before distribution to any investor',
      'US investors: ensure Securities Act exemption compliance (Reg D / Reg S)',
      'EU investors: AIFMD marketing notification required in most jurisdictions',
    ]
  },

  SIDE_LETTER: {
    id: 'side_letter',
    name: 'Side Letter',
    shortName: 'Side Letter',
    aliases: ['side agreement', 'investor side letter', 'LP side letter'],
    purpose: 'Agreement between the GP and a specific LP granting investor-specific rights or modifications to standard LPA terms — typically for anchor investors or investors with regulatory/policy constraints.',
    commonProvisions: [
      { name: 'Most Favoured Nation (MFN)', description: 'LP entitled to benefit of any more favourable terms granted to any other LP of same or smaller commitment size.' },
      { name: 'Cap on Expenses', description: 'Fund-level expense cap or LP-level expense ratio cap. Standard ask: 0.1-0.25% of NAV p.a.' },
      { name: 'Fee Discounts', description: 'Reduced management fee or carried interest for anchor/strategic investors.' },
      { name: 'Co-Investment Rights', description: 'Right of first offer on co-investment opportunities above threshold. Pro-rata allocation formula.' },
      { name: 'Excuse/Exclusion Rights', description: 'Right to be excluded from specific investments — ERISA, ESG, geographic/sector restrictions.' },
      { name: 'Reporting Enhancements', description: 'Additional reporting — ESG data, ILPA fee template, custom portfolio reporting.' },
      { name: 'Transfer Rights', description: 'LP-specific transfer provisions — pre-approved transferee list, reduced consent requirements.' },
      { name: 'ERISA/UBTI Provisions', description: 'US pension fund requirements — plan asset representation, operating company status.' },
      { name: 'Regulatory Provisions', description: 'SWF/government investor provisions; FOIA exemption requests; public records carve-outs.' },
      { name: 'Advisory Board Seat', description: 'Right to appoint a representative to the LPAC.' },
      { name: 'Transparency on Other Side Letters', description: 'Right to see redacted summary of rights granted to other LPs (without identifying investors).' },
    ],
    redFlags: [
      'MFN with carve-outs so broad as to be meaningless',
      'Co-investment right with no deal flow guarantee',
      'Expense cap without clear definition of covered expenses',
      'Side letter conflicts with LPA — side letter should expressly state it prevails',
      'No sunset provision on regulatory carve-outs',
    ],
    negotiationTips: [
      'Anchor investors (typically 10%+ of fund) have strong negotiating leverage',
      'MFN elections should have a defined election window (30-60 days after closing)',
      'Expense cap: push for definition to include broken deal costs',
      'Co-investment: distinguish between right of first offer and mere notification',
    ]
  },

  SPA: {
    id: 'spa',
    name: 'Share Purchase Agreement',
    shortName: 'SPA',
    aliases: ['stock purchase agreement', 'equity purchase agreement', 'share sale agreement'],
    purpose: 'Governs the acquisition of shares in a company — sets out purchase price, conditions to completion, representations and warranties, and post-completion obligations.',
    keyClauses: [
      { name: 'Purchase Price', description: 'Fixed price, locked box or completion accounts mechanism. Earn-out provisions if applicable.' },
      { name: 'Conditions Precedent', description: 'Regulatory approvals, third-party consents, no material adverse change.' },
      { name: 'Representations & Warranties', description: 'Seller\'s representations on business, financial, legal, IP, employment, environmental, tax status.' },
      { name: 'Warranty & Indemnity (W&I) Insurance', description: 'Increasingly standard — shifts warranty risk to insurer; affects seller knowledge qualifiers.' },
      { name: 'Disclosure Letter', description: 'Seller\'s specific disclosures against warranties — limits warranty claims.' },
      { name: 'Indemnities', description: 'Specific indemnities for known risks: tax, litigation, environmental liabilities.' },
      { name: 'MAC Clause', description: 'Material Adverse Change — definition and carve-outs. Triggered events. Heavily negotiated.' },
      { name: 'Completion Mechanics', description: 'Locked box date or completion accounts. Leakage provisions. Locked box covenants.' },
      { name: 'Locked Box', description: 'Economic risk transfers at locked box date; seller covenants against leakage; permitted leakage defined.' },
      { name: 'Non-Compete / Non-Solicit', description: 'Seller restrictions post-completion — geographic and time limits; senior employee restrictions.' },
      { name: 'Limitation of Liability', description: 'Cap (typically 100% of purchase price for fundamental warranties; 20-30% for general); time limits; basket/de minimis.' },
    ],
    redFlags: [
      'Uncapped seller liability (rare but seen in smaller deals)',
      'Overly broad MAC definition without appropriate carve-outs',
      'Missing disclosure letter',
      'No W&I insurance consideration on larger deals',
      'Ambiguous earn-out mechanics',
      'Missing anti-embarrassment / catch-up provisions on earn-out',
      'No specific indemnity for known tax/litigation risks',
    ],
    negotiationTips: [
      'Buyer: push for completion accounts (more protection); Seller: push for locked box (certainty)',
      'W&I insurance: consider on deals above €10M — changes negotiation dynamics significantly',
      'Limitation of liability: separate caps for fundamental vs. general vs. tax warranties',
      'Non-compete: must be reasonable in scope to be enforceable; consider jurisdiction-specific requirements',
    ]
  },

  SUBSCRIPTION_AGREEMENT: {
    id: 'subscription_agreement',
    name: 'Subscription Agreement',
    shortName: 'Sub Docs',
    aliases: ['subscription documents', 'sub docs', 'investor application'],
    purpose: 'The contract by which an investor subscribes for LP interests in a fund — includes the investor\'s commitment amount, representations as to eligibility, source of funds, and AML/KYC certifications.',
    keyClauses: [
      { name: 'Capital Commitment', description: 'Amount committed; currency; drawdown mechanics; default provisions.' },
      { name: 'Investor Eligibility Representations', description: 'Qualified Purchaser / Qualified Investor / Professional Investor status. Jurisdiction-specific.' },
      { name: 'Source of Funds / AML', description: 'AML/KYC certifications; source of wealth and source of funds declarations; PEP screening.' },
      { name: 'FATCA / CRS', description: 'Tax status certifications for FATCA (US) and CRS (global) compliance.' },
      { name: 'Regulatory Status', description: 'ERISA, plan asset, UBTI status (for US investors); AIFMD investor classification (for EU).' },
      { name: 'Investor Questionnaire', description: 'Investment experience, risk tolerance, lock-up acceptance, liquidity requirements.' },
      { name: 'Acceptance of LPA', description: 'Investor agrees to be bound by the LPA as an LP; GP retains right to reject.' },
      { name: 'Transfer Restrictions Acknowledgement', description: 'LP interest is illiquid; restrictions on transfer acknowledged.' },
      { name: 'Side Letter Reference', description: 'Confirmation of side letter rights agreed with this LP.' },
    ],
    redFlags: [
      'Missing FATCA/CRS certifications — regulatory risk',
      'Inadequate AML/KYC representations',
      'Missing investor eligibility representations — securities law risk',
      'No acceptance of lock-up and illiquidity',
      'Inconsistency between subscription agreement and LPA terms',
    ],
    negotiationTips: [
      'Subscription documents are largely standardised — limited negotiation scope',
      'LPs may negotiate specific eligibility carve-outs if they have unusual structures',
      'Family offices: ensure appropriate entity-level representations',
      'Ensure FATCA/CRS certifications are completed accurately — tax compliance risk',
    ]
  },

  IMA: {
    id: 'ima',
    name: 'Investment Management Agreement',
    shortName: 'IMA',
    aliases: ['management agreement', 'fund management agreement', 'AIFM agreement', 'portfolio management agreement'],
    purpose: 'Governs the appointment of an investment manager or AIFM to manage a fund\'s assets — defines investment mandate, authority, fees, reporting, and termination rights. Core document where the fund entity and manager are separate.',
    keyClauses: [
      { name: 'Appointment and Authority', description: 'Scope of manager\'s authority — discretionary or advisory mandate; investment powers granted by the fund entity.' },
      { name: 'Investment Mandate/Guidelines', description: 'Permitted asset classes, geographic limits, concentration limits, leverage limits, liquidity requirements, benchmark reference.' },
      { name: 'Delegation Powers', description: 'Right to delegate investment management to sub-advisors; conditions and oversight obligations; liability for delegates.' },
      { name: 'Management Fee', description: 'Fee rate, calculation basis (NAV, committed capital, invested capital), payment frequency, accrual mechanics.' },
      { name: 'Performance Fee/Carry Allocation', description: 'Performance fee structure, hurdle rate, high-water mark, crystallisation frequency, clawback provisions.' },
      { name: 'Reporting and Information', description: 'Frequency and content of portfolio reports, NAV calculations, risk reports, regulatory filings, investor communications.' },
      { name: 'Compliance and Regulatory', description: 'Manager\'s regulatory status representations, AIFMD compliance, MiFID obligations, ongoing regulatory reporting.' },
      { name: 'Liability and Indemnification', description: 'Standard of care (negligence, gross negligence, wilful misconduct); limitation of liability; mutual indemnification.' },
      { name: 'Term and Termination', description: 'Initial term, renewal mechanics, notice periods, for-cause and no-fault termination, consequences of termination.' },
      { name: 'Key Person', description: 'Named individuals whose departure triggers review, suspension, or termination rights for the fund.' },
      { name: 'Non-Compete', description: 'Restrictions on manager managing competing funds or strategies during the term; carve-outs for existing mandates.' },
      { name: 'Best Execution', description: 'Obligation to achieve best execution on trades; broker selection policy; soft commission disclosure.' },
    ],
    redFlags: [
      'Unlimited delegation with no oversight or liability retention',
      'No performance benchmarks or investment guidelines',
      'Asymmetric termination — manager can terminate easily but fund cannot',
      'No key person provision',
      'No liability cap or standard of care defined',
      'Overly broad indemnification in favour of manager',
      'No reporting obligations or vague reporting requirements',
    ],
    negotiationTips: [
      'Ensure AIFMD compliance if marketing to EU investors — manager must be authorised or delegated by an authorised AIFM',
      'Fee transparency: require full disclosure of all fees, commissions, and soft dollar arrangements',
      'Delegation chain oversight: fund board must approve sub-delegation and retain right to object',
      'Termination notice periods should be reasonable (90-180 days) with adequate transition provisions',
      'Regulatory status representations should be repeated and ongoing, not just at signing',
      'Include portfolio guideline breach notification and cure mechanics',
    ]
  },

  GP_OPERATING_AGREEMENT: {
    id: 'gp_operating_agreement',
    name: 'General Partner Operating Agreement',
    shortName: 'GP OpAg',
    aliases: ['GP LLC agreement', 'GP partnership agreement', 'general partner agreement', 'manager operating agreement'],
    purpose: 'The constitutional document of the General Partner entity — governs internal economics among GP principals, carry allocation and vesting, decision-making, capital contributions, and removal/succession of GP members.',
    keyClauses: [
      { name: 'Member Contributions and Capital', description: 'Capital contributions required from each member; GP commitment to the fund; funding mechanics.' },
      { name: 'Carry Allocation Among Members', description: 'How the GP\'s carried interest entitlement is split among members — percentage allocations, tiered structures.' },
      { name: 'Vesting Schedule', description: 'Carry vesting over time — cliff period, linear or back-loaded vesting, acceleration events.' },
      { name: 'Good Leaver/Bad Leaver', description: 'Definitions and consequences: good leaver retains vested carry; bad leaver forfeits all or most. Grey leaver category.' },
      { name: 'Decision-Making and Voting', description: 'Voting thresholds for ordinary decisions, investment decisions, and reserved matters; unanimity requirements.' },
      { name: 'Management Committee', description: 'Composition, appointment, powers; investment committee vs. management committee distinction.' },
      { name: 'Removal of Members', description: 'For-cause and no-fault removal mechanics; voting thresholds; consequences for carry and capital.' },
      { name: 'Non-Compete/Non-Solicit', description: 'Restrictions during membership and post-departure; scope, duration, geographic limits; enforceability.' },
      { name: 'Distributions', description: 'Waterfall for distributing carry and other GP income; priority of return of capital contributions.' },
      { name: 'Clawback Allocation', description: 'How GP clawback obligations under the LPA are allocated among members — pro rata to carry received.' },
      { name: 'Deadlock Resolution', description: 'Mechanism for resolving deadlocks among members — mediation, arbitration, buy-sell, shotgun clause.' },
      { name: 'Tag-Along/Drag-Along', description: 'Rights and obligations on transfer of GP membership interests; majority can compel sale; minority can join.' },
    ],
    redFlags: [
      'No vesting schedule — carry fully vested from day one',
      'Asymmetric economics — founding member retains disproportionate carry regardless of contribution',
      'No deadlock mechanism — risk of paralysis on key decisions',
      'No bad leaver provisions — departing members retain full economics',
      'Unlimited non-compete duration or geographic scope — may be unenforceable',
      'No succession plan or key person departure provisions',
      'Clawback allocation not aligned with carry allocation',
    ],
    negotiationTips: [
      'Align carry vesting with fund term — typically 4-5 year vesting with 1-year cliff',
      'Define good/bad/grey leaver categories precisely with specific trigger events',
      'Ensure clawback allocation among members mirrors carry allocation — avoid orphan clawback risk',
      'Deadlock mechanism is essential — consider escalation from mediation to binding arbitration to buy-sell',
      'Non-compete must be reasonable in scope and duration to be enforceable across jurisdictions',
      'Address what happens to a departing member\'s fund commitment (buyout, transfer, or maintain)',
    ]
  },

  ARTICLES_OF_ASSOCIATION: {
    id: 'articles_of_association',
    name: 'Articles of Association / Certificate of Incorporation',
    shortName: 'Articles/COI',
    aliases: ['memorandum of association', 'M&A', 'charter', 'certificate of incorporation', 'COI', 'constitutional documents', 'bye-laws'],
    purpose: 'The constitutional document of a corporate entity — defines share capital, shareholder rights, director powers, voting mechanics, dividend policy, and corporate governance. Jurisdiction determines whether this is "Articles" (UK/common law) or "Certificate of Incorporation" (Delaware) or equivalent.',
    types: ['Articles of Association (UK, Cayman, BVI, HK, Singapore)', 'Certificate of Incorporation (Delaware)', 'Statuts (Luxembourg, France)', 'Satzung (Germany)', 'Bye-Laws (Bermuda)'],
    keyClauses: [
      { name: 'Share Capital and Classes', description: 'Authorised share capital; classes of shares (ordinary, preferred, management); rights attaching to each class.' },
      { name: 'Shareholder Rights', description: 'Voting rights, dividend rights, return of capital on winding up; variation of class rights procedures.' },
      { name: 'Director Appointment and Removal', description: 'How directors are appointed, removed, and replaced; board composition requirements; investor director rights.' },
      { name: 'Board Powers and Delegation', description: 'Powers of the board vs. shareholders; delegation to committees; reserved matters requiring shareholder approval.' },
      { name: 'Voting Mechanics', description: 'Ordinary resolution, special resolution, written resolution thresholds; quorum requirements; proxy voting.' },
      { name: 'Dividends and Distributions', description: 'Declaration and payment mechanics; interim vs. final dividends; distribution policy for different share classes.' },
      { name: 'Transfer Restrictions', description: 'Right of first refusal, pre-emption on transfer, board consent requirements, permitted transferees.' },
      { name: 'Pre-Emption Rights', description: 'Statutory and contractual pre-emption on new issuances; disapplying pre-emption; anti-dilution.' },
      { name: 'General Meetings', description: 'Notice requirements, quorum, adjournment, written resolutions in lieu of meetings.' },
      { name: 'Winding Up', description: 'Distribution of assets on winding up; priority of share classes; liquidation preferences.' },
      { name: 'Amendment Provisions', description: 'Threshold for amending articles; entrenched provisions; class consent requirements.' },
    ],
    redFlags: [
      'No minority shareholder protections — majority can act unchecked',
      'Unlimited director powers with no reserved matters for shareholders',
      'No pre-emption rights on new share issuances — dilution risk',
      'Restrictive transfer provisions that effectively lock in shareholders',
      'No deadlock mechanism for 50/50 or evenly split boards',
      'Entrenchment provisions that make amendment practically impossible',
      'Inconsistency between articles and shareholders\' agreement',
    ],
    negotiationTips: [
      'Ensure consistency between articles/COI and any shareholders\' agreement (SHA) — SHA typically prevails but articles bind the company',
      'Preferred share mechanics need detailed drafting — liquidation preference, participation, anti-dilution, conversion',
      'Consider jurisdiction-specific mandatory provisions that cannot be contracted out of',
      'Director removal thresholds should align with the governance structure agreed in the SHA',
      'Pre-emption rights: consider pay-to-play provisions for investors who don\'t participate in follow-on rounds',
    ]
  },

  KYC_AML: {
    id: 'kyc_aml',
    name: 'KYC/AML Attestation and Compliance Forms',
    shortName: 'KYC/AML',
    aliases: ['know your customer', 'anti-money laundering form', 'CDD form', 'EDD form', 'source of funds declaration', 'source of funds', 'PEP declaration', 'beneficial ownership declaration', 'KYC form', 'AML form', 'AML attestation', 'KYC questionnaire', 'customer due diligence'],
    purpose: 'Compliance documentation required from investors for AML/KYC due diligence — captures identity verification, beneficial ownership, source of funds, source of wealth, PEP status, and sanctions screening. Required by all fund jurisdictions under FATF standards.',
    keyClauses: [
      { name: 'Identity Verification', description: 'Certified copies of ID documents (passport, national ID); entity documents (certificate of incorporation, register of directors/shareholders).' },
      { name: 'Beneficial Ownership Declaration', description: 'Full chain of ownership to ultimate beneficial owners (UBOs) — typically 25% threshold; all natural persons with control.' },
      { name: 'Source of Funds', description: 'Origin of the specific funds being invested — bank statements, transaction records, loan documentation if leveraged.' },
      { name: 'Source of Wealth', description: 'How the investor accumulated their overall wealth — employment, business ownership, inheritance, investments.' },
      { name: 'PEP Status Declaration', description: 'Whether investor or any UBO is a Politically Exposed Person, family member of PEP, or close associate of PEP.' },
      { name: 'Sanctions Screening', description: 'Confirmation that investor and all UBOs are not on any sanctions list — OFAC, EU, UN, UK sanctions.' },
      { name: 'Tax Residency', description: 'Tax identification numbers and residency declarations for FATCA/CRS reporting purposes.' },
      { name: 'Ongoing Monitoring Consent', description: 'Investor consent to ongoing AML monitoring, periodic refresh of KYC information, and adverse media screening.' },
    ],
    redFlags: [
      'Incomplete UBO chain — cannot identify ultimate beneficial owners to natural person level',
      'Vague or unsubstantiated source of funds — no documentary evidence',
      'No PEP declaration or incomplete PEP screening',
      'Missing sanctions screening or screening against incomplete lists',
      'No ongoing monitoring framework — KYC is a point-in-time exercise only',
      'Nominee structures obscuring true beneficial ownership',
      'High-risk jurisdiction with no enhanced due diligence applied',
    ],
    negotiationTips: [
      'KYC/AML is non-negotiable — regulatory requirement; no investor should resist reasonable due diligence',
      'Enhanced due diligence (EDD) required for PEPs, high-risk jurisdictions, and complex structures',
      'Beneficial ownership must be traced to natural persons — corporate chains are not sufficient',
      'Source of funds must be specific to the investment, not just general wealth statements',
      'Periodic refresh of KYC: industry standard is every 1-3 years depending on risk rating',
      'Consider third-party verification services (World-Check, Dow Jones, ComplyAdvantage) for sanctions and PEP screening',
    ]
  },

  CARRY_PLAN: {
    id: 'carry_plan',
    name: 'Carried Interest and Management Equity Plan',
    shortName: 'Carry Plan',
    aliases: ['carry allocation plan', 'management equity plan', 'incentive allocation', 'promote agreement', 'performance allocation', 'carried interest plan', 'carried interest'],
    purpose: 'Governs the allocation, vesting, and distribution of carried interest or performance allocation among the GP principals and investment team — the key incentive mechanism in fund management.',
    keyClauses: [
      { name: 'Carry Pool Definition', description: 'Total carry pool available (typically the GP\'s 20% carry entitlement under the LPA); ring-fenced or shared across funds.' },
      { name: 'Allocation Among Participants', description: 'Percentage allocation to each participant; tiered allocations based on seniority; reserve pool for future hires.' },
      { name: 'Vesting Schedule', description: 'Time-based vesting (typically 4-5 years with 1-year cliff); performance-based vesting triggers; acceleration events.' },
      { name: 'Good Leaver/Bad Leaver/Early Leaver', description: 'Precise definitions of each category; consequences for vested and unvested carry; grey leaver provisions.' },
      { name: 'Clawback Allocation', description: 'How the fund-level GP clawback obligation is allocated among carry participants — typically pro rata to carry received.' },
      { name: 'Crystallisation Events', description: 'When carry is calculated and becomes distributable — on realisation of investments, at fund wind-up, or periodic.' },
      { name: 'Distribution Mechanics', description: 'Timing and form of carry distributions; holdback/escrow for clawback; tax withholding.' },
      { name: 'Forfeiture Provisions', description: 'Circumstances triggering forfeiture of unvested and/or vested carry — competitive activity, cause events, material breach.' },
      { name: 'Tax Treatment', description: 'Capital gains treatment requirements; holding period considerations; jurisdiction-specific tax structuring.' },
      { name: 'Escrow', description: 'Percentage of carry distributions held in escrow pending final fund accounting — typically 20-30% of distributions.' },
      { name: 'Joiner/New Hire Provisions', description: 'How new team members are admitted to the carry plan; allocation from reserve pool; board/committee approval.' },
      { name: 'Retirement/Disability', description: 'Treatment of carry on retirement, long-term disability, or death — typically treated as good leaver.' },
    ],
    redFlags: [
      'No vesting — carry fully allocated and non-forfeitable from day one',
      'Asymmetric forfeiture — junior team members forfeit on departure but seniors do not',
      'No clawback allocation — GP clawback falls disproportionately on remaining members',
      'Vague crystallisation triggers — unclear when carry is actually earned',
      'No tax gross-up clarity — carry recipients bear unexpected tax costs',
      'Missing joiner provisions — no mechanism to bring new hires into the carry plan',
      'No escrow or holdback — all carry distributed immediately with no clawback reserve',
    ],
    negotiationTips: [
      'Align vesting schedule with fund lifecycle — carry should vest over the investment period',
      'Define good/bad/early leaver categories precisely with exhaustive lists of trigger events',
      'Ensure clawback allocation among participants matches their carry allocation — avoid orphan risk',
      'Crystallisation: deal-by-deal vs. whole-fund has different risk profiles for participants',
      'Reserve pool of 10-15% for future hires is standard practice',
      'Consider tax advice early — carry tax treatment varies significantly across jurisdictions (UK, US, Luxembourg)',
    ]
  },

  CO_INVESTMENT: {
    id: 'co_investment',
    name: 'Co-Investment Agreement',
    shortName: 'Co-Invest',
    aliases: ['co-investment agreement', 'co-invest side car', 'co-investment vehicle agreement', 'co-invest SPV', 'parallel investment agreement'],
    purpose: 'Governs the terms on which investors participate in specific investments alongside the main fund — defines allocation mechanics, fees (typically no management fee / no carry), governance, and exit mechanics.',
    keyClauses: [
      { name: 'Investment Allocation', description: 'How the co-investment opportunity is allocated among eligible investors — pro-rata, discretionary, or hybrid approach.' },
      { name: 'No Fee/No Carry Terms', description: 'Standard ILPA position: co-investments should be on a no management fee / no carried interest basis.' },
      { name: 'Capital Commitment and Drawdown', description: 'Commitment amount, drawdown mechanics, notice period, default consequences for co-investors.' },
      { name: 'Information Rights', description: 'Co-investor access to portfolio company information, board materials, financial statements, valuation reports.' },
      { name: 'Follow-On Investment Rights', description: 'Whether co-investors are obligated or have the right to participate in follow-on investments in the same company.' },
      { name: 'Exit/Disposal Mechanics', description: 'How exit decisions are made — GP controls timing and process; co-investors participate on same terms as fund.' },
      { name: 'Tag-Along/Drag-Along', description: 'Co-investors\' right to sell alongside the fund (tag) or obligation to sell if fund sells (drag).' },
      { name: 'Transfer Restrictions', description: 'Restrictions on transferring co-investment interests; GP consent; right of first refusal.' },
      { name: 'Conflicts of Interest', description: 'Disclosure and management of conflicts between fund and co-investment vehicle — allocation, exit timing, pricing.' },
      { name: 'Expenses', description: 'Allocation of deal expenses, ongoing costs, and broken deal costs between fund and co-investment vehicle.' },
      { name: 'Reporting', description: 'Frequency and content of co-investment reporting — typically quarterly with annual audited accounts.' },
      { name: 'Term and Wind-Up', description: 'Co-investment vehicle term aligned with underlying investment; wind-up mechanics on exit.' },
    ],
    redFlags: [
      'Carry or management fee charged on co-investment — departure from ILPA standards',
      'No pro-rata allocation mechanism — GP has unfettered discretion creating cherry-picking risk',
      'No information rights for co-investors — information asymmetry with GP',
      'No tag-along right on exit — co-investors left behind on partial exit',
      'Conflicts of interest not addressed — fund and co-invest vehicle interests may diverge',
      'Cherry-picking risk — GP may allocate winners to co-invest and losers to main fund',
      'No follow-on investment mechanism — co-investors diluted on subsequent rounds',
    ],
    negotiationTips: [
      'Insist on no fee/no carry — this is the ILPA standard and market norm for co-investments',
      'Pro-rata allocation based on commitment size ensures fairness among co-investors',
      'Ensure follow-on investment obligations and rights are clearly defined to avoid dilution',
      'GP should control exit process but co-investors should have tag-along rights',
      'Conflicts policy should be transparent — allocation and exit decisions documented and justified',
      'Broken deal costs: clarify whether co-investors share in aborted transaction costs',
    ]
  },

  DISCLOSURE_LETTER: {
    id: 'disclosure_letter',
    name: 'Disclosure Letter',
    shortName: 'Disclosure Letter',
    aliases: ['disclosure schedule', 'disclosure bundle', 'vendor disclosure letter', 'seller disclosure'],
    purpose: 'A letter from the seller to the buyer in an M&A transaction that qualifies and limits the seller\'s representations and warranties in the SPA — constitutes the seller\'s specific disclosures against the general and specific warranties.',
    keyClauses: [
      { name: 'General Disclosures', description: 'Broad disclosures deemed made against all warranties — typically public registry filings, statutory books, matters of public record.' },
      { name: 'Specific Disclosures', description: 'Disclosures made against individual numbered warranties in the SPA — each disclosure references the specific warranty it qualifies.' },
      { name: 'Disclosure Bundle/Data Room Reference', description: 'Index of documents in the disclosure bundle or virtual data room that form part of the disclosed information.' },
      { name: 'Fair Disclosure Standard', description: 'Standard for what constitutes adequate disclosure — must be "fair" and give "sufficient detail to identify the nature and scope" of the matter disclosed.' },
      { name: 'Deemed Disclosures', description: 'Matters deemed disclosed without specific mention — typically public registry searches, statutory filings, matters in the accounts.' },
      { name: 'Accuracy and Completeness', description: 'Seller\'s confirmation that disclosures are accurate and complete; consequences of inaccurate or incomplete disclosure.' },
      { name: 'Warranties as to Disclosures', description: 'Separate warranty that the disclosure letter itself is true, accurate, and not misleading.' },
      { name: 'Update Mechanism', description: 'Whether seller can update disclosures between signing and completion; buyer\'s remedies if new disclosures are material.' },
    ],
    redFlags: [
      'Over-broad general disclosure — effectively qualifies all warranties to the point of being meaningless',
      'Insufficient specificity — disclosures are vague or do not clearly identify the matter disclosed',
      'Missing data room index — no clear record of what was in the virtual data room at signing',
      'No fair disclosure standard — ambiguity about whether a disclosure is adequate',
      'No update mechanism between signing and completion — buyer has no remedy for newly discovered issues',
      'Deemed disclosures too wide — effectively allows seller to avoid substantive disclosure',
      'Disclosure bundle not properly indexed or paginated — creates disputes about what was disclosed',
    ],
    negotiationTips: [
      'Buyer should push for specific disclosures against individual warranties — resist broad general disclosures',
      'Seller wants broad general disclosure to minimise warranty exposure — this is the key battleground',
      'Fair disclosure standard protects both parties — ensures disclosures are meaningful without being oppressive',
      'Data room index should be agreed and locked at signing — use a reputable VDR with audit trail',
      'Update mechanism: buyer should resist or ensure material updates trigger walk-away rights',
      'Cross-reference each specific disclosure to the SPA warranty number — precision is essential',
    ]
  },

  ESG_SFDR: {
    id: 'esg_sfdr',
    name: 'ESG and SFDR Disclosure Document',
    shortName: 'ESG/SFDR',
    aliases: ['SFDR disclosure', 'ESG policy', 'sustainability disclosure', 'Article 8 disclosure', 'Article 9 disclosure', 'PAI statement', 'taxonomy disclosure', 'responsible investment policy'],
    purpose: 'Mandatory disclosure document for EU-marketed funds under the Sustainable Finance Disclosure Regulation (SFDR) — classifies the fund as Article 6, 8, or 9, discloses sustainability risks, principal adverse impacts (PAI), and taxonomy alignment.',
    types: ['Article 6 — no sustainability claims', 'Article 8 — promotes E/S characteristics', 'Article 9 — sustainable investment objective'],
    keyClauses: [
      { name: 'SFDR Classification', description: 'Fund classification as Article 6, 8, or 9 — determines the level of sustainability disclosure required.' },
      { name: 'Sustainability Risk Integration', description: 'How sustainability risks are integrated into the investment decision-making process; impact on returns.' },
      { name: 'Principal Adverse Impact Statement', description: 'Disclosure of principal adverse impacts of investment decisions on sustainability factors — mandatory PAI indicators.' },
      { name: 'Environmental/Social Characteristics (Art. 8)', description: 'For Article 8 funds: description of the environmental or social characteristics promoted; binding elements; measurement methodology.' },
      { name: 'Sustainable Investment Objective (Art. 9)', description: 'For Article 9 funds: description of the sustainable investment objective; how it is attained; benchmark alignment.' },
      { name: 'Taxonomy Alignment', description: 'Percentage of investments aligned with the EU Taxonomy; minimum taxonomy alignment commitment; methodology.' },
      { name: 'Do No Significant Harm', description: 'Assessment that sustainable investments do not significantly harm any environmental or social objective — DNSH criteria.' },
      { name: 'Good Governance Assessment', description: 'How investee companies are assessed for good governance practices — management structures, employee relations, tax compliance.' },
      { name: 'Benchmark Designation', description: 'Whether a sustainability benchmark is designated; comparison with broad market index; methodology differences.' },
      { name: 'Pre-Contractual Disclosure', description: 'Annex II (Art. 8) or Annex III (Art. 9) template disclosures required before investor subscription.' },
      { name: 'Periodic Reporting', description: 'Annual reporting on achievement of sustainability characteristics/objectives — Annex IV (Art. 8) or Annex V (Art. 9).' },
      { name: 'Website Disclosure', description: 'Mandatory website publication of sustainability-related information under SFDR Articles 10, 11, and 12.' },
    ],
    redFlags: [
      'Misclassification — fund classified as Article 8/9 without genuine sustainability integration (greenwashing risk)',
      'Vague PAI methodology — principal adverse impacts disclosed but measurement approach unclear',
      'No taxonomy alignment data — fund claims sustainability but cannot demonstrate EU Taxonomy alignment',
      'Inconsistent with PPM — SFDR disclosure contradicts or diverges from fund offering documents',
      'Missing periodic reporting framework — no plan for annual sustainability reporting',
      'No DNSH assessment — sustainable investments claimed without Do No Significant Harm analysis',
      'Website disclosure not maintained or updated — regulatory breach risk',
    ],
    negotiationTips: [
      'Conservative classification is preferred — downgrading from Article 8 to Article 6 is better than greenwashing enforcement action',
      'Ensure consistency between SFDR disclosure, PPM, LPA, and marketing materials — regulators look for contradictions',
      'PAI reporting is data-intensive — ensure portfolio companies can provide required ESG data',
      'Article 8 "light" (promoting characteristics with no sustainable investment commitment) vs. Article 8+ (with minimum sustainable investment) — choose deliberately',
      'Taxonomy alignment percentages should be conservative and verifiable — EU Taxonomy is a high bar',
      'Engage specialist ESG counsel — SFDR is evolving rapidly with ongoing Level 2 regulatory technical standards',
    ]
  },

  SHAREHOLDER_AGREEMENT: {
    id: 'shareholder_agreement',
    name: 'Shareholder Agreement',
    shortName: 'SHA',
    aliases: ['shareholders agreement', 'SHA', 'investor agreement', 'joint venture agreement', 'JVA', 'stockholders agreement'],
    purpose: 'Governs the relationship between shareholders of a portfolio company or SPV — defines governance, board composition, protective provisions, transfer restrictions, exit mechanics, and minority protections. Distinct from the Articles/COI which is a public document; the SHA is a private contract.',
    keyClauses: [
      { name: 'Board Composition and Appointment Rights', description: 'Right of each shareholder class to appoint directors; board size; observer rights; independent director requirements.' },
      { name: 'Reserved Matters/Protective Provisions', description: 'List of decisions requiring shareholder approval beyond simple board majority — issuance of new shares, incurrence of debt, M&A, material contracts, budget approval, change of business.' },
      { name: 'Information Rights', description: 'Right to receive financial statements, management accounts, board packs, budget and business plan — frequency and detail proportional to stake size.' },
      { name: 'Anti-Dilution', description: 'Protection against dilutive issuances — weighted average or full ratchet; broad-based or narrow-based; pay-to-play carve-outs.' },
      { name: 'Pre-Emption Rights on New Issues', description: 'Right to participate pro-rata in new share issuances to maintain percentage ownership; waiver mechanics; time limits for exercise.' },
      { name: 'Transfer Restrictions', description: 'Restrictions on transfer of shares — board consent, permitted transferees, lock-up periods, right of first refusal.' },
      { name: 'Tag-Along Rights', description: 'Minority right to sell alongside a majority shareholder on the same terms — ensures minority is not left behind in a change of control.' },
      { name: 'Drag-Along Rights', description: 'Majority right to compel minority shareholders to sell on the same terms — enables clean exit; threshold typically 75%+ of shares.' },
      { name: 'Put and Call Options', description: 'Right to require the company or other shareholders to buy (put) or sell (call) shares at a defined price or formula — often triggered by specific events.' },
      { name: 'Deadlock Resolution', description: 'Mechanism for resolving disputes where shareholders cannot agree — escalation to senior management, mediation, arbitration, buy-sell (shotgun/Russian roulette).' },
      { name: 'Non-Compete/Non-Solicit', description: 'Restrictions on shareholders competing with the company or soliciting its employees/customers — scope, duration, geographic limits.' },
      { name: 'Dividend Policy', description: 'Agreed dividend policy — minimum distribution, reinvestment thresholds, priority of distributions among share classes.' },
      { name: 'Good Leaver/Bad Leaver', description: 'For employee shareholders: definitions and consequences for departure — good leaver receives fair value; bad leaver receives nominal or discounted value.' },
      { name: 'Exit/IPO Provisions', description: 'Agreed exit timeline or mechanism — IPO readiness obligations, exit committee, drag-along on IPO, lock-up post-IPO.' },
    ],
    redFlags: [
      'No minority protective provisions — majority can act unchecked on reserved matters',
      'Unrestricted drag-along with no price floor or fairness protection',
      'No tag-along rights for minority shareholders',
      'No deadlock mechanism — risk of paralysis in 50/50 or multi-party structures',
      'Vague reserved matters list that fails to capture key decisions',
      'No anti-dilution protection for minority investors',
      'Unlimited or unreasonable non-compete scope and duration',
    ],
    negotiationTips: [
      'Ensure SHA is aligned with and prevails over the Articles/COI — inconsistencies create legal risk',
      'Minority protective provisions are critical — reserved matters list should cover all value-destructive decisions',
      'Deadlock escalation mechanism should end in a definitive resolution — arbitration or buy-sell, not perpetual mediation',
      'Information rights should be proportional to stake — larger investors get more frequent and detailed reporting',
      'Define "fair value" precisely for put/call options — independent valuation, formula-based, or EBITDA multiple',
      'Drag-along threshold should be high enough to represent genuine majority (typically 75%+ of total shares)',
    ]
  },

  TRANSFER_AGREEMENT: {
    id: 'transfer_agreement',
    name: 'Transfer Agreement',
    shortName: 'Transfer Agmt',
    aliases: ['LP interest transfer', 'secondary transfer', 'assignment agreement', 'LP transfer', 'interest purchase agreement', 'secondary sale agreement', 'secondaries agreement'],
    purpose: 'Governs the sale and transfer of an LP interest in a fund on the secondary market — covers purchase price mechanics (NAV-based or negotiated discount/premium), GP consent process, representations on the interest, unfunded commitments, and regulatory/tax considerations.',
    keyClauses: [
      { name: 'Purchase Price and Valuation', description: 'Price expressed as percentage of NAV (discount or premium); reference NAV date; adjustment mechanics for interim distributions and capital calls.' },
      { name: 'NAV Adjustment Mechanics', description: 'True-up mechanism between reference NAV date and closing — adjustments for distributions received, capital calls made, and NAV movements.' },
      { name: 'GP Consent Process', description: 'Requirement for GP consent to transfer; timeline for GP response; deemed consent provisions; GP right to impose conditions.' },
      { name: 'Representations and Warranties (Seller)', description: 'Seller represents: valid title, no encumbrances, no pending litigation, no side letter rights not disclosed, accurate commitment/drawdown history.' },
      { name: 'Representations and Warranties (Buyer)', description: 'Buyer represents: investor eligibility, regulatory status, source of funds, ability to meet unfunded commitments, no transfer restrictions violated.' },
      { name: 'Unfunded Commitment Assumption', description: 'Buyer assumes seller\'s remaining unfunded commitment; amount specified; buyer confirms ability to fund future capital calls.' },
      { name: 'Distribution Cut-Off', description: 'Date from which buyer is entitled to distributions — typically closing date; treatment of distributions between signing and closing.' },
      { name: 'Conditions Precedent', description: 'GP consent, ROFR compliance, regulatory approvals, satisfactory KYC/AML on buyer, no material adverse change.' },
      { name: 'Tax Indemnities', description: 'Allocation of tax liabilities arising from the transfer; withholding tax obligations; FIRPTA considerations for US partnerships.' },
      { name: 'ROFR/Co-Sale Compliance', description: 'Compliance with right of first refusal and co-sale provisions in the LPA; notification to other LPs if required.' },
      { name: 'Transfer Restrictions Compliance', description: 'Confirmation that transfer complies with all LPA transfer restrictions; no transfer to competitors or restricted persons.' },
      { name: 'Clawback Liability Allocation', description: 'Allocation of GP clawback liability between seller and buyer — seller liable for clawback on distributions received pre-transfer; buyer for post-transfer.' },
    ],
    redFlags: [
      'No NAV true-up mechanism — buyer bears risk of NAV decline between reference date and closing',
      'Unclear unfunded commitment allocation — ambiguity about who funds future capital calls',
      'No clawback liability allocation — silent on who bears clawback exposure post-transfer',
      'Missing GP consent as condition precedent — transfer may be void without GP consent',
      'No distribution cut-off date — disputes over entitlement to interim distributions',
      'Vague tax indemnity — insufficient protection against withholding taxes or transfer taxes',
      'No ERISA/regulatory status representations from buyer — regulatory risk for the fund',
    ],
    negotiationTips: [
      'NAV reference date is critical — use most recent audited NAV with true-up to closing; negotiate who bears interim NAV risk',
      'Unfunded commitment assumption must be explicit — buyer must confirm capacity to meet all future capital calls',
      'Clawback tail liability — who bears clawback exposure for distributions received by seller pre-transfer; consider escrow or indemnity',
      'GP consent is a condition precedent, not a warranty — transfer should not close without GP consent',
      'ROFR compliance timeline — ensure sufficient time for ROFR process before longstop date',
      'Consider stapled secondary (with co-invest) — buyer assumes both LP interest and co-investment positions',
    ]
  },

  LOI: {
    id: 'loi',
    name: 'Letter of Intent',
    shortName: 'LOI',
    aliases: ['letter of intent', 'heads of terms', 'HOT', 'term sheet', 'memorandum of understanding', 'MOU', 'indicative offer', 'non-binding offer'],
    purpose: 'A preliminary agreement outlining the principal terms of a proposed transaction — typically non-binding (except for exclusivity, confidentiality, and governing law) and used to align parties before incurring the cost of full documentation.',
    types: ['Non-Binding LOI (standard)', 'Binding LOI (rare, higher commitment)', 'Heads of Terms (UK terminology)', 'Memorandum of Understanding (MOU)'],
    keyClauses: [
      { name: 'Transaction Structure', description: 'Proposed structure — share purchase, asset purchase, merger, investment; entity and jurisdiction; high-level mechanics.' },
      { name: 'Purchase Price/Valuation', description: 'Indicative price or valuation range; basis of valuation (EBITDA multiple, NAV, DCF); price adjustment mechanisms.' },
      { name: 'Key Conditions', description: 'High-level conditions that must be satisfied before definitive agreement — due diligence, regulatory approvals, financing, board approval.' },
      { name: 'Due Diligence Period', description: 'Scope and duration of due diligence; access to information, management, and facilities; confirmatory vs. full DD.' },
      { name: 'Exclusivity/No-Shop', description: 'Period during which the target agrees not to solicit or entertain competing offers — typically 30-90 days; consequences of breach.' },
      { name: 'Confidentiality', description: 'Binding obligation to keep the transaction and all information confidential; survives termination of the LOI.' },
      { name: 'Break Fee/Reverse Break Fee', description: 'Fee payable if a party walks away — break fee (target pays buyer) or reverse break fee (buyer pays target); typically 1-3% of deal value.' },
      { name: 'Binding vs Non-Binding Provisions', description: 'Clear delineation of which provisions are legally binding (typically exclusivity, confidentiality, governing law, costs) and which are non-binding (commercial terms).' },
      { name: 'Governing Law', description: 'Applicable governing law and jurisdiction for disputes — binding provision even in otherwise non-binding LOI.' },
      { name: 'Timeline/Longstop Date', description: 'Target timeline for completing due diligence, negotiating definitive documents, and closing; longstop date after which LOI lapses.' },
      { name: 'Expenses', description: 'Each party bears own costs; or agreed cost-sharing for specific items (e.g., regulatory filings, adviser fees).' },
      { name: 'Key Assumptions', description: 'Assumptions underlying the proposed terms — no material adverse change, accuracy of provided information, management continuity.' },
    ],
    redFlags: [
      'Accidentally binding provisions — commercial terms that are inadvertently drafted as binding commitments',
      'No exclusivity period — target free to shop the deal during due diligence',
      'Overly long exclusivity period that locks target without commitment from buyer',
      'No break fee — buyer incurs significant DD costs with no protection against target walking away',
      'Missing confidentiality provision — transaction details not protected',
      'Vague conditions that give either party unlimited ability to walk away',
      'No longstop date — LOI remains open indefinitely with no timeline discipline',
    ],
    negotiationTips: [
      'Clearly delineate binding vs non-binding clauses — use explicit "Binding Provisions" and "Non-Binding Provisions" sections',
      'Exclusivity period should be reasonable (30-90 days) — long enough for meaningful DD, short enough to maintain deal momentum',
      'Break fees typically range from 1-3% of deal value — higher for deals with significant DD costs',
      'LOI should reference key conditions that will appear in definitive docs — avoids surprises in later negotiation',
      'Include a clear longstop date to create urgency and avoid indefinite negotiation',
    ]
  },

  INVESTMENT_AGREEMENT: {
    id: 'investment_agreement',
    name: 'Investment Agreement',
    shortName: 'Investment Agmt',
    aliases: ['investment agreement', 'equity investment agreement', 'capital investment agreement', 'growth equity agreement', 'Series A agreement', 'funding agreement', 'direct investment agreement', 'convertible note', 'SAFE', 'simple agreement for future equity', 'mezzanine agreement'],
    purpose: 'Governs a direct equity or quasi-equity investment into a portfolio company — defines investment amount, instrument type (ordinary shares, preference shares, convertible notes, SAFEs), investor protections, conditions precedent, and post-completion obligations. Broader than an SPA as it often includes ongoing governance and milestone provisions.',
    types: ['Equity Investment (ordinary/preference shares)', 'Convertible Note', 'SAFE (Simple Agreement for Future Equity)', 'Mezzanine/Subordinated Debt'],
    keyClauses: [
      { name: 'Investment Amount and Instrument', description: 'Total investment amount; type of instrument (ordinary shares, preference shares, convertible note, SAFE); pricing per share or conversion mechanics.' },
      { name: 'Valuation and Pricing', description: 'Pre-money and post-money valuation; price per share; fully diluted share capital calculation; option pool inclusion.' },
      { name: 'Conditions Precedent', description: 'Conditions to closing — legal DD completion, regulatory approvals, shareholder approvals, IP assignment, key employee contracts, board composition changes.' },
      { name: 'Representations and Warranties (Company)', description: 'Company represents: corporate status, capitalisation, financial statements accuracy, IP ownership, material contracts, litigation, tax compliance, employment matters.' },
      { name: 'Representations and Warranties (Investor)', description: 'Investor represents: authority, source of funds, investment intent (not with a view to distribution), accredited/qualified investor status.' },
      { name: 'Use of Proceeds', description: 'Specified use of investment proceeds — product development, hiring, market expansion; restrictions on use for debt repayment, dividends, or founder payments.' },
      { name: 'Anti-Dilution Protections', description: 'Protection against down-round dilution — broad-based weighted average (standard) or full ratchet (aggressive); pay-to-play provisions.' },
      { name: 'Liquidation Preference', description: 'Priority on liquidation or exit — 1x non-participating (standard), participating, multiple (2x, 3x); cap on participation.' },
      { name: 'Conversion Mechanics', description: 'For convertible instruments: conversion trigger events, conversion price/discount, valuation cap, automatic vs. optional conversion, qualified financing threshold.' },
      { name: 'Board/Observer Rights', description: 'Investor right to appoint board director or board observer; board composition requirements; information access through board participation.' },
      { name: 'Information Rights', description: 'Right to receive monthly/quarterly management accounts, annual audited financials, budget and business plan, cap table updates.' },
      { name: 'Milestone-Based Tranching', description: 'Investment released in tranches upon achievement of defined milestones — revenue targets, product launches, regulatory approvals, hiring goals.' },
      { name: 'Warranties/Indemnities', description: 'Company and founder indemnities for breach of warranties; limitation of liability; escrow for indemnity claims; time limits for claims.' },
      { name: 'Pre-Emption on Future Rounds', description: 'Right to participate pro-rata in future funding rounds to maintain ownership percentage; super pro-rata rights for lead investors.' },
    ],
    redFlags: [
      'No liquidation preference — investor ranks pari passu with common shareholders on exit',
      'Vague use of proceeds — no restrictions on how investment funds are deployed',
      'No anti-dilution protection — investor fully exposed to down-round dilution',
      'Missing milestone conditions for tranched investment — funds released without accountability',
      'No information rights — investor has no visibility into company performance post-investment',
      'Uncapped founder/company liability on warranties — disproportionate risk allocation',
      'No pre-emption rights on future rounds — investor diluted without recourse',
    ],
    negotiationTips: [
      'Liquidation preference: 1x non-participating is market standard for Series A/B; resist multiple or participating unless justified by risk',
      'Anti-dilution: broad-based weighted average is the market standard; full ratchet is aggressive and may deter future investors',
      'Milestone tranching needs objective, measurable criteria — avoid subjective milestones that create disputes',
      'Information rights should include monthly board pack and management accounts — quarterly is insufficient for active investors',
      'Conversion mechanics for convertibles must clearly address down-round scenarios — valuation cap is essential',
      'Pre-emption rights: super pro-rata rights are increasingly common for lead investors in competitive rounds',
    ]
  },

  SERVICE_PROVIDER: {
    id: 'service_provider',
    name: 'Service Provider Contract',
    shortName: 'Service Contract',
    aliases: ['service provider agreement', 'administration agreement', 'fund administration agreement', 'fund administration', 'custodian agreement', 'audit engagement letter', 'legal engagement letter', 'depositary agreement', 'prime brokerage agreement', 'prime brokerage', 'transfer agent agreement'],
    purpose: 'Governs the appointment of service providers to a fund — administrators, custodians, depositaries, auditors, legal counsel, prime brokers, transfer agents. Defines scope of services, SLA, fees, liability, indemnification, termination, and regulatory obligations.',
    types: ['Fund Administration Agreement', 'Custodian/Depositary Agreement', 'Audit Engagement Letter', 'Legal Engagement Letter', 'Prime Brokerage Agreement', 'Transfer Agent Agreement'],
    keyClauses: [
      { name: 'Scope of Services', description: 'Detailed description of services to be provided — NAV calculation, investor reporting, regulatory filings, safekeeping, audit, legal advice; exclusions clearly stated.' },
      { name: 'Service Level Agreement (SLA)', description: 'Measurable performance standards — turnaround times for NAV, reporting deadlines, error rates, response times; consequences of SLA breach.' },
      { name: 'Fees and Expenses', description: 'Fee structure — fixed, percentage of NAV, per-transaction; expense reimbursement; fee escalation mechanics; benchmarking rights.' },
      { name: 'Liability and Standard of Care', description: 'Standard of care (negligence, gross negligence, wilful misconduct); liability cap; exclusion of indirect/consequential damages; force majeure.' },
      { name: 'Indemnification', description: 'Mutual indemnification provisions — service provider indemnified for acting on proper instructions; fund indemnified for service provider negligence/breach.' },
      { name: 'Delegation and Sub-Contracting', description: 'Right to delegate or sub-contract services; prior consent requirements; oversight obligations; liability for delegates\' acts and omissions.' },
      { name: 'Confidentiality', description: 'Obligation to keep fund, investor, and portfolio information confidential; permitted disclosures; survival post-termination.' },
      { name: 'Data Protection/GDPR', description: 'Data processing obligations; controller/processor designation; data processing agreement; cross-border transfer safeguards; breach notification.' },
      { name: 'Term and Termination', description: 'Initial term, renewal mechanics, termination notice periods (typically 90-180 days), for-cause termination triggers, consequences of termination.' },
      { name: 'Transition Assistance', description: 'Obligation to provide transition assistance on termination — data migration, cooperation with successor provider, timeline, fees for transition services.' },
      { name: 'Regulatory Status', description: 'Service provider representations on regulatory authorisation, licensing, ongoing compliance obligations; notification of regulatory changes.' },
      { name: 'Insurance', description: 'Minimum professional indemnity and fidelity insurance requirements; evidence of coverage; notification of material changes to coverage.' },
      { name: 'Force Majeure', description: 'Events excusing non-performance — natural disasters, government actions, system failures; business continuity and disaster recovery obligations.' },
    ],
    redFlags: [
      'Unlimited liability exclusion — service provider excludes all liability including for own negligence',
      'No SLA with measurable performance standards — no accountability for service quality',
      'No transition assistance on termination — fund locked in with no practical ability to switch providers',
      'Broad delegation without oversight or consent requirements — unknown sub-contractors handling fund data',
      'Inadequate insurance — professional indemnity coverage below market standard for fund size',
      'No data protection provisions — GDPR non-compliance risk for EU-related funds',
      'Asymmetric termination rights — service provider can terminate on short notice but fund cannot',
    ],
    negotiationTips: [
      'SLA should include measurable KPIs with financial consequences for persistent underperformance (fee rebates or termination right)',
      'Liability cap market standard is 2-3x annual fees for negligence; unlimited for fraud, wilful misconduct, and data breach',
      'Transition period should be 90-180 days with full cooperation obligation — data migration is critical',
      'AIFMD depositary cannot contractually limit liability for loss of financial instruments held in custody — this is a regulatory requirement',
      'Sub-contracting requires prior written consent — service provider remains fully liable for sub-contractor acts and omissions',
      'Insurance minimums should be specified in the agreement — typically GBP/EUR/USD 5-10M professional indemnity depending on fund size',
    ]
  },

  DISTRIBUTION_AGREEMENT: {
    id: 'distribution_agreement',
    name: 'Marketing and Distribution Agreement',
    shortName: 'Distribution Agmt',
    aliases: ['marketing agreement', 'distribution agreement', 'placement agreement', 'selling agreement', 'distribution arrangement', 'marketing services agreement', 'fund distribution agreement'],
    purpose: 'Governs the marketing and distribution of fund interests by a placement agent, distributor, or marketing partner — defines territories, investor types, fees/commissions, regulatory compliance (AIFMD marketing passport, NPPR, MiFID), anti-solicitation rules, and performance obligations.',
    keyClauses: [
      { name: 'Territory and Investor Scope', description: 'Defined geographic territories and investor categories (institutional, HNWI, retail); jurisdiction-specific regulatory requirements for each territory.' },
      { name: 'Exclusive vs Non-Exclusive', description: 'Whether the distributor has exclusive rights in the territory — exclusive mandates require performance obligations; non-exclusive allows multiple distributors.' },
      { name: 'Fees and Commission Structure', description: 'Upfront placement fee, trailing commission (share of management fee), performance-linked incentives; payment timing and mechanics.' },
      { name: 'Tail Period', description: 'Period after termination during which distributor is entitled to commission on investors in pipeline — typically 12-24 months; defined pipeline criteria.' },
      { name: 'Regulatory Compliance and Licencing', description: 'Distributor representations on regulatory authorisation in each territory; AIFMD marketing passport or NPPR compliance; MiFID status; ongoing regulatory obligations.' },
      { name: 'Marketing Materials Approval', description: 'Process for approving all marketing materials before use — fund manager retains final approval; compliance review; jurisdiction-specific requirements.' },
      { name: 'Anti-Bribery/FCPA', description: 'Representations and covenants on compliance with FCPA, UK Bribery Act, and local anti-corruption laws; right to audit; termination for breach.' },
      { name: 'Investor Suitability Obligations', description: 'Distributor obligations to assess investor suitability — MiFID suitability/appropriateness, qualified purchaser status, KYC/AML responsibilities.' },
      { name: 'Reporting and Transparency', description: 'Regular reporting on marketing activities, investor pipeline, meetings conducted, feedback received; transparency on sub-distribution arrangements.' },
      { name: 'Term and Termination', description: 'Initial term, renewal mechanics, notice periods, for-cause termination triggers (regulatory breach, anti-bribery violation, performance failure).' },
      { name: 'Sub-Distribution Rights', description: 'Whether distributor can appoint sub-distributors; prior consent requirements; sub-distributor must meet same regulatory and compliance standards.' },
      { name: 'Liability and Indemnification', description: 'Distributor indemnifies fund for regulatory breaches and mis-selling; fund indemnifies distributor for material accuracy of offering documents provided.' },
    ],
    redFlags: [
      'Unregistered distributor in regulated jurisdiction — regulatory enforcement risk for fund manager',
      'No regulatory status representations — distributor\'s licensing and authorisation status unknown',
      'Overly broad tail period with no defined pipeline criteria — perpetual commission obligation',
      'No marketing materials approval process — unapproved or misleading materials distributed',
      'No anti-bribery provisions — FCPA/Bribery Act exposure for fund manager',
      'Exclusive territory without performance obligations — territory locked up with no accountability',
      'Sub-distribution without consent — unknown parties marketing the fund',
    ],
    negotiationTips: [
      'Verify distributor regulatory status in every target jurisdiction — unregistered distribution is a criminal offence in many jurisdictions',
      'AIFMD passport vs NPPR requires different compliance frameworks — ensure the correct regime is identified per jurisdiction',
      'Tail period should be 12-24 months with carve-outs for investors already in the fund\'s pipeline before distributor engagement',
      'Commission structure should align with MiFID inducements rules — unbundling requirements may restrict trailing commissions',
      'SEC Rule 15a-1 broker-dealer registration is critical in the US — placement agents must be FINRA-registered or exempt',
      'Sub-distribution must mirror head terms — same regulatory compliance, anti-bribery, and suitability obligations',
    ]
  },

  FORM_ADV_PF: {
    id: 'form_adv_pf',
    name: 'Form ADV and Form PF',
    shortName: 'Form ADV/PF',
    aliases: ['Form ADV', 'Form PF', 'ADV Part 1', 'ADV Part 2', 'ADV Part 2A', 'brochure', 'SEC registration', 'investment adviser registration', 'RIA registration'],
    purpose: 'US SEC regulatory filings required for registered investment advisers. Form ADV is the registration and disclosure document (Part 1: regulatory info; Part 2A: brochure for clients; Part 2B: brochure supplement). Form PF is confidential reporting for private fund advisers with >$150M in private fund AUM.',
    types: ['Form ADV Part 1 (registration)', 'Form ADV Part 2A (brochure/narrative)', 'Form ADV Part 2B (brochure supplement)', 'Form PF (private fund reporting)'],
    keyClauses: [
      { name: 'Advisory Business Description', description: 'Description of advisory services offered, types of clients, and investment strategies employed.' },
      { name: 'Fees and Compensation', description: 'Disclosure of fee schedules, performance-based fees, other compensation, and potential conflicts arising from fee structures.' },
      { name: 'Performance-Based Fees', description: 'Details on any performance-based compensation arrangements and their compliance with SEC Rule 205-3.' },
      { name: 'Types of Clients', description: 'Description of client base — individuals, funds, institutions — and any minimum account or investment requirements.' },
      { name: 'Methods of Analysis and Investment Strategies', description: 'Explanation of analytical methods, strategies, and material risks associated with the investment approach.' },
      { name: 'Disciplinary Information', description: 'Disclosure of legal or disciplinary events involving the adviser or its management persons.' },
      { name: 'Other Financial Industry Activities', description: 'Relationships with broker-dealers, futures commission merchants, and other financial entities that may create conflicts.' },
      { name: 'Code of Ethics', description: 'Summary of the adviser\'s code of ethics, personal trading policies, and how clients can obtain a copy.' },
      { name: 'Brokerage Practices', description: 'Policies on broker selection, soft dollar arrangements, directed brokerage, and trade aggregation.' },
      { name: 'Custody', description: 'Whether the adviser has custody of client assets and the safeguards in place, including surprise examination requirements.' },
      { name: 'Investment Discretion', description: 'Scope of discretionary authority and any limitations imposed by clients or regulatory requirements.' },
      { name: 'Voting Client Securities', description: 'Proxy voting policies and procedures, or disclosure that the adviser does not vote proxies.' },
      { name: 'Form PF Systemic Risk Reporting', description: 'Confidential reporting on fund size, leverage, counterparty exposure, and liquidity for systemic risk monitoring by the SEC and FSOC.' },
    ],
    redFlags: [
      'Incomplete disciplinary disclosure — all material legal and regulatory events must be reported',
      'Inconsistent fee disclosure between Form ADV and LPA/PPM — creates regulatory and investor trust issues',
      'Missing custody reporting or surprise examination — potential safekeeping violations',
      'Outdated AUM figures — must be updated at least annually in the annual updating amendment',
      'Vague conflicts of interest disclosure — SEC expects specific, not boilerplate, conflicts language',
      'No code of ethics reference or personal trading policy — required under Rule 204A-1',
    ],
    negotiationTips: [
      'Annual updating amendment must be filed within 90 days of fiscal year end',
      'Material changes trigger interim amendments — do not wait for the annual update',
      'Form PF filing thresholds: $150M private fund AUM for large private fund advisers; quarterly filing for >$1.5B',
      'Coordinate ADV Part 2A disclosures with PPM to ensure consistency across investor-facing documents',
    ]
  },

  COMPLIANCE_MANUAL: {
    id: 'compliance_manual',
    name: 'Compliance Manual',
    shortName: 'Compliance Manual',
    aliases: ['compliance policies', 'compliance procedures', 'compliance programme', 'compliance handbook', 'policies and procedures manual', 'regulatory compliance manual', 'CCO manual'],
    purpose: 'Internal document setting out a fund manager\'s compliance policies and procedures — covers personal trading, insider trading prevention, gift/entertainment, conflicts of interest, AML/KYC, marketing rules, complaints handling, and regulatory reporting. Required under SEC Rule 206(4)-7, AIFMD, MiFID II, and most financial services regulations globally.',
    keyClauses: [
      { name: 'Code of Ethics and Personal Trading', description: 'Standards of conduct, pre-clearance of personal securities transactions, restricted lists, and reporting requirements for access persons.' },
      { name: 'Insider Trading Prevention', description: 'Information barriers, restricted lists, watch lists, and procedures for handling material non-public information (MNPI).' },
      { name: 'Gift and Entertainment Policy', description: 'Limits on gifts and entertainment given and received, pre-approval thresholds, and reporting requirements.' },
      { name: 'Conflicts of Interest', description: 'Identification, disclosure, and management of conflicts including personal interests, side-by-side management, and allocation conflicts.' },
      { name: 'AML/KYC Procedures', description: 'Customer identification programme, enhanced due diligence for high-risk clients, suspicious activity monitoring and reporting.' },
      { name: 'Marketing and Advertising Rules', description: 'Pre-approval of marketing materials, compliance with SEC Marketing Rule (206(4)-1), performance advertising standards, and testimonial/endorsement requirements.' },
      { name: 'Best Execution', description: 'Policies for achieving best execution of client transactions, broker selection criteria, and periodic review of execution quality.' },
      { name: 'Allocation Policy', description: 'Fair and equitable allocation of investment opportunities and trade executions across client accounts and funds.' },
      { name: 'Valuation Policy', description: 'Procedures for valuing fund assets, use of independent pricing sources, valuation committees, and handling of hard-to-value assets.' },
      { name: 'Business Continuity and Disaster Recovery', description: 'Plans for maintaining operations during disruptions — data backup, alternate sites, communication protocols, and recovery time objectives.' },
      { name: 'Complaints Handling', description: 'Procedures for receiving, logging, investigating, and resolving investor and client complaints within regulatory timeframes.' },
      { name: 'Regulatory Reporting', description: 'Calendar and procedures for all regulatory filings — Form ADV, Form PF, AIFMD Annex IV, CPO-PQR, and other jurisdiction-specific reports.' },
      { name: 'Whistleblowing', description: 'Mechanism for employees to report compliance concerns anonymously without retaliation — required under Dodd-Frank and EU Whistleblower Directive.' },
      { name: 'Data Protection', description: 'Policies for handling personal data in compliance with GDPR, CCPA, and other applicable data privacy regulations.' },
      { name: 'Record Retention', description: 'Requirements for maintaining books and records per SEC Rule 204-2, AIFMD, and other applicable rules — types, formats, and retention periods.' },
      { name: 'CCO Responsibilities', description: 'Role and authority of the Chief Compliance Officer, annual compliance review, and reporting to senior management and the board.' },
    ],
    redFlags: [
      'No personal trading monitoring system — access persons may trade ahead of or against client interests',
      'Missing insider trading prevention procedures — significant regulatory and criminal liability exposure',
      'No allocation policy — unfair allocation of opportunities or trades across accounts',
      'No business continuity plan — operational risk in the event of disruption',
      'No whistleblowing mechanism — regulatory requirement in most jurisdictions and cultural red flag',
      'Outdated regulatory references — manual must reflect current rules and guidance',
      'No annual review process — SEC and AIFMD require periodic review and certification by CCO',
    ],
    negotiationTips: [
      'Not negotiated (internal document) but should be reviewed by external counsel at least annually',
      'SEC Rule 206(4)-7 requires written policies and procedures reasonably designed to prevent violations',
      'AIFMD Article 57 requires a permanent and effective compliance function independent of business activities',
      'Tailor to the specific regulatory regimes applicable to the manager — do not use a generic template without customisation',
    ]
  },

  FORM_D: {
    id: 'form_d',
    name: 'Form D Notice of Exempt Offering',
    shortName: 'Form D',
    aliases: ['Form D', 'Reg D filing', 'Regulation D', 'Rule 506 filing', 'exempt offering notice', 'notice of sale'],
    purpose: 'SEC filing required within 15 days of the first sale of securities in a Regulation D exempt offering (Rule 504, 505, or 506). Provides notice to the SEC of the offering terms, exemption relied upon, and issuer information. State blue sky filings may also be required.',
    keyClauses: [
      { name: 'Issuer Information', description: 'Legal name, jurisdiction of organisation, address, and entity type of the issuer and any co-issuers.' },
      { name: 'Related Persons', description: 'Executive officers, directors, and promoters of the issuer — must include all persons with relevant roles.' },
      { name: 'Industry Group', description: 'Classification of the issuer\'s business for SEC categorisation — pooled investment fund, banking, real estate, etc.' },
      { name: 'Federal Exemption Claimed', description: 'Specification of whether the offering relies on Rule 506(b) (no general solicitation) or Rule 506(c) (general solicitation with accredited investor verification).' },
      { name: 'Type of Securities Offered', description: 'Description of the securities being sold — limited partnership interests, LLC interests, promissory notes, etc.' },
      { name: 'Business Combination Transaction', description: 'Whether the offering involves a business combination and any special conditions applicable.' },
      { name: 'Minimum Investment Amount', description: 'Minimum amount accepted from any single investor — should be consistent with PPM and subscription terms.' },
      { name: 'Sales Compensation', description: 'Disclosure of finder\'s fees, commissions, and other compensation paid to persons involved in the offering.' },
      { name: 'Offering Details', description: 'Total offering amount, amount sold to date, number of investors who have already invested, and number of non-accredited investors (if any).' },
      { name: 'Use of Proceeds', description: 'General description of how the offering proceeds will be used — investments, operating expenses, fees, etc.' },
      { name: 'State Blue Sky Compliance', description: 'Notice filings required in each state where securities are offered or sold — timing and fee requirements vary by state.' },
    ],
    redFlags: [
      'Late filing — Form D must be filed within 15 days of the first sale; late filing may jeopardise the exemption in some states',
      'Wrong exemption claimed — 506(b) vs 506(c) has materially different requirements for solicitation and verification',
      'Missing related persons — all executive officers, directors, and promoters must be listed',
      'Inconsistent with PPM terms — offering amount, minimum investment, and use of proceeds must match across documents',
      'No state blue sky filings — many states require notice filings and failure to file can result in rescission rights',
      'Bad actor disqualification not checked — Rule 506(d) requires a reasonable inquiry into disqualifying events for covered persons',
    ],
    negotiationTips: [
      'File within 15 days of the first sale of securities — mark the calendar when the first subscription is accepted',
      'Amend the Form D for material changes and file an annual amendment if the offering is ongoing',
      'Coordinate with PPM and subscription documents to ensure all terms are consistent across the offering package',
      '506(b) vs 506(c) choice affects general solicitation and accredited investor verification requirements — choose deliberately',
      'Check bad actor disqualification under Rule 506(d) for all covered persons before filing',
    ]
  },

  INVESTOR_QUESTIONNAIRE: {
    id: 'investor_questionnaire',
    name: 'Investor Questionnaire',
    shortName: 'Investor Q',
    aliases: ['investor questionnaire', 'investor suitability questionnaire', 'due diligence questionnaire', 'DDQ', 'LP questionnaire', 'investor qualification form', 'suitability assessment'],
    purpose: 'Questionnaire completed by prospective investors to assess their eligibility (accredited/qualified investor status), suitability (investment experience, risk tolerance), regulatory status (ERISA, FATCA, CRS), and compliance profile (AML/KYC, sanctions, PEP). Companion to the subscription agreement.',
    keyClauses: [
      { name: 'Investor Classification', description: 'Determination of whether the investor qualifies as accredited, qualified purchaser, qualified client, or professional investor under applicable regulations.' },
      { name: 'Investment Experience', description: 'Assessment of the investor\'s experience with private funds, alternative investments, and similar strategies — relevant for suitability analysis.' },
      { name: 'Risk Tolerance Assessment', description: 'Evaluation of the investor\'s ability and willingness to bear investment risk, including potential for total loss of capital.' },
      { name: 'Source of Funds and Wealth', description: 'Identification of the origin of investment capital — employment income, business proceeds, inheritance, etc. — required for AML compliance.' },
      { name: 'Beneficial Ownership Structure', description: 'Disclosure of ultimate beneficial owners (UBOs) holding 25%+ interest — required under FinCEN CDD Rule, 4AMLD/5AMLD, and most AML regimes.' },
      { name: 'ERISA/Plan Asset Status', description: 'Whether the investor is a benefit plan investor subject to ERISA — determines plan asset and prohibited transaction implications for the fund.' },
      { name: 'FATCA Classification', description: 'Entity classification under FATCA Chapter 4 — FFI, NFFE (active or passive), exempt beneficial owner — determines withholding and reporting obligations.' },
      { name: 'CRS Tax Residency', description: 'Tax residency declaration and entity classification for Common Reporting Standard automatic exchange of information purposes.' },
      { name: 'PEP Status', description: 'Whether the investor or its beneficial owners are politically exposed persons (PEPs) — triggers enhanced due diligence requirements.' },
      { name: 'Sanctions Screening', description: 'Confirmation that the investor and its beneficial owners are not on OFAC SDN, EU, or UN sanctions lists.' },
      { name: 'Legal/Regulatory Restrictions', description: 'Disclosure of any legal restrictions on the investor\'s ability to invest — court orders, regulatory prohibitions, or contractual limitations.' },
      { name: 'Investment Horizon', description: 'Expected holding period and liquidity expectations — must align with the fund\'s lock-up, redemption, and distribution terms.' },
      { name: 'Liquidity Requirements', description: 'Whether the investor anticipates needing liquidity from this investment — important for closed-ended fund structures with limited redemption rights.' },
    ],
    redFlags: [
      'Incomplete accredited investor verification — for 506(c) offerings, reasonable steps to verify status are legally required',
      'Missing FATCA classification — creates withholding tax and IRS reporting exposure for the fund',
      'No PEP screening — politically exposed persons require enhanced due diligence under all major AML regimes',
      'Vague beneficial ownership disclosure — must identify all UBOs above the applicable threshold (typically 25%)',
      'Missing ERISA status — undetected plan asset investors can trigger prohibited transaction liability for the fund',
      'No sanctions check — investing sanctioned persons\' funds creates severe legal liability including criminal penalties',
    ],
    negotiationTips: [
      'Coordinate with subscription agreement — the questionnaire findings feed into representations in the subscription docs',
      'Use the ILPA DDQ template as a reference standard for institutional investor expectations',
      'For 506(c) offerings, reasonable steps to verify accredited investor status are required — self-certification alone is insufficient',
      'FATCA entity classification (Chapter 4) is complex — provide guidance notes or worked examples with the questionnaire',
    ]
  },

  CRS_SELF_CERT: {
    id: 'crs_self_cert',
    name: 'CRS Self-Certification Form',
    shortName: 'CRS Self-Cert',
    aliases: ['CRS self-certification', 'common reporting standard', 'CRS form', 'tax self-certification', 'AEOI form', 'automatic exchange of information', 'tax residency self-certification'],
    purpose: 'Self-certification form required under the OECD Common Reporting Standard (CRS) — investors declare their tax residency, entity classification (financial institution, active/passive NFE), and controlling persons for automatic exchange of tax information between 100+ participating jurisdictions.',
    types: ['Individual Self-Certification', 'Entity Self-Certification (with Controlling Person form)'],
    keyClauses: [
      { name: 'Tax Residency Declaration', description: 'Statement of all jurisdictions in which the account holder is resident for tax purposes — must list every jurisdiction, not just the primary one.' },
      { name: 'TIN (Taxpayer Identification Number)', description: 'Tax identification number for each jurisdiction of tax residency — or a reasonable explanation if a TIN is unavailable.' },
      { name: 'Entity Classification', description: 'Classification of the entity as a Financial Institution, Active Non-Financial Entity (NFE), or Passive NFE — determines reporting obligations.' },
      { name: 'Controlling Person Declaration', description: 'For Passive NFEs: identification of controlling persons (typically 25%+ beneficial owners or senior managing officials) with their tax residency and TINs.' },
      { name: 'Change of Circumstances Notification', description: 'Undertaking to notify the fund within a specified period (typically 30 days) if any information on the self-certification becomes incorrect.' },
      { name: 'Certification and Undertaking', description: 'Declaration that all information provided is true, correct, and complete — signed under penalties of perjury or equivalent local standard.' },
      { name: 'Reasonable Explanation for Missing TIN', description: 'Where a TIN is not provided, a valid reason must be given — e.g. the jurisdiction does not issue TINs to residents.' },
      { name: 'Dual/Multiple Tax Residency', description: 'Handling of investors resident in more than one jurisdiction — all residencies must be declared and reported to all relevant tax authorities.' },
    ],
    redFlags: [
      'Missing TIN without a reasonable explanation — the fund must obtain a TIN or a valid reason for its absence',
      'Inconsistent entity classification — e.g. claiming Active NFE status when the entity\'s income is predominantly passive',
      'No controlling person declaration for Passive NFE — required under CRS and failure to collect is a reportable deficiency',
      'Stale self-certification with no update — should be refreshed when a change of circumstances is identified or periodically',
      'Missing change of circumstances notification clause — the fund must have a mechanism to capture updates',
    ],
    negotiationTips: [
      'Not negotiated (regulatory form) but must be completed accurately — errors create reporting failures and regulatory risk',
      'Passive NFE classification requires collection of controlling person details — this is non-negotiable',
      'Fund must monitor for change of circumstances (e.g. change of address) and request updated self-certifications',
      'Coordinate with FATCA W-8/W-9 forms to avoid duplication and ensure consistent tax residency declarations',
      'OECD provides a standard form but many jurisdictions have local variants — use the correct local version where required',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // M&A / DEAL DOCUMENTS
  // ═══════════════════════════════════════════════════════════

  ASSET_PURCHASE_AGREEMENT: {
    id: 'asset_purchase_agreement',
    name: 'Asset Purchase Agreement',
    shortName: 'APA',
    aliases: ['asset purchase', 'APA', 'business purchase agreement', 'asset sale agreement', 'asset acquisition agreement', 'business transfer agreement'],
    purpose: 'Governs the purchase of specific business assets (rather than shares/equity) — the buyer cherry-picks assets and assumes only specified liabilities. Common in carve-outs, distressed acquisitions, and situations where the buyer wants to avoid successor liability.',
    keyClauses: [
      { name: 'Asset Schedule', description: 'Exhaustive schedule of all assets being acquired — tangible assets (equipment, inventory, real property), intangible assets (IP, goodwill, contracts, licences), receivables. Anything not listed is excluded.' },
      { name: 'Assumed and Excluded Liabilities', description: 'Precise delineation of which liabilities the buyer assumes and which remain with the seller. Excluded liabilities typically include pre-closing litigation, tax liabilities, product liability, and environmental liabilities.' },
      { name: 'Purchase Price Allocation', description: 'Allocation of purchase price among asset classes for tax purposes under IRC §1060 or equivalent. Allocation affects depreciation, amortisation, and tax treatment for both parties. Must be agreed and filed consistently.' },
      { name: 'Bulk Transfer Compliance', description: 'Compliance with Uniform Commercial Code Article 6 (bulk sales) or equivalent — notice to creditors, escrow of purchase price, or waiver of bulk transfer requirements.' },
      { name: 'Employee Transfer (TUPE/ARD)', description: 'Transfer of employees under TUPE (UK), Acquired Rights Directive (EU), or equivalent labour laws. Automatic transfer of employment contracts, consultation obligations, pension treatment, and redundancy liability allocation.' },
      { name: 'Non-Compete Covenant', description: 'Seller\'s post-completion covenant not to compete — geographic scope, duration (typically 2-5 years), business scope definition, and reasonableness requirements for enforceability.' },
      { name: 'Transitional Services Agreement', description: 'Seller provides transitional services (IT, back office, shared services) for a defined period post-completion to enable operational handover. Scope, duration, SLAs, fees, and termination mechanics.' },
      { name: 'IP Assignment', description: 'Assignment and transfer of all intellectual property included in the asset schedule — patents, trademarks, copyrights, trade secrets, domain names. Chain of title representations and further assurance obligations.' },
      { name: 'Tax Allocation and Indemnity', description: 'Allocation of pre-closing and post-closing tax obligations; straddle period apportionment; transfer taxes (stamp duty, VAT, sales tax); tax indemnities for pre-closing tax liabilities.' },
      { name: 'Third-Party Consents', description: 'Identification and procurement of consents required to transfer contracts, leases, and licences. Treatment of non-assignable contracts — efforts obligation, subcontracting, or purchase price adjustment.' },
      { name: 'Representations and Warranties', description: 'Seller\'s representations on title to assets, condition, no encumbrances, sufficiency of assets, financial statements, material contracts, IP ownership, employee matters, tax compliance, and environmental status.' },
      { name: 'Conditions Precedent', description: 'Conditions to completion — regulatory approvals (competition/antitrust), third-party consents, no material adverse change, employee consultation completion, and financing condition (if applicable).' },
    ],
    redFlags: [
      'Incomplete asset schedule — missing key assets needed to operate the business as a going concern',
      'Broad assumed liabilities clause — buyer inadvertently assumes pre-closing or unknown liabilities',
      'No purchase price allocation agreement — creates tax disputes and inconsistent filing positions',
      'Missing TUPE/ARD analysis — employee transfer obligations are automatic by operation of law and cannot be contracted out of',
      'Non-assignable contracts with no alternative mechanism — critical customer or supplier contracts may be lost',
      'No transitional services arrangement — operational disruption if shared services are severed immediately',
      'Insufficient IP chain of title — seller cannot demonstrate clean ownership of transferred IP',
    ],
    negotiationTips: [
      'Buyer should insist on a "sufficiency of assets" warranty — the transferred assets are sufficient to carry on the business as currently conducted',
      'Purchase price allocation has significant tax implications — engage tax advisors before agreeing allocation; the allocation binds both parties',
      'TUPE/ARD transfers are automatic — the key negotiation is liability allocation for pre-transfer employee obligations and pensions',
      'Transition services: set clear SLAs, cap the duration (6-12 months), and include a step-down fee mechanism to incentivise independence',
      'For distressed acquisitions: consider whether bulk transfer laws create creditor claims against the acquired assets',
    ]
  },

  MERGER_AGREEMENT: {
    id: 'merger_agreement',
    name: 'Merger Agreement',
    shortName: 'Merger Agmt',
    aliases: ['merger agreement', 'scheme of arrangement', 'amalgamation agreement', 'agreement and plan of merger', 'statutory merger', 'business combination agreement'],
    purpose: 'Governs a statutory merger, scheme of arrangement, or amalgamation — one entity is absorbed into another (or both into a new entity) by operation of law. All assets and liabilities transfer automatically. Used for public-to-private transactions, take-privates, strategic combinations, and SPAC de-SPAC transactions.',
    keyClauses: [
      { name: 'Merger Consideration', description: 'What target shareholders receive — cash, acquirer shares, or mixed consideration. Per-share price, exchange ratio mechanics, treatment of options/warrants/convertibles, and fractional share treatment.' },
      { name: 'Exchange Ratio', description: 'For stock-for-stock mergers: fixed ratio, floating ratio (collar mechanism), or walk-away rights if share price moves beyond defined range. Adjustment mechanics for dividends and share splits.' },
      { name: 'Conditions Precedent', description: 'Shareholder approval (both parties if stock consideration), regulatory approvals (antitrust/competition, FDI, sector-specific), no legal impediment, accuracy of representations, compliance with covenants, and MAE condition.' },
      { name: 'Shareholder Approvals', description: 'Voting thresholds required — simple majority, supermajority, or special resolution depending on jurisdiction. Voting agreements with major shareholders. Court approval for schemes of arrangement.' },
      { name: 'Regulatory Approvals', description: 'Antitrust/competition clearance (HSR Act, EU Merger Regulation, CMA), foreign direct investment (CFIUS, FDI screening), and sector-specific (financial services, telecoms, defence). Efforts standard and timing.' },
      { name: 'Fiduciary Out', description: 'Target board\'s right to change its recommendation to shareholders if it receives a "Superior Proposal" or if there is an "Intervening Event." Requires good faith negotiation with the original buyer before exercising.' },
      { name: 'Go-Shop / No-Shop', description: 'No-shop: target cannot solicit competing bids after signing. Go-shop: target may actively solicit competing bids for a defined window (typically 30-45 days) post-signing. Window bid protections for bidders during go-shop.' },
      { name: 'Break Fee / Reverse Break Fee', description: 'Break fee (1-4% of equity value): target pays acquirer if board changes recommendation or accepts superior proposal. Reverse break fee (same range): acquirer pays target if it fails to obtain financing or regulatory approvals.' },
      { name: 'MAE/MAC Definition', description: 'Material Adverse Effect / Material Adverse Change — carve-outs for general economic conditions, industry-wide changes, changes in law, pandemic/epidemic, and changes resulting from announcement of the transaction itself.' },
      { name: 'Interim Operating Covenants', description: 'Target operates in the ordinary course between signing and closing. Negative covenants: no dividends, no share issuances, no material contracts, no capex above threshold, no acquisitions, no changes to compensation. Affirmative covenants: maintain insurance, comply with law.' },
      { name: 'Representations and Warranties', description: 'Comprehensive mutual representations — corporate existence, authority, capitalisation, financial statements, no undisclosed liabilities, compliance with law, material contracts, litigation, tax, environmental, employee benefits, IP.' },
      { name: 'Appraisal/Dissenter Rights', description: 'Statutory rights of dissenting shareholders to receive judicially determined fair value of their shares instead of merger consideration. Notice requirements and procedures vary by jurisdiction.' },
    ],
    redFlags: [
      'No fiduciary out — target board locked in with no ability to respond to superior proposals; may breach directors\' duties',
      'Excessive break fee (above 4% of equity value) — may be viewed as a deal protection device that coerces shareholder approval',
      'Overly narrow MAE carve-outs — acquirer retains ability to walk away for foreseeable market or industry changes',
      'No reverse break fee — target has no remedy if acquirer fails to close due to financing or regulatory failure',
      'Missing regulatory approval conditions — risk of closing without required clearances, triggering gun-jumping liability',
      'Vague interim operating covenants — either too broad (paralysing the target) or too loose (allowing value destruction)',
      'No dissenter/appraisal rights disclosure — shareholders may not be aware of statutory fair value alternative',
    ],
    negotiationTips: [
      'MAE definition is the most heavily negotiated provision — focus on carve-outs for general market conditions, industry changes, pandemic, and effects of the merger announcement itself',
      'Break fee: market range is 2-4% of equity value; higher fees may face shareholder challenge; lower fees reduce deal certainty',
      'Interim operating covenants should include materiality thresholds and carve-outs for pre-approved actions in the disclosure schedule',
      'For public company mergers: antitrust risk allocation (efforts standard and hell-or-high-water vs. best efforts) is a critical deal point',
      'Reverse break fee should cover target\'s costs and opportunity loss if acquirer fails to close — consider ticking fee mechanism',
    ]
  },

  ESCROW_AGREEMENT: {
    id: 'escrow_agreement',
    name: 'Escrow Agreement',
    shortName: 'Escrow Agmt',
    aliases: ['escrow agreement', 'escrow arrangement', 'holdback agreement', 'indemnification escrow', 'purchase price escrow', 'escrow'],
    purpose: 'Governs the holdback of a portion of a transaction\'s purchase price with a neutral escrow agent — used for indemnification claims, earn-out protection, purchase price adjustments, or regulatory holdbacks. Provides security for post-closing claims without requiring the seller to pay out of pocket.',
    keyClauses: [
      { name: 'Escrow Amount', description: 'Total amount deposited in escrow — typically 5-15% of purchase price for indemnification escrows; 100% for certain regulatory or earn-out escrows. Currency denomination and funding mechanics.' },
      { name: 'Release Conditions', description: 'Precise conditions under which escrow funds are released — time-based release (anniversary schedule), claim-based release (resolution of pending claims), or milestone-based release (satisfaction of earn-out conditions).' },
      { name: 'Escrow Agent Duties', description: 'Agent acts as neutral stakeholder — holds funds per written instructions; releases only on joint instruction or final determination (arbitration award, court order). No duty to investigate or verify claims.' },
      { name: 'Investment of Escrow Funds', description: 'How escrow funds are invested during the escrow period — permitted investments (money market, treasuries, bank deposits), risk tolerance, and allocation of investment income (typically to the party ultimately receiving the funds).' },
      { name: 'Claim Mechanics', description: 'Process for making claims against escrow — notice requirements, response period, dispute resolution for contested claims, partial releases while claims are pending.' },
      { name: 'Dispute Resolution', description: 'Mechanism for resolving disputes over escrow release — mediation, arbitration, or court determination. Escrow agent holds funds pending resolution of any disputed claim.' },
      { name: 'Term and Final Release', description: 'Escrow period duration (typically 12-24 months for indemnification; longer for tax or earn-out). Final release mechanics after expiry — automatic release of undisputed funds; retention of disputed amount pending resolution.' },
      { name: 'Escrow Agent Fees and Expenses', description: 'Agent\'s annual fee, transaction fees, and legal expenses. Allocation between buyer and seller — typically shared equally or borne by the party who established the escrow requirement.' },
      { name: 'Indemnification of Escrow Agent', description: 'Both parties indemnify the escrow agent for actions taken in good faith and in accordance with the agreement — standard bank requirement.' },
      { name: 'Tax Treatment', description: 'Tax ownership of escrow funds — typically the seller is treated as the owner for tax purposes and reports income; withholding obligations; tax indemnity for escrow distributions.' },
    ],
    redFlags: [
      'Ambiguous release conditions — creates disputes about when and how funds are released',
      'Escrow agent has discretion to determine claims — agent should be a neutral holder, not an adjudicator',
      'No investment provisions — escrow funds lose value to inflation over multi-year periods',
      'Missing claim mechanics — no clear process for buyer to make claims or seller to dispute them',
      'Escrow period too short — expires before warranty or indemnity claims can be identified and resolved',
      'No partial release mechanism — entire escrow held hostage pending resolution of minor claims',
    ],
    negotiationTips: [
      'Escrow amount should reflect the realistic risk of post-closing claims — 10% of purchase price is the typical market standard for indemnification escrow',
      'Include a time-based step-down release (e.g., 50% released at 12 months, remainder at 18 months) to return funds to the seller as claim risk diminishes',
      'Claim notice mechanics must be clear — require specific description of the claim, amount, and basis; vague notices should be rejected',
      'Escrow agent selection: use a reputable institutional escrow agent (major bank trust department) — avoid party-affiliated agents',
      'Tax reporting: clarify which party reports escrow income for tax purposes and who bears withholding obligations',
    ]
  },

  EARN_OUT_AGREEMENT: {
    id: 'earn_out_agreement',
    name: 'Earn-Out Agreement',
    shortName: 'Earn-Out',
    aliases: ['earn-out agreement', 'earnout agreement', 'contingent consideration agreement', 'deferred consideration agreement', 'earn out', 'earnout'],
    purpose: 'Governs contingent or deferred purchase price payments that depend on the acquired business achieving specified financial or operational milestones after closing — bridges the valuation gap between buyer and seller when they disagree on the business\'s future performance.',
    keyClauses: [
      { name: 'Earn-Out Metrics', description: 'Performance measures that trigger earn-out payments — EBITDA, revenue, gross profit, net income, or operational milestones (product launch, customer acquisition, regulatory approval). Must be precisely defined with accounting methodology.' },
      { name: 'Measurement Period', description: 'Duration over which performance is measured — typically 1-3 years post-closing; annual or cumulative measurement; partial period adjustments for mid-year closings.' },
      { name: 'Accounting Methodology', description: 'Accounting principles and policies applied to calculate earn-out metrics — GAAP/IFRS, consistency with pre-closing practices, specific adjustments and exclusions, treatment of extraordinary items.' },
      { name: 'Operating Covenants', description: 'Buyer\'s obligation to operate the acquired business in a manner consistent with historical practice and to give the business a fair opportunity to achieve earn-out targets. Restrictions on stripping resources, diverting customers, or restructuring.' },
      { name: 'Acceleration on Change of Control', description: 'If buyer sells or merges the acquired business during the earn-out period — acceleration of unpaid earn-out at maximum or negotiated level; prevents buyer from avoiding earn-out through a subsequent sale.' },
      { name: 'Dispute Resolution', description: 'Independent accounting firm determines disputed earn-out calculations — typically a Big Four firm not engaged by either party. Baseball arbitration (each party submits a number, accountant picks one) or traditional determination.' },
      { name: 'Cap and Floor', description: 'Maximum (cap) and minimum (floor) earn-out payments — cap protects buyer from unlimited contingent liability; floor provides seller with guaranteed minimum deferred consideration.' },
      { name: 'Payment Mechanics', description: 'Timing of earn-out payments — calculation within 60-90 days of measurement period end; review period for seller; dispute resolution timeline; interest on overdue payments.' },
      { name: 'Seller Access to Books and Records', description: 'Seller\'s right to inspect books and records supporting earn-out calculations — scope of access, frequency, confidentiality obligations, and audit rights.' },
      { name: 'Anti-Embarrassment Provision', description: 'If buyer sells the business at a premium within the earn-out period, seller receives a share of the upside — protects against buyer flipping the asset at a higher valuation while earn-out remains unpaid.' },
    ],
    redFlags: [
      'Subjective earn-out metrics that cannot be independently verified — creates irresolvable disputes',
      'No operating covenants — buyer can starve the business of resources to suppress earn-out achievement',
      'No acceleration on change of control — buyer can sell the business and extinguish earn-out obligation',
      'Vague accounting methodology — buyer controls the calculation with insufficient constraints',
      'No dispute resolution mechanism — earn-out disputes are notoriously contentious without a clear resolution path',
      'No seller access to books and records — seller cannot verify earn-out calculations',
      'Missing anti-embarrassment provision — buyer can profit from immediate resale while paying minimal earn-out',
    ],
    negotiationTips: [
      'Revenue-based earn-outs are generally more objective and harder to manipulate than EBITDA; EBITDA requires detailed accounting policies and exclusions',
      'Operating covenants are critical for sellers — buyer must commit to maintaining sales force, marketing spend, and capital investment at historical levels',
      'Independent accountant determination should be final and binding — limit the scope of judicial review to fraud or manifest error',
      'Structure earn-out with both a floor (minimum guaranteed payment) and cap (maximum contingent payment) to create certainty for both parties',
      'Consider escrow or letter of credit to secure buyer\'s earn-out payment obligations — especially important where buyer is a financial sponsor',
      'Anti-embarrassment should cover not just direct asset sales but also share sales, mergers, and asset-stripping transactions',
    ]
  },

  EXCLUSIVITY_AGREEMENT: {
    id: 'exclusivity_agreement',
    name: 'Exclusivity Agreement',
    shortName: 'Exclusivity',
    aliases: ['exclusivity agreement', 'lockout agreement', 'no-shop agreement', 'lock-out agreement', 'exclusive dealing agreement', 'standstill agreement'],
    purpose: 'Standalone agreement (separate from an LOI) in which a target company or seller agrees not to solicit, negotiate with, or provide information to competing bidders for a defined period — gives the prospective buyer deal certainty while it conducts due diligence and negotiates definitive documentation.',
    keyClauses: [
      { name: 'Exclusivity Period', description: 'Duration of the no-shop obligation — typically 30-90 days for M&A; renewable on mutual agreement. Start date, end date, and extension mechanics clearly defined.' },
      { name: 'Scope of Restriction', description: 'Breadth of the exclusivity obligation — no solicitation (target cannot approach other bidders), no negotiation (target cannot engage with unsolicited approaches), no provision of information (target cannot open data room to others).' },
      { name: 'Break Fee', description: 'Fee payable by the target if it breaches exclusivity and enters into a transaction with a third party — compensates buyer for due diligence costs and opportunity cost. Typically covers documented out-of-pocket expenses plus a premium.' },
      { name: 'Fiduciary Out', description: 'Carve-out allowing target\'s board to respond to an unsolicited superior proposal if required by their fiduciary duties — typically requires notice to the buyer and a matching right period before the target can engage with the competing bidder.' },
      { name: 'Superior Proposal Definition', description: 'Definition of what constitutes a "superior proposal" that may trigger the fiduciary out — must be bona fide, fully financed, and on terms materially more favourable to shareholders than the buyer\'s proposal.' },
      { name: 'Notification Obligations', description: 'Target\'s obligation to promptly notify the buyer of any unsolicited approach, including identity of the bidder (if permitted) and material terms of the competing proposal. Allows buyer to exercise matching rights.' },
      { name: 'Matching Right', description: 'Buyer\'s right to match or improve upon any competing proposal before the target can terminate exclusivity — typically 5-10 business day matching period; iterative matching for successive competing proposals.' },
      { name: 'Term and Termination', description: 'Exclusivity period end date; early termination triggers (buyer failure to proceed in good faith, material breach, passage of longstop date); survival of certain provisions post-termination.' },
      { name: 'Remedies for Breach', description: 'Specific performance, injunctive relief, break fee, and damages. Acknowledge that damages alone are inadequate for exclusivity breach and equitable relief is appropriate.' },
      { name: 'Buyer Obligations During Exclusivity', description: 'Buyer\'s obligation to proceed with due diligence and negotiation in good faith and with reasonable expedition — prevents buyer from using exclusivity as a blocking mechanism without genuine intent to close.' },
    ],
    redFlags: [
      'Exclusivity period longer than 90 days without buyer commitment or break fee — locks target without reciprocal obligation',
      'No fiduciary out — target board may be in breach of directors\' duties if unable to consider clearly superior proposals',
      'No notification obligation — buyer has no visibility on competing approaches during the exclusivity window',
      'Vague scope of restriction — loopholes that allow indirect approaches or information sharing through affiliates',
      'No buyer good faith obligation — buyer can use exclusivity to delay while pursuing other targets',
      'Break fee that exceeds reasonable compensation — may be challenged as a penalty clause and unenforceable',
    ],
    negotiationTips: [
      'Balance exclusivity duration with buyer\'s genuine due diligence timeline — 45-60 days is typical for mid-market M&A; complex cross-border deals may justify 90 days',
      'Fiduciary out is essential for public company targets — directors have statutory duties that cannot be contracted away by a no-shop agreement',
      'Matching rights create deal certainty for the buyer without fully locking out competition — 5-10 business days is standard',
      'Break fee should cover buyer\'s documented costs plus a reasonable premium — typically 1-2% of expected deal value',
      'Include buyer good faith obligations to prevent the exclusivity from being used as a "market freeze" tactic',
    ]
  },

  DUE_DILIGENCE_REQUEST_LIST: {
    id: 'due_diligence_request_list',
    name: 'Due Diligence Request List',
    shortName: 'DD Request List',
    aliases: ['due diligence checklist', 'DD list', 'DD request list', 'due diligence questionnaire', 'information request list', 'DD checklist', 'vendor due diligence'],
    purpose: 'Standardised checklist of documents and information requested from a target company or fund in connection with an acquisition, investment, or fund subscription — organises the due diligence process across legal, financial, tax, operational, and regulatory categories.',
    keyClauses: [
      { name: 'Corporate/Organisational', description: 'Constitutional documents, share registers, board minutes, subsidiary structure charts, joint venture agreements, powers of attorney, corporate governance policies.' },
      { name: 'Financial', description: 'Audited and management accounts (3-5 years), budgets and forecasts, debt schedules, working capital analysis, capital expenditure history and plans, off-balance sheet items, related party transactions.' },
      { name: 'Tax', description: 'Tax returns (3-5 years), tax computations, correspondence with tax authorities, transfer pricing documentation, tax audits/disputes, withholding tax positions, VAT/GST registrations, tax structuring opinions.' },
      { name: 'Contracts and Agreements', description: 'Material contracts (by revenue threshold), customer contracts (top 10-20), supplier contracts, distribution agreements, joint ventures, partnership agreements, change of control provisions in all material contracts.' },
      { name: 'Employment and Labour', description: 'Employment contracts (key employees), employee handbook/policies, pension/benefit schemes, share option plans, collective bargaining agreements, tribunal/litigation, headcount and compensation data, TUPE considerations.' },
      { name: 'Intellectual Property', description: 'Patent/trademark/copyright registrations and applications, licence agreements (in and out), IP assignment agreements, domain names, trade secrets protection, open source software usage, IP disputes.' },
      { name: 'Real Property', description: 'Freehold and leasehold property schedules, leases, landlord consents, planning permissions, environmental assessments, valuations, occupancy permits, rent reviews, dilapidations.' },
      { name: 'Litigation and Disputes', description: 'Pending and threatened litigation, regulatory investigations, settlement agreements, arbitration proceedings, claims history, insurance claims, product liability claims, warranty claims.' },
      { name: 'Regulatory and Compliance', description: 'Licences and permits, regulatory filings, compliance audits/reports, correspondence with regulators, sanctions and anti-bribery compliance, industry-specific regulatory requirements.' },
      { name: 'Insurance', description: 'Insurance policies schedule, coverage amounts and deductibles, claims history (3-5 years), key exclusions, D&O coverage, professional indemnity, run-off/tail provisions.' },
      { name: 'Environmental', description: 'Environmental permits, compliance reports, contamination assessments, hazardous materials usage, environmental litigation, remediation obligations, carbon/emissions reporting.' },
      { name: 'IT and Data Protection', description: 'IT infrastructure overview, cybersecurity policies and audits, data protection registrations, GDPR/CCPA compliance, data processing agreements, data breach history, business continuity/disaster recovery plans.' },
    ],
    redFlags: [
      'Material gaps in document production — missing financial records, incomplete contract register, or unavailable corporate books suggest poor record-keeping or concealment',
      'Overly restrictive data room access — limited indexing, no download rights, or short access windows impede thorough review',
      'No management interviews permitted — buyers cannot verify documentary DD with operational insight',
      'Missing regulatory correspondence — absence of regulator communications may indicate undisclosed investigations',
      'Incomplete IP chain of title — inability to trace IP ownership to the company suggests assignment failures',
      'No environmental assessments for manufacturing or industrial targets — potentially catastrophic hidden liabilities',
      'Late or piecemeal disclosure — seller dripping information to delay the process or bury adverse information',
    ],
    negotiationTips: [
      'Customise the standard checklist for the specific target, industry, and transaction — a generic list wastes time and misses sector-specific risks',
      'Priority-rank requests — focus the initial DD phase on deal-breaker items (litigation, regulatory, material contracts, IP ownership) before deep-diving into lower-risk areas',
      'Establish a virtual data room (VDR) with proper indexing, Q&A functionality, and audit trail from the outset',
      'Set clear timelines for document production — tie the DD timeline to the exclusivity period and condition satisfaction dates',
      'For vendor due diligence (VDD): engage an independent accounting firm to prepare DD reports for buyer review — accelerates the process and shifts some liability to the VDD provider',
    ]
  },

  COMPLETION_CHECKLIST: {
    id: 'completion_checklist',
    name: 'Completion Checklist',
    shortName: 'Closing Checklist',
    aliases: ['closing checklist', 'completion checklist', 'closing mechanics', 'completion agenda', 'closing agenda', 'signing and completion checklist'],
    purpose: 'Operational document that tracks all actions, deliverables, and filings required for the successful signing and completion (closing) of a transaction — ensures all conditions precedent are satisfied, all documents are executed, and all regulatory filings and fund transfers occur in the correct sequence.',
    keyClauses: [
      { name: 'Pre-Completion Actions', description: 'Actions required before closing — obtaining board and shareholder approvals, regulatory clearances, third-party consents, waiver of pre-emption rights, satisfaction of conditions precedent.' },
      { name: 'Conditions Precedent Satisfaction', description: 'Checklist tracking satisfaction or waiver of each CP in the transaction agreement — regulatory approvals, no material adverse change confirmation, bring-down of representations, legal opinions delivered.' },
      { name: 'Signing Deliverables', description: 'Documents to be executed at signing — transaction agreement, disclosure letter, ancillary documents (TSA, employment agreements, escrow agreement), legal opinions, officer certificates, board resolutions.' },
      { name: 'Completion Deliverables', description: 'Documents and actions at closing — stock transfer forms, share certificates, resignations/appointments of directors, updated registers, release of security, novation of contracts, closing certificates.' },
      { name: 'Funds Flow', description: 'Detailed funds flow memorandum — source accounts, destination accounts, amounts, wire transfer instructions, payment sequence, confirmation procedures. Critical for multi-party transactions with escrow, debt payoff, and adviser fees.' },
      { name: 'Post-Completion Actions', description: 'Actions required after closing — regulatory notifications, company registry filings, tax filings (stamp duty, transfer tax), employee notifications, customer/supplier notifications, insurance transfers, IT system migrations.' },
      { name: 'Filing Requirements', description: 'Post-closing regulatory and corporate filings — Companies House (UK), ACRA (Singapore), SEC (US), competition authority notifications, tax authority notifications, change of control filings under material contracts.' },
      { name: 'Responsible Party Assignment', description: 'Each action item assigned to a specific responsible party (buyer counsel, seller counsel, escrow agent, accountant) with a deadline — ensures accountability and prevents items from falling through gaps.' },
      { name: 'Document Execution Logistics', description: 'Practical mechanics — signing in counterparts, electronic signatures (validity under applicable law), notarisation and apostille requirements, power of attorney usage, document delivery and release.' },
      { name: 'Simultaneous Signing and Completion', description: 'If signing and closing occur simultaneously: sequence of document execution, condition of release (funds must be in escrow before release of executed documents), and fall-back if any element fails.' },
    ],
    redFlags: [
      'Missing conditions precedent tracking — risk of closing without satisfied or waived CPs, potentially voiding the transaction',
      'No funds flow memorandum — creates confusion on payment amounts, sequence, and destination, especially in multi-party deals',
      'Unsigned or incomplete ancillary documents at closing — TSA, employment agreements, or escrow agreement not finalised',
      'Missing post-completion filing deadlines — late regulatory filings trigger penalties and potentially invalidate the transaction',
      'No responsible party assignment — items fall through gaps between buyer and seller counsel',
      'Insufficient time allocated for notarisation and apostille — cross-border transactions require advance planning for legalisation',
    ],
    negotiationTips: [
      'Circulate the completion checklist early — ideally at the same time as the first draft of the transaction agreement; it exposes practical issues early',
      'Funds flow memo should be agreed 5-10 business days before closing — allow time for bank verification and test wires',
      'Cross-border transactions require additional time for notarisation, apostille, and local counsel co-ordination — build this into the closing timeline',
      'Track conditions precedent satisfaction with a traffic light system (red/amber/green) to give all parties visibility on closing readiness',
      'Post-completion obligations should have clear deadlines and responsible parties — create a separate post-completion tracker',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // BROKER / INTERMEDIARY / PLACEMENT
  // ═══════════════════════════════════════════════════════════

  PLACEMENT_AGENT_AGREEMENT: {
    id: 'placement_agent_agreement',
    name: 'Placement Agent Agreement',
    shortName: 'Placement Agmt',
    aliases: ['placement agent agreement', 'placement agreement', 'capital raising agreement', 'fundraising agreement', 'placement agent mandate', 'distribution mandate', 'placement agent'],
    purpose: 'Governs the appointment of a placement agent to raise capital for a fund — defines target investors, geographic scope, fee structure (upfront and trailing), regulatory compliance requirements, and FCPA/anti-bribery obligations. The placement agent acts as intermediary between the fund manager and prospective investors.',
    keyClauses: [
      { name: 'Scope of Engagement', description: 'Definition of target investor universe (institutional, HNWI, family office, sovereign wealth), geographic territories, fund(s) covered, and whether the agent provides introductions only or broader advisory services.' },
      { name: 'Fee Structure', description: 'Upfront placement fee (typically 1-2% of capital raised), trailing commission (share of management fee, typically 20-25% for 2-4 years), retainer, and expense reimbursement. Fee triggers tied to investor commitment or capital drawdown.' },
      { name: 'Tail Period', description: 'Period after termination during which placement agent is entitled to fees for investors in the pipeline — typically 12-24 months. Pipeline definition and protected investor list must be clearly defined and periodically updated.' },
      { name: 'Exclusivity', description: 'Exclusive right to place the fund in defined territories/investor categories, or non-exclusive engagement. Exclusive arrangements require minimum performance obligations — failure to meet targets triggers non-exclusivity or termination.' },
      { name: 'Regulatory Compliance', description: 'Agent warrants and represents its regulatory status — SEC/FINRA registration (US), FCA authorisation (UK), MAS licence (Singapore), SFC licence (Hong Kong). Agent responsible for compliance in each jurisdiction where it markets.' },
      { name: 'Anti-Bribery/FCPA', description: 'Express representations and covenants regarding compliance with the Foreign Corrupt Practices Act, UK Bribery Act, and applicable local anti-corruption laws. Prohibition on payments to government officials; right to audit; immediate termination for breach.' },
      { name: 'Placement Agent Disclosure', description: 'Fund manager\'s obligation to disclose the placement agent relationship to investors — required by SEC guidance, ILPA best practices, and many public pension fund policies (e.g., CalPERS, CalSTRS placement agent disclosure rules).' },
      { name: 'Investor Suitability', description: 'Agent\'s obligation to assess investor suitability and eligibility before making introductions — qualified purchaser/accredited investor verification, AML/KYC responsibility allocation.' },
      { name: 'Marketing Materials', description: 'All marketing materials must be pre-approved by the fund manager\'s compliance function. Agent cannot create or distribute unapproved materials. Financial promotion rules compliance in each jurisdiction.' },
      { name: 'Termination', description: 'Termination for convenience (typically 30-90 days notice), for cause (regulatory breach, anti-bribery violation, fraud), and automatic termination on loss of regulatory licence. Consequences for fees and tail period.' },
      { name: 'Expenses', description: 'Reimbursement of agent expenses — travel, accommodation, marketing events. Pre-approval required above threshold; cap on total reimbursable expenses; documentation requirements.' },
      { name: 'Indemnification', description: 'Agent indemnifies fund for regulatory breaches, mis-selling, and anti-bribery violations. Fund indemnifies agent for material accuracy of offering documents and fund information provided to the agent.' },
    ],
    redFlags: [
      'Placement agent not registered as broker-dealer in US or authorised in relevant jurisdiction — creates securities law violations and potential rescission rights for investors',
      'No anti-bribery representations or FCPA compliance — fund manager bears vicarious liability for agent\'s corrupt practices',
      'No placement agent disclosure to investors — violates SEC guidance and public pension fund policies; creates trust and governance issues',
      'Trailing commission with no cap or sunset — perpetual fee obligation that outlasts any reasonable commercial rationale',
      'No marketing materials approval process — unapproved or misleading materials create regulatory and civil liability',
      'Tail period exceeds 24 months with vague pipeline definition — agent claims fees on investors with no genuine nexus to the agent\'s efforts',
      'No performance obligations under exclusive arrangement — territory locked up with underperforming agent',
    ],
    negotiationTips: [
      'Verify regulatory status before engagement — in the US, unregistered placement activity is a criminal offence; in the UK, an FCA-authorised firm must handle regulated activities',
      'ILPA best practices recommend full disclosure of placement agent fees and relationships to all prospective investors — build this into the fund\'s PPM and subscription process',
      'Trailing commissions should step down over time (e.g., 25% year 1, 20% year 2, 15% year 3) and terminate after a defined period',
      'Tail period: maintain a rolling pipeline list updated quarterly — only investors on the list at termination qualify for tail fees',
      'Public pension fund investors (CalPERS, CalSTRS, etc.) have specific placement agent disclosure requirements — failure to comply may disqualify the fund from investment',
    ]
  },

  FINDERS_FEE_AGREEMENT: {
    id: 'finders_fee_agreement',
    name: 'Finder\'s Fee Agreement',
    shortName: 'Finder\'s Fee',
    aliases: ['finder\'s fee agreement', 'finders fee', 'introduction fee agreement', 'referral agreement', 'deal sourcing agreement', 'introduction agreement', 'referral fee agreement'],
    purpose: 'Governs the payment of a fee to a finder or introducer who sources a deal or investment opportunity — defines what constitutes a valid introduction, fee trigger events, fee calculation, and non-circumvention protections. Simpler than a placement agent agreement; typically covers one-off introductions rather than ongoing placement.',
    keyClauses: [
      { name: 'Definition of Introduction', description: 'Precise definition of what constitutes a valid "introduction" — first introduction only, or re-introductions; written confirmation of introduction; introduction log maintained by finder.' },
      { name: 'Fee Trigger Events', description: 'Events that trigger fee payment — signing of definitive agreement, closing of transaction, first capital drawdown. Must be specific to avoid disputes over when the fee is earned.' },
      { name: 'Fee Calculation', description: 'Fee as a percentage of deal value (typically 1-5% depending on deal size, declining on a Lehman or modified Lehman scale), or fixed fee. Definition of "deal value" (enterprise value, equity value, committed capital).' },
      { name: 'Tail Period', description: 'Period after termination during which finder is entitled to fees for introduced parties — typically 12-18 months; applies if the introduced party closes a transaction after the agreement terminates.' },
      { name: 'Protected Parties List', description: 'Schedule of specific parties or opportunities introduced by the finder — fees are only payable on transactions with listed parties. List should be updated periodically and agreed by both parties.' },
      { name: 'Exclusions', description: 'Transactions excluded from fee obligation — parties already known to the principal, transactions already in progress, introductions previously made by others, and de minimis transactions below a threshold.' },
      { name: 'Payment Timing', description: 'When the fee is payable — on closing, in instalments, or deferred. Interest on late payments. Currency and wire transfer mechanics.' },
      { name: 'Non-Circumvention', description: 'Principal covenants not to bypass the finder and deal directly with introduced parties — covers direct and indirect approaches, use of affiliates or agents, and transactions with related entities of introduced parties.' },
      { name: 'Regulatory Status', description: 'Finder\'s representation on regulatory status — in many jurisdictions, receiving transaction-based compensation for introductions requires broker-dealer or equivalent registration. SEC no-action letters on finders\' exemptions.' },
    ],
    redFlags: [
      'Finder not registered as broker-dealer where required — creates securities law violations; fee may be unenforceable and fund may face rescission claims',
      'Vague definition of "introduction" — disputes over whether the finder genuinely introduced the party or whether the parties already knew each other',
      'No protected parties list — open-ended fee claims on any transaction the principal enters into',
      'Fee trigger on signing rather than closing — principal pays fee even if transaction fails to close',
      'No exclusions for pre-existing relationships — principal pays fee for parties already in its pipeline',
      'Excessive tail period without sunset — perpetual fee obligation on introduced parties',
    ],
    negotiationTips: [
      'Maintain a contemporaneous introduction log — written confirmation of each introduction on the date it is made; prevents disputes about who introduced whom',
      'Fee should be triggered on closing, not signing — aligns the finder\'s interest with successful completion of the transaction',
      'Protected parties list should be specific and exhaustive — no fee payable on unlisted parties; update quarterly',
      'Regulatory status: in the US, the SEC\'s position on unregistered finders is narrow and fact-specific; consider using a registered broker-dealer to avoid risk',
      'Non-circumvention should cover affiliates and related parties of both the finder and the introduced party',
    ]
  },

  ENGAGEMENT_LETTER: {
    id: 'engagement_letter',
    name: 'Engagement Letter',
    shortName: 'Engagement Letter',
    aliases: ['engagement letter', 'retainer letter', 'letter of engagement', 'professional engagement', 'law firm engagement', 'legal engagement letter', 'advisory engagement letter'],
    purpose: 'Formal letter appointing a professional advisor (law firm, accounting firm, tax advisor, valuation firm) — defines the scope of engagement, fee structure, billing arrangements, conflicts check, professional liability limitations, and confidentiality obligations. Required by most professional regulatory bodies.',
    keyClauses: [
      { name: 'Scope of Engagement', description: 'Precise definition of the services to be provided — matter description, specific tasks included and excluded, limitations on scope. Critical to manage expectations and limit professional liability to the agreed scope.' },
      { name: 'Client Identification', description: 'Clear identification of the client entity — the fund, the GP, the management company, or an individual. Multi-party engagements require conflict analysis and joint client consent.' },
      { name: 'Fee Structure', description: 'Billing methodology — hourly rates by seniority (partner, associate, trainee), fixed fee, capped fee, success fee, or hybrid. Rate escalation provisions. Estimate of total fees where possible.' },
      { name: 'Billing Arrangements', description: 'Invoice frequency (monthly, quarterly, on completion), payment terms (typically 30 days), interest on overdue invoices, right to suspend work for non-payment, detailed time narratives.' },
      { name: 'Conflict Check', description: 'Confirmation that the advisor has conducted a conflicts check and identified no disqualifying conflicts. Ongoing obligation to monitor for new conflicts. Disclosure of any existing relationships with counterparties.' },
      { name: 'Limitation of Liability', description: 'Contractual cap on the advisor\'s liability — typically a multiple of fees or a fixed amount (subject to regulatory minimum and professional body rules). Exclusion of indirect/consequential damages. Aggregate cap across all claims.' },
      { name: 'Professional Indemnity Insurance', description: 'Confirmation that the advisor maintains professional indemnity insurance at the level required by its regulatory body — SRA (England), bar association, PCAOB. Minimum coverage amounts disclosed.' },
      { name: 'Privilege and Confidentiality', description: 'Legal professional privilege (attorney-client privilege) applies to communications within the scope of legal advice. Waiver risks if third parties are copied. Document retention and privilege logs.' },
      { name: 'Termination', description: 'Either party may terminate on reasonable notice — advisor must ensure orderly handover; client remains liable for fees incurred. Advisor\'s lien over client papers for unpaid fees (subject to regulatory limits).' },
      { name: 'File Retention', description: 'Period for which the advisor retains the client file post-completion — typically 6-15 years depending on jurisdiction and regulatory requirements. Electronic storage and destruction policy.' },
      { name: 'Complaints Procedure', description: 'Internal complaints handling procedure as required by professional regulatory body. Right to refer unresolved complaints to the legal ombudsman or equivalent.' },
    ],
    redFlags: [
      'Vague scope of engagement — creates scope creep and fee disputes; client may expect services not included in the engagement',
      'No conflicts check disclosed — risk of disqualifying conflict emerging mid-engagement, forcing advisor withdrawal',
      'Excessive limitation of liability — cap set below the realistic risk exposure; may not comply with professional regulatory requirements',
      'No client identification — ambiguity about who the advisor owes duties to, especially in fund structures with multiple entities',
      'Missing fee estimate — client has no budget expectation; potential for bill shock',
      'No termination provision — either party trapped in an unsatisfactory relationship',
    ],
    negotiationTips: [
      'Scope of engagement should be as precise as possible — include a schedule of specific deliverables, milestones, and exclusions',
      'For transactional work, request a fixed fee or capped fee rather than open-ended hourly billing — creates cost certainty and aligns incentives',
      'Limitation of liability must comply with the advisor\'s professional regulatory body rules — SRA (England) sets minimum professional indemnity at GBP 3M for multi-partner firms',
      'Multi-party engagements (GP and fund jointly engaging counsel) require explicit conflict analysis and joint client consent — privilege implications must be addressed',
    ]
  },

  MANDATE_LETTER: {
    id: 'mandate_letter',
    name: 'Mandate Letter',
    shortName: 'Mandate',
    aliases: ['mandate letter', 'investment bank mandate', 'financial advisor mandate', 'advisory mandate', 'sell-side mandate', 'buy-side mandate', 'M&A mandate'],
    purpose: 'Agreement appointing an investment bank or financial advisor to provide advisory services on a specific transaction — defines whether the mandate is sell-side, buy-side, or general advisory, the fee structure (retainer plus success fee), exclusivity, indemnification, and termination rights.',
    keyClauses: [
      { name: 'Scope of Advisory', description: 'Nature of the mandate — sell-side (running a sale process), buy-side (sourcing and evaluating acquisition targets), capital raising (debt or equity), restructuring, fairness opinion. Specific transaction or general advisory relationship.' },
      { name: 'Fee Structure', description: 'Monthly retainer (credited against success fee), success fee calculated on a Lehman or modified Lehman formula, or bespoke fee grid. Minimum fee. Definition of "transaction value" for fee calculation purposes.' },
      { name: 'Lehman Formula', description: 'Standard fee scale — 5% of first $1M, 4% of second $1M, 3% of third $1M, 2% of fourth $1M, 1% thereafter. Modified Lehman (double Lehman, modern Lehman) adjusts percentages upward. Declining scale for larger transactions.' },
      { name: 'Tail Period', description: 'Period after termination during which the advisor earns its success fee if the transaction closes — typically 12-24 months. Covers transactions with parties identified or introduced during the mandate period.' },
      { name: 'Exclusivity', description: 'Whether the advisor has an exclusive mandate — client cannot appoint a competing advisor for the same transaction. Exclusivity typically linked to performance obligations and terminable for underperformance.' },
      { name: 'Indemnification', description: 'Client indemnifies the advisor for liabilities arising from the engagement (except the advisor\'s own negligence, wilful misconduct, or fraud). Standard investment bank indemnification is broad — covers litigation, regulatory actions, and third-party claims.' },
      { name: 'Expenses', description: 'Reimbursement of out-of-pocket expenses — travel, data room costs, third-party reports. Pre-approval required above a threshold. Cap on total expenses. Expenses payable regardless of whether the transaction closes.' },
      { name: 'Termination', description: 'Either party may terminate on 30-60 days written notice. Consequences: retainer ceases; tail period activates; expenses reimbursed; indemnification survives. For-cause termination on material breach or loss of regulatory status.' },
      { name: 'Confidentiality', description: 'Mutual confidentiality obligations regarding the transaction, client information, and the advisory relationship. Survives termination. Permitted disclosures to the advisor\'s affiliates and professional advisors.' },
      { name: 'Conflicts Disclosure', description: 'Advisor discloses existing and potential conflicts — other client relationships, proprietary positions, lending relationships with the counterparty. Ongoing obligation to disclose new conflicts.' },
    ],
    redFlags: [
      'Excessive success fee without retainer credit — double-paying for the same work',
      'Broad indemnification with no carve-outs — client liable even for advisor\'s own negligence or regulatory failures',
      'No tail period cap — advisor claims fees indefinitely after termination',
      'Exclusive mandate with no performance obligations or termination for underperformance — locks client in with ineffective advisor',
      'Vague "transaction value" definition — disputes over whether earn-outs, assumed debt, and contingent consideration are included in the fee base',
      'No conflicts disclosure — advisor may have relationships with the counterparty or competing interests',
      'Expenses not capped — open-ended expense reimbursement obligation',
    ],
    negotiationTips: [
      'Success fee should be calculated on a clearly defined "transaction value" — specify whether enterprise value, equity value, or total consideration; include or exclude contingent/deferred consideration',
      'Retainer should be credited against the success fee — the advisor should not receive both the full retainer and full success fee',
      'Indemnification: resist "arising out of or in connection with the engagement" — narrow to claims arising from specific third-party actions, with carve-outs for the advisor\'s own negligence and wilful misconduct',
      'Tail period: maintain a list of parties introduced or identified during the mandate period — only these parties trigger tail fees',
      'For sell-side mandates: ensure the advisor is obligated to run a competitive process (broad auction vs. targeted approach) and provide regular progress reports',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // DEBT / CREDIT
  // ═══════════════════════════════════════════════════════════

  FACILITY_AGREEMENT: {
    id: 'facility_agreement',
    name: 'Facility Agreement',
    shortName: 'Facility Agmt',
    aliases: ['facility agreement', 'loan agreement', 'credit agreement', 'credit facility', 'term loan agreement', 'revolving credit facility', 'RCF', 'subscription line', 'capital call facility', 'NAV facility', 'leverage facility'],
    purpose: 'Governs the provision of credit from one or more lenders to a borrower — defines the facility amount, drawdown mechanics, interest rate, repayment schedule, covenants, events of default, and security package. In the fund context, commonly used for subscription credit lines (secured by LP commitments), NAV facilities (secured by portfolio assets), and leverage facilities.',
    types: ['Term Loan', 'Revolving Credit Facility (RCF)', 'Subscription Line/Capital Call Facility', 'NAV Facility', 'Bridge Loan', 'Mezzanine Facility'],
    keyClauses: [
      { name: 'Facility Amount and Type', description: 'Total committed facility amount, currency, and type (term, revolving, or hybrid). Sub-limits, swingline, and letter of credit sub-facilities. Accordion feature for facility increase.' },
      { name: 'Drawdown Mechanics', description: 'Notice requirements for drawdowns (typically 3-5 business days), minimum drawdown amounts, number of loans outstanding, rollover mechanics for revolving facilities. Subscription line: drawdown triggers capital call to LPs.' },
      { name: 'Interest Rate', description: 'Reference rate (SOFR, EURIBOR, SONIA) plus margin. Margin ratchet (step-up/step-down based on leverage or credit rating). Default interest rate (typically 2% above standard rate). Interest payment dates and day count convention.' },
      { name: 'Repayment Schedule', description: 'Amortisation schedule for term loans; bullet maturity for revolving facilities. Mandatory prepayment triggers (asset sale proceeds, excess cash flow sweep, change of control, insurance proceeds). Voluntary prepayment mechanics and break costs.' },
      { name: 'Representations and Warranties', description: 'Borrower representations — corporate existence, authority, no litigation, financial statements accuracy, no default, no material adverse change, compliance with law, tax status, security validity. Repeated on each drawdown and interest payment date.' },
      { name: 'Information Covenants', description: 'Obligation to deliver financial statements (quarterly management accounts, annual audited), compliance certificates, budgets/forecasts, material event notifications, LP commitment data (for subscription lines).' },
      { name: 'Financial Covenants', description: 'Loan-to-value ratio (LTV), debt service coverage ratio (DSCR), leverage ratio, interest coverage ratio, borrowing base coverage (for subscription lines). Testing frequency (quarterly) and cure mechanics.' },
      { name: 'General Undertakings', description: 'Negative covenants: no additional debt (negative pledge), no disposals, no change of business, no dividends/distributions (or restricted payments basket), no mergers. Positive covenants: maintain insurance, comply with law, maintain authorisations.' },
      { name: 'Events of Default', description: 'Payment default, financial covenant breach, representation breach, cross-default, insolvency events, material adverse change, change of control, illegality, key LP default (subscription lines). Cure periods and remedies.' },
      { name: 'Security Package', description: 'Security interests granted — share pledge over fund/SPV shares, assignment of LP commitments (subscription line), floating charge over assets, account pledge, assignment of material contracts. Perfection requirements.' },
      { name: 'Intercreditor Arrangements', description: 'If multiple lenders or tranches: priority of payments, enforcement waterfall, standstill provisions, turnover obligations, release mechanics. Separate intercreditor agreement or provisions within the facility agreement.' },
      { name: 'Agency Provisions', description: 'Role of the facility agent (administrative agent) in a syndicated facility — agent duties, voting mechanics, majority lender decisions, unanimous lender decisions, agent fees, replacement of agent.' },
      { name: 'Borrowing Base (Subscription Lines)', description: 'Calculation of the borrowing base — eligible LP commitments, advance rate (typically 60-90% of eligible commitments), inclusion/exclusion criteria for LPs, concentration limits, credit quality ratings for LPs.' },
    ],
    redFlags: [
      'Financial covenants with no cure rights — immediate default without opportunity to remedy; particularly dangerous for fund borrowers with variable cash flows',
      'Cross-default clauses with no materiality threshold — minor defaults under unrelated facilities trigger acceleration',
      'Overly broad material adverse change event of default — subjective determination by lender; should be objective and material',
      'No cap on mandatory prepayment from asset sale proceeds — prevents reinvestment or distribution to investors',
      'Security package includes LP commitment letters directly — LPs may object to assignment and question fund governance',
      'Margin ratchet only steps up, never steps down — one-way pricing mechanism that penalises without rewarding improvement',
      'Missing clean-down requirement for revolving facilities — facility becomes a de facto term loan',
      'No borrowing base advance rate cushion — facility fully drawn against maximum base with no buffer for LP defaults',
    ],
    negotiationTips: [
      'Subscription line borrowing base: negotiate advance rates, LP eligibility criteria, and concentration limits carefully — these determine actual borrowing capacity',
      'Financial covenant cure rights: "equity cure" allowing sponsor injection to cure financial covenant breach is standard in sponsor-backed facilities',
      'SOFR transition: ensure fallback provisions clearly address the end of LIBOR screen rates; credit spread adjustment to SOFR base rate',
      'Covenant headroom should be 20-30% above projected performance — too tight and operational flexibility is constrained; too loose and lender protection is illusory',
      'For fund facilities: ensure LP consent/acknowledgement letters are pre-arranged — lender may require direct LP acknowledgement of commitment assignment',
      'Mandatory prepayment: negotiate reinvestment rights (12-18 month reinvestment period) before excess proceeds sweep',
    ]
  },

  PROMISSORY_NOTE: {
    id: 'promissory_note',
    name: 'Promissory Note',
    shortName: 'Note',
    aliases: ['promissory note', 'PN', 'note payable', 'IOU', 'loan note', 'demand note', 'term note'],
    purpose: 'A simple, unconditional written promise to pay a specified sum of money to the holder at a defined time or on demand — the most basic form of debt instrument. Used for inter-company loans, shareholder loans, vendor financing, and bridge financing where full facility documentation is unnecessary.',
    keyClauses: [
      { name: 'Principal Amount', description: 'Face value of the note — the amount the maker promises to pay. May be a single advance or drawn in tranches with a maximum principal amount.' },
      { name: 'Interest Rate', description: 'Fixed or floating rate of interest — simple or compound interest. Payment frequency (monthly, quarterly, at maturity). Default interest rate for overdue amounts.' },
      { name: 'Maturity Date', description: 'Date on which the principal and any accrued interest become due and payable. Demand notes have no fixed maturity — payable on demand with reasonable notice (typically 5-30 days).' },
      { name: 'Payment Schedule', description: 'Interest-only payments with bullet principal repayment, or fully amortising with blended payments. Payment dates, business day convention, and wire transfer instructions.' },
      { name: 'Prepayment', description: 'Right to prepay the note before maturity — with or without penalty. Prepayment premium (make-whole) or yield maintenance if applicable. Notice requirements for voluntary prepayment.' },
      { name: 'Events of Default', description: 'Triggers for acceleration — non-payment, insolvency, cross-default, breach of covenants, material adverse change, change of control. Grace periods for non-payment (typically 5-10 business days).' },
      { name: 'Governing Law', description: 'Applicable governing law — determines negotiability, transferability, and enforcement. UCC Article 3 (US), Bills of Exchange Act (UK/Commonwealth), or civil code equivalent.' },
      { name: 'Waiver of Presentment', description: 'Maker waives formal presentment, demand, notice of dishonour, and protest — standard in modern promissory notes to simplify enforcement procedures.' },
      { name: 'Transferability', description: 'Whether the note is negotiable (transferable by endorsement and delivery to a holder in due course) or non-negotiable (assignable only by contract). Legend restricting transfer if not intended to be negotiable.' },
      { name: 'Security', description: 'Whether the note is secured or unsecured. If secured, reference to the security agreement, pledge, or mortgage. If unsecured, any negative pledge or pari passu provisions.' },
    ],
    redFlags: [
      'No maturity date and no demand provision — note may be perpetual with no mechanism to require repayment',
      'No events of default — holder has no remedy if maker becomes insolvent or defaults on other obligations',
      'Unclear interest calculation — simple vs compound, day count convention, and accrual method not specified',
      'Negotiable form when non-negotiability was intended — note can be transferred to a holder in due course who takes free of defences',
      'No subordination language where the note is intended to be junior — senior creditors may challenge priority',
      'Missing usury compliance — interest rate may exceed statutory maximum in applicable jurisdiction',
    ],
    negotiationTips: [
      'Keep promissory notes simple — if the transaction requires extensive covenants, representations, or security, use a full facility agreement instead',
      'Interest rate must comply with usury laws in the governing jurisdiction — statutory maximum rates vary significantly',
      'For inter-company or shareholder loans: ensure the interest rate is arm\'s length for transfer pricing purposes — tax authorities may impute interest or recharacterise the loan',
      'If the note is intended to be subordinated: include express subordination language and ensure the senior creditor acknowledges the subordination',
    ]
  },

  CONVERTIBLE_NOTE: {
    id: 'convertible_note',
    name: 'Convertible Note',
    shortName: 'Convertible',
    aliases: ['convertible note', 'convertible loan note', 'CLN', 'convertible debt', 'convertible promissory note', 'bridge note', 'convertible bridge'],
    purpose: 'A debt instrument that converts into equity upon specified trigger events — commonly used as bridge financing before a priced equity round. The note accrues interest and converts at a discount to the next round\'s price or at a valuation cap, whichever gives the holder a better price.',
    keyClauses: [
      { name: 'Principal and Interest', description: 'Principal amount of the note; interest rate (typically 4-8% per annum); simple or compound interest; accrued interest converts into equity alongside principal on conversion.' },
      { name: 'Maturity Date', description: 'Date by which the note must be repaid or converted — typically 12-24 months from issuance. If no qualified financing occurs before maturity, the note may convert at the cap or become repayable.' },
      { name: 'Conversion Mechanics', description: 'Automatic conversion on a qualified financing above a defined threshold (e.g., $1M+ equity raise). Conversion price equals the lesser of: (a) the next round price multiplied by the discount, or (b) the valuation cap divided by fully diluted shares.' },
      { name: 'Discount Rate', description: 'Percentage discount to the next round\'s price per share — typically 15-25%. Rewards the noteholder for the risk of investing before a priced round establishes the company\'s valuation.' },
      { name: 'Valuation Cap', description: 'Maximum valuation at which the note converts — protects the noteholder if the company\'s valuation increases significantly before the qualified financing. Conversion price = cap / fully diluted pre-money shares.' },
      { name: 'Qualified Financing Trigger', description: 'Definition of the equity financing that triggers automatic conversion — minimum amount raised (e.g., $1M), type of securities issued (preferred stock), and whether bridge round proceeds are counted.' },
      { name: 'Optional vs Automatic Conversion', description: 'Automatic conversion on qualified financing (standard). Optional conversion at noteholder\'s election on other events (smaller raise, M&A, maturity). Conversion at maturity if no qualified financing has occurred.' },
      { name: 'Most Favoured Nation', description: 'If the company issues subsequent convertible notes with better terms (lower cap, higher discount), existing noteholders receive the benefit of those terms. Protects early bridge investors against term degradation.' },
      { name: 'Information Rights', description: 'Noteholder\'s right to receive financial statements, cap table, and material event notifications — limited compared to equity investors but sufficient for conversion planning.' },
      { name: 'Subordination', description: 'Note is subordinated to senior indebtedness (bank debt, facility agreements) — conversion into equity on a qualified financing eliminates the subordination issue.' },
      { name: 'Events of Default', description: 'Payment default, insolvency, dissolution, material breach of representations. On an event of default, noteholder may accelerate repayment (subject to subordination) or convert at the cap or last round valuation.' },
    ],
    redFlags: [
      'No valuation cap — noteholder has no protection if the company\'s valuation increases dramatically before the qualified financing',
      'Valuation cap too high — effectively provides no meaningful conversion benefit; note converts at terms close to the next round investors',
      'No qualified financing threshold — conversion triggered by trivially small equity raises that do not establish a credible valuation',
      'No MFN protection — subsequent noteholders receive better terms, diluting earlier bridge investors\' economic position',
      'Interest rate below market — tax authorities may impute interest for transfer pricing purposes; noteholder receives inadequate compensation',
      'Missing maturity date conversion mechanic — if no qualified financing occurs, the note has no clear resolution path',
      'No subordination — creates conflict with existing senior lenders who may accelerate their facilities',
    ],
    negotiationTips: [
      'Cap and discount work together — the conversion price is the lesser of the two, so both matter; model both scenarios before agreeing terms',
      'Valuation cap is the more important term for noteholders in high-growth companies — the discount becomes irrelevant if the cap is significantly below the next round valuation',
      'Qualified financing threshold should be meaningful (e.g., $1M+ for early-stage, $5M+ for growth-stage) — too low allows manipulation',
      'At maturity with no qualified financing: negotiate automatic conversion at the cap rather than repayment — the company may not have cash to repay',
      'MFN provisions should be automatic — existing noteholders receive the benefit of better subsequent terms without having to negotiate individually',
    ]
  },

  SUBORDINATION_AGREEMENT: {
    id: 'subordination_agreement',
    name: 'Subordination Agreement',
    shortName: 'Subordination',
    aliases: ['subordination agreement', 'intercreditor agreement', 'priority agreement', 'deed of subordination', 'inter-creditor deed', 'creditor priority agreement'],
    purpose: 'Governs the priority of claims among creditors — the subordinated (junior) creditor agrees that its claims rank behind those of the senior creditor in payment priority and enforcement rights. Essential in layered capital structures with multiple debt tranches.',
    keyClauses: [
      { name: 'Priority of Payments', description: 'Defines the payment waterfall — senior debt principal and interest paid in full before any payment on subordinated debt. Application of all payments, distributions, and liquidation proceeds in strict priority order.' },
      { name: 'Standstill Provisions', description: 'Junior creditor agrees not to take enforcement action (accelerate, sue, commence insolvency proceedings) for a defined standstill period (typically 90-180 days) after a default, giving the senior creditor time to act first.' },
      { name: 'Turnover Obligations', description: 'If the junior creditor receives any payment in violation of the subordination (including in insolvency proceedings), it must turn over those payments to the senior creditor. Trust/constructive trust mechanics.' },
      { name: 'Enforcement Restrictions', description: 'Junior creditor cannot enforce its security, accelerate its debt, or commence insolvency proceedings against the borrower without senior creditor consent or until the standstill period expires.' },
      { name: 'Permitted Payments', description: 'Payments that the borrower may make to the junior creditor notwithstanding the subordination — scheduled interest payments (if no default exists), administrative fees. Blocked during a payment blockage period triggered by senior default.' },
      { name: 'Cure Rights', description: 'Junior creditor\'s right to cure a senior default (by making the overdue payment) to prevent senior acceleration — subrogation to the senior creditor\'s rights to the extent of the cure payment.' },
      { name: 'Release Mechanics', description: 'How and when the subordination is released — typically on full repayment of senior debt; partial release on agreed deleveraging milestones; automatic release if senior facility is refinanced without subordination requirement.' },
      { name: 'Amendment Restrictions', description: 'Restrictions on amending the senior or junior debt documents without the other creditor\'s consent — prevents either party from changing terms to the detriment of the other (e.g., senior creditor extending maturity, junior creditor adding covenants).' },
      { name: 'Voting and Consent Rights', description: 'Treatment of the junior creditor\'s voting rights in insolvency proceedings — whether the junior creditor can vote on reorganisation plans, object to asset sales, or participate in creditors\' committees.' },
      { name: 'Subrogation', description: 'Junior creditor\'s right to step into the senior creditor\'s shoes after senior debt is repaid in full — inherits the senior creditor\'s priority position, security, and enforcement rights.' },
    ],
    redFlags: [
      'Indefinite standstill period — junior creditor permanently blocked from enforcement with no time limit',
      'No permitted payments — junior creditor receives no interest or any payment while subordination is in effect, even absent a default',
      'No cure rights — junior creditor cannot prevent senior acceleration even by making the overdue payment',
      'Amendment restrictions only bind the junior creditor — senior creditor free to amend its terms to the detriment of the junior position',
      'Turnover obligations not limited to improper payments — junior creditor must turn over even legitimately received permitted payments',
      'No release mechanics — subordination continues indefinitely even after senior debt dynamics have changed',
    ],
    negotiationTips: [
      'Standstill period should be limited (90-180 days) — after expiry, the junior creditor should be free to enforce independently',
      'Permitted payments are critical for the junior creditor\'s economics — ensure scheduled interest payments are permitted absent a senior payment default',
      'Cure rights protect the junior creditor\'s investment — the right to cure a senior default and subrogate is a valuable tool',
      'Amendment restrictions should be mutual — neither the senior nor junior documents should be materially amended without the other\'s consent',
      'Payment blockage periods should have a cap (e.g., 179 days in any 360-day period) to prevent perpetual blocking',
    ]
  },

  SECURITY_AGREEMENT: {
    id: 'security_agreement',
    name: 'Security Agreement',
    shortName: 'Security Agmt',
    aliases: ['security agreement', 'pledge agreement', 'share pledge', 'charge agreement', 'debenture', 'account pledge', 'assignment by way of security', 'mortgage', 'collateral agreement'],
    purpose: 'Creates a security interest (lien, pledge, charge, or assignment by way of security) over specified assets in favour of a secured creditor — provides the lender with recourse to specific collateral if the borrower defaults on its obligations under a facility agreement or other debt instrument.',
    types: ['Share Pledge', 'Account Pledge', 'Assignment of Receivables', 'Floating Charge/Debenture', 'Mortgage (Real Property)', 'IP Security Assignment'],
    keyClauses: [
      { name: 'Granted Security', description: 'Description of the security interest created — pledge, fixed charge, floating charge, assignment by way of security, or mortgage. Must match the asset type and the requirements of the applicable jurisdiction for creating valid security.' },
      { name: 'Secured Obligations', description: 'Definition of the obligations secured — all amounts owing under the facility agreement and related finance documents; or limited to specific tranches. "All monies" clause vs. limited recourse security.' },
      { name: 'Collateral Description', description: 'Precise description of the collateral — pledged shares (number, class, issuer), bank accounts (account numbers, banks), receivables (contracts, debtors), IP (registration numbers), real property (title references). Schedules attached.' },
      { name: 'Perfection Requirements', description: 'Steps required to perfect the security interest — registration (UCC-1 filing, Companies House charge registration, Pledgee notation on share register), possession (share certificates delivered to secured party), control (control agreements for bank accounts).' },
      { name: 'Representations', description: 'Pledgor represents: valid title to collateral, no prior security interests, no restrictions on pledging, power and authority to grant security, collateral description is accurate and complete.' },
      { name: 'Covenants', description: 'Negative pledge (no further security over the collateral), no disposal without consent, maintain and insure the collateral, notify secured party of any adverse claims, comply with applicable laws regarding the collateral.' },
      { name: 'Enforcement Rights', description: 'Secured party\'s rights on enforcement — right to sell/dispose of collateral, appoint a receiver, exercise voting rights on pledged shares, collect receivables, foreclose on real property. Notice requirements and commercially reasonable sale obligations.' },
      { name: 'Release Mechanics', description: 'Conditions for release of security — full repayment of secured obligations, partial release on agreed deleveraging, substitution of collateral. Documentation for release (UCC-3 termination, charge release, re-transfer of shares).' },
      { name: 'Power of Attorney', description: 'Irrevocable power of attorney granted to the secured party — to execute transfers, register changes, and take all steps necessary to enforce the security on default. Coupled with an interest and not revocable by the pledgor.' },
      { name: 'Voting Rights', description: 'For share pledges: pledgor retains voting rights on pledged shares absent default; on default, secured party may exercise all voting and other shareholder rights. Dividend rights: collected into pledged account or paid to pledgor absent default.' },
    ],
    redFlags: [
      'Security interest not perfected — unperfected security is ineffective against third parties and in insolvency; the secured party may rank as unsecured',
      'Collateral description too vague — imprecise description may not create a valid security interest over the intended assets',
      'Missing negative pledge — pledgor can grant competing security interests over the same collateral, diluting the secured party\'s recovery',
      'No enforcement notice requirements — secured party can enforce without notice, creating procedural challenges and potential legal liability',
      'Floating charge without crystallisation mechanics — floating charge ranks behind fixed charges and may not provide adequate protection',
      'Cross-border collateral without local law security — security over assets in another jurisdiction may require a parallel local law security document',
      'Power of attorney revocable — if not expressed as irrevocable and coupled with an interest, it may be revoked by the pledgor or on insolvency',
    ],
    negotiationTips: [
      'Perfection is paramount — file UCC-1 (US), register charge at Companies House (UK), notarise pledge deed (civil law jurisdictions) within the required timeframes',
      'For share pledges: require delivery of share certificates and signed blank stock transfer forms to the secured party — this creates the strongest form of security',
      'Floating charges are weaker than fixed charges in insolvency (UK: prescribed part, expenses carve-out) — convert to fixed charge where the assets can be specifically identified',
      'Cross-border security requires local counsel in each jurisdiction where collateral is located — a single-jurisdiction security document may be ineffective over foreign assets',
      'Release mechanics should be pre-agreed and documented — avoid disputes about release documentation requirements after the debt is repaid',
    ]
  },

  GUARANTEE: {
    id: 'guarantee',
    name: 'Guarantee',
    shortName: 'Guarantee',
    aliases: ['guarantee', 'parent guarantee', 'parent company guarantee', 'personal guarantee', 'performance guarantee', 'corporate guarantee', 'deed of guarantee', 'guaranty'],
    purpose: 'A promise by a third party (the guarantor) to answer for the debt, default, or obligation of the principal debtor if the principal debtor fails to perform — provides the creditor with recourse to an additional credit-worthy party. Used for parent-subsidiary obligations, personal guarantees from founders/sponsors, and performance bonds.',
    types: ['Parent Company Guarantee', 'Personal Guarantee', 'Performance Guarantee/Bond', 'Payment Guarantee', 'Demand Guarantee/Standby Letter of Credit'],
    keyClauses: [
      { name: 'Guaranteed Obligations', description: 'Precise definition of the obligations guaranteed — all obligations under the principal agreement (all-monies guarantee) or limited to specific obligations (limited guarantee). Maximum guaranteed amount.' },
      { name: 'Demand vs Conditional Guarantee', description: 'Demand guarantee: payable on written demand without proof of default by the principal debtor (see-through). Conditional guarantee: payable only after the creditor has exhausted remedies against the principal debtor. Material distinction for the guarantor\'s exposure.' },
      { name: 'Cap/Limitation on Liability', description: 'Maximum amount payable under the guarantee — fixed amount, percentage of the principal obligation, or declining cap over time. Financial assistance and corporate benefit limitations in some jurisdictions.' },
      { name: 'Subrogation Rights', description: 'Guarantor\'s right, after paying under the guarantee, to step into the creditor\'s shoes and recover from the principal debtor. Subrogation is typically suspended until the creditor is paid in full to prevent the guarantor from competing with the creditor.' },
      { name: 'Waiver of Defences', description: 'Guarantor waives defences that might otherwise reduce or extinguish the guarantee — variation of the principal agreement, grant of time, release of security, failure to enforce against the principal debtor. Preserves the guarantee\'s enforceability.' },
      { name: 'Independent Obligation', description: 'Guarantee constitutes a primary and independent obligation of the guarantor — not merely accessory to the principal debt. Survives invalidity or unenforceability of the underlying obligation.' },
      { name: 'Reinstatement', description: 'If any payment by the principal debtor is clawed back (e.g., in insolvency as a preference), the guarantee is automatically reinstated as if the payment had not been made. Prevents the guarantor from being released by voidable payments.' },
      { name: 'Expiry', description: 'Duration of the guarantee — co-terminous with the principal obligation, fixed term with renewal, or demand-based. Expiry mechanics and notice requirements for non-renewal.' },
      { name: 'Representations by Guarantor', description: 'Guarantor represents: power and authority, corporate benefit/financial assistance compliance, no insolvency, financial statements accuracy, enforceability of the guarantee.' },
      { name: 'Information Rights', description: 'Guarantor\'s right to receive information about the guaranteed obligations — principal debt balance, defaults, amendments. Creditor\'s obligation to notify guarantor of material events.' },
    ],
    redFlags: [
      'All-monies guarantee with no cap — guarantor exposed to unlimited liability for all current and future obligations of the principal debtor',
      'Demand guarantee where a conditional guarantee was intended — guarantor must pay on demand without proof of principal default',
      'No corporate benefit analysis — guarantee may be unenforceable or voidable if the guarantor entity receives no benefit (financial assistance rules, fraudulent conveyance)',
      'Waiver of defences extends to fraud — guarantor should not waive defences where the creditor\'s own fraud is involved',
      'No subrogation rights — guarantor who pays has no recourse against the principal debtor',
      'Missing cap/limitation — particularly dangerous for personal guarantees where the guarantor\'s personal assets are at risk',
      'Reinstatement without limit — guarantee revives indefinitely if any payment is clawed back',
    ],
    negotiationTips: [
      'Cap the guarantee at a fixed amount or declining percentage — unlimited guarantees are disproportionate to the risk in most commercial contexts',
      'Corporate benefit analysis is essential before granting a guarantee — in many jurisdictions (UK, EU), a guarantee without corporate benefit is voidable or unlawful (financial assistance, fraudulent preference)',
      'Demand guarantees are significantly more onerous than conditional guarantees — ensure the guarantor understands the distinction and the immediacy of the payment obligation',
      'Personal guarantees from founders/sponsors: negotiate a time limit, declining cap, and release triggers (e.g., leverage ratio achieved, loan-to-value threshold met)',
      'Subrogation rights should be preserved but suspended until the creditor is fully repaid — this is market standard and protects both parties',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // JV / PARTNERSHIP
  // ═══════════════════════════════════════════════════════════

  JOINT_VENTURE_AGREEMENT: {
    id: 'joint_venture_agreement',
    name: 'Joint Venture Agreement',
    shortName: 'JVA',
    aliases: ['joint venture agreement', 'JV agreement', 'JVA', 'joint venture', 'co-development agreement', 'strategic partnership agreement'],
    purpose: 'Governs a joint venture between two or more parties to pursue a specific business purpose — defines capital contributions, governance, profit sharing, deadlock resolution, and exit mechanics. Distinct from a limited partnership fund structure; used for project-specific ventures, real estate developments, strategic partnerships, and co-development arrangements.',
    keyClauses: [
      { name: 'JV Purpose and Scope', description: 'Precise definition of the JV\'s business purpose, permitted activities, and geographic scope. Anything outside the stated purpose requires unanimous consent. Prevents mission creep and scope disputes.' },
      { name: 'Capital Contributions', description: 'Initial and follow-on capital contributions by each party — cash, assets, IP, or services. Valuation of non-cash contributions. Default consequences for failure to contribute (dilution, buy-out, liquidation).' },
      { name: 'Governance and Board Composition', description: 'Board composition — each party appoints a defined number of directors; independent directors if applicable. Voting mechanics — simple majority for ordinary decisions, reserved matters requiring supermajority or unanimity.' },
      { name: 'Reserved Matters', description: 'Decisions requiring unanimous or supermajority consent — budget approval, capital expenditure above threshold, incurrence of debt, new business lines, disposal of material assets, admission of new parties, changes to constitutional documents.' },
      { name: 'Management and Operations', description: 'Day-to-day management delegation — managing party or management committee. Management fees, operating budgets, reporting obligations, hiring of key personnel, procurement policies.' },
      { name: 'Profit Sharing and Distributions', description: 'How profits are allocated and distributed — pro rata to capital contributions, or bespoke waterfall (preferred return, promote/carry). Distribution policy (mandatory minimum, discretionary), timing, and reinvestment provisions.' },
      { name: 'Non-Compete', description: 'Each party covenants not to compete with the JV within the defined scope and geography during the JV term and for a period after exit. Carve-outs for existing businesses and pre-approved activities.' },
      { name: 'Deadlock Resolution', description: 'Escalation mechanism for unresolvable disputes — negotiation between senior executives, mediation, and if deadlock persists: Russian roulette (one party offers to buy or sell at a named price), Texas shoot-out (sealed bids), expert determination, or winding up.' },
      { name: 'Exit Mechanisms', description: 'How parties can exit the JV — IPO, trade sale to third party, buy-out by one party (put/call options), drag-along, tag-along, winding up. Valuation methodology for buy-outs (independent valuation, formula-based, EBITDA multiple).' },
      { name: 'Term and Winding Up', description: 'Fixed term or indefinite with termination rights. Winding up procedures — distribution of assets, settlement of liabilities, deregistration, IP reversion, non-compete survival.' },
      { name: 'Information and Audit Rights', description: 'Each party\'s right to receive financial statements, management reports, and to audit the JV\'s books and records. Access to JV premises, management interviews, and independent audit rights.' },
      { name: 'Transfer Restrictions', description: 'Restrictions on transferring JV interests — no transfer without consent, right of first refusal, tag-along/drag-along, permitted transferees (affiliates only), change of control triggers.' },
    ],
    redFlags: [
      'No deadlock resolution mechanism — 50/50 JV without a deadlock breaker leads to paralysis and value destruction',
      'Vague JV purpose — overly broad scope creates disputes about which activities and opportunities belong to the JV vs. the individual parties',
      'No exit mechanism — parties locked into the JV with no buyout, sale, or winding up path',
      'Non-compete does not cover affiliates — parties circumvent the JV through related entities',
      'No default/dilution consequence for failure to contribute capital — free-riding on the contributing party\'s investment',
      'Reserved matters list too narrow — key decisions made by management without JV partner consent',
      'Profit sharing not aligned with capital contributions or risk allocation — economic mismatch creates disputes',
    ],
    negotiationTips: [
      'Deadlock is the single most important issue in a 50/50 JV — agree the mechanism upfront; Russian roulette is clean but favours the wealthier party; Texas shoot-out is fairer',
      'JV purpose must be specific and exhaustive — ambiguity about scope leads to disputes about opportunity allocation between the JV and the parties\' separate businesses',
      'Non-compete should cover affiliates, successors, and persons acting in concert — individual party restrictions alone are easily circumvented',
      'Exit valuation: agree the methodology upfront (independent valuation, formula, EBITDA multiple) to avoid disputes when exit actually occurs',
      'Capital contribution default: consider automatic dilution (increasing the contributing party\'s percentage) as a self-executing remedy rather than requiring enforcement proceedings',
    ]
  },

  CONSORTIUM_AGREEMENT: {
    id: 'consortium_agreement',
    name: 'Consortium Agreement',
    shortName: 'Consortium Agmt',
    aliases: ['consortium agreement', 'consortium arrangement', 'bidding consortium', 'club deal agreement', 'co-bidding agreement', 'joint bidding agreement', 'consortium'],
    purpose: 'Governs the formation and operation of a consortium of parties bidding together for an acquisition target, investment opportunity, or project — defines the lead party, cost sharing, bid strategy, exclusivity, and what happens if the bid succeeds or fails. Common in take-privates, infrastructure projects, and large-scale real estate acquisitions.',
    keyClauses: [
      { name: 'Consortium Purpose', description: 'Specific target, project, or opportunity the consortium is formed to pursue. Clear delineation between the consortium phase (pre-closing) and the post-closing arrangements (typically governed by a separate JV or shareholders\' agreement).' },
      { name: 'Lead Party Designation', description: 'Which party leads the consortium — responsibilities include managing the bid process, negotiating with the target, coordinating advisors, and acting as the consortium\'s representative. Decision-making authority and limits.' },
      { name: 'Cost Sharing', description: 'Allocation of bid costs (advisor fees, due diligence costs, data room fees, regulatory filing fees) among consortium members — pro rata to expected ownership percentages, equally, or custom allocation. Pre-approval requirements for costs above threshold.' },
      { name: 'Bid Strategy', description: 'Agreed parameters for the bid — maximum price, valuation methodology, bid structure (cash/shares/hybrid), financing structure, conditions. Decision-making process for bid adjustments. Unanimous vs. majority decision-making.' },
      { name: 'Exclusivity', description: 'Each member commits not to bid for the target separately or with a competing consortium. Duration of exclusivity. Consequences of breach (forfeiture of cost sharing contributions, liquidated damages).' },
      { name: 'Break-Up/Work Fees', description: 'If the consortium breaks up before a bid is submitted: allocation of work product, advisor relationships, and information. Break-up fee payable by the departing member. Non-use obligations for confidential target information.' },
      { name: 'Information Sharing', description: 'Framework for sharing due diligence findings and target information among consortium members — clean team arrangements, confidentiality, competition law compliance (particularly for competitors in the same industry).' },
      { name: 'Decision-Making', description: 'How the consortium makes decisions — lead party authority for day-to-day matters, unanimous consent for material decisions (bid price, structure, conditions), majority for administrative matters.' },
      { name: 'Withdrawal Rights', description: 'Right of a member to withdraw from the consortium — notice requirements, consequences (forfeiture of cost contributions, non-compete on the target, break-up fee). Whether remaining members can continue the bid.' },
      { name: 'Post-Completion Framework', description: 'Outline of the post-closing governance arrangements — binding heads of terms for the shareholders\' agreement or JV agreement that will govern the consortium members\' relationship after acquisition completion.' },
    ],
    redFlags: [
      'No exclusivity — members can join competing consortia or bid separately, undermining the consortium\'s bargaining position',
      'Vague cost sharing — disputes over who pays for expensive due diligence or advisor fees',
      'No competition law analysis — competitors sharing information in a consortium may violate antitrust rules; clean team protocols essential',
      'Missing post-completion framework — consortium wins the bid but members cannot agree on governance, value split, or management',
      'No withdrawal mechanism — members trapped in a consortium pursuing a bid they no longer support',
      'Lead party authority too broad — makes material decisions (price increases, condition waivers) without other members\' consent',
    ],
    negotiationTips: [
      'Agree the post-completion shareholders\' agreement or JV terms in parallel with the consortium agreement — do not leave governance for later; disputes frequently arise after a successful bid',
      'Competition law: if consortium members are competitors, engage antitrust counsel from the outset; implement clean team protocols for due diligence information sharing',
      'Cost sharing should be proportionate to expected ownership — but include a minimum contribution to ensure all members have skin in the game regardless of ownership percentage',
      'Withdrawal penalty should be meaningful but proportionate — forfeiture of costs contributed plus a reasonable break-up fee; excessive penalties may be unenforceable',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // CORPORATE GOVERNANCE / PORTFOLIO COMPANY
  // ═══════════════════════════════════════════════════════════

  BOARD_RESOLUTION: {
    id: 'board_resolution',
    name: 'Board Resolution',
    shortName: 'Board Res',
    aliases: ['board resolution', 'board minutes', 'directors resolution', 'board consent', 'written resolution of directors', 'unanimous written consent'],
    purpose: 'Formal record of decisions made by the board of directors — either at a board meeting (minutes) or by written resolution without a meeting. Authorises corporate actions, records director deliberations and conflicts, and provides evidence of proper governance for regulatory, transactional, and audit purposes.',
    types: ['Ordinary Board Resolution', 'Special Board Resolution', 'Written Resolution of Directors', 'Unanimous Written Consent'],
    keyClauses: [
      { name: 'Quorum', description: 'Minimum number of directors present (in person, by phone, or by video) to constitute a valid meeting — as defined in the articles of association. Quorum requirements for specific decisions (e.g., certain matters may require all directors or investor-nominated directors).' },
      { name: 'Matters Resolved', description: 'Clear statement of each matter resolved — approval of a transaction, appointment of officers, authorisation of banking signatories, approval of financial statements, declaration of dividends, allotment of shares.' },
      { name: 'Authority Granted', description: 'Specific authority delegated to officers or committees to implement the resolution — signing authority, bank mandate changes, filing authority, authority to negotiate and execute documents.' },
      { name: 'Director Conflicts', description: 'Disclosure and management of any director conflicts of interest in relation to the matter being resolved — conflicted director may be required to recuse from voting or the entire discussion, depending on jurisdiction and articles.' },
      { name: 'Voting Record', description: 'Record of how each director voted on each resolution — for, against, or abstained. Dissenting votes recorded for director liability purposes. Alternate directors recorded if applicable.' },
      { name: 'Certification', description: 'Company secretary or chairman certifies the resolution as a true and correct record — signed, dated, and filed with the company\'s statutory books. Required for third-party reliance (banks, counterparties).' },
      { name: 'Attachments and Schedules', description: 'Documents approved by the board attached to or referenced in the resolution — contracts, financial statements, reports, terms of appointment. Evidence that the board reviewed the materials before approving.' },
      { name: 'Ratification', description: 'Retrospective approval of actions already taken by officers or agents — ratification has the same legal effect as prior authorisation, but should be used sparingly to avoid governance concerns.' },
    ],
    redFlags: [
      'No quorum verified — resolutions passed without a valid quorum are void or voidable',
      'Conflicted directors not disclosed or not recused — creates breach of fiduciary duty and potential for transaction to be challenged',
      'Vague authority granted — broad delegation without clear limits creates agency risk',
      'Missing board materials — resolution approves a transaction but no evidence that directors reviewed the terms',
      'No dissenting vote record — directors may claim they voted against a decision to avoid personal liability',
      'Resolution not signed or certified — third parties and auditors may not accept uncertified resolutions',
    ],
    negotiationTips: [
      'Board resolutions are not negotiated per se, but drafting quality matters — ensure each resolution is self-contained and clearly identifies the action authorised',
      'For transactions: counterparties will request certified board resolutions as a condition to closing — draft with third-party reliance in mind',
      'Conflict management: follow the articles precisely; some jurisdictions require conflicted directors to leave the meeting room, not just abstain from voting',
      'Written resolutions (without a meeting) must comply with the statutory requirements of the jurisdiction — some require unanimity, others require the same majority as at a meeting',
    ]
  },

  SHAREHOLDER_RESOLUTION: {
    id: 'shareholder_resolution',
    name: 'Shareholder Resolution',
    shortName: 'SH Resolution',
    aliases: ['shareholder resolution', 'shareholder consent', 'written consent of shareholders', 'EGM resolution', 'AGM resolution', 'members resolution', 'stockholder consent'],
    purpose: 'Formal record of decisions made by the shareholders of a company — either at a general meeting (AGM/EGM) or by written consent without a meeting. Required for matters reserved to shareholders under the articles and applicable corporate law (amendment of articles, share capital changes, winding up, approval of fundamental transactions).',
    keyClauses: [
      { name: 'Resolution Text', description: 'Precise wording of the resolution — must clearly describe the action approved and be capable of a "for" or "against" vote. Ordinary resolution (simple majority) vs. special resolution (75% or higher threshold).' },
      { name: 'Voting Threshold', description: 'Required majority for the resolution to pass — ordinary resolution (50%+ of votes cast), special resolution (75%+ in most jurisdictions), or unanimous resolution. Class consents if different share classes are affected differently.' },
      { name: 'Circulation Procedure', description: 'How the resolution and explanatory materials are circulated to shareholders — notice of meeting (statutory minimum 14-21 days), or written resolution circulated with 28-day deadline for response. Electronic communication if permitted.' },
      { name: 'Deadline for Response', description: 'For written resolutions: date by which shareholders must sign and return the resolution — typically 28 days from circulation. Lapse date if insufficient votes received.' },
      { name: 'Proxy Provisions', description: 'Right of shareholders to appoint a proxy to vote on their behalf — form of proxy, deadline for proxy submission, chair as default proxy. Corporate representatives for institutional shareholders.' },
      { name: 'Class Consents', description: 'If the resolution affects the rights of a particular class of shares, separate class consent from the affected shareholders may be required — variation of class rights provisions in the articles.' },
      { name: 'Explanatory Statement', description: 'Statement accompanying the resolution explaining its purpose, background, and the directors\' recommendation — required for certain transactions (related party transactions, director compensation, significant disposals).' },
      { name: 'Filing Requirements', description: 'Statutory filings required after the resolution is passed — Companies House filing for special resolutions (UK, 15 days), ACRA filing (Singapore), SEC filing if applicable. Some resolutions require regulatory pre-approval.' },
    ],
    redFlags: [
      'Wrong voting threshold applied — special resolution matters passed by ordinary resolution are void',
      'Insufficient notice period — resolutions passed on short notice without the required consent of shareholders are challengeable',
      'Missing class consent — variation of class rights without separate class approval is invalid',
      'No filing of special resolutions — failure to file at Companies House (or equivalent) within the statutory period is a criminal offence in some jurisdictions',
      'Proxy irregularities — proxies submitted after the deadline or in incorrect form; invalid proxies counted in the vote',
      'Written resolution circulated without explanatory statement — shareholders cannot make an informed decision',
    ],
    negotiationTips: [
      'Shareholder resolutions are generally not negotiated but the resolution text must be precisely drafted — ambiguous resolution text creates legal uncertainty about what was approved',
      'For private companies: written resolutions are faster and simpler than convening a meeting — use where the articles and applicable law permit',
      'Minority shareholders should review the resolution carefully — once passed, the resolution binds all shareholders including those who voted against',
      'For multi-class structures: identify whether the resolution triggers class consent requirements; failure to obtain class consent may invalidate the resolution',
    ]
  },

  POWER_OF_ATTORNEY: {
    id: 'power_of_attorney',
    name: 'Power of Attorney',
    shortName: 'PoA',
    aliases: ['power of attorney', 'POA', 'PoA', 'proxy', 'letter of authority', 'delegation of authority', 'authorisation letter'],
    purpose: 'Legal instrument by which one party (the principal) authorises another party (the attorney/agent) to act on their behalf in specified legal or business matters — used in fund structures for signing authority, closing mechanics, regulatory filings, and corporate administration across multiple jurisdictions.',
    types: ['General Power of Attorney', 'Special/Limited Power of Attorney', 'Lasting/Durable Power of Attorney'],
    keyClauses: [
      { name: 'Scope of Authority', description: 'Precise definition of what the attorney is authorised to do — sign specific documents, operate bank accounts, file regulatory returns, attend and vote at meetings, execute share transfers. General PoA grants broad authority; special PoA is limited to named actions.' },
      { name: 'Duration', description: 'Period for which the power of attorney is effective — fixed term, until a specific event (completion of a transaction), or until revoked. Lasting/durable PoA survives the principal\'s mental incapacity.' },
      { name: 'Revocation', description: 'How the power of attorney may be revoked — written notice to the attorney and all third parties who have relied on it. Powers coupled with an interest (e.g., security agreements) may be irrevocable.' },
      { name: 'Governing Law', description: 'Applicable law determines the formal requirements for validity — execution requirements, witnessing, notarisation, registration. Conflict of laws issues if the PoA is used in a different jurisdiction.' },
      { name: 'Notarisation and Apostille', description: 'Many jurisdictions require notarisation for the PoA to be effective locally. Cross-border use typically requires apostille (Hague Convention countries) or consular legalisation (non-Hague countries). Processing time: 1-10 business days.' },
      { name: 'Substitution', description: 'Whether the attorney may delegate or substitute their authority to another person — general PoAs typically permit substitution; special PoAs may restrict it.' },
      { name: 'Ratification', description: 'Actions taken by the attorney within the scope of authority are binding on the principal as if the principal had acted directly. Actions outside scope may be ratified retrospectively by the principal.' },
      { name: 'Third-Party Reliance', description: 'Third parties (banks, registries, counterparties) are entitled to rely on the PoA unless they have notice of revocation or expiry. Indemnification of third parties who act in good faith reliance on the PoA.' },
      { name: 'Liability of Attorney', description: 'Attorney\'s duty of care — fiduciary obligations to the principal; liability for actions outside scope of authority or in breach of duty. Indemnification of the attorney for actions taken in good faith within scope.' },
    ],
    redFlags: [
      'General PoA where a limited PoA was intended — grants authority far beyond the specific purpose, creating significant agency risk',
      'No expiry date or revocation mechanism — power of attorney remains effective indefinitely',
      'Missing notarisation or apostille for cross-border use — PoA may be rejected by foreign registries, banks, or courts',
      'PoA not executed in compliance with local law requirements — invalid and unenforceable; actions taken under it may be void',
      'No substitution restriction — attorney can delegate to unknown third parties without the principal\'s knowledge',
      'Principal incapacitated but PoA is not a lasting/durable form — PoA automatically revoked by incapacity',
    ],
    negotiationTips: [
      'Use special/limited PoAs wherever possible — restrict the authority to the specific actions required for the transaction; general PoAs are a last resort',
      'Cross-border transactions: allow adequate time for notarisation and apostille — the process can take 5-10 business days and must be completed before closing',
      'For closing mechanics: if a signatory will not be available at closing, the PoA should be prepared and legalised well in advance — it is the most common cause of closing delay',
      'Some jurisdictions (e.g., UAE, Saudi Arabia, China) have specific formal requirements for PoAs — engage local counsel to confirm compliance',
    ]
  },

  MANAGEMENT_SERVICES_AGREEMENT: {
    id: 'management_services_agreement',
    name: 'Management Services Agreement',
    shortName: 'MSA',
    aliases: ['management services agreement', 'MSA', 'management agreement', 'portfolio company management agreement', 'sponsor management agreement', 'monitoring agreement', 'advisory services agreement'],
    purpose: 'Agreement under which the GP, sponsor, or management company provides management, advisory, or monitoring services to a portfolio company — defines the scope of services, management/monitoring fee, performance incentive, and the relationship between the fund-level management fee and the portfolio company management fee.',
    keyClauses: [
      { name: 'Scope of Services', description: 'Specific services provided — strategic advisory, board participation, financial oversight, operational improvement, capital structure advice, M&A support, management recruitment. Distinct from day-to-day operational management by the portfolio company\'s own team.' },
      { name: 'Management/Monitoring Fee', description: 'Annual fee payable by the portfolio company — typically 1-2% of EBITDA, or a fixed annual amount. Payment frequency (quarterly in advance). Comparison/offset against fund-level management fee.' },
      { name: 'Performance Incentive', description: 'Additional fee tied to portfolio company performance — EBITDA growth, revenue milestones, or successful exit. Aligns sponsor incentives with portfolio company value creation.' },
      { name: 'Fund Management Fee Offset', description: 'Critical ILPA issue: monitoring fees received from portfolio companies should be offset (typically 80-100%) against the fund-level management fee to avoid double-charging. The offset percentage and mechanics must be clearly documented.' },
      { name: 'Term and Termination', description: 'Co-terminous with the sponsor\'s ownership of the portfolio company. Termination on exit (IPO, trade sale, secondary) — often with an accelerated payment of remaining fees on exit. Termination for cause on material breach.' },
      { name: 'Accelerated Fee on Exit', description: 'On exit, sponsor receives a lump sum payment equal to the present value of the remaining management fee for the unexpired term — can be 2-5 years of fees capitalised. Controversial provision that reduces exit proceeds available to the fund.' },
      { name: 'Non-Compete', description: 'Sponsor\'s obligation not to provide the same services to competing portfolio companies (or, conversely, carve-outs allowing the sponsor to serve multiple non-competing portfolio companies).' },
      { name: 'Reporting Obligations', description: 'Periodic reports from the portfolio company to the sponsor — financial statements, KPIs, material events, budget variances. Scope and frequency of sponsor reporting to the portfolio company board.' },
      { name: 'Liability Standard', description: 'Sponsor\'s standard of care — typically no liability except for gross negligence, wilful misconduct, or fraud. Indemnification by the portfolio company for the sponsor\'s good faith actions.' },
      { name: 'Indemnification', description: 'Portfolio company indemnifies the sponsor for liabilities arising from the provision of services (except sponsor\'s own gross negligence/fraud). Scope, cap, and survival provisions.' },
    ],
    redFlags: [
      'No fund management fee offset — LPs are effectively paying twice for the same services (at fund level and portfolio company level)',
      'Accelerated fee on exit equal to the full remaining term — reduces exit proceeds significantly and creates misaligned incentives (sponsor profits from exit through fees, not just carry)',
      'Vague scope of services — unclear what the sponsor actually provides in exchange for the monitoring fee',
      'No termination on exit — management fee continues post-exit when the sponsor no longer has an ownership interest',
      'Liability standard is too broad — sponsor has no accountability for poor advice that damages the portfolio company',
      'No portfolio company board oversight — fee arrangement not approved by independent directors',
    ],
    negotiationTips: [
      'ILPA best practices require 100% offset of monitoring fees against the fund management fee — LPs should insist on full offset',
      'Accelerated fee on exit is contentious — LPs and co-investors should push to eliminate or cap the accelerated payment, as it reduces exit proceeds',
      'Independent portfolio company directors should approve the MSA — the sponsor is conflicted in negotiating a fee it pays to itself',
      'Scope of services should be specific and measurable — avoid generic "advisory services" language that justifies any fee without accountability',
      'Termination should be automatic on exit — no accelerated fee, or at most a discounted present value of fees for a limited remaining period',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // EMPLOYMENT / TEAM
  // ═══════════════════════════════════════════════════════════

  EMPLOYMENT_AGREEMENT: {
    id: 'employment_agreement',
    name: 'Employment Agreement',
    shortName: 'Employment Agmt',
    aliases: ['employment agreement', 'employment contract', 'service agreement', 'executive employment agreement', 'key person employment', 'director service agreement'],
    purpose: 'Governs the employment relationship with key personnel in a fund management context — portfolio managers, CIOs, COOs, and other key persons whose departure may trigger key man provisions in the fund\'s LPA. Covers compensation, equity/carry participation, restrictive covenants, and the intersection with fund governance.',
    keyClauses: [
      { name: 'Role and Duties', description: 'Job title, reporting line, principal duties, time commitment (full-time vs. part-time), permitted outside activities, and regulatory responsibilities (SMF/CF designations under FCA Senior Managers Regime, or NFA/SEC equivalent).' },
      { name: 'Compensation', description: 'Base salary, discretionary annual bonus (and any guaranteed minimum), deferred compensation, carried interest/profit participation (cross-reference to carry plan), signing bonus, and retention payments.' },
      { name: 'Equity and Carry Participation', description: 'Entitlement to carried interest under the carry plan, co-investment rights, management company equity, and the vesting schedule. Cross-reference to the GP operating agreement and carry plan for detailed mechanics.' },
      { name: 'Notice Period', description: 'Period of notice required to terminate — typically 3-12 months for senior fund professionals. Must be sufficient to allow the fund to find a replacement and potentially avoid triggering key man provisions.' },
      { name: 'Garden Leave', description: 'Right to require the employee to remain at home during the notice period — still employed and paid but not performing duties. Allows the fund to protect relationships and confidential information during the transition.' },
      { name: 'Restrictive Covenants', description: 'Post-termination restrictions — non-compete (cannot join competing fund managers), non-solicit (cannot solicit the fund\'s investors or team members), non-deal (cannot transact with the fund\'s portfolio companies). Duration, geographic scope, and enforceability.' },
      { name: 'IP Assignment', description: 'All intellectual property created during employment belongs to the employer — investment strategies, research, models, software, and proprietary methodologies. Moral rights waiver where applicable.' },
      { name: 'Confidentiality', description: 'Lifetime obligation not to disclose confidential information — fund performance, investor identities, investment pipeline, portfolio company information, and proprietary trading strategies.' },
      { name: 'Termination', description: 'For cause termination (fraud, gross misconduct, regulatory disqualification, criminal conviction); without cause (notice period); good leaver/bad leaver consequences for carry and equity vesting.' },
      { name: 'Good Leaver/Bad Leaver', description: 'Good leaver (death, disability, redundancy, constructive dismissal): retains vested carry and equity; receives payment in lieu of notice. Bad leaver (gross misconduct, competing activity, material breach): forfeits all or most unvested and potentially vested carry.' },
      { name: 'Regulatory Obligations', description: 'Employee\'s obligations under applicable regulatory regime — FCA approved person status, SEC registration, FINRA compliance, personal account dealing restrictions, regulatory reference requirements on departure.' },
    ],
    redFlags: [
      'No restrictive covenants — key person can immediately join a competitor and solicit investors/team members',
      'Notice period shorter than the key man cure period in the LPA — fund cannot replace the key person before triggering key man suspension',
      'No garden leave provision — employee works out notice while actively transitioning relationships to a competitor',
      'Carry vesting not linked to employment — employee can resign and retain all carry without any continued service obligation',
      'Bad leaver definition too narrow — only covers criminal conviction or fraud; resignation to join a competitor is not caught',
      'No IP assignment — employee may claim ownership of investment strategies and models developed during employment',
      'Missing regulatory compliance obligations — employee departure triggers regulatory notification requirements that must be managed',
    ],
    negotiationTips: [
      'Notice period should align with the key man cure period in the LPA — if the LPA gives 180 days to find a replacement, the employment agreement should require at least 6 months notice',
      'Restrictive covenants: enforceability varies dramatically by jurisdiction — 6 months is typical in the UK; up to 12 months may be enforceable; some US states (California) prohibit non-competes entirely',
      'Garden leave plus non-compete should not exceed the maximum enforceable restriction period — they typically run concurrently, not consecutively',
      'Good/bad leaver categories should be exhaustive and precisely defined — grey areas (resignation for undisclosed personal reasons) should be addressed explicitly',
      'Carry vesting should be cross-referenced with (and consistent with) the carry plan and GP operating agreement — inconsistencies create disputes on departure',
      'Regulatory references: under FCA rules, the employer must provide a regulatory reference on departure — factor this into any settlement or separation discussions',
    ]
  },

  IP_ASSIGNMENT_AGREEMENT: {
    id: 'ip_assignment_agreement',
    name: 'IP Assignment Agreement',
    shortName: 'IP Assignment',
    aliases: ['IP assignment', 'intellectual property assignment', 'IP transfer agreement', 'technology transfer agreement', 'assignment of IP rights', 'deed of assignment of IP'],
    purpose: 'Transfers ownership of intellectual property rights from one party (typically a founder, employee, or contractor) to another (typically the company or fund entity) — ensures the company has clean title to all IP used in its business, including pre-existing IP contributed by founders and IP developed during employment.',
    keyClauses: [
      { name: 'Assigned IP', description: 'Comprehensive description of all IP being assigned — patents (including applications), trademarks, copyrights, design rights, trade secrets, know-how, domain names, source code, algorithms, and any other proprietary technology. Schedules listing specific registrations.' },
      { name: 'Scope of Assignment', description: 'Assignment of existing IP (pre-existing IP contributed by the assignor) and future IP (all IP created during the relationship). Worldwide, perpetual, irrevocable assignment of all right, title, and interest.' },
      { name: 'Consideration', description: 'Consideration for the assignment — nominal (if part of employment), equity, cash payment, or acknowledgement that consideration is included in the employment compensation. Must be adequate for the assignment to be enforceable.' },
      { name: 'Representations', description: 'Assignor represents: sole and unencumbered owner of the assigned IP, no prior assignments or licences, no infringement of third-party rights, no pending disputes or claims, right to assign.' },
      { name: 'No Encumbrances', description: 'IP is transferred free and clear of all liens, charges, security interests, licences, and other encumbrances. If any licences exist, they must be disclosed and the assignee accepts the assignment subject to those licences.' },
      { name: 'Moral Rights Waiver', description: 'Assignor waives all moral rights (right of attribution, right of integrity) in the assigned works to the fullest extent permitted by law — required in jurisdictions where moral rights cannot be assigned (UK, EU, civil law countries).' },
      { name: 'Further Assurance', description: 'Assignor undertakes to execute all further documents and take all actions necessary to perfect the assignment — including filing assignments with patent and trademark offices, executing specific assignment forms, and cooperating with registration.' },
      { name: 'Licence-Back', description: 'If the assignor retains any rights (e.g., pre-existing personal IP not related to the business), a licence-back to the assignee ensures the company can continue to use all IP it has been using.' },
      { name: 'Warranty Against Infringement', description: 'Assignor warrants that the assigned IP does not infringe any third-party intellectual property rights. Indemnity for third-party IP infringement claims relating to the assigned IP.' },
    ],
    redFlags: [
      'Incomplete IP schedule — material IP assets omitted from the assignment, particularly pre-existing IP contributed by founders',
      'No representations on ownership — assignor may not have clean title; prior assignments, licences, or encumbrances may exist',
      'Missing moral rights waiver — in many jurisdictions, moral rights persist even after assignment and can restrict the company\'s use of the works',
      'No further assurance obligation — without this, patent and trademark office filings may not be completed, leaving the assignment imperfect',
      'Prior employer IP claims — founder/employee may have assigned the same IP to a prior employer under a previous employment agreement',
      'Open source contamination — IP includes components subject to open source licences (GPL, AGPL) that may impose copyleft obligations on the company\'s proprietary code',
    ],
    negotiationTips: [
      'Conduct an IP audit before executing the assignment — identify all material IP, trace the chain of title, and confirm no prior assignments or encumbrances exist',
      'Founder IP: ensure all pre-existing IP that the founders contributed to the company is formally assigned — verbal contributions are insufficient',
      'Moral rights cannot be assigned in most jurisdictions but can be waived — include a comprehensive waiver to the fullest extent permitted by law',
      'For software companies: address open source licence compliance — identify all open source components, their licences, and ensure compliance with copyleft and attribution requirements',
    ]
  },

  RESTRICTIVE_COVENANT_AGREEMENT: {
    id: 'restrictive_covenant_agreement',
    name: 'Restrictive Covenant Agreement',
    shortName: 'Restrictive Covenants',
    aliases: ['restrictive covenant agreement', 'non-compete agreement', 'non-compete', 'non-solicitation agreement', 'non-solicit', 'restraint of trade agreement', 'restrictive covenants', 'post-termination restrictions'],
    purpose: 'Standalone agreement (or deed) imposing post-employment or post-transaction restrictions on an individual — non-compete, non-solicitation, non-dealing, and non-poaching obligations. Enforceability varies dramatically by jurisdiction and is subject to reasonableness tests.',
    keyClauses: [
      { name: 'Non-Compete', description: 'Prohibition on engaging in competing business activities — defined by business scope (same industry, same strategy), geographic area (specific countries, regions, or worldwide), and duration. Must be no wider than reasonably necessary to protect legitimate business interests.' },
      { name: 'Non-Solicitation of Clients', description: 'Prohibition on soliciting or approaching clients or investors of the former employer — limited to clients with whom the individual had material dealings during a defined look-back period (typically 12-24 months before departure).' },
      { name: 'Non-Dealing', description: 'Broader than non-solicitation — prohibition on dealing with (not just soliciting) the former employer\'s clients, even if the client approaches the individual. Harder to enforce but provides stronger protection.' },
      { name: 'Non-Poaching', description: 'Prohibition on recruiting or hiring employees of the former employer — limited to employees with whom the individual worked during a defined period. May also cover senior employees generally.' },
      { name: 'Garden Leave', description: 'Period during which the individual is employed but not required to work — reduces the effective duration of post-termination restrictions as the individual is already out of the market during garden leave.' },
      { name: 'Compensation for Restrictions', description: 'Some jurisdictions require the employer to pay compensation during the restriction period for the covenant to be enforceable — Germany (50%+ of last salary), France (33%+ of last salary), Italy (varies). No compensation required in England.' },
      { name: 'Duration Limits', description: 'Maximum enforceable duration varies by jurisdiction — Denmark (6 months), UK (typically 6-12 months, subject to reasonableness), Germany (24 months with compensation), US (varies by state, California prohibits non-competes entirely).' },
      { name: 'Enforceability and Severability', description: 'Blue pencil clause or reduction clause — if a covenant is too broad, the court may reduce it to enforceable scope rather than striking it entirely. Severability of individual covenants so that invalidity of one does not affect others.' },
      { name: 'Remedies', description: 'Injunctive relief (specific performance), damages, and account of profits. Acknowledgement that damages alone are inadequate for breach of restrictive covenants. Undertaking as to damages for interim injunctive relief.' },
      { name: 'Legitimate Business Interest', description: 'Identification of the legitimate business interests the covenants protect — trade secrets, confidential information, client relationships, staff stability. Required in most common law jurisdictions for the covenant to be enforceable.' },
    ],
    redFlags: [
      'Non-compete with no geographic limit — worldwide non-competes are rarely enforceable unless the business genuinely operates globally',
      'Duration exceeds jurisdiction maximum — covenants longer than the enforceable period are void (entirely in some jurisdictions, reduced to the maximum in others)',
      'No compensation where required by law — in Germany, France, and several other civil law jurisdictions, non-competes without compensation are unenforceable',
      'No legitimate business interest identified — covenant may fail the reasonableness test if it does not protect a specific, identifiable interest',
      'Overly broad business scope — prohibiting "any financial services activity" rather than "managing funds with the same strategy in the same geography"',
      'Non-compete applies to California-based employees — California Business and Professions Code §16600 renders non-competes void with limited exceptions',
    ],
    negotiationTips: [
      'Tailor restrictions to the specific jurisdiction — a covenant enforceable in London may be void in California, uncompensated in Germany, or too long in Denmark',
      'Layered restrictions work better than a single broad non-compete — combine a narrow non-compete with non-solicitation and non-dealing for comprehensive protection',
      'Include a blue pencil / reduction clause — gives the court the option to reduce rather than strike the covenant; maximises the chance of partial enforcement',
      'Garden leave counts toward the restriction period in most jurisdictions — 6 months garden leave + 6 months non-compete = 12 months total restriction',
      'For fund managers: the key legitimate interest is the investor relationships — non-solicitation of LPs is often more important and more enforceable than a broad non-compete',
      'Consider compensating the restriction voluntarily even where not legally required — strengthens enforceability and reduces the risk of challenge',
    ]
  },

  // ═══════════════════════════════════════════════════════════
  // REGULATORY / LICENSING
  // ═══════════════════════════════════════════════════════════

  REGULATORY_LICENCE_APPLICATION: {
    id: 'regulatory_licence_application',
    name: 'Regulatory Licence Application',
    shortName: 'Licence Application',
    aliases: ['regulatory licence application', 'AIFM licence', 'CMS licence', 'fund management licence', 'investment adviser registration', 'MAS licence application', 'FCA authorisation', 'SFC licence', 'regulatory authorisation', 'regulatory licence'],
    purpose: 'Application to a financial regulatory authority for authorisation to manage funds, provide investment advice, or conduct regulated activities — covers the applicant\'s organisational structure, programme of operations, key personnel (fit and proper assessment), capital requirements, risk management, and compliance frameworks. Jurisdiction-specific but follows common patterns derived from IOSCO principles.',
    keyClauses: [
      { name: 'Applicant Details', description: 'Legal entity details — name, jurisdiction of incorporation, registered office, ownership structure, group structure chart, ultimate beneficial owners, shareholders holding qualifying stakes (>10%).' },
      { name: 'Programme of Operations', description: 'Detailed description of proposed business activities — investment strategies, target AUM, target investors, distribution channels, delegation arrangements, and three-year business plan with financial projections.' },
      { name: 'Organisational Structure', description: 'Corporate governance framework — board composition, board committees, senior management structure, reporting lines, functional organisational chart, outsourcing/delegation arrangements.' },
      { name: 'Key Persons (Fit and Proper)', description: 'Biographical details, qualifications, experience, and regulatory history of all directors, senior managers, and compliance/risk officers. Fit and proper assessment — competence, reputation, financial soundness. Criminal record checks, regulatory sanctions checks.' },
      { name: 'Capital Requirements', description: 'Demonstration that the applicant meets minimum capital requirements — initial capital (AIFMD: EUR 125K base + 0.02% of AUM above EUR 250M, capped at EUR 10M), own funds, professional indemnity insurance as alternative.' },
      { name: 'Risk Management', description: 'Risk management framework — risk identification, measurement, monitoring, and mitigation. Separation of risk management from portfolio management (AIFMD functional independence). Stress testing, liquidity risk management, counterparty risk.' },
      { name: 'Delegation Arrangements', description: 'Details of any delegation of portfolio management, risk management, or other functions — delegate identity, regulatory status, oversight arrangements, liability retention (AIFMD: AIFM remains fully liable despite delegation).' },
      { name: 'Compliance Framework', description: 'Compliance function structure, compliance officer appointment, compliance monitoring programme, regulatory reporting calendar, personal account dealing policy, conflicts of interest policy.' },
      { name: 'AML Procedures', description: 'Anti-money laundering and counter-terrorism financing framework — CDD/EDD procedures, ongoing monitoring, suspicious transaction reporting, training programme, MLRO (Money Laundering Reporting Officer) appointment.' },
      { name: 'Business Continuity', description: 'Business continuity and disaster recovery plan — alternative site, data backup, communication protocols, recovery time objectives, testing schedule.' },
      { name: 'Valuation Policy', description: 'Framework for valuing fund assets — valuation methodology, independent valuation requirements, valuation frequency, valuation committee composition, procedures for hard-to-value assets.' },
      { name: 'Investor Complaints', description: 'Complaints handling procedures — receipt, investigation, escalation, resolution, regulatory reporting of complaints, and record retention.' },
    ],
    redFlags: [
      'Key persons fail fit and proper assessment — prior regulatory sanctions, criminal convictions, or financial insolvency disqualify individuals from holding senior positions',
      'Insufficient capital — applicant does not meet minimum capital requirements and has no credible plan to raise additional capital',
      'No functional independence between portfolio management and risk management — AIFMD requires structural separation',
      'Delegation to unregulated entities in non-equivalent jurisdictions — regulator may refuse to approve delegation arrangements that undermine investor protection',
      'Incomplete AML procedures — regulator will not authorise without a robust AML framework; this is a non-negotiable baseline requirement',
      'Business plan not credible — projected AUM and revenues unrealistic given the team size, track record, and market conditions',
    ],
    negotiationTips: [
      'Engage the regulator early — pre-application meetings (available at FCA, MAS, SFC, and most regulators) significantly improve the likelihood and speed of approval',
      'Fit and proper: disclose everything proactively — regulators value transparency; undisclosed issues discovered during the vetting process are treated as integrity failures',
      'Capital requirements: model the capital requirement dynamically based on projected AUM growth — ensure the business plan includes adequate capital buffers',
      'Delegation: AIFMD allows delegation of portfolio management but the AIFM must not become a "letterbox entity" — retain genuine oversight and decision-making authority',
      'Timeline: expect 3-6 months for straightforward applications (MAS, DIFC); 6-12 months for complex applications (FCA full authorisation, SEC registration); plan accordingly',
    ]
  },

  FUND_MARKETING_NOTIFICATION: {
    id: 'fund_marketing_notification',
    name: 'Fund Marketing Notification',
    shortName: 'Marketing Notification',
    aliases: ['fund marketing notification', 'AIFMD passport', 'AIFMD notification', 'NPPR notification', 'national private placement regime', 'marketing passport', 'cross-border marketing notification', 'reverse solicitation'],
    purpose: 'Regulatory notification filed with host state authorities to market a fund cross-border — under the AIFMD, this is either a passport notification (EU AIFM marketing EU AIF to professional investors in another EU member state) or an NPPR notification (non-EU AIFM or non-EU AIF using the national private placement regime). Equivalent notifications exist in other jurisdictions.',
    keyClauses: [
      { name: 'Management Company Details', description: 'Identity of the AIFM or fund manager — name, registered office, regulatory status, home state authorisation reference, LEI (Legal Entity Identifier), contact details for regulatory correspondence.' },
      { name: 'Fund Details', description: 'Identity of the fund being marketed — name, domicile, legal form (limited partnership, corporate, unit trust), ISIN/LEI, investment strategy summary, fund size, and current NAV.' },
      { name: 'Host State', description: 'EU member state(s) in which the fund will be marketed — each member state requires a separate notification or a single notification covering multiple states (depending on the regime).' },
      { name: 'Target Investors', description: 'Category of investors targeted — professional investors only (AIFMD marketing passport), or broader categories under certain member state NPPR regimes. Retail distribution may require a separate UCITS-equivalent regime.' },
      { name: 'Offering Document', description: 'Copy of the fund\'s offering document (PPM) — must comply with AIFMD Article 23 disclosure requirements, including strategy, risks, fees, delegation, leverage, liquidity management, and valuation procedures.' },
      { name: 'Depositary Confirmation', description: 'Confirmation that a depositary has been appointed for the fund in compliance with AIFMD Article 21 — depositary identity, domicile, and regulatory status. Depositary lite regime for non-EU AIFs marketed under NPPR.' },
      { name: 'Regulatory Status', description: 'Confirmation of the AIFM\'s regulatory status — full AIFM authorisation (passport eligible) or sub-threshold/registered AIFM (may not be passport eligible). Third-country AIFM status for NPPR.' },
      { name: 'Fee Payment', description: 'Payment of the applicable notification fee to the home state regulator (passport) or host state regulator (NPPR) — fees vary by jurisdiction (typically EUR 500-5,000 per notification).' },
      { name: 'AIFMD Annex IV Reporting', description: 'Confirmation that the AIFM will file AIFMD Annex IV periodic reports with the home state regulator — semi-annual or quarterly depending on AUM threshold. Reports cover leverage, liquidity, risk profile, and instrument exposure.' },
      { name: 'Investor Facilities', description: 'Some member states require the AIFM to establish local facilities for investors in the host state — paying agent, information agent, complaints handling. Requirements vary and are evolving under the AIFMD cross-border distribution directive.' },
    ],
    redFlags: [
      'Marketing without notification — marketing a fund in an EU member state without completing the passport or NPPR notification is a regulatory offence; may result in fines and prohibition on future marketing',
      'Incorrect notification regime — using the passport when the fund or AIFM is non-EU (passport is EU-only); or filing NPPR when the AIFM is a full-scope EU AIFM (must use passport)',
      'Offering document does not comply with AIFMD Article 23 — home state regulator will not process the notification if disclosure requirements are not met',
      'No depositary appointed — AIFMD requires a depositary for all AIFs marketed in the EU; absence blocks the notification entirely',
      'Annex IV reporting not in place — AIFM must commit to ongoing regulatory reporting as a condition of marketing; failure to report may result in withdrawal of marketing rights',
      'Reverse solicitation misuse — claiming "reverse solicitation" (investor approached the manager unprompted) to avoid notification is heavily scrutinised by regulators and difficult to evidence',
    ],
    negotiationTips: [
      'Start the notification process 2-4 weeks before planned marketing activity — passport processing time is typically 20 business days (home state to host state); NPPR varies by member state',
      'NPPR regimes vary significantly — some member states (Germany, France) have detailed requirements; others (Luxembourg, Ireland) are more streamlined; some (Italy, Spain) are restrictive',
      'Reverse solicitation is not a marketing strategy — it is an exemption for genuine investor-initiated contact; regulators (especially ESMA) are increasingly challenging its use as a marketing workaround',
      'Pre-marketing regime (AIFMD cross-border distribution directive): allows testing investor interest before formal notification — subject to specific conditions and a 18-month prohibition on the same investors if the fund is subsequently notified',
      'Keep detailed records of all marketing activities — dates, investor names, materials shared, meetings held; regulators may request evidence that marketing occurred only after notification was completed',
    ]
  }

};

/**
 * Get document type by ID.
 */
function getDocument(id) {
  const key = Object.keys(DOCUMENTS).find(
    k => DOCUMENTS[k].id === id.toLowerCase().replace(/[\s-]/g, '_')
      || (DOCUMENTS[k].aliases || []).some(a => a.toLowerCase().includes(id.toLowerCase()))
  );
  return key ? DOCUMENTS[key] : null;
}

/**
 * Get all document types.
 */
function getAllDocuments() {
  return Object.values(DOCUMENTS);
}

/**
 * Detect document type from free text.
 */
function detectDocumentType(text) {
  const lower = text.toLowerCase();

  // Helper: for short terms (<=4 chars), use word boundary matching to avoid false positives
  // e.g. "nda" should not match inside "secondary"
  function matches(haystack, needle) {
    if (needle.length <= 4) {
      const re = new RegExp('\\b' + needle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
      return re.test(haystack);
    }
    return haystack.includes(needle);
  }

  // First pass: try exact name/alias matches (most specific)
  for (const doc of Object.values(DOCUMENTS)) {
    if (lower.includes(doc.name.toLowerCase()) ||
        (doc.aliases || []).some(a => a.length > 4 && lower.includes(a.toLowerCase()))) {
      return doc;
    }
  }

  // Second pass: try ID and shortName with word boundary for short terms
  for (const doc of Object.values(DOCUMENTS)) {
    if (matches(lower, doc.id.replace(/_/g, '-')) ||
        matches(lower, doc.id.replace(/_/g, ' ')) ||
        matches(lower, doc.shortName.toLowerCase()) ||
        (doc.aliases || []).some(a => a.length <= 4 && matches(lower, a.toLowerCase()))) {
      return doc;
    }
  }

  return null;
}

/**
 * Build a document context prompt block for AI injection.
 */
function buildDocumentPrompt(docId) {
  const doc = getDocument(docId);
  if (!doc) return '';

  const clauseList = (doc.keyClauses || doc.commonProvisions || [])
    .map(c => `  • ${c.name}: ${c.description}`)
    .join('\n');

  const redFlagList = (doc.redFlags || []).map(r => `  ⚠️ ${r}`).join('\n');
  const tipList = (doc.negotiationTips || []).map(t => `  → ${t}`).join('\n');

  return `
[DOCUMENT TYPE: ${doc.name} (${doc.shortName})]
Purpose: ${doc.purpose}
Key Clauses:
${clauseList}
Red Flags to Watch:
${redFlagList}
Negotiation Tips:
${tipList}
  `.trim();
}

module.exports = {
  DOCUMENTS,
  getDocument,
  getAllDocuments,
  detectDocumentType,
  buildDocumentPrompt
};
