/**
 * GAIO — Deep Legal Knowledge Base
 *
 * Institutional-grade fund law knowledge covering:
 * - ILPA Principles 3.0 standard positions
 * - Market standard terms for LPAs, side letters, SPAs
 * - Regulatory frameworks (AIFMD, ERISA, Securities Act, MAS, SFC)
 * - Case law principles and leading precedents
 * - Cross-jurisdictional comparison tables
 * - Standard negotiation positions by investor type
 * - Waterfall mechanics, carried interest structures
 * - GP/LP relationship governance standards
 */

'use strict';

// ── ILPA PRINCIPLES 3.0 (2019) ──────────────────────────────────────────────
const ILPA_PRINCIPLES = {
  source: 'ILPA Principles 3.0 (2019)',
  alignment: {
    gpCommitment: 'GP commitment: minimum 1-2% of total fund commitments. ILPA recommends 2%+. Cash contribution preferred over management fee waiver.',
    catchUp: 'Catch-up: 100% catch-up to GP until carried interest = 20% of total profits above hurdle. Soft hurdle (100% catch-up) vs hard hurdle (no catch-up).',
    carriedInterest: 'Standard carry: 20% of profits. Super-carry: 25-30% negotiated by top-tier managers. Carry recipient: GP entity, not individuals.',
    clawback: 'Clawback: GP returns excess carry if LP capital + preferred return not met on whole-fund basis. ILPA: clawback should cover tax paid by carry recipients.',
    escrow: 'Carry escrow: ILPA recommends 30-50% of carry distributions held in escrow until fund is substantially wound down. Cash or LC.',
  },
  fees: {
    managementFee: 'Investment period: 1.5-2% on committed capital. Post-investment period: 1.5-2% on invested/remaining cost. Fee step-down standard.',
    feeOffset: 'ILPA standard: 100% offset of transaction, monitoring, director, advisory fees against management fee. Sub-100% offset (e.g. 80%) is LP-adverse.',
    organizationCosts: 'Fund formation costs: ILPA cap €500k-€1M. Placement agent fees: capped and fully disclosed.',
    operatingCosts: 'Legitimate fund costs: audit, legal, compliance, D&O insurance, LP advisory committee costs.',
    portCosts: 'Portfolio company costs: management fees, transaction fees, monitoring fees — must be offset 100% under ILPA.',
  },
  governance: {
    lpac: 'LPAC composition: 5-8 LP representatives, major LPs. Powers: conflict approvals, valuation oversight, amendment consent.',
    reporting: 'ILPA reporting template: quarterly + annual. Audited financials within 90-120 days of year end. Capital account statements.',
    transparency: 'Fee transparency: itemised fee reporting. ILPA fee reporting template. Full disclosure of all income streams.',
    conflicts: 'Conflict policy: written policy required. LPAC approval for all GP conflicts. Side-by-side investing rules.',
    amendments: 'Amendment thresholds: routine = majority LP consent. Material = 66-75% LP consent. Without consent: none for economic terms.',
  },
  fund: {
    investmentPeriod: 'Investment period: 4-6 years from first close. Extensions: 1+1 year with LPAC/LP consent.',
    fundTerm: 'Fund term: 8-12 years. Extensions: 2 x 1-year with LP consent.',
    keyMan: 'Key man: suspension of investment period if key person(s) spend less than 50% of business time on fund. Resume on LP consent or replacement.',
    removal: 'No-fault removal: 75-80% LP consent (by commitment). For-cause: 50.1-66% LP consent. Cause: fraud, gross negligence, wilful misconduct, material breach.',
    transferRestrictions: 'GP transfer: LP consent required. No transfer to competitor without LP consent. LP transfer: GP consent required, not to be unreasonably withheld.',
  }
};

// ── MARKET STANDARD TERMS TABLE ──────────────────────────────────────────────
const MARKET_STANDARDS = {

  LPA: {
    managementFee: {
      standard: '1.5-2.0% on committed capital (investment period), stepping to 1.5% on invested/cost basis (post-investment period)',
      lpFriendly: '1.5% throughout; step-down at 50% invested or end of investment period',
      gpFriendly: '2% throughout fund life on committed capital; no step-down',
      redLine: 'Never 2%+ on committed capital for full term without step-down'
    },
    carriedInterest: {
      standard: '20% above 8% preferred return (IRR hurdle)',
      lpFriendly: 'Whole-fund carry; European waterfall; 100% catch-up',
      gpFriendly: 'Deal-by-deal carry; American waterfall',
      redLine: 'Deal-by-deal without clawback escrow is LP-adverse'
    },
    preferredReturn: {
      standard: '8% compounded annually (US standard); 6-8% in European funds',
      lpFriendly: 'Hard hurdle (no catch-up); compounded from drawdown date',
      gpFriendly: 'Soft hurdle with 100% catch-up',
      note: 'Hard hurdle means LP receives 100% of profits until IRR = hurdle, THEN GP receives catch-up'
    },
    clawback: {
      standard: 'Whole-fund clawback; includes interest/taxes in some structures',
      lpFriendly: 'Full clawback with escrow + interest; GP personal guarantee',
      gpFriendly: 'Net-of-tax clawback; no escrow; 3-year lookback only',
      redLine: 'No clawback at all — unacceptable'
    },
    gpCommitment: {
      standard: '1-2% of total fund commitments',
      lpFriendly: '2%+ in cash; no management fee waiver',
      gpFriendly: '1% or less; management fee waiver acceptable',
      note: 'First-time funds often 1%; established managers 2%'
    },
    fundTerm: {
      standard: '10 years + 2 x 1-year extensions (LP/LPAC consent)',
      lpFriendly: 'No extension without 66%+ LP consent; no additional fees during extension',
      gpFriendly: 'GP discretion on extensions',
    },
    keyMan: {
      standard: '2-3 key persons named; suspension if <50% time; 12-18 months to cure',
      lpFriendly: 'Include founders/CIO; broad definition of "business time"',
      gpFriendly: 'Narrow definition; long cure period',
    }
  },

  NDA: {
    confidentialityPeriod: {
      standard: '2-3 years for general commercial; 5 years for sensitive technical',
      lpFriendly: '5 years minimum; trade secrets perpetual',
      gpFriendly: '1-2 years',
      note: 'Post-termination obligations should be explicitly stated'
    },
    permittedPurpose: {
      standard: 'Strictly limited to named transaction/purpose',
      redLine: 'Broad "legitimate business purposes" — too vague; resist'
    },
    residuals: {
      standard: 'No residuals clause',
      redLine: 'Broad residuals clause (retained in unaided memory) — significant risk; severely limits NDA protection'
    }
  },

  SPA: {
    warrantyCap: {
      standard: '100% of purchase price for fundamental warranties; 15-25% for general',
      lpFriendly: 'Higher caps; longer limitation periods',
      gpFriendly: 'Lower caps; shorter limitation periods',
      note: 'W&I insurance increasingly used — shifts economic cap to insurer'
    },
    warrantyPeriod: {
      standard: 'Fundamental: 7-10 years. General: 2-3 years. Tax: 7 years.',
      note: 'Limitation periods run from completion date'
    },
    basket: {
      standard: 'De minimis: 0.1% of purchase price per claim. Basket: 0.5-1% of price.',
      note: 'Tipping basket (entire amount recoverable) vs. excess basket (amount above only)'
    },
    mac: {
      standard: 'Material Adverse Change — heavily negotiated; extensive carve-outs standard',
      carveOuts: ['General economic conditions', 'Industry-wide changes', 'Acts of God/pandemic', 'Changes in law', 'Changes in accounting standards'],
      redLine: 'No MAC carve-outs at all — buyer-favourable but seller should resist'
    },
    lockedBox: {
      standard: 'Locked box date: 3-6 months before signing; no leakage post-locked box',
      permittedLeakage: ['Dividends declared before locked box', 'Director fees at normal rates', 'Transactions at arm\'s length'],
      note: 'Locked box gives seller certainty; completion accounts give buyer more protection'
    }
  },

  SIDE_LETTER: {
    mfn: {
      standard: 'MFN election window: 30-60 days after relevant closing',
      scope: 'All LPs at same or smaller commitment size',
      carveOuts: ['Strategic investors with specific services', 'Regulatory-driven provisions', 'Seed investors who took risk'],
      redLine: 'MFN with so many carve-outs it is meaningless'
    },
    expenseCap: {
      standard: '0.10-0.25% of NAV or committed capital per annum',
      scope: 'All fund-level operating expenses; broken deal costs often excluded',
      lpFriendly: 'Include broken deal costs; apply from first drawdown',
      note: 'Cap should specify whether it includes or excludes management fee'
    },
    coInvestment: {
      standard: 'Right of first offer (ROFO) on pro-rata basis',
      lpFriendly: 'ROFO on all investments above threshold; no fee on co-invest',
      note: 'Distinguish ROFO (offer before others) from ROFR (right to match)'
    },
    transparency: {
      standard: 'Redacted summary of other side letter rights on request',
      lpFriendly: 'Full transparency on all side letter rights (anonymised)',
    }
  }
};

// ── REGULATORY FRAMEWORK ──────────────────────────────────────────────────────
const REGULATORY = {

  AIFMD: {
    name: 'EU Alternative Investment Fund Managers Directive (2011/61/EU)',
    scope: 'All AIFMs managing or marketing AIFs to EU investors',
    thresholds: {
      leveraged: '€100M AUM — full authorisation required',
      unleveraged: '€500M AUM — full authorisation required',
      below: 'Registration only (lighter regime)'
    },
    requirements: [
      'Authorisation in home member state',
      'Depositary appointment mandatory (EU depositary)',
      'Remuneration policy (variable pay, carried interest)',
      'Transparency: annual report, pre-investment disclosure to investors',
      'Leverage reporting to national regulator',
      'Notification for cross-border marketing (passport or NPPR)'
    ],
    marketing: {
      passport: 'EU-authorised AIFM can market to professional investors across EU via passport',
      nppr: 'Non-EU AIFM: National Private Placement Regime (NPPR) — varies by member state',
      reverseSolicitation: 'Reverse solicitation (investor initiative) — narrow exemption; increasingly scrutinised by ESMA'
    },
    remuneration: {
      principle: 'Performance-based variable remuneration must be deferred; subject to clawback',
      carriedInterest: 'Carry treated as variable remuneration — 40-60% deferral over 3-5 years under full AIFMD',
      note: 'Specific rules apply to AIFMs above authorisation threshold'
    }
  },

  SECURITIES_ACT: {
    name: 'US Securities Act 1933 / Securities Exchange Act 1934',
    privateExemptions: {
      regD: {
        rule506b: 'Up to 35 non-accredited investors + unlimited accredited; no general solicitation',
        rule506c: 'Unlimited accredited investors; general solicitation permitted; verification required',
        accreditedInvestor: '$1M net worth (ex-primary residence) or $200k/$300k income (individual/joint)',
      },
      regS: 'Offshore transactions — US persons excluded; no directed selling efforts into US',
      section4a2: 'Private placement exemption — transactions not involving any public offering'
    },
    investmentCompanyAct: {
      section3c1: 'Fewer than 100 beneficial owners; no public offering',
      section3c7: 'Qualified purchasers only ($5M+ investments for individuals); unlimited investors',
      qualifiedPurchaser: '$5M+ investments for individuals; $25M+ for institutions'
    },
    investmentAdvisersAct: {
      exemptions: ['Foreign Private Adviser', 'Venture Capital Adviser', 'Private Fund Adviser (<$150M US AUM)'],
      registered: 'SEC registration required above $110M AUM (state below)'
    }
  },

  ERISA: {
    name: 'US Employee Retirement Income Security Act 1974',
    planAssets: 'If 25%+ of any class of equity interests held by benefit plan investors — fund assets become "plan assets"',
    consequences: [
      'GP becomes ERISA fiduciary — prohibited transaction rules apply',
      'Investments restricted — conflicts require exemption',
      'QPAM or INHAM exemption needed for investment discretion'
    ],
    protection: 'Operating company exception; venture capital operating company (VCOC); real estate operating company (REOC)',
    standardProvisions: [
      'Plan Asset Representation from each LP',
      '25% test monitoring obligation on GP',
      'UBTI (Unrelated Business Taxable Income) protections for US tax-exempt investors'
    ]
  },

  MAS_SINGAPORE: {
    name: 'Monetary Authority of Singapore — Securities and Futures Act (SFA)',
    licenses: {
      cmsLicense: 'Capital Markets Services licence for fund management',
      rfmc: 'Registered Fund Management Company — for AUM < SGD 250M',
      vcfm: 'Venture Capital Fund Manager — streamlined registration for VC funds'
    },
    exemptions: {
      section304: 'Exempt from prospectus requirement — offers to institutional investors',
      section305: 'Offers to accredited investors (net assets > SGD 2M or income > SGD 300k)',
    },
    vcc: {
      name: 'Variable Capital Company',
      features: ['Umbrella structure with sub-funds', 'Fund assets/liabilities ring-fenced', 'Tax transparent possible', 'Re-domiciliation into Singapore available'],
      regulator: 'Acra + MAS'
    }
  },

  SFC_HONG_KONG: {
    name: 'Securities and Futures Commission — Securities and Futures Ordinance (SFO)',
    licenses: {
      type9: 'Type 9 — Asset Management licence',
    },
    exemptions: {
      section103: 'Prospectus requirement exemption for professional investors',
      professionalInvestor: 'Portfolio > HKD 8M; institutions'
    },
    lpf: {
      name: 'Limited Partnership Fund Ordinance 2020',
      features: ['No restriction on number of LPs', 'Flexible governance', 'No mandatory auditor appointment', 'Fast registration with Companies Registry'],
    }
  }

};

// ── WATERFALL MECHANICS ───────────────────────────────────────────────────────
const WATERFALL = {

  european: {
    name: 'European Waterfall (Whole-Fund)',
    sequence: [
      '1. Return of all LP contributed capital (100%)',
      '2. Return of all LP management fees and expenses (100%)',
      '3. Preferred return to LPs at hurdle rate (e.g. 8% p.a. compounded)',
      '4. Catch-up to GP until GP has received 20% of total profits (if soft hurdle)',
      '5. Remaining profits split 80% LP / 20% GP (carried interest)',
    ],
    lpPerspective: 'LP-friendly — GP only receives carry after all LP capital and preferred return is returned across the whole fund',
    gpPerspective: 'Delayed carry receipt; cash flow disadvantage for GP',
    common: 'Standard in European and institutional LP relationships'
  },

  american: {
    name: 'American Waterfall (Deal-by-Deal)',
    sequence: [
      '1. Return of invested capital for that specific deal',
      '2. Return of deal-related expenses and fees',
      '3. Preferred return on invested capital for that deal',
      '4. Catch-up to GP',
      '5. Remaining profits 80/20',
    ],
    lpPerspective: 'GP-friendly — GP can receive carry on winning deals before losing deals crystallise',
    gpPerspective: 'Earlier carry receipt; better GP cash flow',
    risk: 'Without adequate clawback, LPs may overpay carry on early deals vs total fund performance',
    common: 'More common in US venture / smaller funds; requires robust clawback'
  },

  clawback: {
    mechanism: 'If GP has received more carry distributions than warranted by total fund performance, GP must return excess',
    calculation: 'Total carry received MINUS carry GP would have received if European waterfall applied',
    protection: [
      'Clawback escrow: 30-50% of carry distributions held back',
      'Personal guarantee from individual GP principals',
      'Net-of-tax clawback (GP only returns net of tax paid on carry)',
      'Gross clawback (GP returns full amount; LPs gross it up)'
    ],
    timeLimit: 'Typically survives for 2-3 years after fund wind-down'
  },

  preferredReturn: {
    hardHurdle: 'No catch-up — GP only participates in profits above hurdle. LP keeps 100% of return up to hurdle, then profits split 80/20. True 8% preferred return.',
    softHurdle: '100% catch-up — GP receives 100% of profits above hurdle until GP has received 20% of total profits above hurdle. Then 80/20. Most common.',
    calculation: 'IRR or money-multiple basis. IRR preferred (time value of money). Compounded from drawdown date.',
    rate: 'US buyout: 8%. European buyout: 6-8%. VC: often no hurdle or 3-5%.'
  }

};

// ── KEY CASE LAW & LEGAL PRINCIPLES ──────────────────────────────────────────
const LEGAL_PRINCIPLES = {

  english: [
    { principle: 'Investors Compensation Scheme v West Bromwich BS [1998]', area: 'Contract interpretation', note: 'Modern approach to contractual interpretation — words given natural meaning in context; matrix of fact admissible' },
    { principle: 'Arnold v Britton [2015]', area: 'Contract interpretation', note: 'Supreme Court: clear words of contract prevail; commercial common sense cannot override clear contractual language' },
    { principle: 'Marks & Spencer v BNP Paribas [2015]', area: 'Implied terms', note: 'High threshold for implying terms: necessary to give business efficacy or so obvious it goes without saying' },
    { principle: 'Cavendish Square v Makdessi [2015]', area: 'Penalty clauses', note: 'New test: clause is penalty only if out of all proportion to legitimate interest; commercial parties have wide latitude' },
    { principle: 'Rock Advertising v MWB Business Exchange [2018]', area: 'No oral modification', note: 'NOM clauses are enforceable; parties cannot orally vary a contract with a NOM clause' },
    { principle: 'Patel v Mirza [2016]', area: 'Illegality', note: 'Court balances policy factors; not all illegal contracts are unenforceable; range of factors considered' },
    { principle: 'Springwell Navigation v JP Morgan [2010]', area: 'Financial contracts', note: 'Sophisticated investors bound by contractual terms; representations clauses limiting liability effective' },
  ],

  delaware: [
    { principle: 'Business Judgment Rule', area: 'Fiduciary duty', note: 'Court defers to business decisions of directors absent fraud, bad faith or gross negligence; burden on plaintiff' },
    { principle: 'Entire Fairness Standard', area: 'Conflict transactions', note: 'Applies to self-dealing transactions by controlling shareholders/GPs; requires fair price and fair dealing' },
    { principle: 'Corwin v KKR Financial Holdings [2015]', area: 'M&A', note: 'Fully informed, uncoerced shareholder vote invokes business judgment review, not entire fairness' },
    { principle: 'Weinberger v UOP [1983]', area: 'Squeeze-out mergers', note: 'Entire fairness standard; injunctive relief or damages; minority shareholders must receive fair value' },
    { principle: 'DRULPA Section 17-1101', area: 'LP Agreements', note: 'LP Agreement may expand, restrict or eliminate any fiduciary duties; parties have maximum freedom to contract' },
    { principle: 'Gotham Partners v Hallwood Realty [2002]', area: 'LP fiduciary duties', note: 'GP owes fiduciary duties to LP unless modified by LP Agreement; modification must be express' },
  ],

  general_fund_law: [
    { principle: 'No-Action Letter — SEC (Lamp Technologies, 1997)', area: 'US marketing', note: 'Reverse solicitation: investor must make unsolicited approach; GP cannot facilitate or encourage' },
    { principle: 'ILPA Due Diligence Questionnaire', area: 'LP due diligence', note: 'Industry standard DDQ; covers track record attribution, team stability, conflicts, operational infrastructure' },
    { principle: 'AIFMD Article 23 — Pre-Investment Disclosure', area: 'AIFMD compliance', note: 'Mandatory disclosure before investment: strategy, leverage, risk management, fees, conflicts, prime broker' },
    { principle: 'FATF Recommendations — AML', area: 'AML/KYC', note: 'Source of wealth, source of funds, beneficial ownership; PEP screening; ongoing monitoring' },
    { principle: 'FATCA Section 1471-1474', area: 'US tax compliance', note: 'Withholding on US-source income to non-compliant FFIs; fund must identify US persons and report' },
    { principle: 'OECD Common Reporting Standard', area: 'Global tax transparency', note: 'Automatic exchange of financial account information; 100+ participating jurisdictions; annual reporting' },
  ]

};

// ── NEGOTIATION TACTICS BY INVESTOR TYPE ─────────────────────────────────────
const NEGOTIATION_BY_INVESTOR = {

  pension_fund: {
    name: 'Pension Fund / Sovereign Wealth Fund',
    typicalSize: '€25M-€200M+ commitment',
    leverage: 'High — anchor investors; long-term relationship value',
    standardAsk: [
      'Lower management fee (25-50bps reduction)',
      'Fee offsets 100% or better',
      'Quarterly reporting + ILPA fee template',
      'LPAC seat',
      'Co-investment ROFO',
      'ESG reporting requirements',
      'No-fault removal at lower threshold',
      'Expense cap',
      'ERISA/plan asset provisions (US pension)',
      'Government/FOIA exemptions (sovereign funds)',
    ],
    redLines: ['Must have LPAC representation', 'Cannot accept conflicts without LPAC approval', 'ESG policy required'],
  },

  family_office: {
    name: 'Family Office / HNWI',
    typicalSize: '€5M-€50M commitment',
    leverage: 'Medium — relationship-driven; flexible',
    standardAsk: [
      'Transparency on portfolio',
      'Co-investment access',
      'Flexible reporting format',
      'Sometimes tax-specific provisions (family trust structures)',
    ],
    note: 'Family offices often have more flexibility than institutions but less negotiating power'
  },

  fund_of_funds: {
    name: 'Fund of Funds',
    typicalSize: '€10M-€100M commitment',
    leverage: 'Medium-high — multiple relationships across managers',
    standardAsk: [
      'Full fee transparency (ILPA template)',
      'MFN with broad scope',
      'Portfolio reporting for downstream LP reporting',
      'Look-through for investor reporting',
      'Sub-limit on leverage',
    ],
    note: 'FoF LPs have their own LP obligations; need information to discharge them'
  },

  insurance_company: {
    name: 'Insurance Company',
    typicalSize: '€10M-€100M',
    leverage: 'Medium',
    standardAsk: [
      'Solvency II / SCR optimisation (lower risk charge)',
      'Asset eligibility under Solvency II Article 132',
      'Regular valuation reporting',
      'Matching adjustment eligibility (for annuity books)',
      'Capital relief structures',
    ],
    regulatory: 'Solvency II (EU); PRA/FCA (UK); NAIC (US) — all have specific requirements'
  }

};

// ── STANDARD CLAUSE LIBRARY ───────────────────────────────────────────────────
const CLAUSE_LIBRARY = {

  governingLaw: {
    english: `This Agreement and any dispute or claim (including non-contractual disputes or claims) arising out of or in connection with it or its subject matter or formation shall be governed by and construed in accordance with the law of England and Wales.`,

    delaware: `This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to conflicts of law principles thereof.`,

    singapore: `This Agreement shall be governed by and construed in accordance with the laws of the Republic of Singapore.`,

    hongKong: `This Agreement and any dispute or claim arising out of or in connection with it or its subject matter shall be governed by and construed in accordance with the laws of Hong Kong.`,
  },

  arbitration: {
    lcia: `Any dispute arising out of or in connection with this Agreement, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration under the LCIA Rules, which Rules are deemed to be incorporated by reference into this clause. The number of arbitrators shall be [one/three]. The seat, or legal place, of arbitration shall be London. The language to be used in the arbitral proceedings shall be English.`,

    siac: `Any dispute arising out of or in connection with this Agreement, including any question regarding its existence, validity or termination, shall be referred to and finally resolved by arbitration administered by the Singapore International Arbitration Centre ("SIAC") in accordance with the Arbitration Rules of the Singapore International Arbitration Centre ("SIAC Rules") for the time being in force, which rules are deemed to be incorporated by reference in this clause. The seat of the arbitration shall be Singapore. The Tribunal shall consist of [one/three] arbitrator(s). The language of the arbitration shall be English.`,

    icc: `All disputes arising out of or in connection with this Agreement shall be finally settled under the Rules of Arbitration of the International Chamber of Commerce by one or more arbitrators appointed in accordance with the said Rules. The seat of arbitration shall be [London/Paris/Singapore]. The language of the arbitration shall be English.`,
  },

  confidentialityCore: `Each party undertakes that it shall not at any time [during the term of this Agreement and for a period of [●] years after termination or expiry of this Agreement,] disclose to any person any confidential information concerning the business, affairs, customers, clients or suppliers of the other party or of any member of the group to which the other party belongs, except as permitted by [Clause ●].

Each party may disclose the other party's confidential information:
(a) to its employees, officers, representatives, contractors, subcontractors or advisers who need to know such information for the purposes of carrying out the party's obligations under this Agreement. Each party shall ensure that its employees, officers, representatives, contractors, subcontractors or advisers to whom it discloses the other party's confidential information comply with this Clause; and
(b) as may be required by law, a court of competent jurisdiction or any governmental or regulatory authority.

No party shall use any other party's confidential information for any purpose other than to perform its obligations under this Agreement.`,

  keyMan: `If at any time during the Investment Period, any [two (2)] of the Key Persons (i) ceases to devote substantially all of their working time (being not less than [●]% of their total business time) to the business of the Partnership, (ii) is no longer employed by or otherwise associated with the General Partner or any of its Affiliates, or (iii) dies or becomes Incapacitated, then the Investment Period shall be automatically suspended (the "Key Man Suspension") upon written notice of the same to the Limited Partners.

The Investment Period shall be reinstated upon the consent of [●]% in interest of the Limited Partners, which consent shall not be unreasonably withheld provided that the General Partner has within [●] months of the Key Man Suspension nominated a replacement acceptable to [●]% in interest of the Limited Partners.`,

  clawbackCore: `To the extent that the aggregate distributions made to the General Partner pursuant to [carried interest clause] exceed the amount that the General Partner would have been entitled to receive had the distributions been made in respect of all Portfolio Investments taken together rather than each Portfolio Investment individually, the General Partner shall be obliged to return to the Partnership (or directly to the Limited Partners pro rata to their Commitments) an amount equal to such excess (the "Clawback Amount"), net of any income taxes paid or payable by the General Partner (or the individual carry recipients) in respect of the amounts distributed to it.`,

  mfn: `If at any time prior to or following the Final Closing, the General Partner grants rights to any other Limited Partner (having the same or a smaller Capital Commitment than the relevant Limited Partner) that are more favourable in any respect than the rights granted to [LP Name] (each, a "More Favourable Right"), then the General Partner shall promptly notify [LP Name] of such More Favourable Rights and [LP Name] shall have the right, exercisable within [30] days of receipt of such notice, to elect to receive the benefit of any such More Favourable Rights.`,

  expenseCap: `Notwithstanding any other provision of this Agreement, the annual Partnership Expenses (excluding Management Fees and Carried Interest) allocable to [LP Name] shall not exceed [0.15]% of [LP Name]'s Capital Commitment per annum (the "Expense Cap"). To the extent that Partnership Expenses allocable to [LP Name] in any year exceed the Expense Cap, the General Partner shall bear such excess expenses.`,

};

// ── FUND STRUCTURE COMPARISON ─────────────────────────────────────────────────
const FUND_STRUCTURES = {

  englishLP: {
    jurisdiction: 'England & Wales',
    legislation: 'Limited Partnerships Act 1907 (traditional) / Limited Partnerships Act 2021 (reformed)',
    taxTransparent: true,
    gpLiability: 'Unlimited',
    lpLiability: 'Limited to commitment',
    formation: 'Registration with Companies House',
    pros: ['Widely understood by institutional LPs', 'English law governs', 'Strong legal framework', 'LP Act 2021 modernises the regime'],
    cons: ['GP has unlimited liability (use GP Ltd)', 'Traditional LP Act 1907 provisions can be restrictive'],
    typical: 'UK PE, VC, real assets funds'
  },

  delawareLP: {
    jurisdiction: 'Delaware, USA',
    legislation: 'Delaware Revised Uniform Limited Partnership Act (DRULPA)',
    taxTransparent: true,
    gpLiability: 'Unlimited (use GP LLC)',
    lpLiability: 'Limited to commitment',
    formation: 'Filing with Delaware Secretary of State',
    pros: ['Maximum contractual flexibility', 'Court of Chancery expertise', 'International recognition', 'GP can be LLC (limited liability)'],
    cons: ['SEC/ERISA regulatory overlay', 'US tax issues for non-US investors (FIRPTA, ECI)', 'Less LP protection than EU structures'],
    typical: 'US PE, VC, hedge funds'
  },

  singaporeVCC: {
    jurisdiction: 'Singapore',
    legislation: 'Variable Capital Companies Act 2018',
    taxTransparent: 'Sub-fund level',
    formation: 'ACRA registration + MAS approval for manager',
    pros: ['Ring-fenced sub-funds', 'Tax-efficient for funds management', 'No minimum paid-up capital', 'Re-domiciliation from Cayman possible', 'Growing recognition'],
    cons: ['Relatively new; less precedent', 'MAS licensing required for manager', 'Not all LP protections as developed as US/UK'],
    typical: 'Asia-focused PE, VC, hedge funds'
  },

  hongKongLPF: {
    jurisdiction: 'Hong Kong',
    legislation: 'Limited Partnership Fund Ordinance 2020',
    taxTransparent: true,
    formation: 'Registration with Companies Registry',
    pros: ['Modern legislation', 'No minimum capital', 'Fast registration', 'English law heritage', 'Gateway to China'],
    cons: ['Newer than Cayman; less market-tested', 'Manager must have SFC Type 9 or exemption'],
    typical: 'Greater China PE, VC funds'
  }

};

/**
 * Build a comprehensive deep legal context for AI injection.
 * Used in the system prompt to give Gaio institutional-grade knowledge.
 */
function buildDeepLegalContext(docType, jurisdictions = []) {
  const sections = [];

  // Always include ILPA principles for fund documents
  const fundDocs = ['lpa', 'side_letter', 'ppm', 'subscription_agreement'];
  if (!docType || fundDocs.includes(docType)) {
    sections.push(`
[ILPA PRINCIPLES 3.0 — INDUSTRY STANDARD]
Management Fee: ${ILPA_PRINCIPLES.fees.managementFee}
Fee Offset: ${ILPA_PRINCIPLES.fees.feeOffset}
Clawback: ${ILPA_PRINCIPLES.alignment.clawback}
Escrow: ${ILPA_PRINCIPLES.alignment.escrow}
GP Commitment: ${ILPA_PRINCIPLES.alignment.gpCommitment}
LPAC Powers: ${ILPA_PRINCIPLES.governance.lpac}
Amendment Thresholds: ${ILPA_PRINCIPLES.governance.amendments}
Key Man: ${ILPA_PRINCIPLES.fund.keyMan}
Removal Standards: ${ILPA_PRINCIPLES.fund.removal}
    `.trim());
  }

  // Waterfall mechanics for LPA
  if (!docType || docType === 'lpa' || docType === 'profit_split') {
    sections.push(`
[WATERFALL MECHANICS]
European (LP-friendly): ${WATERFALL.european.sequence.join(' → ')}
American (GP-friendly): ${WATERFALL.american.sequence.join(' → ')}
Hard Hurdle: ${WATERFALL.preferredReturn.hardHurdle}
Soft Hurdle: ${WATERFALL.preferredReturn.softHurdle}
Market Standard Hurdle: ${WATERFALL.preferredReturn.rate}
    `.trim());
  }

  // Market standards for the specific document
  if (docType && MARKET_STANDARDS[docType.toUpperCase()]) {
    const ms = MARKET_STANDARDS[docType.toUpperCase()];
    const lines = Object.entries(ms).map(([key, val]) =>
      `${key}: Standard: ${val.standard || ''}${val.lpFriendly ? ` | LP-friendly: ${val.lpFriendly}` : ''}${val.redLine ? ` | RED LINE: ${val.redLine}` : ''}`
    );
    sections.push(`[MARKET STANDARD TERMS — ${docType.toUpperCase()}]\n${lines.join('\n')}`);
  }

  // Regulatory frameworks
  const jurSet = new Set(jurisdictions.map(j => j.toLowerCase()));
  if (jurSet.has('delaware') || jurSet.has('english') || jurSet.size === 0) {
    sections.push(`
[REGULATORY — AIFMD (EU)]
Thresholds: Leveraged funds >€100M; Unleveraged >€500M require full AIFMD authorisation
Marketing: EU passport for authorised AIFMs; NPPR for non-EU managers; reverse solicitation narrow
Remuneration: Carry = variable remuneration; deferral and clawback requirements above threshold
    `.trim());

    sections.push(`
[REGULATORY — US SECURITIES LAWS]
Reg D Rule 506(b): Up to 35 non-accredited + unlimited accredited investors; no general solicitation
Reg D Rule 506(c): Unlimited accredited investors; general solicitation permitted; verification required
Investment Company Act: Section 3(c)(1) <100 investors; Section 3(c)(7) qualified purchasers only ($5M+)
ERISA 25% Rule: >25% of any equity class held by benefit plan investors → plan assets rules apply
    `.trim());
  }

  // Case law
  const caseLaw = jurSet.has('delaware') ? LEGAL_PRINCIPLES.delaware :
    jurSet.has('english') ? LEGAL_PRINCIPLES.english : [];
  if (caseLaw.length > 0) {
    const lines = caseLaw.slice(0, 4).map(c => `${c.principle} [${c.area}]: ${c.note}`);
    sections.push(`[KEY CASE LAW]\n${lines.join('\n')}`);
  }

  // Always include general fund law principles
  sections.push(`
[GENERAL FUND LAW PRINCIPLES]
${LEGAL_PRINCIPLES.general_fund_law.map(p => `${p.principle}: ${p.note}`).join('\n')}
  `.trim());

  return sections.join('\n\n');
}

const M_AND_A_MARKET_STANDARDS = {
  lockedBox: {
    description: 'Purchase price fixed at locked box date; no post-completion price adjustment',
    whenUsed: 'European M&A (dominant); seller-friendly; clean exit',
    keyRisks: 'Value leakage between locked box date and completion',
    leakageProtections: 'Permitted leakage (ordinary course) vs non-permitted; seller indemnifies non-permitted leakage',
    marketTrend: 'Now used in 60-70% of European private M&A deals'
  },
  completionAccounts: {
    description: 'Price adjusted post-completion based on actual balance sheet at completion date',
    whenUsed: 'US M&A (dominant); buyer-friendly; price certainty post-close',
    mechanics: 'Completion accounts prepared within 60-90 days; disputes to independent accountant',
    adjustments: 'Working capital, net debt, cash, capex — all adjustable',
  },
  wAndIInsurance: {
    description: 'Warranty and indemnity insurance — insurer assumes seller breach risk',
    coverage: 'Typically covers all seller warranties except known issues',
    exclusions: 'Forward-looking warranties, pension underfunding, transfer pricing, known issues',
    policyLimits: 'Typically 10-30% of enterprise value',
    retention: 'De minimis 0.1% EV; excess/retention 0.5-1% EV',
    pricing: '1-3% of policy limit (premium)',
    marketTrend: 'Used in 50%+ of European PE exits; increasingly standard'
  },
  macMaeClauses: {
    definition: 'Material adverse change/effect — allows buyer to walk if target suffers significant deterioration',
    standard: 'Measured against target specifically, not industry-wide; must be durationally significant',
    carveOuts: 'General economic conditions, industry-wide changes, changes in law, pandemic, acts of God — typically carved out',
    burdenOfProof: 'On buyer — extremely difficult to invoke successfully',
    keyCaseLaw: 'Akorn v Fresenius Kabi (Del. Ch. 2018) — first successful MAE invocation in Delaware',
    negotiation: 'Sellers push for maximum carve-outs; buyers push for narrow carve-outs and quantitative thresholds'
  },
  earnOut: {
    metrics: 'Revenue (simpler, harder to manipulate) or EBITDA (more common, subject to accounting disputes)',
    typicalPeriod: '1-3 years post-completion',
    operationalCovenants: 'Buyer must operate business in ordinary course during earn-out period; no asset stripping',
    disputes: 'Independent accountant for accounting disputes; arbitration for covenant breaches',
    acceleration: 'Earn-out typically accelerates at maximum on change of control',
    capFloor: 'Earn-out cap = maximum contingent consideration; floor = minimum guaranteed payment (rare)'
  },
  breakFees: {
    typicalRange: '1-3% of enterprise value',
    reverseFee: 'Buyer pays if regulatory approval fails or financing falls through',
    triggers: 'Board recommendation change, competing bid acceptance, shareholder vote failure',
    fiduciaryOut: 'Board can accept superior proposal subject to matching right and break fee payment'
  },
  escrow: {
    holdback: '10-15% of purchase price is market standard',
    term: '12-24 months (shorter trend post-W&I insurance)',
    release: 'Time-based release, claims deducted, balance returned to seller',
    escrowAgent: 'Major bank or specialised escrow agent; governed by separate escrow agreement'
  },
  dueDiligence: {
    scope: 'Financial, tax, legal, commercial, operational, IT, ESG, environmental, insurance',
    dataRoom: 'Virtual data room (Intralinks, Datasite, Ansarada); structured index; controlled access',
    relianceLetters: 'Third-party DD reports: buyer typically negotiates reliance letter from seller advisors',
    redFlagReport: 'Preliminary DD findings within 2-4 weeks; full report at signing'
  },
  nonCompeteInMA: {
    typicalScope: '2-3 years post-completion',
    geographic: 'Limited to territories where target operates',
    businessScope: 'Limited to business of the target, not all seller activities',
    consideration: 'Purchase price consideration; no separate payment usually required in M&A context'
  }
};

const DEBT_MARKET_STANDARDS = {
  lmaStandards: {
    description: 'Loan Market Association — the European standard for facility agreements',
    templates: 'LMA publishes model facility agreements (senior, leveraged, investment grade, real estate)',
    marketPosition: 'De facto standard in European lending; equivalent to LSTA in US',
    keyPrinciple: 'LMA documents are starting points, heavily negotiated in practice'
  },
  facilityTypes: {
    termLoan: 'Fixed amount drawn down in full; repaid on schedule (bullet, amortising, or balloon)',
    revolvingCredit: 'Committed amount available for draw, repay, redraw during availability period',
    bridge: 'Short-term facility (6-18 months) pending permanent financing or exit',
    subscriptionLine: 'Fund-level facility secured against LP uncalled commitments; used for capital call management',
    navFacility: 'Facility secured against fund NAV; used for liquidity, distributions, follow-on investments',
    capitalCallFacility: 'Secured against unfunded LP commitments; typical 90-day draw-to-call bridge',
    mezzanine: 'Subordinated debt with equity kicker (warrants or PIK); fills gap between senior debt and equity'
  },
  financialCovenants: {
    ltv: 'Loan-to-value: typically 50-65% for real estate; 40-60% for corporate lending',
    dscr: 'Debt service coverage ratio: typically 1.2-1.5x minimum',
    leverage: 'Net debt / EBITDA: typically 3-5x for leveraged buyouts; 1-3x for investment grade',
    interestCoverage: 'EBITDA / interest expense: typically 2-4x minimum',
    testing: 'Maintenance covenants (tested quarterly) vs incurrence covenants (tested only on new debt/distributions)'
  },
  securityPackage: {
    sharePledge: 'Pledge over shares of borrower/target; perfected by filing or possession',
    accountCharge: 'Charge over bank accounts (collection, reserve, distribution accounts)',
    assignmentReceivables: 'Assignment of insurance policies, intercompany loans, material contracts',
    floatingCharge: 'Charge over all assets not subject to fixed security (UK/English law concept)',
    perfection: 'Filing requirements vary by jurisdiction: Companies House (UK), UCC (US), RCS (Luxembourg)'
  },
  intercreditor: {
    seniorVsMezzanine: 'Senior lender controls enforcement; mezzanine standstill typically 90-180 days',
    paymentWaterfall: 'Operating costs → senior interest → senior principal → mezzanine interest → mezzanine principal → equity',
    standstill: 'Mezzanine lender cannot enforce during standstill period after senior default',
    releaseOnDisposal: 'Security automatically released on permitted disposal; proceeds applied per waterfall'
  },
  convertibleNotes: {
    discount: '15-25% discount to next qualified financing round price',
    valuationCap: 'Maximum pre-money valuation for conversion (protects investor upside)',
    qualifiedFinancing: 'Typically $1M+ equity round triggers automatic conversion',
    mfn: 'Most favored nation: if better terms given to later note holders, earlier holders can elect same terms',
    maturity: '18-24 months typical; conversion or repayment at maturity'
  },
  pricing: {
    referenceRates: 'SOFR (USD), EURIBOR (EUR), SONIA (GBP), STIBOR (SEK), NIBOR (NOK)',
    margins: 'Investment grade: 100-250bp; leveraged: 300-600bp; distressed: 600bp+',
    floors: 'Zero floor on reference rate standard post-negative-rate era',
    commitment: 'Commitment fee on undrawn amounts: typically 35-50% of applicable margin'
  },
  subordination: {
    payment: 'Payment subordination: junior creditor cannot receive payment while senior debt outstanding (or on default)',
    structural: 'Structural subordination: senior lender lends to operating company; junior lends to holding company',
    contractual: 'Contractual subordination: intercreditor agreement governs priority',
    turnover: 'If junior creditor receives payment in breach, must turn over to senior creditor'
  }
};

const EMPLOYMENT_STANDARDS = {
  nonCompeteByJurisdiction: {
    english: { maxDuration: '6-12 months', compensationRequired: false, test: 'Reasonable restraint of trade — must protect legitimate business interest', gardenLeave: true, keyCase: 'Tillman v Egon Zehnder [2019] UKSC 32' },
    delaware: { maxDuration: '12-24 months', compensationRequired: false, test: 'Reasonable in scope, geography, duration; supported by consideration', gardenLeave: true, keyCase: 'Blue pencil / reformation doctrine' },
    singapore: { maxDuration: '6-12 months', compensationRequired: false, test: 'Reasonable restraint of trade (English common law approach)', gardenLeave: true, keyCase: 'Man Financial v Wong Bark Chuan David [2008] SGCA 29' },
    hong_kong: { maxDuration: '6-12 months', compensationRequired: false, test: 'Reasonable restraint of trade (English common law approach)', gardenLeave: true },
    french: { maxDuration: '24 months', compensationRequired: true, test: 'Must pay financial compensation (min 33-50% of salary); must be limited in time, geography, activity', gardenLeave: true, keyStatute: 'Code du travail; jurisprudence constante Cour de cassation' },
    german: { maxDuration: '24 months', compensationRequired: true, test: 'Karenzentschädigung mandatory (min 50% of last salary); must protect legitimate interest', gardenLeave: true, keyStatute: 'HGB §§74-75d (Handelsgesetzbuch)' },
    italian: { maxDuration: '3 years (5 for executives)', compensationRequired: true, test: 'Proportionate compensation required; limited to specific activities/geography', gardenLeave: false, keyStatute: 'Codice Civile Art. 2125' },
    spanish: { maxDuration: '24 months', compensationRequired: true, test: 'Adequate financial compensation; limited scope', gardenLeave: false, keyStatute: 'Estatuto de los Trabajadores Art. 21' },
    swedish: { maxDuration: '18-24 months', compensationRequired: true, test: 'Compensation per collective agreements (typically 60% of salary during restriction)', gardenLeave: true, keyStatute: 'Lag om anställningsskydd (LAS); collective agreements' },
    danish: { maxDuration: '12 months', compensationRequired: true, test: '40% salary (non-compete only) or 60% salary (combined clause); combined clauses max 6 months', gardenLeave: true, keyStatute: 'Lov om ansættelsesklausuler (2015)' },
    norwegian: { maxDuration: '12 months', compensationRequired: true, test: 'Full salary compensation required for restriction period', gardenLeave: true, keyStatute: 'Arbeidsmiljøloven §14A' },
    finnish: { maxDuration: '12 months', compensationRequired: true, test: 'Compensation required for restrictions >6 months; reasonable scope', gardenLeave: true, keyStatute: 'Työsopimuslaki Ch.3 §5' },
    estonian: { maxDuration: '12 months', compensationRequired: true, test: 'Reasonable monthly compensation required; proportionate scope', gardenLeave: false, keyStatute: 'Töölepingu seadus §§23-24' },
    lithuanian: { maxDuration: '24 months', compensationRequired: true, test: 'Min 40% average salary; must be proportionate to legitimate interest', gardenLeave: false, keyStatute: 'Darbo kodeksas Art. 38' },
    cayman: { maxDuration: '12 months', compensationRequired: false, test: 'English common law reasonable restraint principles apply', gardenLeave: true },
    luxembourg: { maxDuration: '12 months', compensationRequired: false, test: 'Limited to competing activities; must be in writing; Code du travail Art. L.125-8', gardenLeave: true, keyStatute: 'Code du travail Art. L.125-8' },
    bvi: { maxDuration: '12 months', compensationRequired: false, test: 'English common law principles', gardenLeave: true },
    difc: { maxDuration: '12 months', compensationRequired: false, test: 'DIFC Employment Law No.4 of 2005; reasonable restraint', gardenLeave: true },
    adgm: { maxDuration: '12 months', compensationRequired: false, test: 'ADGM Employment Regulations 2019; reasonable restraint', gardenLeave: true },
    jersey: { maxDuration: '12 months', compensationRequired: false, test: 'English common law principles via Jersey customary law', gardenLeave: true },
    guernsey: { maxDuration: '12 months', compensationRequired: false, test: 'English common law principles via Guernsey customary law', gardenLeave: true },
    ireland: { maxDuration: '12 months', compensationRequired: false, test: 'Reasonable restraint of trade (English common law approach); Mulligan v Corr [1925]', gardenLeave: true },
    switzerland: { maxDuration: '36 months', compensationRequired: false, test: 'Swiss CO Art. 340-340c; narrowly construed; no compensation required but courts limit scope', gardenLeave: false, keyStatute: 'Swiss Code of Obligations Art. 340-340c' },
    netherlands: { maxDuration: 'No statutory max', compensationRequired: false, test: 'Must be in writing; courts may limit if unreasonable; reform may require compensation', gardenLeave: true, keyStatute: 'Burgerlijk Wetboek Art. 7:653' }
  },
  ipAssignment: {
    usWorkForHire: 'Copyright Act §101: work made for hire — employer owns automatically if within scope of employment',
    euEmployerOwnership: 'Most EU states: employer owns IP created in course of employment by statute; moral rights retained',
    founderAssignment: 'Pre-incorporation IP must be assigned by written agreement; consideration required in common law jurisdictions',
    moralRights: 'Cannot be assigned in most EU jurisdictions; can be waived (UK) or limited contractually'
  },
  keyPersonFund: {
    trigger: 'Key person spends less than substantially all business time (typically 50-75%) on fund matters',
    effect: 'Suspension of investment period — no new investments until cured or LP vote to reinstate',
    cure: '12-18 months to find replacement or LP vote to waive/reinstate',
    interaction: 'Employment agreement must align with key person provisions in LPA — notice periods, garden leave, non-compete all affect cure period'
  }
};

const BROKER_INTERMEDIARY_STANDARDS = {
  regulatoryRequirements: {
    us: 'SEC: broker-dealer registration under Exchange Act §15; investment adviser under Advisers Act; placement agent = broker-dealer or exempt; Finders Exemption Act (proposed)',
    uk: 'FCA: arranging deals in investments (Article 25 RAO); managing investments (Article 37 RAO); advising on investments (Article 53 RAO)',
    eu: 'MiFID II: investment services authorisation required; tied agent possible; cross-border passport available',
    singapore: 'MAS: Capital Markets Services licence (dealing in securities, fund management, advising on corporate finance)',
    hongKong: 'SFC: Type 1 (dealing), Type 4 (advising on securities), Type 9 (asset management)',
  },
  feeStructures: {
    placementAgent: 'Upfront: 1-2.5% of capital raised; trail: 0.25-0.5% p.a. for fund life; success-only increasingly common',
    findersFee: 'Success-only: 1-5% of transaction value (Lehman formula common for M&A); introduction fee for capital raising: 1-2%',
    mandateLetter: 'Retainer: $25k-$100k/month (credited against success fee); success: 1-3% of EV (M&A sell-side); Lehman/double Lehman for smaller deals',
    engagementLetter: 'Hourly rates: $300-$1,500/hr (law firm); fixed fee for defined scope; success fee hybrid common for PE fund formation'
  },
  tailPeriods: {
    standard: '12-24 months post-termination',
    definition: 'Agent entitled to fee if transaction completes with party introduced during engagement, even after termination',
    bestPractice: 'Defined list of introduced parties; tail period should not survive indefinitely; negotiate sunset',
    disputes: 'Most common dispute area in intermediary agreements — clear definition of "introduction" is critical'
  },
  placementAgentDisclosure: {
    sec: 'Rule 206(4)-5 (pay-to-play): political contribution restrictions; Form ADV Part 2A disclosure of placement agent use',
    ilpa: 'ILPA requires full disclosure: identity, fees, political contributions, conflicts; placement agent questionnaire',
    fcaUk: 'FCA COBS inducements rules; disclosure of fees and conflicts; suitability requirements'
  },
  antiBribery: {
    fcpa: 'US Foreign Corrupt Practices Act: prohibits payments to foreign officials; books and records requirements; DOJ/SEC enforcement',
    ukBriberyAct: 'UK Bribery Act 2010: corporate offence of failing to prevent bribery; adequate procedures defence; extraterritorial reach',
    euDirective: 'EU Anti-Corruption Directive (proposed); member state criminal law applies; varying enforcement',
    bestPractice: 'Due diligence on intermediaries; written compliance policies; red flag monitoring; fee benchmarking against market rates'
  },
  finderVsBrokerDealer: {
    distinction: 'Finder: introduces parties only, no negotiation or structuring; Broker-dealer: negotiates terms, structures transactions, handles funds',
    usRisk: 'Unregistered broker-dealer activity: SEC enforcement, rescission rights for investors, void transaction risk',
    safePractices: 'Finder should: limit activities to introduction; not negotiate terms; not handle funds; not give advice; not be compensated based on transaction outcome (controversial)',
    exemptions: 'Rule 3a4-1 (associated persons of issuer); Regulation D Rule 502(c) general solicitation ban limits finder role; state-level finder exemptions vary'
  }
};

const JV_STANDARDS = {
  deadlockResolution: {
    russianRoulette: 'Party A offers price; Party B must buy at that price or sell at that price. Forces fair pricing. Disadvantages smaller/less liquid party.',
    texasShootOut: 'Both parties submit sealed bids; highest bidder buys the other out. More balanced than Russian roulette.',
    expertDetermination: 'Independent expert determines the dispute. Binding. Faster and cheaper than arbitration. Limited grounds for challenge.',
    mediationEscalation: 'Mandatory mediation → arbitration → court. Staged dispute resolution. Preserves relationship.',
    castingVote: 'Chairman/independent director has casting vote on deadlocked matters. Simple but concentrates power.',
    dissolution: 'Ultimate deadlock: JV wound up, assets distributed. Nuclear option — rarely invoked but necessary backstop.'
  },
  governance: {
    fiftyFifty: 'Equal control: all decisions joint; high deadlock risk; requires robust deadlock mechanism; common in symmetric JVs',
    majorityControl: 'Majority partner controls board and day-to-day; minority has reserved matters/protective provisions; asymmetric JV',
    reservedMatters: 'Unanimous/supermajority consent required: budget approval, capex above threshold, debt incurrence, litigation, change of business, related party transactions, dividend policy, admission of new partners',
    managementCommittee: 'Separate from board; operational oversight; day-to-day management delegation; typically senior executives from each party'
  },
  competitionLaw: {
    euMergerRegulation: 'Full-function JV = concentration under EUMR; filing required if thresholds met; substantive test: SIEC',
    gunJumping: 'Parties must not coordinate competitively before clearance; information barriers required during review; fines for premature integration',
    informationBarriers: 'Clean team arrangements for commercially sensitive information during due diligence and pre-completion',
    behavioralRemedies: 'Commission may impose conditions: access commitments, firewall obligations, monitoring trustees'
  },
  exitMechanisms: {
    ipo: 'IPO of JV entity or assets; drag-along/tag-along rights; lock-up periods; market conditions flexibility',
    tradeSale: 'Sale to third party; ROFO (right of first offer) or ROFR (right of first refusal) to JV partner',
    putCall: 'Put option: right to sell stake to partner at agreed price/formula; Call option: right to buy partner stake; often linked to time triggers or performance',
    tagDrag: 'Tag-along: minority can join exit on same terms; Drag-along: majority can force minority to sell; price/terms protections for tagged party'
  },
  accounting: {
    consolidation: 'IFRS 10: parent controls JV → full consolidation',
    equityMethod: 'IAS 28: significant influence (20-50%) → equity method',
    jointArrangement: 'IFRS 11: joint control → classify as joint operation (line-by-line) or joint venture (equity method)',
    taxConsiderations: 'JV structure affects tax consolidation, transfer pricing, withholding taxes on profit distributions'
  }
};

const CORPORATE_GOVERNANCE_STANDARDS = {
  boardComposition: {
    english: { minDirectors: 1, residency: 'No statutory requirement (but practical/tax reasons for UK resident)', independentRequired: false },
    delaware: { minDirectors: 1, residency: 'No requirement', independentRequired: 'Only for listed companies (NYSE/NASDAQ rules)' },
    luxembourg: { minDirectors: 3, residency: 'No statutory requirement; CSSF expects Luxembourg substance', independentRequired: false },
    singapore: { minDirectors: 1, residency: 'At least 1 ordinarily resident in Singapore', independentRequired: 'Listed companies: at least 2 independent directors' },
    hong_kong: { minDirectors: 1, residency: 'No requirement for private; listed: at least 3 independent NEDs', independentRequired: 'Listed only' },
    ireland: { minDirectors: 2, residency: 'At least 1 EEA-resident director (or bond)', independentRequired: false },
    cayman: { minDirectors: 1, residency: 'No requirement; CIMA expects substance for regulated funds', independentRequired: false },
    switzerland: { minDirectors: 1, residency: 'At least 1 director or officer with Swiss domicile (representation requirement)', independentRequired: false },
    germany: { minDirectors: 1, residency: 'Managing director (Geschäftsführer) for GmbH; no statutory residency but practical need', independentRequired: 'Listed: Supervisory board with employee representation (Mitbestimmung)' },
    france: { minDirectors: 3, residency: 'Président required; no strict residency', independentRequired: 'Listed: AFEP-MEDEF Code recommends majority independent' },
    norway: { minDirectors: 1, residency: 'At least half resident in EEA', independentRequired: false },
    finland: { minDirectors: 1, residency: 'At least 1 resident in EEA', independentRequired: false },
    estonia: { minDirectors: 1, residency: 'No statutory requirement', independentRequired: false },
    lithuania: { minDirectors: 1, residency: 'No statutory requirement', independentRequired: false }
  },
  fiduciaryDuties: {
    english: 'Companies Act 2006 ss.170-177: duty to promote success of company (s.172); duty of care, skill, diligence (s.174); duty to avoid conflicts (s.175)',
    delaware: 'Fiduciary duties of care and loyalty; business judgment rule presumes informed, good faith decision; Revlon duties on sale of control',
    singapore: 'Companies Act s.157: duty to act honestly and use reasonable diligence; common law fiduciary duties apply',
    hong_kong: 'Companies Ordinance: duty of care, skill, diligence; duty to act in good faith for benefit of company; no-conflict, no-profit rules',
    german: 'GmbHG: Geschäftsführer duty of care of orderly businessperson (Sorgfalt eines ordentlichen Geschäftsmanns); business judgment rule (§ 93 AktG analogy)',
    french: 'Code de commerce: dirigeant social duties; liability for faute de gestion; no statutory business judgment rule but courts apply similar concept',
    cayman: 'Common law fiduciary duties (English law basis): duty of good faith, duty of care, no-conflict rule, no-profit rule'
  },
  shareholderApprovals: {
    ordinaryResolution: '50%+1 of votes cast (simple majority) — standard for most routine matters',
    specialResolution: '75% of votes cast (UK, Ireland, Cayman, BVI, Jersey, Guernsey, HK, Singapore) or 66.67% (Luxembourg, France, Germany, many EU jurisdictions)',
    unanimousConsent: 'Required for certain fundamental changes in some jurisdictions (e.g., change of company object in Luxembourg SA)',
    writtenResolution: 'Available in most jurisdictions — avoids formal meeting; UK: simple majority (ordinary) / 75% (special); Delaware: majority of voting power'
  },
  minorityProtection: {
    unfairPrejudice: 'UK Companies Act s.994: minority shareholder petition where affairs conducted in unfairly prejudicial manner; remedy: share purchase order at fair value',
    appraisalRights: 'Delaware DGCL §262: dissenting shareholders in merger can petition Court of Chancery for fair value of shares; excludes synergy value',
    derivativeActions: 'Available in most common law jurisdictions: shareholder sues on behalf of company for director breach of duty',
    oppressionRemedies: 'Singapore s.216; Canada CBCA s.241; Ireland s.212: broader than UK unfair prejudice in some respects'
  },
  directorsLiability: {
    personalLiability: 'Breach of fiduciary duty, wrongful/fraudulent trading, breach of statutory duty, environmental liability, tax liability (in some jurisdictions)',
    dAndO: 'Directors & Officers insurance: standard coverage Side A (personal), Side B (company reimbursement), Side C (entity securities claims)',
    indemnification: 'Delaware: broad indemnification permitted (DGCL §145); UK: limited — cannot indemnify against liability to company or criminal fines (CA 2006 s.234)',
    businessJudgmentRule: 'Delaware: presumption directors acted on informed basis, in good faith, in honest belief action was in company best interest; burden on plaintiff to rebut'
  }
};

const CROSS_JURISDICTION_COMPARISON = {}; // Populated by jurisdiction-compare.js module

module.exports = {
  ILPA_PRINCIPLES,
  MARKET_STANDARDS,
  REGULATORY,
  WATERFALL,
  LEGAL_PRINCIPLES,
  NEGOTIATION_BY_INVESTOR,
  CLAUSE_LIBRARY,
  FUND_STRUCTURES,
  M_AND_A_MARKET_STANDARDS,
  DEBT_MARKET_STANDARDS,
  EMPLOYMENT_STANDARDS,
  BROKER_INTERMEDIARY_STANDARDS,
  JV_STANDARDS,
  CORPORATE_GOVERNANCE_STANDARDS,
  CROSS_JURISDICTION_COMPARISON,
  buildDeepLegalContext
};

// ── OFFSHORE FUND STRUCTURES (appended) ────────────────────────────────────

const OFFSHORE_KNOWLEDGE = `
[OFFSHORE FUND DOMICILES — CAYMAN, LUXEMBOURG, BVI]

CAYMAN ISLANDS — GLOBAL FUND DOMICILE:
• Dominant: majority of global hedge funds; large share of PE/VC; most Asian and US-managed offshore funds
• ELP (Exempted Limited Partnership Act 2014): primary PE vehicle; tax transparent; LPA fully confidential; maximum flexibility; no mandatory LP protections beyond statute minimum
• Private Funds Act 2020: closed-ended funds >15 investors must register with CIMA; audit (6 months FYE); valuation policy; cash monitoring; safe-keeping of assets; annual return
• Zero tax: no income, CGT, corporation, withholding; 20-year tax exemption certificate available
• AML: full CDD/EDD; MLRO mandatory; SAR reporting to FRA; BOSS beneficial ownership register
• Economic Substance Act 2019: fund management activities may require BVI/Cayman substance
• CRS/FATCA: Cayman FATCA IGA partner; full CRS reporting; fund must identify US persons and CRS reportable persons
• EU grey/blacklist risk: Cayman periodically on EU AML lists — monitor before EU investor marketing
• Directors registration: all fund directors must register with CIMA under Directors Registration Act
• STAR Trust: purpose trust for orphan/governance structures; segregated portfolio companies (SPC) for multi-strategy

CAYMAN ELP vs DELAWARE LP:
• Both tax transparent; Cayman: no tax on ELP itself; Delaware LP: US federal tax for US investors
• Cayman preferred for non-US manager with non-US investors; Delaware preferred for US-managed funds with US investors
• Parallel fund structure common: Cayman ELP (non-US investors) + Delaware LP (US investors) managed by same GP

LUXEMBOURG — EU FUND DOMICILE:
• Largest EU fund centre; ~€5 trillion AUM; UCITS global standard (passportable to 40+ countries)
• SCSp (Société en Commandite Spéciale, Law of 12 July 2013): primary PE/VC vehicle; tax transparent; no legal personality; maximum flexibility; governed by partnership agreement
• RAIF (Reserved Alternative Investment Fund, Law of 23 July 2016): no CSSF product approval; must appoint authorised AIFM; fastest Luxembourg launch; all SIF/SICAR techniques available
• SIF (Specialised Investment Fund): CSSF-approved; 30-business-day launch; well-informed investors (€125k minimum); CSSF supervision
• SICAR: full tax exemption on risk capital investments; PE/VC specific; CSSF supervision
• EU passport: Luxembourg AIFs marketed to professional investors across all 27 EU member states via AIFMD passport
• Tax: participation exemption on qualifying dividends and capital gains; no WHT on distributions to non-residents under standard structures; 80+ tax treaties; subscription tax 0.01% on SIF NAV (exempt for SICAR/RAIF with SICAR regime)
• SFDR: Article 8 (promotes ESG) and Article 9 (sustainable objective) are standard for institutional fundraising; Article 6 for non-ESG strategies
• Substance: CSSF expects genuine substance post-BEPS — local board meetings, Luxembourg-resident directors, risk management functions present
• AML: CSSF AML Circular; full CDD; RBE beneficial ownership register (partially public); GDPR via CNPD

CAYMAN vs LUXEMBOURG:
• Non-EU investors/manager: Cayman ELP preferred (no AIFMD; simpler; lower cost)
• EU investors/manager: Luxembourg SCSp or RAIF preferred (AIFMD passport; EU regulatory comfort)
• Parallel structure: Cayman ELP (non-EU) + Luxembourg SCSp or RAIF (EU) — very common for large PE funds
• Cost: Luxembourg more expensive (CSSF fees, substance requirements, mandatory audit at fund level); Cayman lower ongoing costs
• Regulation: Luxembourg RAIF/SIF provides regulatory comfort for EU institutional LPs; Cayman PFA 2020 provides lighter equivalent

BVI — OFFSHORE HOLDING COMPANY STANDARD:
• Global standard for offshore holding company and co-investment SPV — BVI Business Company (BC) used in virtually every offshore fund structure
• BVI Business Companies Act 2004 (BCA): extremely flexible; no minimum capital; minimum 1 director/shareholder; no public share register; fast incorporation (hours)
• BVI BC used as: GP entity, intermediate holdco, co-investment SPV, carry vehicle, management entity
• BVI LP (Limited Partnerships Act 1996): less developed than Cayman ELP; less commonly used as fund vehicle; BVI BC preferred for most offshore structures
• Professional Fund (SIBA 2010): FSC-approved; professional investors ($100k min or institutional); 3-5 day approval; annual audit required
• Zero BVI taxes: no corporation, income, CGT, withholding or stamp duty
• Economic Substance Act 2018: pure equity holding companies — simplified test; fund management — full substance test
• BOSS: beneficial ownership register — not public; accessible to BVI authorities and law enforcement
• Cayman vs BVI: Cayman ELP superior for PE fund vehicle; BVI BC superior for holdco/SPV (lower cost, simpler maintenance)

THREE-JURISDICTION STRUCTURES (common in practice):
• Typical large PE fund: Cayman ELP (fund) + Luxembourg parallel SCSp or RAIF (EU investors) + BVI BC (GP holdco, carry SPV, co-investment vehicles)
• Typical VC fund: Cayman ELP (main fund) + BVI BC (GP entity) + Delaware LLC (US investors' parallel fund if needed)
• Typical hedge fund: Cayman SPC (main fund) + BVI BC (investment manager/adviser)
`;

// Export the offshore knowledge for use in the engine
module.exports.OFFSHORE_KNOWLEDGE = OFFSHORE_KNOWLEDGE;
