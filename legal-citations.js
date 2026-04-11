/**
 * GAIO — Legal Citation Database Access
 *
 * Searches free legal databases for real case law, statutes and regulations.
 * APIs: CourtListener (US), Caselaw Access Project (US), legislation.gov.uk (UK),
 *       EUR-Lex (EU), US Congress API, Federal Register API,
 *       Lovdata (Norway), Finlex (Finland), Riigi Teataja (Estonia),
 *       e-TAR (Lithuania), SSO (Singapore), HK e-Legislation, Fedlex (Switzerland).
 *
 * All adapters normalise results to a common schema and never throw — they
 * return [] on failure so one broken API cannot disrupt Gaio's workflow.
 */

'use strict';

// ── CONSTANTS ────────────────────────────────────────────────────────────────
const MAX_RESULTS   = 5;
const TIMEOUT_MS    = 10000;
const MAX_SUMMARY   = 500;

// ── HELPERS ──────────────────────────────────────────────────────────────────

function truncate(str, max) {
  if (!str) return '';
  str = String(str).trim();
  return str.length > max ? str.substring(0, max - 1) + '…' : str;
}

function safeFetch(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  return fetch(url, { ...options, signal: controller.signal })
    .finally(() => clearTimeout(timer));
}

function stripHtml(html) {
  if (!html) return '';
  return String(html).replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").trim();
}

// ── RESULT SCHEMA ────────────────────────────────────────────────────────────
// Every adapter returns an array of:
// {
//   source:       string,
//   title:        string,
//   citation:     string,
//   date:         string (ISO),
//   summary:      string,
//   url:          string,
//   jurisdiction: string (Gaio jurisdiction ID),
//   type:         'case' | 'statute' | 'regulation'
// }

// ── COURTLISTENER (US Case Law) ──────────────────────────────────────────────

async function searchCourtListener(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    const apiKey = process.env.COURTLISTENER_API_KEY || '';
    const headers = { 'Content-Type': 'application/json' };
    if (apiKey) headers['Authorization'] = `Token ${apiKey}`;

    const url = `https://www.courtlistener.com/api/rest/v3/search/?q=${encodeURIComponent(query)}&type=o&page_size=${limit}`;
    const res = await safeFetch(url, { headers });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).slice(0, limit).map(r => ({
      source: 'courtlistener',
      title: r.caseName || r.case_name || 'Untitled',
      citation: r.citation || (r.citations || [{}])[0]?.cite || '',
      date: r.dateFiled || r.date_filed || '',
      summary: truncate(stripHtml(r.snippet || ''), MAX_SUMMARY),
      url: r.absolute_url ? `https://www.courtlistener.com${r.absolute_url}` : '',
      jurisdiction: 'delaware',
      type: 'case'
    }));
  } catch (err) {
    console.error('[GAIO citations] CourtListener error:', err.message);
    return [];
  }
}

// ── CASELAW ACCESS PROJECT (Harvard — US Historical Case Law) ────────────────

async function searchCaseLaw(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    // Caselaw Access Project v1 API — request JSON explicitly
    const url = `https://api.case.law/v1/cases/?search=${encodeURIComponent(query)}&page_size=${limit}`;
    const res = await safeFetch(url, { headers: { 'Accept': 'application/json' } });
    if (!res.ok) return [];

    const text = await res.text();
    // Guard against HTML responses (API may return HTML for some endpoints)
    if (text.trimStart().startsWith('<')) return [];

    const data = JSON.parse(text);
    return (data.results || []).slice(0, limit).map(r => ({
      source: 'caselaw_access',
      title: r.name_abbreviation || r.name || 'Untitled',
      citation: (r.citations || [{}])[0]?.cite || '',
      date: r.decision_date || '',
      summary: truncate(stripHtml(r.preview || ''), MAX_SUMMARY),
      url: r.frontend_url || '',
      jurisdiction: 'delaware',
      type: 'case'
    }));
  } catch (err) {
    console.error('[GAIO citations] Caselaw Access error:', err.message);
    return [];
  }
}

// ── LEGISLATION.GOV.UK (UK Legislation) ──────────────────────────────────────

async function searchUKLegislation(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    const url = `https://www.legislation.gov.uk/search?text=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { headers: { 'Accept': 'application/atom+xml' } });
    if (!res.ok) return [];

    const text = await res.text();
    const results = [];

    // Parse Atom feed entries with regex (lightweight, no XML parser dependency)
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    let match;
    while ((match = entryRegex.exec(text)) !== null && results.length < limit) {
      const entry = match[1];
      const title   = (entry.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || '';
      const link    = (entry.match(/<link[^>]*href="([^"]*)"/) || [])[1] || '';
      const updated = (entry.match(/<updated>([\s\S]*?)<\/updated>/) || [])[1] || '';
      const summary = (entry.match(/<summary[^>]*>([\s\S]*?)<\/summary>/) || [])[1] || '';

      results.push({
        source: 'uk_legislation',
        title: stripHtml(title),
        citation: stripHtml(title),
        date: updated ? updated.substring(0, 10) : '',
        summary: truncate(stripHtml(summary), MAX_SUMMARY),
        url: link,
        jurisdiction: 'english',
        type: 'statute'
      });
    }
    return results;
  } catch (err) {
    console.error('[GAIO citations] UK Legislation error:', err.message);
    return [];
  }
}

// ── EUR-LEX SPARQL (EU Law) ──────────────────────────────────────────────────

async function searchEurLex(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    // Use simpler keyword matching with REGEX for broader results
    const safeQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 4).join('.*');
    const sparql = `
      PREFIX cdm: <http://publications.europa.eu/ontology/cdm#>
      SELECT DISTINCT ?celex ?title ?date WHERE {
        ?work cdm:resource_legal_id_celex ?celex .
        ?work cdm:resource_legal_date_document ?date .
        ?exp cdm:expression_belongs_to_work ?work .
        ?exp cdm:expression_title ?title .
        FILTER(LANG(?title) = "en")
        FILTER(REGEX(LCASE(?title), "${safeQuery}", "i"))
      }
      ORDER BY DESC(?date)
      LIMIT ${limit}
    `;

    const res = await safeFetch('https://publications.europa.eu/webapi/rdf/sparql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/sparql-results+json' },
      body: `query=${encodeURIComponent(sparql)}`
    });
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results?.bindings || []).slice(0, limit).map(b => ({
      source: 'eurlex',
      title: b.title?.value || 'Untitled',
      citation: b.celex?.value || '',
      date: (b.date?.value || '').substring(0, 10),
      summary: truncate(b.title?.value || '', MAX_SUMMARY),
      url: b.celex?.value ? `https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:${b.celex.value}` : '',
      jurisdiction: 'french',   // generic EU — mapped to closest Gaio jurisdiction
      type: 'statute'
    }));
  } catch (err) {
    console.error('[GAIO citations] EUR-Lex error:', err.message);
    return [];
  }
}

// ── US CONGRESS API (Federal Legislation) ────────────────────────────────────

async function searchUSCongress(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    const apiKey = process.env.CONGRESS_API_KEY || '';
    if (!apiKey) return [];  // API key required

    const url = `https://api.congress.gov/v3/bill?query=${encodeURIComponent(query)}&limit=${limit}&api_key=${apiKey}`;
    const res = await safeFetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    return (data.bills || []).slice(0, limit).map(b => ({
      source: 'us_congress',
      title: b.title || 'Untitled',
      citation: `${b.type || ''} ${b.number || ''}`.trim(),
      date: b.updateDate || b.latestAction?.actionDate || '',
      summary: truncate(b.latestAction?.text || b.title || '', MAX_SUMMARY),
      url: b.url || '',
      jurisdiction: 'delaware',
      type: 'statute'
    }));
  } catch (err) {
    console.error('[GAIO citations] US Congress error:', err.message);
    return [];
  }
}

// ── FEDERAL REGISTER API (US Regulations) ────────────────────────────────────

async function searchFederalRegister(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    const url = `https://www.federalregister.gov/api/v1/documents.json?conditions[term]=${encodeURIComponent(query)}&per_page=${limit}&order=relevance`;
    const res = await safeFetch(url);
    if (!res.ok) return [];

    const data = await res.json();
    return (data.results || []).slice(0, limit).map(r => ({
      source: 'federal_register',
      title: r.title || 'Untitled',
      citation: r.citation || `${r.volume || ''} FR ${r.start_page || ''}`.trim(),
      date: r.publication_date || '',
      summary: truncate(r.abstract || '', MAX_SUMMARY),
      url: r.html_url || '',
      jurisdiction: 'delaware',
      type: 'regulation'
    }));
  } catch (err) {
    console.error('[GAIO citations] Federal Register error:', err.message);
    return [];
  }
}

// ── LOVDATA (Norwegian Legislation & Case Law) ─────────────────────────────

async function searchLovdata(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;

    // Attempt structured API first (requires subscription key)
    const apiKey = process.env.LOVDATA_API_KEY || '';
    if (apiKey) {
      const url = `https://lovdata.no/api/search?query=${encodeURIComponent(query)}&limit=${limit}`;
      const res = await safeFetch(url, { headers: { 'Authorization': `Bearer ${apiKey}`, 'Accept': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        return (data.results || data.hits || []).slice(0, limit).map(r => ({
          source: 'lovdata',
          title: r.title || r.name || 'Untitled',
          citation: r.id || r.reference || '',
          date: (r.date || r.published || '').substring(0, 10),
          summary: truncate(stripHtml(r.summary || r.snippet || ''), MAX_SUMMARY),
          url: r.url || `https://lovdata.no/dokument/${encodeURIComponent(r.id || '')}`,
          jurisdiction: 'norwegian',
          type: r.type === 'case' ? 'case' : 'statute'
        }));
      }
    }

    // Fallback: web search endpoint (no auth required)
    const fallbackUrl = `https://lovdata.no/sok?q=${encodeURIComponent(query)}`;
    const res = await safeFetch(fallbackUrl, { headers: { 'Accept': 'text/html' } });
    if (!res.ok) return [];

    const html = await res.text();
    const results = [];
    const itemRegex = /<a[^>]*href="(\/dokument\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = itemRegex.exec(html)) !== null && results.length < limit) {
      results.push({
        source: 'lovdata',
        title: stripHtml(match[2]),
        citation: stripHtml(match[2]),
        date: '',
        summary: '',
        url: `https://lovdata.no${match[1]}`,
        jurisdiction: 'norwegian',
        type: 'statute'
      });
    }
    return results;
  } catch (err) {
    console.error('[GAIO citations] Lovdata error:', err.message);
    return [];
  }
}

// ── FINLEX (Finnish Legislation & Case Law) ─────────────────────────────────

async function searchFinlex(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;

    // Finlex search — legislation
    const url = `https://finlex.fi/fi/laki/ajantasa/?search%5Btype%5D=pika&search%5Bpika%5D=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { headers: { 'Accept': 'text/html' } });
    if (!res.ok) return [];

    const html = await res.text();
    const results = [];

    // Parse search result links
    const itemRegex = /<a[^>]*href="(\/fi\/laki\/ajantasa\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = itemRegex.exec(html)) !== null && results.length < limit) {
      const title = stripHtml(match[2]);
      if (!title) continue;
      results.push({
        source: 'finlex',
        title,
        citation: title,
        date: '',
        summary: '',
        url: `https://finlex.fi${match[1]}`,
        jurisdiction: 'finnish',
        type: 'statute'
      });
    }

    // Also try case law endpoint
    if (results.length < limit) {
      try {
        const caseUrl = `https://finlex.fi/fi/oikeus/kko/?search%5Btype%5D=pika&search%5Bpika%5D=${encodeURIComponent(query)}`;
        const caseRes = await safeFetch(caseUrl, { headers: { 'Accept': 'text/html' } });
        if (caseRes.ok) {
          const caseHtml = await caseRes.text();
          const caseRegex = /<a[^>]*href="(\/fi\/oikeus\/kko\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
          let cm;
          while ((cm = caseRegex.exec(caseHtml)) !== null && results.length < limit) {
            const cTitle = stripHtml(cm[2]);
            if (!cTitle) continue;
            results.push({
              source: 'finlex',
              title: cTitle,
              citation: cTitle,
              date: '',
              summary: '',
              url: `https://finlex.fi${cm[1]}`,
              jurisdiction: 'finnish',
              type: 'case'
            });
          }
        }
      } catch (_) { /* ignore case law sub-search failure */ }
    }

    return results;
  } catch (err) {
    console.error('[GAIO citations] Finlex error:', err.message);
    return [];
  }
}

// ── RIIGI TEATAJA (Estonian Legislation) ─────────────────────────────────────

async function searchRiigiTeataja(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    const url = `https://www.riigiteataja.ee/en/search?searchType=SIMPLE&query=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { headers: { 'Accept': 'text/html' } });
    if (!res.ok) return [];

    const html = await res.text();
    const results = [];

    // Parse result links from search page
    const itemRegex = /<a[^>]*href="(\/en\/eli\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = itemRegex.exec(html)) !== null && results.length < limit) {
      const title = stripHtml(match[2]);
      if (!title) continue;
      results.push({
        source: 'riigi_teataja',
        title,
        citation: title,
        date: '',
        summary: '',
        url: `https://www.riigiteataja.ee${match[1]}`,
        jurisdiction: 'estonian',
        type: 'statute'
      });
    }
    return results;
  } catch (err) {
    console.error('[GAIO citations] Riigi Teataja error:', err.message);
    return [];
  }
}

// ── e-TAR (Lithuanian Legislation Registry) ─────────────────────────────────

async function searchETar(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;

    // e-TAR portal search
    const url = `https://www.e-tar.lt/portal/en/legalActSearch?searchText=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { headers: { 'Accept': 'text/html' } });
    if (!res.ok) {
      // Fallback: try Seimas legal acts database
      const seimasUrl = `https://www.lrs.lt/sip/portal.show?p_r=35781&p_k=2&p_t=${encodeURIComponent(query)}`;
      const sRes = await safeFetch(seimasUrl, { headers: { 'Accept': 'text/html' } });
      if (!sRes.ok) return [];

      const sHtml = await sRes.text();
      const results = [];
      const sRegex = /<a[^>]*href="([^"]*legalAct[^"]*)"[^>]*>([\s\S]*?)<\/a>/gi;
      let sm;
      while ((sm = sRegex.exec(sHtml)) !== null && results.length < limit) {
        const title = stripHtml(sm[2]);
        if (!title) continue;
        results.push({
          source: 'e_tar',
          title,
          citation: title,
          date: '',
          summary: '',
          url: sm[1].startsWith('http') ? sm[1] : `https://www.lrs.lt${sm[1]}`,
          jurisdiction: 'lithuanian',
          type: 'statute'
        });
      }
      return results;
    }

    const html = await res.text();
    const results = [];
    const itemRegex = /<a[^>]*href="(\/portal\/en\/legalAct\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let match;
    while ((match = itemRegex.exec(html)) !== null && results.length < limit) {
      const title = stripHtml(match[2]);
      if (!title) continue;
      results.push({
        source: 'e_tar',
        title,
        citation: title,
        date: '',
        summary: '',
        url: `https://www.e-tar.lt${match[1]}`,
        jurisdiction: 'lithuanian',
        type: 'statute'
      });
    }
    return results;
  } catch (err) {
    console.error('[GAIO citations] e-TAR error:', err.message);
    return [];
  }
}

// ── SINGAPORE STATUTES ONLINE (SSO) ────────────────────────────────────────

async function searchSSOSingapore(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    const url = `https://sso.agc.gov.sg/search/act?WholeDoc=1&SearchText=${encodeURIComponent(query)}`;
    const res = await safeFetch(url, { headers: { 'Accept': 'text/html' } });
    if (!res.ok) return [];

    const html = await res.text();
    const results = [];

    // Parse search results — SSO returns links like /Act/CAP50
    const itemRegex = /<a[^>]*href="(\/Act\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = itemRegex.exec(html)) !== null && results.length < limit) {
      const title = stripHtml(match[2]);
      if (!title || title.length < 3) continue;
      results.push({
        source: 'sso_singapore',
        title,
        citation: title,
        date: '',
        summary: '',
        url: `https://sso.agc.gov.sg${match[1]}`,
        jurisdiction: 'singapore',
        type: 'statute'
      });
    }
    return results;
  } catch (err) {
    console.error('[GAIO citations] SSO Singapore error:', err.message);
    return [];
  }
}

// ── HONG KONG e-LEGISLATION ────────────────────────────────────────────────

async function searchHKeLegislation(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;
    const url = `https://www.elegislation.gov.hk/search?keyword=${encodeURIComponent(query)}&lang=en`;
    const res = await safeFetch(url, { headers: { 'Accept': 'text/html' } });
    if (!res.ok) return [];

    const html = await res.text();
    const results = [];

    // Parse search result links — typically /hk/cap32 style paths
    const itemRegex = /<a[^>]*href="(\/hk\/[^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
    let match;
    while ((match = itemRegex.exec(html)) !== null && results.length < limit) {
      const title = stripHtml(match[2]);
      if (!title || title.length < 3) continue;
      results.push({
        source: 'hk_elegislation',
        title,
        citation: title,
        date: '',
        summary: '',
        url: `https://www.elegislation.gov.hk${match[1]}`,
        jurisdiction: 'hong_kong',
        type: 'statute'
      });
    }
    return results;
  } catch (err) {
    console.error('[GAIO citations] HK e-Legislation error:', err.message);
    return [];
  }
}

// ── FEDLEX (Swiss Federal Legislation) ──────────────────────────────────────

async function searchFedlex(query, options = {}) {
  try {
    const limit = options.maxResults || MAX_RESULTS;

    // Fedlex SPARQL endpoint for Swiss classified compilation (SR/RS)
    const safeQuery = query.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).slice(0, 4).join('.*');
    const sparql = `
      PREFIX jolux: <http://data.legilux.public.lu/resource/ontology/jolux#>
      PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
      SELECT DISTINCT ?sr ?title WHERE {
        ?act a jolux:ConsolidationAbstract ;
             jolux:classifiedByTaxonomyEntry ?entry ;
             jolux:isRealizedBy ?expr .
        ?entry skos:notation ?sr .
        ?expr jolux:isEmbodiedBy ?manif ;
              jolux:language <http://publications.europa.eu/resource/authority/language/ENG> .
        ?expr jolux:title ?title .
        FILTER(REGEX(LCASE(?title), "${safeQuery}", "i"))
      }
      LIMIT ${limit}
    `;

    const res = await safeFetch('https://fedlex.data.admin.ch/sparqlendpoint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/sparql-results+json' },
      body: `query=${encodeURIComponent(sparql)}`
    });

    if (res.ok) {
      const data = await res.json();
      const bindings = data.results?.bindings || [];
      if (bindings.length > 0) {
        return bindings.slice(0, limit).map(b => ({
          source: 'fedlex',
          title: b.title?.value || 'Untitled',
          citation: b.sr?.value || '',
          date: '',
          summary: truncate(b.title?.value || '', MAX_SUMMARY),
          url: b.sr?.value ? `https://www.fedlex.admin.ch/eli/cc/${b.sr.value}` : 'https://www.fedlex.admin.ch/en/',
          jurisdiction: 'switzerland',
          type: 'statute'
        }));
      }
    }

    // Fallback: simple search page scrape
    const fallbackUrl = `https://www.fedlex.admin.ch/en/search#k=${encodeURIComponent(query)}`;
    return [{
      source: 'fedlex',
      title: `Fedlex search: ${query}`,
      citation: '',
      date: '',
      summary: `Search Swiss federal legislation for "${query}"`,
      url: fallbackUrl,
      jurisdiction: 'switzerland',
      type: 'statute'
    }];
  } catch (err) {
    console.error('[GAIO citations] Fedlex error:', err.message);
    return [];
  }
}

// ── JURISDICTION → API MAPPING ───────────────────────────────────────────────

const JURISDICTION_API_MAP = {
  english:     ['uk_legislation'],
  delaware:    ['courtlistener', 'caselaw_access', 'us_congress', 'federal_register'],
  singapore:   ['sso_singapore', 'eurlex'],
  hong_kong:   ['hk_elegislation', 'eurlex'],
  italian:     ['eurlex'],
  french:      ['eurlex'],
  swedish:     ['eurlex'],
  danish:      ['eurlex'],
  spanish:     ['eurlex'],
  german:      ['eurlex'],
  cayman:      ['uk_legislation'],            // English common law basis
  luxembourg:  ['eurlex'],
  bvi:         ['uk_legislation'],            // English common law basis
  difc:        ['uk_legislation'],            // English common law basis
  adgm:        ['uk_legislation'],            // English common law basis
  jersey:      ['uk_legislation'],            // English common law basis
  guernsey:    ['uk_legislation'],            // English common law basis
  ireland:     ['uk_legislation', 'eurlex'],  // Common law EU member
  switzerland: ['fedlex', 'eurlex'],          // Swiss federal law + EU-adjacent
  netherlands: ['eurlex'],                    // Civil law EU member
  norwegian:   ['lovdata', 'eurlex'],
  finnish:     ['finlex', 'eurlex'],
  estonian:    ['riigi_teataja', 'eurlex'],
  lithuanian:  ['e_tar', 'eurlex'],
};

const API_FUNCTIONS = {
  courtlistener:    searchCourtListener,
  caselaw_access:   searchCaseLaw,
  uk_legislation:   searchUKLegislation,
  eurlex:           searchEurLex,
  us_congress:      searchUSCongress,
  federal_register: searchFederalRegister,
  lovdata:          searchLovdata,
  finlex:           searchFinlex,
  riigi_teataja:    searchRiigiTeataja,
  e_tar:            searchETar,
  sso_singapore:    searchSSOSingapore,
  hk_elegislation:  searchHKeLegislation,
  fedlex:           searchFedlex,
};

// ── UNIFIED SEARCH ───────────────────────────────────────────────────────────

async function searchCitations(query, jurisdictions = []) {
  if (!query || typeof query !== 'string') return { ok: false, error: 'query is required', results: [] };

  // Determine which APIs to call
  const apiSet = new Set();
  if (jurisdictions.length === 0) {
    // Search all APIs
    Object.keys(API_FUNCTIONS).forEach(k => apiSet.add(k));
  } else {
    for (const j of jurisdictions) {
      const apis = JURISDICTION_API_MAP[j.toLowerCase().replace(/[\s-]/g, '_')] || [];
      apis.forEach(a => apiSet.add(a));
    }
  }

  // Fire all relevant API calls in parallel
  const promises = [...apiSet].map(apiName => {
    const fn = API_FUNCTIONS[apiName];
    return fn ? fn(query).then(results => ({ api: apiName, results })) : Promise.resolve({ api: apiName, results: [] });
  });

  const settled = await Promise.allSettled(promises);

  // Collect all results
  let allResults = [];
  for (const s of settled) {
    if (s.status === 'fulfilled' && s.value.results.length > 0) {
      allResults.push(...s.value.results);
    }
  }

  // Deduplicate by citation string (keep first occurrence)
  const seen = new Set();
  allResults = allResults.filter(r => {
    const key = (r.citation || r.title || '').toLowerCase().trim();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Sort: newest first
  allResults.sort((a, b) => (b.date || '').localeCompare(a.date || ''));

  return {
    ok: true,
    query,
    jurisdictions,
    resultCount: allResults.length,
    results: allResults,
    searchedAt: new Date().toISOString()
  };
}

// ── BUILD CITATION CONTEXT FOR AI PROMPT ─────────────────────────────────────

function buildCitationContext(results) {
  if (!results || results.length === 0) return '';

  const lines = results.map((r, i) => {
    const parts = [`${i + 1}.`];
    if (r.title) parts.push(r.title);
    if (r.citation) parts.push(`[${r.citation}]`);
    if (r.date) parts.push(`(${r.date})`);
    if (r.summary) parts.push(`— ${r.summary}`);
    if (r.url) parts.push(`— ${r.url}`);
    return parts.join(' ');
  });

  return `[LEGAL CITATIONS — VERIFIED EXTERNAL SOURCES]\nThe following real legal authorities were found in external databases. Where relevant, cite them using their exact citation format and include the URL.\n\n${lines.join('\n')}`;
}

// ── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  searchCourtListener,
  searchCaseLaw,
  searchUKLegislation,
  searchEurLex,
  searchUSCongress,
  searchFederalRegister,
  searchLovdata,
  searchFinlex,
  searchRiigiTeataja,
  searchETar,
  searchSSOSingapore,
  searchHKeLegislation,
  searchFedlex,
  searchCitations,
  buildCitationContext,
  JURISDICTION_API_MAP
};
