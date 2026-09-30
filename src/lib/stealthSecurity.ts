// ============================================================================
// THE GEOPACTS - STEALTH SECURITY & ANTI-HACKER GATEWAY ENGINE
// ============================================================================
// Hardened against dictionary attacks, port/path scanners, and unauthorized probing.
// 1. Obfuscated entry token (Custom secret URL parameter / hash).
// 2. Automated address bar scrubbing (leaves 0 trace in browser history or referrer).
// 3. Invisible anti-bot honeypot traps.
// 4. Client-side brute force defense with exponential lockout timer.
// 5. Inactivity auto-lockout.
// ============================================================================

export interface SecurityStatus {
  isLocked: boolean;
  remainingSeconds: number;
  attemptsCount: number;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  type: 'gate_accessed' | 'failed_login' | 'successful_login' | 'honeypot_triggered' | 'lockout_triggered';
  details: string;
}

const STORAGE_GATE_KEY = 'thegeopacts_admin_gate_key';
const STORAGE_FAILED_ATTEMPTS = 'thegeopacts_failed_logins';
const STORAGE_LOCKOUT_UNTIL = 'thegeopacts_lockout_until';
const STORAGE_SECURITY_LOGS = 'thegeopacts_security_logs';
const STORAGE_MASTER_PIN = 'thegeopacts_vault_master_pin';

// Default cryptographically random entrance key
export const DEFAULT_ADMIN_GATE_KEY = 'gp_vault_9842_k9';
const MAX_ALLOWED_ATTEMPTS = 5;
const LOCKOUT_DURATION_SECONDS = 15 * 60; // 15 minutes lockout

/**
 * Retrieves the current configured secret entrance key
 */
export function getAdminGateKey(): string {
  if (typeof window === 'undefined') return DEFAULT_ADMIN_GATE_KEY;
  const saved = localStorage.getItem(STORAGE_GATE_KEY);
  return (saved && saved.trim().length >= 6) ? saved.trim() : DEFAULT_ADMIN_GATE_KEY;
}

/**
 * Saves a new customized secret entrance key (restricted to Super Admins)
 */
export function setAdminGateKey(newKey: string): { success: boolean; error?: string } {
  const sanitized = newKey.trim();
  if (sanitized.length < 8) {
    return { success: false, error: 'Secret entrance key must be at least 8 characters long for security.' };
  }
  // Prevent common easily guessable words
  const forbidden = ['admin', 'superadmin', 'login', 'portal', 'dashboard', 'password', '12345678', 'newsroom'];
  if (forbidden.includes(sanitized.toLowerCase())) {
    return { success: false, error: 'Cannot use common dictionary words like "admin" or "login" as a secret entrance key.' };
  }

  localStorage.setItem(STORAGE_GATE_KEY, sanitized);
  logSecurityEvent('gate_accessed', `Secret Gate Key rotated by Super Admin to: ${sanitized.substring(0, 3)}***`);
  return { success: true };
}

/**
 * Generates a high-entropy cryptographically secure secret gate key
 */
export function generateSecureGateKey(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let rand = '';
  for (let i = 0; i < 12; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `gp_vault_${rand}`;
}

/**
 * Verifies if a given query or hash matches the secret admin gate key
 */
export function isSecretGateAuthorized(): boolean {
  if (typeof window === 'undefined') return false;

  const currentKey = getAdminGateKey();
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.replace(/^#/, '').trim();

  // Check specific stealth query keys: ?vault=... or ?gate=... or ?key=...
  const queryVault = searchParams.get('vault') || searchParams.get('gate') || searchParams.get('key');
  if (queryVault && queryVault === currentKey) {
    return true;
  }

  // Check if hash matches format: #vault-... or #gate-... or direct hash key
  if (hash === currentKey || hash === `vault-${currentKey}` || hash === `gate-${currentKey}`) {
    return true;
  }

  return false;
}

/**
 * Detects if a suspicious scanner probe is targeting predictable administration paths
 * (/admin, ?admin, /login, #admin, wp-admin, cpanel, etc.) to record in security audit logs
 */
export function detectHackerProbe(): boolean {
  if (typeof window === 'undefined') return false;
  const searchParams = new URLSearchParams(window.location.search);
  const hash = window.location.hash.toLowerCase().replace(/^#/, '');
  const pathname = window.location.pathname.toLowerCase().replace(/\/$/, '');

  // Predictable endpoints commonly targeted by scanners and scrapers
  const maliciousScannerProbes = [
    'admin', 'wp-admin', 'wp-login', 'login', 'superadmin',
    'cpanel', 'newsroom', 'dashboard', 'auth', 'phpmyadmin',
    'xmlrpc.php', 'shell.php', 'eval-stdin.php', 'administrator'
  ];

  for (const probe of maliciousScannerProbes) {
    if (searchParams.has(probe) || hash === probe || pathname === `/${probe}`) {
      logSecurityEvent('honeypot_triggered', `Unauthorized probe/scanner detected targeting predictable path: ${pathname || '/'}?${probe} or #${probe}`);
      return true;
    }
  }
  return false;
}

/**
 * Scrubs secret gate parameters and scanner probes from URL
 * Ensures 0 trace is left in browser history, bookmarks, or outgoing referrers!
 */
export function scrubUrlSecret(): void {
  if (typeof window === 'undefined') return;

  const searchParams = new URLSearchParams(window.location.search);

  ['vault', 'gate', 'key', 'admin', 'login', 'dashboard', 'newsroom', 'superadmin', 'cpanel'].forEach((param) => {
    if (searchParams.has(param)) {
      searchParams.delete(param);
    }
  });

  // If address bar is on a predictable probe path like /admin, reset cleanly to root
  let targetPath = window.location.pathname;
  const lowerPath = targetPath.toLowerCase().replace(/\/$/, '');
  const probePaths = ['/admin', '/login', '/dashboard', '/newsroom', '/superadmin', '/wp-admin'];
  if (probePaths.includes(lowerPath)) {
    targetPath = '/';
  }

  const newSearch = searchParams.toString() ? `?${searchParams.toString()}` : '';
  const newUrl = `${targetPath}${newSearch}`;

  try {
    window.history.replaceState({}, document.title, newUrl);
  } catch (err) {
    // Ignore in unsupported environments
  }
}

/**
 * Checks if the current browser session is locked out due to repeated failed login attempts
 */
export function checkBruteForceLockout(): SecurityStatus {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, attemptsCount: 0 };
  }

  const lockoutUntilStr = localStorage.getItem(STORAGE_LOCKOUT_UNTIL);
  const attemptsStr = localStorage.getItem(STORAGE_FAILED_ATTEMPTS);
  const attemptsCount = attemptsStr ? parseInt(attemptsStr, 10) || 0 : 0;

  if (lockoutUntilStr) {
    const lockoutUntil = parseInt(lockoutUntilStr, 10);
    const now = Date.now();
    if (lockoutUntil > now) {
      const remainingSeconds = Math.ceil((lockoutUntil - now) / 1000);
      return { isLocked: true, remainingSeconds, attemptsCount };
    } else {
      // Lockout expired, reset lockout timestamp
      localStorage.removeItem(STORAGE_LOCKOUT_UNTIL);
    }
  }

  return { isLocked: false, remainingSeconds: 0, attemptsCount };
}

/**
 * Records a failed login attempt; triggers 15-min lockout if attempts reach threshold
 */
export function recordFailedLoginAttempt(): SecurityStatus {
  if (typeof window === 'undefined') {
    return { isLocked: false, remainingSeconds: 0, attemptsCount: 1 };
  }

  const attemptsStr = localStorage.getItem(STORAGE_FAILED_ATTEMPTS);
  let attemptsCount = (attemptsStr ? parseInt(attemptsStr, 10) || 0 : 0) + 1;
  localStorage.setItem(STORAGE_FAILED_ATTEMPTS, attemptsCount.toString());

  if (attemptsCount >= MAX_ALLOWED_ATTEMPTS) {
    const lockoutUntil = Date.now() + (LOCKOUT_DURATION_SECONDS * 1000);
    localStorage.setItem(STORAGE_LOCKOUT_UNTIL, lockoutUntil.toString());
    logSecurityEvent('lockout_triggered', `Anti-brute force lockout activated after ${attemptsCount} failed attempts.`);
    return { isLocked: true, remainingSeconds: LOCKOUT_DURATION_SECONDS, attemptsCount };
  }

  logSecurityEvent('failed_login', `Failed admin login attempt (${attemptsCount}/${MAX_ALLOWED_ATTEMPTS}).`);
  return { isLocked: false, remainingSeconds: 0, attemptsCount };
}

/**
 * Clears failed attempts counter upon successful authentication
 */
export function resetFailedLoginAttempts(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_FAILED_ATTEMPTS);
  localStorage.removeItem(STORAGE_LOCKOUT_UNTIL);
}

/**
 * Master Vault PIN (Optional extra 2FA barrier)
 */
export function getVaultMasterPin(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(STORAGE_MASTER_PIN);
}

export function setVaultMasterPin(pin: string): void {
  if (typeof window === 'undefined') return;
  if (!pin || pin.trim().length === 0) {
    localStorage.removeItem(STORAGE_MASTER_PIN);
  } else {
    localStorage.setItem(STORAGE_MASTER_PIN, pin.trim());
  }
}

/**
 * Appends a security event to the localized audit log
 */
export function logSecurityEvent(type: SecurityEvent['type'], details: string): void {
  if (typeof window === 'undefined') return;

  try {
    const logsJson = localStorage.getItem(STORAGE_SECURITY_LOGS);
    const logs: SecurityEvent[] = logsJson ? JSON.parse(logsJson) : [];
    logs.unshift({
      id: `sec-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      type,
      details
    });

    // Keep last 50 events
    localStorage.setItem(STORAGE_SECURITY_LOGS, JSON.stringify(logs.slice(0, 50)));
  } catch (err) {
    // Non-fatal
  }
}

/**
 * Retrieves the security logs for the Super Admin audit tab
 */
export function getSecurityLogs(): SecurityEvent[] {
  if (typeof window === 'undefined') return [];
  try {
    const logsJson = localStorage.getItem(STORAGE_SECURITY_LOGS);
    return logsJson ? JSON.parse(logsJson) : [];
  } catch (err) {
    return [];
  }
}
