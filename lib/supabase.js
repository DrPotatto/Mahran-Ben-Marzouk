// Optional Supabase integration WITHOUT the supabase-js dependency:
// a single REST insert using the public "anon" key.
//
// Security model:
//  - Only the project URL and the *anon* key are read (NEXT_PUBLIC_*).
//  - A key whose JWT role is "service_role" is refused outright.
//  - Row Level Security must allow INSERT only for the anon role (see README).

function decodeJwtRole(token) {
  try {
    const part = String(token).split('.')[1];
    if (!part) return null;
    const b64 = part.replace(/-/g, '+').replace(/_/g, '/');
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4);
    const json = typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString();
    return JSON.parse(json).role ?? null;
  } catch {
    return null;
  }
}

/** Returns `{ url, anonKey }` or `null` when not (safely) configured. */
export function getSupabaseConfig(env = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
}) {
  const url = String(env.url ?? '').trim().replace(/\/+$/, '');
  const anonKey = String(env.anonKey ?? '').trim();
  if (!url || !anonKey) return null;
  if (!/^https:\/\/[^\s/]+$/i.test(url)) return null;
  if (decodeJwtRole(anonKey) === 'service_role') {
    if (typeof console !== 'undefined') {
      console.error(
        '[7DCONSTRUCTION] A Supabase service_role key was supplied to a public variable. It was ignored. Use the anon key only.'
      );
    }
    return null;
  }
  return { url, anonKey };
}

export function isSupabaseConfigured(env) {
  return getSupabaseConfig(env) !== null;
}

/**
 * Insert one inquiry row. Resolves `{ ok: true }` only if the server answered 2xx.
 * `config` / `fetchImpl` are injectable for tests.
 */
export async function insertInquiry(row, { config = getSupabaseConfig(), fetchImpl, timeoutMs = 10000 } = {}) {
  if (!config) return { ok: false, error: 'not-configured' };
  const doFetch = fetchImpl || (typeof fetch === 'function' ? fetch : null);
  if (!doFetch) return { ok: false, error: 'no-fetch' };

  const controller = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
  try {
    const res = await doFetch(`${config.url}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(row),
      signal: controller ? controller.signal : undefined,
    });
    if (!res.ok) return { ok: false, error: `http-${res.status}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err && err.name === 'AbortError' ? 'timeout' : 'network' };
  } finally {
    if (timer) clearTimeout(timer);
  }
}
