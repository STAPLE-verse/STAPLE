type QueryValue = string | string[] | undefined

const first = (value: QueryValue) => (Array.isArray(value) ? value[0] : value)

/**
 * Where to send someone who came to STAPLE's sign-up from MARKER
 * (`/auth/signup?from=marker`), once their account exists: MARKER's login
 * page. Returns null for an ordinary STAPLE sign-up, or when no MARKER
 * address is configured.
 *
 * The destination host is never taken from the query string — only from
 * NEXT_PUBLIC_MARKER_URL — so this can't be used as an open redirect. `next`
 * is a path inside MARKER to land on after login; it is passed along only if
 * it is a plain same-site path (`//host` and `/\host` both resolve to another
 * site in a browser), and MARKER validates it again on its side.
 */
export function getMarkerReturnUrl(
  query: { from?: QueryValue; next?: QueryValue },
  markerUrl: string | undefined = process.env.NEXT_PUBLIC_MARKER_URL
): string | null {
  if (first(query.from) !== "marker" || !markerUrl) return null

  const params = new URLSearchParams({ registered: "1" })
  const next = first(query.next)
  if (next && next.startsWith("/") && next[1] !== "/" && next[1] !== "\\") {
    params.set("next", next)
  }

  return `${markerUrl.replace(/\/+$/, "")}/login?${params.toString()}`
}
