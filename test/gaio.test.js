'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const gaio = require('../index');
const engine = require('../gaio-engine');

test('agent card is a well-formed A2A identity', () => {
  const c = gaio.AGENT_CARD;
  assert.equal(c.name, 'Gaio');
  assert.equal(c.protocol, 'a2a/1.0');
  assert.match(c.version, /^\d+\.\d+\.\d+$/);
  assert.ok(c.owner && c.owner.name);
  assert.ok(Array.isArray(c.capabilities) && c.capabilities.length > 0);
});

test('card version matches package version', () => {
  assert.equal(gaio.AGENT_CARD.version, require('../package.json').version);
});

test('each capability declares an id, name and description', () => {
  for (const cap of gaio.AGENT_CARD.capabilities) {
    assert.ok(cap.id, 'capability without an id');
    assert.ok(cap.name, `capability ${cap.id} has no name`);
    assert.ok(cap.description, `capability ${cap.id} has no description`);
  }
});

// What implements each advertised capability. Most live on the engine, but
// several are served by a sibling module, so the mapping is stated rather
// than inferred from the name.
const CAPABILITY_IMPL = {
  advise:               () => engine.advise,
  citedAdvise:          () => engine.citedAdvise,
  draft:                () => engine.draft,
  review:               () => engine.review,
  negotiate:            () => engine.negotiate,
  validate:             () => engine.validate,
  compare:              () => engine.compare,
  chat:                 () => engine.chat,
  dealBrief:            () => engine.dealBrief,
  dealMemory:           () => gaio.dealMemory.addDeal,
  citations:            () => gaio.legalCitations.searchCaseLaw,
  templates:            () => gaio.templateLibrary.findBestTemplate,
  compareJurisdictions: () => require('../jurisdiction-compare').compareJurisdictions,
  docxExport:           () => engine.generateDocx,
};

test('every declared capability is implemented', () => {
  // The card is the agent's public contract — a capability with nothing behind
  // it would be advertised but uncallable.
  const ids = gaio.AGENT_CARD.capabilities.map(c => c.id);

  const unmapped = ids.filter(id => !CAPABILITY_IMPL[id]);
  assert.deepEqual(unmapped, [], 'capabilities with no declared implementation');

  const missing = ids.filter(id => typeof CAPABILITY_IMPL[id]() !== 'function');
  assert.deepEqual(missing, [], 'capabilities whose implementation is not callable');

  const stale = Object.keys(CAPABILITY_IMPL).filter(id => !ids.includes(id));
  assert.deepEqual(stale, [], 'mapped capabilities no longer on the card');
});

test('knowledge bases are populated', () => {
  const jurisdictions = Object.keys(gaio.jurisdictions.JURISDICTIONS || {});
  const documents = Object.keys(gaio.documentKB.DOCUMENTS || {});
  const templates = Object.keys(gaio.templateLibrary.TEMPLATES || {});

  // The card claims 26 jurisdictions, 56 document types and 79 templates;
  // hold the knowledge bases to that rather than to a non-empty check.
  assert.ok(jurisdictions.length >= 26, `expected >= 26 jurisdictions, found ${jurisdictions.length}`);
  assert.ok(documents.length >= 56, `expected >= 56 document types, found ${documents.length}`);
  assert.ok(templates.length >= 79, `expected >= 79 templates, found ${templates.length}`);
});

test('jurisdiction entries carry the fields the engine reads', () => {
  for (const [key, j] of Object.entries(gaio.jurisdictions.JURISDICTIONS || {})) {
    assert.ok(j.name, `jurisdiction ${key} has no name`);
  }
});

test('supporting modules load', () => {
  for (const name of ['legalKB', 'legalCitations', 'dealMemory', 'agentBridge', 'sandbox', 'templateLibrary']) {
    assert.ok(gaio[name], `${name} is not exported`);
  }
});

test('importing the library does not start a server', () => {
  const handles = process._getActiveHandles().filter(h => h.constructor.name === 'Server');
  assert.equal(handles.length, 0, 'importing @tabularum/gaio bound a listening socket');
});
