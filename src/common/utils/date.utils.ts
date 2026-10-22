/** Time zone designator at the end of an ISO 8601 date-time: Z, +03:00, +0300, +03. */
const TIME_ZONE_SUFFIX = /(Z|[+-]\d{2}(:?\d{2})?)$/i;

/**
 * Parses an ISO 8601 date-time string into a Date.
 * A date-time without a time zone designator is treated as UTC,
 * so the result never depends on the server's local time zone.
 * Returns null when the string cannot be parsed.
 */
export function parseIsoDateTime(value: string): Date | null {
  const normalized = TIME_ZONE_SUFFIX.test(value) ? value : `${value}Z`;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** True when `value` is a real calendar date in YYYY-MM-DD form (2030-02-30 is not). */
export function isCalendarDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const date = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
