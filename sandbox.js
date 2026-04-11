/**
 * GAIO — Tenant Data Sandbox
 *
 * Ensures each Tabularum user's data is isolated in its own sandbox.
 * No cross-tenant data access is possible — every deal, obligation,
 * citation search and AI call is scoped to the authenticated tenant.
 *
 * Architecture:
 * - Each tenant gets a unique sandbox directory: data/<tenantId>/
 * - Deal memory, chat history, and exported documents are stored per-tenant
 * - All read/write operations go through this module — never access the
 *   filesystem directly from other modules
 * - Tenant context is set once per request/session and threaded through
 *
 * For now (single-user mode): tenantId defaults to 'default'.
 * When multi-tenant: each authenticated user gets their own tenantId.
 */

'use strict';

const fs   = require('fs');
const path = require('path');
const { AsyncLocalStorage } = require('async_hooks');

// ── CONSTANTS ────────────────────────────────────────────────────────────────

const DATA_ROOT      = path.join(__dirname, 'data');
const DEFAULT_TENANT = 'default';

// ── TENANT CONTEXT ───────────────────────────────────────────────────────────
// AsyncLocalStorage provides true per-request tenant isolation for concurrent
// requests. The module-level _currentTenantId is kept as a fallback for
// synchronous / legacy callers that haven't migrated to runWithTenant().

const tenantStorage = new AsyncLocalStorage();
let _currentTenantId = DEFAULT_TENANT;

/**
 * Set the tenant for synchronous / legacy contexts.
 * For async-safe isolation, prefer runWithTenant().
 */
function setTenant(tenantId) {
  if (!tenantId || typeof tenantId !== 'string') throw new Error('tenantId is required');
  // Sanitise: alphanumeric, dashes, underscores only — prevents path traversal
  const safe = tenantId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safe) throw new Error('Invalid tenantId');
  _currentTenantId = safe;
  _ensureSandboxDir();
  return _currentTenantId;
}

/**
 * Get the current tenant — checks AsyncLocalStorage first, then falls back
 * to the module-level variable for backward compatibility.
 */
function getTenant() {
  const store = tenantStorage.getStore();
  return store?.tenantId || _currentTenantId;
}

/**
 * Run a callback with tenant context bound via AsyncLocalStorage.
 * This is the preferred method for concurrent request handling.
 * @param {string} tenantId
 * @param {Function} callback
 * @returns {*} the return value of the callback
 */
function runWithTenant(tenantId, callback) {
  if (!tenantId || typeof tenantId !== 'string') throw new Error('tenantId is required');
  const safe = tenantId.replace(/[^a-zA-Z0-9_-]/g, '');
  if (!safe) throw new Error('Invalid tenantId');
  return tenantStorage.run({ tenantId: safe }, callback);
}

// ── SANDBOX PATHS ────────────────────────────────────────────────────────────

function _sandboxDir(tenantId) {
  return path.join(DATA_ROOT, tenantId || getTenant());
}

function _ensureSandboxDir() {
  const dir = _sandboxDir();
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

/**
 * Get the path for a data file within the current tenant's sandbox.
 * All file access MUST go through this to enforce isolation.
 */
function sandboxPath(filename) {
  if (!filename || typeof filename !== 'string') throw new Error('filename is required');
  // Prevent path traversal
  const safe = path.basename(filename);
  return path.join(_ensureSandboxDir(), safe);
}

/**
 * Get the deals.json path for the current tenant.
 * Used by deal-memory.js to initialise the store.
 */
function dealsStorePath() {
  return sandboxPath('deals.json');
}

/**
 * Get the chat history path for the current tenant.
 */
function chatHistoryPath() {
  return sandboxPath('chat-history.json');
}

/**
 * Get the exports directory for the current tenant.
 */
function exportsDir() {
  const dir = path.join(_ensureSandboxDir(), 'exports');
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

// ── SANDBOXED READ / WRITE ───────────────────────────────────────────────────

function readJSON(filename) {
  const filePath = sandboxPath(filename);
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function writeJSON(filename, data) {
  const filePath = sandboxPath(filename);
  const tmp = filePath + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8');
  fs.renameSync(tmp, filePath);
  return filePath;
}

function readText(filename) {
  const filePath = sandboxPath(filename);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, 'utf8');
}

function writeText(filename, text) {
  const filePath = sandboxPath(filename);
  fs.writeFileSync(filePath, text, 'utf8');
  return filePath;
}

// ── TENANT LISTING / ADMIN ──────────────────────────────────────────────────

function listTenants() {
  if (!fs.existsSync(DATA_ROOT)) return [];
  return fs.readdirSync(DATA_ROOT, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);
}

function tenantExists(tenantId) {
  return fs.existsSync(_sandboxDir(tenantId));
}

/**
 * Get a summary of what data a tenant has (for admin/audit).
 * Does NOT expose the data itself.
 */
function tenantInventory(tenantId) {
  const dir = _sandboxDir(tenantId || _currentTenantId);
  if (!fs.existsSync(dir)) return { exists: false };

  const files = fs.readdirSync(dir).filter(f => !f.startsWith('.'));
  return {
    exists: true,
    tenantId: tenantId || _currentTenantId,
    files: files.map(f => {
      const stat = fs.statSync(path.join(dir, f));
      return { name: f, size: stat.size, modified: stat.mtime.toISOString() };
    })
  };
}

// ── EXPORTS ──────────────────────────────────────────────────────────────────

module.exports = {
  // Tenant management
  setTenant,
  getTenant,
  runWithTenant,
  listTenants,
  tenantExists,
  tenantInventory,

  // Sandboxed paths
  sandboxPath,
  dealsStorePath,
  chatHistoryPath,
  exportsDir,

  // Sandboxed I/O
  readJSON,
  writeJSON,
  readText,
  writeText,

  // Constants
  DEFAULT_TENANT,
  DATA_ROOT
};
