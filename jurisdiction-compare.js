/**
 * GAIO — Cross-Jurisdiction Comparison Module
 *
 * 8 institutional-grade comparison tables across 26 jurisdictions.
 * Utility functions for filtered comparisons, jurisdiction profiles,
 * and AI prompt injection.
 */

'use strict';

// ── 26 JURISDICTION IDS ─────────────────────────────────────────────────────
const JURISDICTION_IDS = [
  'english', 'delaware', 'singapore', 'hong_kong', 'italian', 'french',
  'swedish', 'danish', 'spanish', 'german', 'cayman', 'luxembourg',
  'bvi', 'difc', 'adgm', 'jersey', 'guernsey', 'ireland', 'switzerland',
  'netherlands', 'norwegian', 'finnish', 'estonian', 'lithuanian',
  'japanese', 'korean'
];

// ═════════════════════════════════════════════════════════════════════════════
// 1. FUND_VEHICLES — Primary fund vehicle per jurisdiction
// ═════════════════════════════════════════════════════════════════════════════

const FUND_VEHICLES = {
  english: {
    primaryVehicle: 'English Limited Partnership (ELP)',
    legislation: 'Limited Partnerships Act 2021 (LPACT 2021)',
    taxTransparent: true,
    legalPersonality: 'Legal personality (LPACT 2021 s.3)'
  },
  delaware: {
    primaryVehicle: 'Delaware Limited Partnership (LP)',
    legislation: 'Delaware Revised Uniform Limited Partnership Act (DRULPA, 6 Del. C. §17-101 et seq.)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality'
  },
  singapore: {
    primaryVehicle: 'Singapore Limited Partnership / Variable Capital Company (VCC)',
    legislation: 'Limited Partnerships Act (LPMA, Cap. 163B); Variable Capital Companies Act 2018',
    taxTransparent: true,
    legalPersonality: 'VCC has legal personality; LP does not'
  },
  hong_kong: {
    primaryVehicle: 'Limited Partnership Fund (LPF)',
    legislation: 'Limited Partnership Fund Ordinance (Cap. 637, 2020)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality'
  },
  italian: {
    primaryVehicle: 'Società in Accomandita Semplice (SAS) / Fondo di Investimento Alternativo (FIA)',
    legislation: 'Codice Civile (Art. 2313–2324); TUF (D.Lgs. 58/1998)',
    taxTransparent: true,
    legalPersonality: 'SAS has limited legal personality; FIA tax-transparent for investors'
  },
  french: {
    primaryVehicle: 'Société de Libre Partenariat (SLP) / FPCI',
    legislation: 'Loi 2015-990 (Loi Macron); Code Monétaire et Financier (Art. L214-162-1 et seq.)',
    taxTransparent: true,
    legalPersonality: 'SLP has legal personality; FPCI (FCP) does not'
  },
  swedish: {
    primaryVehicle: 'Kommanditbolag (KB)',
    legislation: 'Lag om handelsbolag och enkla bolag (HBL, 1980:1102)',
    taxTransparent: true,
    legalPersonality: 'Legal personality'
  },
  danish: {
    primaryVehicle: 'Kommanditselskab (K/S)',
    legislation: 'Lov om erhvervsdrivende virksomheder (LEV)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality'
  },
  spanish: {
    primaryVehicle: 'Fondo de Capital Riesgo (FCR)',
    legislation: 'Ley 22/2014 de Entidades de Capital-Riesgo',
    taxTransparent: false,
    legalPersonality: 'FCR has no legal personality (fondo patrimonio separado); SCR has legal personality'
  },
  german: {
    primaryVehicle: 'GmbH & Co. KG',
    legislation: 'Handelsgesetzbuch (HGB §§161–177a); KAGB',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality (Gesamthandsgemeinschaft)'
  },
  cayman: {
    primaryVehicle: 'Exempted Limited Partnership (ELP)',
    legislation: 'Exempted Limited Partnership Act (2021 Revision, originally 2014)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality'
  },
  luxembourg: {
    primaryVehicle: 'Société en Commandite Spéciale (SCSp)',
    legislation: 'Loi du 12 juillet 2013 (amended)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality'
  },
  bvi: {
    primaryVehicle: 'BVI Limited Partnership / BVI Business Company (BC)',
    legislation: 'Limited Partnership Act 1996; BVI Business Companies Act 2004',
    taxTransparent: true,
    legalPersonality: 'LP no legal personality; BC has legal personality. BC not tax-transparent'
  },
  difc: {
    primaryVehicle: 'DIFC Limited Partnership',
    legislation: 'Limited Partnership Law DIFC Law No. 4 of 2006 (amended 2018)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality (no income tax in DIFC)'
  },
  adgm: {
    primaryVehicle: 'ADGM Limited Partnership',
    legislation: 'Limited Partnership Regulations 2017 (ADGM)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality (no income tax in ADGM)'
  },
  jersey: {
    primaryVehicle: 'Jersey Limited Partnership',
    legislation: 'Limited Partnerships (Jersey) Law 1994 (as amended)',
    taxTransparent: true,
    legalPersonality: 'Separate legal personality (2014 amendment)'
  },
  guernsey: {
    primaryVehicle: 'Guernsey Limited Partnership',
    legislation: 'Limited Partnerships (Guernsey) Law 1995 (as amended)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality (opt-in available since 2021)'
  },
  ireland: {
    primaryVehicle: 'Investment Limited Partnership (ILP) / ICAV',
    legislation: 'Investment Limited Partnerships Act 1994 (as amended 2021); ICAV Act 2015',
    taxTransparent: true,
    legalPersonality: 'ILP tax-transparent; ICAV has legal personality (corporate, not transparent)'
  },
  switzerland: {
    primaryVehicle: 'Swiss Limited Partnership (Kommanditgesellschaft) / FCP',
    legislation: 'Code of Obligations (CO Art. 594–619); CISA (KAG)',
    taxTransparent: true,
    legalPersonality: 'LP no separate legal personality; FCP no legal personality'
  },
  netherlands: {
    primaryVehicle: 'Commanditaire Vennootschap (CV)',
    legislation: 'Dutch Civil Code (Burgerlijk Wetboek, Book 7A)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality (transparent only if closed CV — no transferable interests without unanimous consent)'
  },
  norwegian: {
    primaryVehicle: 'Kommandittselskap (KS) / Indre Selskap (IS)',
    legislation: 'Selskapsloven (Lov 1985-06-21 nr. 83)',
    taxTransparent: true,
    legalPersonality: 'No separate legal personality'
  },
  finnish: {
    primaryVehicle: 'Kommandiittiyhtiö (Ky)',
    legislation: 'Laki avoimesta yhtiöstä ja kommandiittiyhtiöstä (1988/389)',
    taxTransparent: true,
    legalPersonality: 'Legal personality'
  },
  estonian: {
    primaryVehicle: 'Usaldusühing (UÜ)',
    legislation: 'Äriseadustik (Commercial Code, §§125–139)',
    taxTransparent: true,
    legalPersonality: 'Legal personality'
  },
  lithuanian: {
    primaryVehicle: 'Komanditinė ūkinė bendrija (KŪB)',
    legislation: 'Ūkinių bendrijų įstatymas (Partnerships Act)',
    taxTransparent: true,
    legalPersonality: 'Legal personality'
  },
  japanese: {
    primaryVehicle: 'Investment LPS (Tōshi jigyō yūgen sekinin kumiai) / GK-TK Structure',
    legislation: 'Investment Limited Partnership Act 1998 (LPS Act); Companies Act 2005 (GK); Commercial Code Art. 535–542 (TK)',
    taxTransparent: true,
    legalPersonality: 'LPS has no separate legal personality; GK has legal personality'
  },
  korean: {
    primaryVehicle: 'PEF (Gyeongnyeong chamyeo-hyeong samopeundeu)',
    legislation: 'Financial Investment Services and Capital Markets Act (FSCMA 2009)',
    taxTransparent: true,
    legalPersonality: 'PEF has no separate legal personality (partnership-style)'
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 2. NON_COMPETE_RULES — Per jurisdiction
// ═════════════════════════════════════════════════════════════════════════════

const NON_COMPETE_RULES = {
  english: {
    maxDuration: '12 months (typically enforceable)',
    compensationRequired: false,
    enforceabilityTest: 'Restraint of trade doctrine — must protect legitimate business interest, reasonable in scope/duration/geography',
    keyStatute: 'Common law (Nordenfelt v Maxim Nordenfelt [1894]); no statutory codification'
  },
  delaware: {
    maxDuration: '12–24 months',
    compensationRequired: false,
    enforceabilityTest: 'Reasonable in scope, duration and geography; protects legitimate economic interest; blue-pencil doctrine applies',
    keyStatute: 'Common law; Delaware courts apply reasonableness test (Weichert Co. of Pennsylvania v Young)'
  },
  singapore: {
    maxDuration: '12–24 months',
    compensationRequired: false,
    enforceabilityTest: 'Restraint of trade doctrine (follows English common law) — reasonable, protects legitimate interest',
    keyStatute: 'Common law (Man Financial (S) Pte Ltd v Wong Bark Chuan David [2008])'
  },
  hong_kong: {
    maxDuration: '12 months (typically)',
    compensationRequired: false,
    enforceabilityTest: 'Restraint of trade — must be reasonable and protect legitimate business interest',
    keyStatute: 'Common law (Esso Petroleum v Harper\'s Garage principles)'
  },
  italian: {
    maxDuration: '5 years (executives); 3 years (others) per Art. 2125 CC',
    compensationRequired: true,
    enforceabilityTest: 'Must be in writing, specify territory/activity/duration, and include adequate compensation (not symbolic)',
    keyStatute: 'Codice Civile Art. 2125'
  },
  french: {
    maxDuration: '24 months (typical)',
    compensationRequired: true,
    enforceabilityTest: 'Must be limited in time, geography and scope; must include financial compensation (jurisprudence constante since Cass. Soc. 10 July 2002)',
    keyStatute: 'Code du travail (jurisprudence); Cass. Soc. 10 July 2002'
  },
  swedish: {
    maxDuration: '18 months (per 2015 collective agreement norms); 9 months if no compensation',
    compensationRequired: true,
    enforceabilityTest: 'Must be proportionate; compensation required for clauses >9 months; employers can waive with 3 months notice',
    keyStatute: 'Lag (1915:218) om avtal §38; 2015 Industry Agreement on Non-Competes'
  },
  danish: {
    maxDuration: '12 months',
    compensationRequired: true,
    enforceabilityTest: 'Statutory framework; must compensate min. 40% salary (6 mo) or 60% salary (12 mo); employee can demand release',
    keyStatute: 'Ansættelsesbevisloven; Lov om ansættelsesklausuler (2015)'
  },
  spanish: {
    maxDuration: '24 months (executives); 6 months (others)',
    compensationRequired: true,
    enforceabilityTest: 'Must be in writing, include adequate compensation, and employer must have industrial/commercial interest',
    keyStatute: 'Estatuto de los Trabajadores Art. 21.2'
  },
  german: {
    maxDuration: '24 months',
    compensationRequired: true,
    enforceabilityTest: 'Must be in writing; employer must pay ≥50% of last compensation (Karenzentschädigung); void if unconscionable',
    keyStatute: 'Handelsgesetzbuch §§74–75f; BGB §138'
  },
  cayman: {
    maxDuration: '12–24 months (contractual; no statute)',
    compensationRequired: false,
    enforceabilityTest: 'English common law restraint of trade principles apply; must protect legitimate interest',
    keyStatute: 'Common law (follows English precedent)'
  },
  luxembourg: {
    maxDuration: '12 months',
    compensationRequired: true,
    enforceabilityTest: 'Must be in writing, limited to specific activity, 12-month max, compensation required; only for employees earning >statutory threshold',
    keyStatute: 'Code du travail Art. L.125-8'
  },
  bvi: {
    maxDuration: '12–24 months (contractual)',
    compensationRequired: false,
    enforceabilityTest: 'English common law restraint of trade doctrine applies',
    keyStatute: 'Common law'
  },
  difc: {
    maxDuration: '12 months (DIFC Employment Law)',
    compensationRequired: false,
    enforceabilityTest: 'Must be reasonable in scope and duration; DIFC courts follow English restraint of trade principles',
    keyStatute: 'DIFC Employment Law No. 2 of 2019, Art. 63'
  },
  adgm: {
    maxDuration: '12 months',
    compensationRequired: false,
    enforceabilityTest: 'Must be reasonable; ADGM courts apply English common law principles',
    keyStatute: 'ADGM Employment Regulations 2019'
  },
  jersey: {
    maxDuration: '12 months (typical)',
    compensationRequired: false,
    enforceabilityTest: 'English restraint of trade principles apply; must be reasonable',
    keyStatute: 'Common law (follows English precedent)'
  },
  guernsey: {
    maxDuration: '12 months (typical)',
    compensationRequired: false,
    enforceabilityTest: 'English restraint of trade principles apply; Guernsey courts follow English precedent',
    keyStatute: 'Common law'
  },
  ireland: {
    maxDuration: '12 months (typically enforceable)',
    compensationRequired: false,
    enforceabilityTest: 'Restraint of trade doctrine — must protect legitimate business interest, be reasonable in scope and duration',
    keyStatute: 'Common law (John Orr Ltd v Orr [1987]; Apex Fire Protection v Murtagh [1993])'
  },
  switzerland: {
    maxDuration: '3 years (CO Art. 340a)',
    compensationRequired: false,
    enforceabilityTest: 'Must be in writing, limited by geography/time/subject; compensation not required but absence reduces enforceability; void if employer terminates without cause',
    keyStatute: 'Code of Obligations (CO) Art. 340–340c'
  },
  netherlands: {
    maxDuration: 'No statutory maximum (typically 12–24 months)',
    compensationRequired: false,
    enforceabilityTest: 'Must be in writing with adult employee on permanent contract; judge can annul or reduce if disproportionate (Art. 7:653 BW)',
    keyStatute: 'Burgerlijk Wetboek Art. 7:653'
  },
  norwegian: {
    maxDuration: '12 months',
    compensationRequired: true,
    enforceabilityTest: 'Must be in writing; employer must compensate 100% of salary up to 8G, 70% above; 12-month statutory max',
    keyStatute: 'Arbeidsmiljøloven (Working Environment Act) §14A-1 et seq. (2016 amendment)'
  },
  finnish: {
    maxDuration: '12 months (6 months without compensation)',
    compensationRequired: true,
    enforceabilityTest: 'Must have particularly weighty reason; compensation required if >6 months; max 12 months; statutory reform 2022',
    keyStatute: 'Työsopimuslaki (Employment Contracts Act) Ch.3 §5 (amended 2022)'
  },
  estonian: {
    maxDuration: '12 months',
    compensationRequired: true,
    enforceabilityTest: 'Must be in writing with reasonable compensation; must be necessary to protect employer\'s special economic interest',
    keyStatute: 'Töölepingu seadus (Employment Contracts Act) §23–25'
  },
  lithuanian: {
    maxDuration: '24 months',
    compensationRequired: true,
    enforceabilityTest: 'Must be in writing; compensation ≥40% of employee\'s average salary for each month of restriction; max 24 months',
    keyStatute: 'Darbo kodeksas (Labour Code) Art. 38'
  },
  japanese: {
    maxDuration: '12–24 months (typical)',
    compensationRequired: false,
    enforceabilityTest: 'Courts apply reasonableness test: scope, duration, geography, and whether compensation provided; compensation strengthens enforceability but not required',
    keyStatute: 'Case law (no statutory codification); Labour Standards Act (Rōdō kijun hō) as background; Foseco Japan v Okuno (Tokyo District Court) leading case'
  },
  korean: {
    maxDuration: '12–24 months',
    compensationRequired: true,
    enforceabilityTest: 'Courts apply proportionality test: must protect legitimate business interest, be limited in duration/geography/scope, and include compensation',
    keyStatute: 'Labour Standards Act (Geunno gijun beop); Supreme Court precedent requires reasonable compensation for enforceability'
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 3. AIFM_REGULATION — Regulatory framework per jurisdiction
// ═════════════════════════════════════════════════════════════════════════════

const AIFM_REGULATION = {
  english: {
    regime: 'UK AIFM regime (onshored AIFMD)',
    authority: 'Financial Conduct Authority (FCA)',
    fullLicenceThreshold: '£500M AUM (leveraged) / £100M AUM (unleveraged with 5yr lock-up)',
    euPassport: false
  },
  delaware: {
    regime: 'Investment Advisers Act 1940; Dodd-Frank',
    authority: 'Securities and Exchange Commission (SEC)',
    fullLicenceThreshold: '$150M AUM (SEC registration); <$150M state-registered; PE adviser exemption available',
    euPassport: false
  },
  singapore: {
    regime: 'Securities and Futures Act (SFA); MAS licensing',
    authority: 'Monetary Authority of Singapore (MAS)',
    fullLicenceThreshold: 'CMS licence required; RFMC exempt if ≤30 qualified investors and ≤S$250M AUM',
    euPassport: false
  },
  hong_kong: {
    regime: 'Securities and Futures Ordinance (SFO)',
    authority: 'Securities and Futures Commission (SFC)',
    fullLicenceThreshold: 'Type 9 licence required for fund management; no AUM-based threshold',
    euPassport: false
  },
  italian: {
    regime: 'AIFMD (transposed via TUF D.Lgs. 58/1998)',
    authority: 'Banca d\'Italia / CONSOB',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  french: {
    regime: 'AIFMD (transposed via Code Monétaire et Financier)',
    authority: 'Autorité des marchés financiers (AMF)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  swedish: {
    regime: 'AIFMD (transposed via LAIF 2013:561)',
    authority: 'Finansinspektionen (FI)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  danish: {
    regime: 'AIFMD (transposed via Danish AIFM Act)',
    authority: 'Finanstilsynet (Danish FSA)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  spanish: {
    regime: 'AIFMD (transposed via Ley 22/2014)',
    authority: 'Comisión Nacional del Mercado de Valores (CNMV)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  german: {
    regime: 'AIFMD (transposed via KAGB)',
    authority: 'Bundesanstalt für Finanzdienstleistungsaufsicht (BaFin)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  cayman: {
    regime: 'Securities Investment Business Act (SIBA); Private Funds Act 2020',
    authority: 'Cayman Islands Monetary Authority (CIMA)',
    fullLicenceThreshold: 'Registration required for all private funds; no AUM-based exemption',
    euPassport: false
  },
  luxembourg: {
    regime: 'AIFMD (transposed via Law of 12 July 2013)',
    authority: 'Commission de Surveillance du Secteur Financier (CSSF)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  bvi: {
    regime: 'Securities and Investment Business Act 2010 (SIBA)',
    authority: 'BVI Financial Services Commission (FSC)',
    fullLicenceThreshold: 'Registration required; professional/private funds exempt from full licensing',
    euPassport: false
  },
  difc: {
    regime: 'DIFC Collective Investment Law (CIL) 2010',
    authority: 'Dubai Financial Services Authority (DFSA)',
    fullLicenceThreshold: 'Category 3C licence for fund management; Qualified Investor Fund (QIF) streamlined',
    euPassport: false
  },
  adgm: {
    regime: 'Financial Services and Markets Regulations 2015 (FSMR)',
    authority: 'Financial Services Regulatory Authority (FSRA)',
    fullLicenceThreshold: 'FSP required; Exempt Fund Manager available for ≤$250M AUM or ≤30 investors',
    euPassport: false
  },
  jersey: {
    regime: 'Collective Investment Funds (Jersey) Law 1988; AIFMD NPPR access',
    authority: 'Jersey Financial Services Commission (JFSC)',
    fullLicenceThreshold: 'Fund service business licence; JPF available for ≤50 offers',
    euPassport: false
  },
  guernsey: {
    regime: 'Protection of Investors (Bailiwick of Guernsey) Law 2020; AIFMD NPPR access',
    authority: 'Guernsey Financial Services Commission (GFSC)',
    fullLicenceThreshold: 'Licence required; Registered Fund for ≤50 investors',
    euPassport: false
  },
  ireland: {
    regime: 'AIFMD (transposed via SI 257/2013)',
    authority: 'Central Bank of Ireland (CBI)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  switzerland: {
    regime: 'Collective Investment Schemes Act (CISA/KAG); FinIA/FinSA (2020)',
    authority: 'FINMA (Swiss Financial Market Supervisory Authority)',
    fullLicenceThreshold: 'Fund management company licence; portfolio manager authorisation under FinIA',
    euPassport: false
  },
  netherlands: {
    regime: 'AIFMD (transposed via Wft — Wet op het financieel toezicht)',
    authority: 'Autoriteit Financiële Markten (AFM) / De Nederlandsche Bank (DNB)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  norwegian: {
    regime: 'AIFMD (transposed via AIF-loven 2014)',
    authority: 'Finanstilsynet (Norwegian FSA)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  finnish: {
    regime: 'AIFMD (transposed via Laki vaihtoehtorahastojen hoitajista 162/2014)',
    authority: 'Finanssivalvonta (FIN-FSA)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  estonian: {
    regime: 'AIFMD (transposed via Investment Funds Act — Investeerimisfondide seadus)',
    authority: 'Finantsinspektsioon (Estonian FSA)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  lithuanian: {
    regime: 'AIFMD (transposed via Collective Investment Undertakings Act)',
    authority: 'Lietuvos bankas (Bank of Lithuania)',
    fullLicenceThreshold: '€500M AUM (leveraged) / €100M AUM (unleveraged with 5yr lock-up)',
    euPassport: true
  },
  japanese: {
    regime: 'Financial Instruments and Exchange Act (FIEA); Investment Limited Partnership Act 1998',
    authority: 'Financial Services Agency (FSA/JFSA)',
    fullLicenceThreshold: 'Type II FIBO for fund distribution; Investment Management FIBO for discretionary management; QII (Qualified Institutional Investor) exemption available for ≤49 non-QII investors',
    euPassport: false
  },
  korean: {
    regime: 'Financial Investment Services and Capital Markets Act (FSCMA 2009)',
    authority: 'Financial Services Commission (FSC) / Financial Supervisory Service (FSS)',
    fullLicenceThreshold: 'Registration required as collective investment business entity; PEF GP registration; venture capital registration under Venture Investment Promotion Act',
    euPassport: false
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 4. CARRIED_INTEREST_TAX — Tax treatment of carry
// ═════════════════════════════════════════════════════════════════════════════

const CARRIED_INTEREST_TAX = {
  english: {
    treatment: 'Capital gains (with Income Tax re-characterisation risk under carried interest rules)',
    approximateRate: '28% CGT (carried interest rate since April 2025); income tax up to 45% if recharacterised',
    keyConditions: 'Must satisfy qualifying carried interest conditions (average holding period ≥40 months); Finance Act 2016 Pt.3 Ch.5E'
  },
  delaware: {
    treatment: 'Capital gains (long-term if ≥3 year holding)',
    approximateRate: '20% LTCG + 3.8% NIIT = 23.8% (federal); ordinary income up to 37% if <3yr',
    keyConditions: 'IRC §1061 three-year holding period; must be applicable partnership interest; QSBS exclusion may apply'
  },
  singapore: {
    treatment: 'Not taxed if capital in nature (no CGT)',
    approximateRate: '0% (capital gains); 24% corporate tax if recharacterised as income',
    keyConditions: 'Badges of trade test; fund manager incentive scheme (Section 13H/13U) available'
  },
  hong_kong: {
    treatment: 'Not taxed if capital in nature (no CGT); carried interest concession since 2021',
    approximateRate: '0% (qualifying carried interest); 16.5% profits tax if income',
    keyConditions: 'Must be certified fund and SFC-licensed; Inland Revenue (Amendment) (Tax Concessions for Carried Interest) Ordinance 2021'
  },
  italian: {
    treatment: 'Capital gains at reduced rate if qualifying conditions met (Art. 60 DL 50/2017)',
    approximateRate: '26% substitute tax on capital gains; up to 43% IRPEF if income',
    keyConditions: 'Manager must co-invest ≥1%; carry must be ≥20% of fund profits above hurdle; minimum holding period'
  },
  french: {
    treatment: 'Capital gains with specific carried interest regime',
    approximateRate: '30% PFU (flat tax) on qualifying carried interest; up to 49% if recharacterised as salary',
    keyConditions: 'Manager must co-invest ≥1% of fund commitments; Art. 150-0 A CGI; carried interest must be in proportion to co-investment'
  },
  swedish: {
    treatment: 'Income from employment (Skatteverket position after HFD 2018 ref. 37)',
    approximateRate: 'Up to 52% marginal income tax',
    keyConditions: 'Swedish Supreme Administrative Court ruled carried interest as employment income; limited capital gains treatment'
  },
  danish: {
    treatment: 'Taxed as personal income in most cases',
    approximateRate: 'Up to 52.07% marginal income tax; 42% on share income >DKK 61,000',
    keyConditions: 'Danish tax authorities generally treat carry as employment income; limited planning options'
  },
  spanish: {
    treatment: 'Capital gains with special regime for qualifying carried interest (2022 reform)',
    approximateRate: '28% savings income tax (gains >€300K); up to 47% if employment income',
    keyConditions: 'Ley 18/2022 introduced qualifying carried interest regime; manager co-investment and holding conditions apply'
  },
  german: {
    treatment: 'Commercial income at partnership level; carried interest partially exempt (40% Teileinkünfteverfahren)',
    approximateRate: 'Effective ~26–28% after partial exemption; up to 45% + 5.5% solidarity surcharge if fully taxable',
    keyConditions: '§18 Abs.1 Nr.4 EStG for self-employed carried interest; §3 Nr.40a EStG partial exemption on qualifying gains'
  },
  cayman: {
    treatment: 'No tax',
    approximateRate: '0%',
    keyConditions: 'No income tax, capital gains tax, or withholding tax in Cayman Islands'
  },
  luxembourg: {
    treatment: 'Capital gains (if qualifying under carried interest regime)',
    approximateRate: '0% on qualifying carried interest for individuals holding >10yr; otherwise up to 42% income tax (50% exempt)',
    keyConditions: 'Art. 152bis LIR for participation exemption; carried interest must qualify as capital gain, not salary'
  },
  bvi: {
    treatment: 'No tax',
    approximateRate: '0%',
    keyConditions: 'No income tax, capital gains tax, or withholding tax in BVI'
  },
  difc: {
    treatment: 'No tax',
    approximateRate: '0% (UAE has no personal income tax; 9% corporate tax applies to corporate entities from June 2023 but free zones exempt on qualifying income)',
    keyConditions: 'DIFC is a free zone; qualifying income exempt from UAE corporate tax'
  },
  adgm: {
    treatment: 'No tax',
    approximateRate: '0% (UAE free zone)',
    keyConditions: 'ADGM is a free zone; qualifying income exempt from UAE corporate tax'
  },
  jersey: {
    treatment: 'Income tax at 0% or 20% depending on residency',
    approximateRate: '0% for non-resident recipients; 20% for Jersey-resident individuals',
    keyConditions: 'Jersey-resident individuals taxed at 20% flat; fund entities typically 0% rated'
  },
  guernsey: {
    treatment: 'Income tax at 0% for companies; 20% for individuals',
    approximateRate: '0% for fund entities; 20% for Guernsey-resident individuals',
    keyConditions: 'Companies generally 0% rated (except regulated utilities/banking); individual tax at 20%'
  },
  ireland: {
    treatment: 'Income tax (generally treated as employment or professional income)',
    approximateRate: 'Up to 52% (40% IT + 4% PRSI + 8% USC) if employment income; 33% CGT if capital gain',
    keyConditions: 'Irish Revenue generally treats carried interest as income; limited scope for CGT treatment; Section 541C TCA 1997'
  },
  switzerland: {
    treatment: 'Capital gains if individual (tax-free); income if professional trader',
    approximateRate: '0% on private capital gains; up to ~40% (cantonal + federal) if employment income',
    keyConditions: 'Swiss individual private capital gains are tax-free; risk of re-characterisation as professional activity'
  },
  netherlands: {
    treatment: 'Lucrative interest regime (Lucratief belang, Art. 3.92b Wet IB 2001)',
    approximateRate: 'Up to 49.5% income tax (Box 1) under lucrative interest rules',
    keyConditions: 'Art. 3.92b Wet IB 2001 — carried interest treated as income from lucrative interest; effective since 2009'
  },
  norwegian: {
    treatment: 'Taxed as ordinary income or capital gains depending on structure',
    approximateRate: '22% on capital gains (corporate); up to 47.4% on employment income; effective ~37.8% via shielding deduction',
    keyConditions: 'Aksjonærmodellen (shareholder model) for individual capital gains; shielding deduction available'
  },
  finnish: {
    treatment: 'Capital income or earned income depending on structure',
    approximateRate: '30% capital income (34% above €30K); up to ~51% earned income',
    keyConditions: 'Finnish Tax Administration evaluates substance over form; carry through partnership can be capital income'
  },
  estonian: {
    treatment: 'Corporate level: 0% until distribution; distribution taxed at 20/80',
    approximateRate: '20% effective on distributions (20/80 formula); 0% on retained earnings',
    keyConditions: 'Estonia taxes only on distribution; no ongoing corporate income tax; individuals pay 20% on dividends'
  },
  lithuanian: {
    treatment: 'Capital gains at flat rate; employment income progressively taxed',
    approximateRate: '15% on capital gains; up to 32% on employment income',
    keyConditions: 'If structured as capital gain, 15% rate applies; Lithuanian tax authority may recharacterise as employment income'
  },
  japanese: {
    treatment: 'Profit distribution from partnership; risk of recharacterisation as employment income',
    approximateRate: '~30% effective corporate rate (23.2% national + local); up to 55.945% marginal income tax for individuals',
    keyConditions: 'LPS Act distributions generally treated as business/investment income; GK-TK distributions treated as miscellaneous income; JFSA has scrutinised carry arrangements'
  },
  korean: {
    treatment: 'Profit distribution from PEF; capital gains or earned income depending on structure',
    approximateRate: '9–24% CIT (graduated); up to 49.5% individual income tax (including local surtax)',
    keyConditions: 'PEF profit distributions to GP generally treated as earned income; FSS reviews carry arrangements for recharacterisation risk'
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 5. WITHHOLDING_TAX — WHT on fund distributions
// ═════════════════════════════════════════════════════════════════════════════

const WITHHOLDING_TAX = {
  english: {
    dividendRate: '0% (no UK WHT on dividends)',
    interestRate: '20% (reduced by treaty or exemption)',
    treatyCount: '130+',
    participationExemption: true
  },
  delaware: {
    dividendRate: '30% (reduced by treaty)',
    interestRate: '30% (reduced by treaty; portfolio interest exemption)',
    treatyCount: '65+',
    participationExemption: false
  },
  singapore: {
    dividendRate: '0% (one-tier system)',
    interestRate: '15% (reduced by treaty)',
    treatyCount: '90+',
    participationExemption: true
  },
  hong_kong: {
    dividendRate: '0%',
    interestRate: '0% (generally)',
    treatyCount: '45+',
    participationExemption: true
  },
  italian: {
    dividendRate: '26% (reduced by treaty or EU Parent-Subsidiary Directive)',
    interestRate: '26% (reduced by treaty or EU Interest-Royalty Directive)',
    treatyCount: '100+',
    participationExemption: true
  },
  french: {
    dividendRate: '25% (reduced by treaty or EU PSD)',
    interestRate: '0% (generally; 25% on related-party interest in low-tax jurisdictions)',
    treatyCount: '120+',
    participationExemption: true
  },
  swedish: {
    dividendRate: '30% (reduced by treaty or EU PSD)',
    interestRate: '0% (no WHT on interest)',
    treatyCount: '80+',
    participationExemption: true
  },
  danish: {
    dividendRate: '27% (reduced by treaty or EU PSD)',
    interestRate: '0% (generally; 22% on controlled debt)',
    treatyCount: '75+',
    participationExemption: true
  },
  spanish: {
    dividendRate: '19% (reduced by treaty or EU PSD)',
    interestRate: '19% (reduced by treaty)',
    treatyCount: '95+',
    participationExemption: true
  },
  german: {
    dividendRate: '25% + 5.5% solidarity surcharge = 26.375% (reduced by treaty or EU PSD)',
    interestRate: '0% (no WHT on interest generally)',
    treatyCount: '95+',
    participationExemption: true
  },
  cayman: {
    dividendRate: '0%',
    interestRate: '0%',
    treatyCount: '0 (no DTA network)',
    participationExemption: false
  },
  luxembourg: {
    dividendRate: '15% (reduced by treaty or EU PSD)',
    interestRate: '0% (no WHT on interest)',
    treatyCount: '85+',
    participationExemption: true
  },
  bvi: {
    dividendRate: '0%',
    interestRate: '0%',
    treatyCount: '0 (limited TIEA network only)',
    participationExemption: false
  },
  difc: {
    dividendRate: '0%',
    interestRate: '0%',
    treatyCount: '140+ (UAE treaty network)',
    participationExemption: false
  },
  adgm: {
    dividendRate: '0%',
    interestRate: '0%',
    treatyCount: '140+ (UAE treaty network)',
    participationExemption: false
  },
  jersey: {
    dividendRate: '0%',
    interestRate: '0% (20% on Jersey-source interest to individuals)',
    treatyCount: '15+ (limited DTA network; extensive TIEA network)',
    participationExemption: false
  },
  guernsey: {
    dividendRate: '0%',
    interestRate: '0%',
    treatyCount: '13+ (limited DTA network; extensive TIEA network)',
    participationExemption: false
  },
  ireland: {
    dividendRate: '25% (reduced by treaty or EU PSD; ICAV/QIF may be exempt)',
    interestRate: '20% (reduced by treaty or EU IRD)',
    treatyCount: '75+',
    participationExemption: true
  },
  switzerland: {
    dividendRate: '35% (reduced by treaty; notification procedure for qualifying holdings)',
    interestRate: '35% (on Swiss-source bank interest; 0% on inter-company loans generally)',
    treatyCount: '100+',
    participationExemption: true
  },
  netherlands: {
    dividendRate: '15% (reduced by treaty or EU PSD; conditional WHT on dividends to low-tax jurisdictions since 2024)',
    interestRate: '0% (conditional WHT 25.8% on interest to low-tax jurisdictions since 2021)',
    treatyCount: '95+',
    participationExemption: true
  },
  norwegian: {
    dividendRate: '25% (reduced by treaty or EEA exemption)',
    interestRate: '0% (no WHT on interest)',
    treatyCount: '85+',
    participationExemption: true
  },
  finnish: {
    dividendRate: '20% (corporate recipients) / 30% (individuals); reduced by treaty or EU PSD',
    interestRate: '0% (no WHT on interest)',
    treatyCount: '75+',
    participationExemption: true
  },
  estonian: {
    dividendRate: '0% (regular dividends from taxed profits) / 7% on reduced-rate dividends',
    interestRate: '0%',
    treatyCount: '60+',
    participationExemption: true
  },
  lithuanian: {
    dividendRate: '15% (reduced by treaty or EU PSD)',
    interestRate: '10% (reduced by treaty)',
    treatyCount: '55+',
    participationExemption: true
  },
  japanese: {
    dividendRate: '20.42% (reduced by treaty)',
    interestRate: '15.315% (reduced by treaty)',
    treatyCount: '80+',
    participationExemption: true
  },
  korean: {
    dividendRate: '22% (reduced by treaty)',
    interestRate: '22% (reduced by treaty)',
    treatyCount: '90+',
    participationExemption: true
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 6. AML_FRAMEWORK — AML regime per jurisdiction
// ═════════════════════════════════════════════════════════════════════════════

const AML_FRAMEWORK = {
  english: {
    legislation: 'Proceeds of Crime Act 2002 (POCA); Money Laundering Regulations 2017 (MLR 2017)',
    supervisor: 'FCA (for regulated firms); HMRC (for non-regulated)',
    fiu: 'National Crime Agency (NCA) — UK Financial Intelligence Unit'
  },
  delaware: {
    legislation: 'Bank Secrecy Act (BSA); USA PATRIOT Act; AML Act 2020; FinCEN CDD Rule; Corporate Transparency Act 2024',
    supervisor: 'FinCEN; SEC (for investment advisers); FINRA (for broker-dealers)',
    fiu: 'Financial Crimes Enforcement Network (FinCEN)'
  },
  singapore: {
    legislation: 'Corruption, Drug Trafficking and Other Serious Crimes Act (CDSA); MAS Notice SFA 04-N02',
    supervisor: 'Monetary Authority of Singapore (MAS)',
    fiu: 'Suspicious Transaction Reporting Office (STRO) — Singapore Police Force'
  },
  hong_kong: {
    legislation: 'Anti-Money Laundering and Counter-Terrorist Financing Ordinance (AMLO, Cap. 615)',
    supervisor: 'SFC (for licensed entities); HKMA (for banks)',
    fiu: 'Joint Financial Intelligence Unit (JFIU)'
  },
  italian: {
    legislation: 'D.Lgs. 231/2007 (transposing 4th & 5th AMLD)',
    supervisor: 'Banca d\'Italia; CONSOB; UIF',
    fiu: 'Unità di Informazione Finanziaria (UIF) — Banca d\'Italia'
  },
  french: {
    legislation: 'Code Monétaire et Financier (L.561-1 et seq.); transposing 4th & 5th AMLD',
    supervisor: 'Autorité de contrôle prudentiel et de résolution (ACPR); AMF',
    fiu: 'TRACFIN (Traitement du renseignement et action contre les circuits financiers clandestins)'
  },
  swedish: {
    legislation: 'Lag om åtgärder mot penningtvätt (2017:630) — transposing 4th & 5th AMLD',
    supervisor: 'Finansinspektionen (FI)',
    fiu: 'Finanspolisen (Financial Police) — Swedish Police Authority'
  },
  danish: {
    legislation: 'Hvidvaskloven (AML Act, Lov nr. 651/2017) — transposing 4th & 5th AMLD',
    supervisor: 'Finanstilsynet (Danish FSA)',
    fiu: 'Hvidvasksekretariatet (Money Laundering Secretariat) — SØIK/Danish State Prosecutor'
  },
  spanish: {
    legislation: 'Ley 10/2010 de prevención del blanqueo de capitales; RD 304/2014',
    supervisor: 'SEPBLAC (Servicio Ejecutivo de la Comisión de Prevención del Blanqueo de Capitales)',
    fiu: 'SEPBLAC'
  },
  german: {
    legislation: 'Geldwäschegesetz (GwG) — transposing 4th & 5th AMLD',
    supervisor: 'BaFin (for regulated entities); Länderbehörden (state authorities for non-financial)',
    fiu: 'Zentralstelle für Finanztransaktionsuntersuchungen (FIU) — Zollkriminalamt'
  },
  cayman: {
    legislation: 'Proceeds of Crime Act (2020 Revision); Anti-Money Laundering Regulations (2020 Revision)',
    supervisor: 'Cayman Islands Monetary Authority (CIMA)',
    fiu: 'Financial Reporting Authority (FRA)'
  },
  luxembourg: {
    legislation: 'Law of 12 November 2004 (as amended) — transposing 4th & 5th AMLD',
    supervisor: 'CSSF (for financial entities); Commissariat aux Assurances (for insurers)',
    fiu: 'Cellule de Renseignement Financier (CRF)'
  },
  bvi: {
    legislation: 'Anti-money Laundering Regulations 2008 (as amended); Proceeds of Criminal Conduct Act 1997',
    supervisor: 'BVI Financial Services Commission (FSC)',
    fiu: 'BVI Financial Investigation Agency (FIA)'
  },
  difc: {
    legislation: 'Federal AML Law (Federal Decree-Law No. 20/2018); DFSA AML Module',
    supervisor: 'DFSA (within DIFC)',
    fiu: 'UAE Financial Intelligence Unit (goAML)'
  },
  adgm: {
    legislation: 'Federal AML Law (Federal Decree-Law No. 20/2018); FSRA AML Rules',
    supervisor: 'FSRA (within ADGM)',
    fiu: 'UAE Financial Intelligence Unit (goAML)'
  },
  jersey: {
    legislation: 'Proceeds of Crime (Jersey) Law 1999; Money Laundering Order 2008 (as amended)',
    supervisor: 'Jersey Financial Services Commission (JFSC)',
    fiu: 'Joint Financial Crimes Unit (JFCU) — States of Jersey Police'
  },
  guernsey: {
    legislation: 'Criminal Justice (Proceeds of Crime) (Bailiwick of Guernsey) Law 1999; AML/CFT Handbook',
    supervisor: 'Guernsey Financial Services Commission (GFSC)',
    fiu: 'Financial Intelligence Service (FIS) — Guernsey'
  },
  ireland: {
    legislation: 'Criminal Justice (Money Laundering and Terrorist Financing) Act 2010 (as amended) — transposing 4th & 5th AMLD',
    supervisor: 'Central Bank of Ireland (CBI)',
    fiu: 'Financial Intelligence Unit Ireland (FIU Ireland) — An Garda Síochána'
  },
  switzerland: {
    legislation: 'Anti-Money Laundering Act (AMLA/GwG); FINMA Anti-Money Laundering Ordinance',
    supervisor: 'FINMA; SROs (self-regulatory organisations for non-bank intermediaries)',
    fiu: 'Money Laundering Reporting Office Switzerland (MROS)'
  },
  netherlands: {
    legislation: 'Wet ter voorkoming van witwassen en financieren van terrorisme (Wwft) — transposing 4th & 5th AMLD',
    supervisor: 'DNB (for financial entities); AFM; BFT (for legal professionals)',
    fiu: 'Financial Intelligence Unit — Nederland (FIU-NL)'
  },
  norwegian: {
    legislation: 'Hvitvaskingsloven (AML Act 2018) — transposing 4th AMLD',
    supervisor: 'Finanstilsynet (Norwegian FSA)',
    fiu: 'Enheten for finansiell etterretning (EFE) — Økokrim'
  },
  finnish: {
    legislation: 'Laki rahanpesun ja terrorismin rahoittamisen estämisestä (444/2017) — transposing 4th & 5th AMLD',
    supervisor: 'Finanssivalvonta (FIN-FSA)',
    fiu: 'Rahanpesun selvittelykeskus (Financial Intelligence Unit) — National Bureau of Investigation'
  },
  estonian: {
    legislation: 'Rahapesu ja terrorismi rahastamise tõkestamise seadus (RahaPTS) — transposing 4th & 5th AMLD',
    supervisor: 'Finantsinspektsioon (Estonian FSA); Rahapesu Andmebüroo',
    fiu: 'Rahapesu Andmebüroo (Financial Intelligence Unit — Estonian FIU)'
  },
  lithuanian: {
    legislation: 'Pinigų plovimo ir teroristų finansavimo prevencijos įstatymas — transposing 4th & 5th AMLD',
    supervisor: 'Lietuvos bankas (Bank of Lithuania); FNTT',
    fiu: 'Finansinių nusikaltimų tyrimo tarnyba (FNTT — Financial Crime Investigation Service)'
  },
  japanese: {
    legislation: 'Act on Prevention of Transfer of Criminal Proceeds (Hanzai shūeki iten bōshi hō 2007); Foreign Exchange and Foreign Trade Act',
    supervisor: 'FSA/JFSA (for financial institutions); National Police Agency',
    fiu: 'Japan Financial Intelligence Center (JAFIC) — National Public Safety Commission'
  },
  korean: {
    legislation: 'Act on Reporting and Using Specified Financial Transaction Information (Teukjeong geumyung georae jeongbo beop)',
    supervisor: 'FSC/FSS (for financial institutions); KoFIU',
    fiu: 'Korea Financial Intelligence Unit (KoFIU) — Financial Services Commission'
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 7. LP_SAFE_HARBORS — LP safe harbor provisions
// ═════════════════════════════════════════════════════════════════════════════

const LP_SAFE_HARBORS = {
  english: {
    hasSafeHarbor: true,
    legislation: 'Limited Partnerships Act 2021 s.6 — statutory safe harbor list',
    protectedActivities: [
      'Approving valuations',
      'Consulting with and advising the GP',
      'Voting on major fund decisions (removal of GP, amendments, extensions)',
      'Serving on advisory committee / LPAC',
      'Approving conflicts of interest',
      'Enforcing LP rights under partnership agreement'
    ]
  },
  delaware: {
    hasSafeHarbor: true,
    legislation: 'DRULPA §17-303(b) — extensive statutory safe harbor',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Acting as contractor or agent of the LP',
      'Voting on dissolution, amendment, admission of partners',
      'Serving on advisory committee',
      'Proposing or approving amendments',
      'Winding up the LP'
    ]
  },
  singapore: {
    hasSafeHarbor: true,
    legislation: 'Limited Partnerships Act (LPMA) s.16 — safe harbor activities',
    protectedActivities: [
      'Acting as employee or contractor of GP',
      'Consulting and advising the GP',
      'Voting on specific matters (removal of GP, amendments)',
      'Approving or disapproving transactions',
      'Acting as surety for the LP'
    ]
  },
  hong_kong: {
    hasSafeHarbor: true,
    legislation: 'LPF Ordinance (Cap. 637) s.29 — protected activities schedule',
    protectedActivities: [
      'Serving on investment committee in advisory capacity',
      'Consulting with GP on fund affairs',
      'Approving or disapproving specified actions',
      'Voting on amendments, dissolution, removal of GP',
      'Calling or attending partner meetings',
      'Enforcing rights under partnership agreement'
    ]
  },
  italian: {
    hasSafeHarbor: false,
    legislation: 'Codice Civile Art. 2320 — accomandanti prohibited from management acts',
    protectedActivities: [
      'Limited partners (accomandanti) lose limited liability if they interfere in management',
      'Advisory activities may be permissible if not constituting management',
      'Voting on specific matters allowed under partnership agreement'
    ]
  },
  french: {
    hasSafeHarbor: true,
    legislation: 'Code de commerce Art. L222-6; Loi 2015-990 for SLP',
    protectedActivities: [
      'Giving advice and opinions',
      'Exercising control and supervision',
      'Participating in internal acts authorised by articles',
      'Voting on partner resolutions as provided in partnership agreement'
    ]
  },
  swedish: {
    hasSafeHarbor: false,
    legislation: 'HBL (1980:1102) — no statutory safe harbor; kommanditdelägare must not manage',
    protectedActivities: [
      'LP must not participate in management of partnership',
      'Advisory and supervisory roles may be acceptable by custom',
      'Voting on key decisions under partnership agreement'
    ]
  },
  danish: {
    hasSafeHarbor: false,
    legislation: 'LEV — limited partners must not participate in management',
    protectedActivities: [
      'LP must not participate in management',
      'Advisory committee roles generally acceptable',
      'Voting on amendments and dissolution'
    ]
  },
  spanish: {
    hasSafeHarbor: false,
    legislation: 'Código de Comercio Art. 148 — comanditarios may not manage',
    protectedActivities: [
      'Comanditarios lose limited liability if they participate in management',
      'Supervisory and approval rights limited to partnership deed provisions'
    ]
  },
  german: {
    hasSafeHarbor: false,
    legislation: 'HGB §§164, 170 — Kommanditist excluded from management; consent rights for extraordinary acts',
    protectedActivities: [
      'Consent rights on extraordinary business (§164 HGB)',
      'Right to inspect books (§166 HGB)',
      'Advisory committee participation generally acceptable',
      'Voting on partnership agreement amendments'
    ]
  },
  cayman: {
    hasSafeHarbor: true,
    legislation: 'Exempted Limited Partnership Act (2021 Revision) s.20 — broad safe harbor',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Voting on dissolution, amendment, admission of partners',
      'Serving on advisory committee',
      'Investigating the partnership affairs',
      'Approving or disapproving amendments to LPA',
      'Providing guarantees or security for the LP'
    ]
  },
  luxembourg: {
    hasSafeHarbor: true,
    legislation: 'Law of 12 July 2013 Art. 3 — SCSp safe harbor',
    protectedActivities: [
      'Exercising advisory or supervisory functions',
      'Giving authorisation to the manager for specific acts',
      'Voting on partnership resolutions',
      'Participating in partner meetings',
      'Approving accounts'
    ]
  },
  bvi: {
    hasSafeHarbor: true,
    legislation: 'Limited Partnership Act 1996 s.23 — safe harbor activities',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Being a contractor, agent or employee of the partnership or GP',
      'Voting on dissolution, removal of GP, amendments',
      'Serving on advisory committee'
    ]
  },
  difc: {
    hasSafeHarbor: true,
    legislation: 'Limited Partnership Law (DIFC Law No. 4/2006) Art. 36 — safe harbor',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Voting on specified matters',
      'Serving on advisory committee',
      'Approving or disapproving amendments',
      'Acting as surety or guarantor'
    ]
  },
  adgm: {
    hasSafeHarbor: true,
    legislation: 'Limited Partnership Regulations 2017 (ADGM) — safe harbor provisions',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Voting on specified matters',
      'Serving on advisory committee',
      'Enforcing partnership agreement rights',
      'Approving or disapproving amendments'
    ]
  },
  jersey: {
    hasSafeHarbor: true,
    legislation: 'Limited Partnerships (Jersey) Law 1994 Art. 19 — safe harbor',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Voting on dissolution, amendments, removal of GP',
      'Serving on advisory committee',
      'Acting as contractor or agent of partnership'
    ]
  },
  guernsey: {
    hasSafeHarbor: true,
    legislation: 'Limited Partnerships (Guernsey) Law 1995 s.10 — safe harbor',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Voting on major decisions',
      'Serving on advisory committee',
      'Acting as contractor or employee of the partnership'
    ]
  },
  ireland: {
    hasSafeHarbor: true,
    legislation: 'Investment Limited Partnerships Act 1994 (as amended 2021) s.6 — safe harbor',
    protectedActivities: [
      'Consulting with and advising the GP',
      'Voting on removal of GP, amendments, dissolution',
      'Serving on advisory committee',
      'Approving or disapproving valuations',
      'Enforcing rights under partnership agreement'
    ]
  },
  switzerland: {
    hasSafeHarbor: false,
    legislation: 'CO Art. 600 — Kommanditär excluded from management',
    protectedActivities: [
      'Right to inspect books (Art. 600 CO)',
      'Right to object to extraordinary acts',
      'Advisory roles acceptable if not amounting to management'
    ]
  },
  netherlands: {
    hasSafeHarbor: false,
    legislation: 'BW (Burgerlijk Wetboek) — commanditaire vennoot may not manage (beheersverbod)',
    protectedActivities: [
      'Strict management prohibition (beheersverbod)',
      'Advisory roles carry risk of triggering unlimited liability',
      'Voting on limited matters under CV agreement'
    ]
  },
  norwegian: {
    hasSafeHarbor: false,
    legislation: 'Selskapsloven §3-9 — stille deltaker (silent partner) restrictions',
    protectedActivities: [
      'Limited partner should not participate in management',
      'Advisory role acceptable if not management',
      'Voting on key decisions under partnership agreement'
    ]
  },
  finnish: {
    hasSafeHarbor: false,
    legislation: 'Laki 1988/389 — äänetön yhtiömies (silent partner) restricted from management',
    protectedActivities: [
      'Silent partner excluded from management',
      'Right to inspect books',
      'Consent rights for partnership agreement changes'
    ]
  },
  estonian: {
    hasSafeHarbor: false,
    legislation: 'Äriseadustik §§125–139 — usaldusosanik restricted from management',
    protectedActivities: [
      'Limited partner may not represent the partnership externally',
      'Internal advisory roles may be permissible',
      'Voting on amendments to partnership agreement'
    ]
  },
  lithuanian: {
    hasSafeHarbor: false,
    legislation: 'Ūkinių bendrijų įstatymas — komanditorius restricted from management',
    protectedActivities: [
      'Limited partner may not participate in management',
      'May exercise supervisory rights under partnership agreement',
      'Voting on key decisions as provided in agreement'
    ]
  },
  japanese: {
    hasSafeHarbor: true,
    legislation: 'Investment Limited Partnership Act 1998 (LPS Act) Art. 7 — LP safe harbor',
    protectedActivities: [
      'Monitoring and advising the GP on investments',
      'Approving or disapproving investment decisions above threshold',
      'Serving on advisory committee',
      'Voting on amendments, dissolution, admission of partners',
      'Inspecting partnership books and records'
    ]
  },
  korean: {
    hasSafeHarbor: true,
    legislation: 'FSCMA Art. 9(19), 249-2 et seq. — PEF LP safe harbor provisions',
    protectedActivities: [
      'Approving or disapproving investment decisions',
      'Serving on LP advisory committee',
      'Voting on amendments to partnership agreement',
      'Voting on removal/replacement of GP',
      'Participating in partner meetings'
    ]
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// 8. CORPORATE_GOVERNANCE — Board/governance basics
// ═════════════════════════════════════════════════════════════════════════════

const CORPORATE_GOVERNANCE = {
  english: {
    minDirectors: 1,
    residencyRequirement: 'No statutory requirement (but recommended for tax/substance)',
    specialResolutionThreshold: '75% (Companies Act 2006 s.283)'
  },
  delaware: {
    minDirectors: 1,
    residencyRequirement: 'No residency requirement',
    specialResolutionThreshold: 'Majority of outstanding shares (DGCL §242 for charter amendments); supermajority may be set in charter'
  },
  singapore: {
    minDirectors: 1,
    residencyRequirement: 'At least 1 director ordinarily resident in Singapore',
    specialResolutionThreshold: '75% (Companies Act s.184)'
  },
  hong_kong: {
    minDirectors: 1,
    residencyRequirement: 'No residency requirement (at least 1 natural person director)',
    specialResolutionThreshold: '75% (Companies Ordinance Cap. 622 s.564)'
  },
  italian: {
    minDirectors: 1,
    residencyRequirement: 'No statutory requirement (tax residency of company depends on place of effective management)',
    specialResolutionThreshold: '66.67% (extraordinary resolution) — Codice Civile Art. 2368'
  },
  french: {
    minDirectors: 3,
    residencyRequirement: 'No nationality/residency requirement for SA directors (since 2019 PACTE Law)',
    specialResolutionThreshold: '66.67% (assemblée générale extraordinaire) — Code de commerce Art. L225-96'
  },
  swedish: {
    minDirectors: 1,
    residencyRequirement: 'At least 50% of directors and the MD must be EEA-resident (or Bolagsverket exemption)',
    specialResolutionThreshold: '66.67% (Aktiebolagslagen 2005:551 Ch.7 §42)'
  },
  danish: {
    minDirectors: 1,
    residencyRequirement: 'At least 50% of directors must be EEA/EU-resident (Selskabsloven §112)',
    specialResolutionThreshold: '66.67% of votes and capital represented (Selskabsloven §106)'
  },
  spanish: {
    minDirectors: 3,
    residencyRequirement: 'No statutory residency requirement',
    specialResolutionThreshold: '66.67% (if <50% capital present; simple majority if ≥50% present) — Ley de Sociedades de Capital Art. 201'
  },
  german: {
    minDirectors: 1,
    residencyRequirement: 'At least 1 managing director must be EU/EEA-resident (for service of process)',
    specialResolutionThreshold: '75% (GmbHG §53 for articles amendments)'
  },
  cayman: {
    minDirectors: 1,
    residencyRequirement: 'No residency requirement',
    specialResolutionThreshold: '66.67% (Companies Act (2023 Revision) s.60)'
  },
  luxembourg: {
    minDirectors: 3,
    residencyRequirement: 'No statutory requirement (recommended for substance)',
    specialResolutionThreshold: '66.67% (SA — Law of 10 August 1915 Art. 450-3)'
  },
  bvi: {
    minDirectors: 1,
    residencyRequirement: 'No residency requirement',
    specialResolutionThreshold: '75% (or as set in M&A) — BVI Business Companies Act 2004 s.60'
  },
  difc: {
    minDirectors: 1,
    residencyRequirement: 'No residency requirement',
    specialResolutionThreshold: '75% (Companies Law DIFC Law No. 5/2018 Art. 130)'
  },
  adgm: {
    minDirectors: 1,
    residencyRequirement: 'No residency requirement',
    specialResolutionThreshold: '75% (Companies Regulations 2020 s.183)'
  },
  jersey: {
    minDirectors: 1,
    residencyRequirement: 'No statutory requirement (but JFSC expects local substance)',
    specialResolutionThreshold: '66.67% (Companies (Jersey) Law 1991 Art. 90)'
  },
  guernsey: {
    minDirectors: 1,
    residencyRequirement: 'At least 1 director resident in Guernsey (GFSC requirement for licensed entities)',
    specialResolutionThreshold: '75% (Companies (Guernsey) Law 2008 s.292)'
  },
  ireland: {
    minDirectors: 2,
    residencyRequirement: 'At least 1 director EEA-resident (or s.137 bond — Companies Act 2014)',
    specialResolutionThreshold: '75% (Companies Act 2014 s.191)'
  },
  switzerland: {
    minDirectors: 1,
    residencyRequirement: 'At least 1 director or officer with Swiss domicile (CO Art. 718 para.4)',
    specialResolutionThreshold: '66.67% of votes and majority of par value represented (CO Art. 704)'
  },
  netherlands: {
    minDirectors: 1,
    residencyRequirement: 'No statutory requirement (recommended for substance)',
    specialResolutionThreshold: 'Absolute majority (BV — BW 2:230); articles may set higher thresholds'
  },
  norwegian: {
    minDirectors: 1,
    residencyRequirement: 'At least 50% of directors and the CEO must be EEA-resident (Aksjeloven §6-11)',
    specialResolutionThreshold: '66.67% of votes and capital represented (Aksjeloven §5-18)'
  },
  finnish: {
    minDirectors: 1,
    residencyRequirement: 'At least 1 director EEA-resident (or PRH exemption) — Osakeyhtiölaki Ch.6 §10',
    specialResolutionThreshold: '66.67% (Osakeyhtiölaki Ch.5 §27)'
  },
  estonian: {
    minDirectors: 1,
    residencyRequirement: 'If no board member has Estonian/EEA address, must appoint contact person in Estonia',
    specialResolutionThreshold: '66.67% (Äriseadustik §173 for OÜ)'
  },
  lithuanian: {
    minDirectors: 1,
    residencyRequirement: 'No statutory residency requirement',
    specialResolutionThreshold: '66.67% (Akcinių bendrovių įstatymas Art. 29)'
  },
  japanese: {
    minDirectors: 1,
    residencyRequirement: 'At least 1 representative director must have a Japanese address (for service of process); no nationality requirement',
    specialResolutionThreshold: '66.67% of votes present (Companies Act Art. 309(2)) — special resolution; articles amendment requires same threshold'
  },
  korean: {
    minDirectors: 1,
    residencyRequirement: 'No statutory residency requirement for directors (but representative director should be registerable at Korean court registry)',
    specialResolutionThreshold: '66.67% of votes present and >33.33% of total issued shares (Commercial Act Art. 434) — special resolution'
  }
};

// ═════════════════════════════════════════════════════════════════════════════
// TABLE REGISTRY
// ═════════════════════════════════════════════════════════════════════════════

const TABLES = {
  FUND_VEHICLES,
  NON_COMPETE_RULES,
  AIFM_REGULATION,
  CARRIED_INTEREST_TAX,
  WITHHOLDING_TAX,
  AML_FRAMEWORK,
  LP_SAFE_HARBORS,
  CORPORATE_GOVERNANCE
};

// ═════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Returns all available comparison topics.
 */
function getAllTopics() {
  return [
    'FUND_VEHICLES',
    'NON_COMPETE_RULES',
    'AIFM_REGULATION',
    'CARRIED_INTEREST_TAX',
    'WITHHOLDING_TAX',
    'AML_FRAMEWORK',
    'LP_SAFE_HARBORS',
    'CORPORATE_GOVERNANCE'
  ];
}

/**
 * Get a table by topic name.
 */
function getTable(topic) {
  return TABLES[topic] || null;
}

/**
 * Compare selected jurisdictions on a given topic.
 * @param {string} topic        — One of getAllTopics()
 * @param {string[]} jurisdictionIds — Array of jurisdiction IDs to compare
 * @returns {Object|null}       — Filtered comparison object, or null if topic invalid
 */
function compareJurisdictions(topic, jurisdictionIds) {
  const table = getTable(topic);
  if (!table) return null;
  const result = {};
  jurisdictionIds.forEach(id => {
    if (table[id]) result[id] = table[id];
  });
  return result;
}

/**
 * Get all data for a single jurisdiction across every topic.
 * @param {string} jurisdictionId — Jurisdiction ID
 * @returns {Object}              — { topicName: { ...data }, ... }
 */
function getJurisdictionProfile(jurisdictionId) {
  const profile = {};
  for (const [topic, table] of Object.entries(TABLES)) {
    if (table[jurisdictionId]) {
      profile[topic] = table[jurisdictionId];
    }
  }
  return profile;
}

/**
 * Build a formatted text block for AI prompt injection comparing jurisdictions.
 * @param {string} topic           — Topic name
 * @param {string[]} jurisdictionIds — Jurisdictions to compare
 * @returns {string}                — Formatted comparison text
 */
function buildComparisonPrompt(topic, jurisdictionIds) {
  const data = compareJurisdictions(topic, jurisdictionIds);
  if (!data || Object.keys(data).length === 0) {
    return `[No comparison data available for topic "${topic}" with jurisdictions: ${jurisdictionIds.join(', ')}]`;
  }

  const lines = [`── CROSS-JURISDICTION COMPARISON: ${topic} ──\n`];

  for (const [jId, fields] of Object.entries(data)) {
    lines.push(`▸ ${jId.toUpperCase()}`);
    for (const [key, value] of Object.entries(fields)) {
      if (Array.isArray(value)) {
        lines.push(`  ${key}:`);
        value.forEach(item => lines.push(`    • ${item}`));
      } else {
        lines.push(`  ${key}: ${value}`);
      }
    }
    lines.push('');
  }

  return lines.join('\n');
}

// ═════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═════════════════════════════════════════════════════════════════════════════

module.exports = {
  // Tables
  FUND_VEHICLES,
  NON_COMPETE_RULES,
  AIFM_REGULATION,
  CARRIED_INTEREST_TAX,
  WITHHOLDING_TAX,
  AML_FRAMEWORK,
  LP_SAFE_HARBORS,
  CORPORATE_GOVERNANCE,
  TABLES,
  JURISDICTION_IDS,

  // Functions
  getAllTopics,
  getTable,
  compareJurisdictions,
  getJurisdictionProfile,
  buildComparisonPrompt
};
