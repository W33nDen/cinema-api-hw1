import { isCalendarDate, parseIsoDateTime } from './date.utils';

describe('date utils', () => {
  it('treats a date-time without a time zone as UTC', () => {
    expect(parseIsoDateTime('2030-01-15T18:00:00')?.toISOString()).toBe(
      '2030-01-15T18:00:00.000Z',
    );
  });

  it('respects an explicit offset', () => {
    expect(parseIsoDateTime('2030-01-15T01:00:00+03:00')?.toISOString()).toBe(
      '2030-01-14T22:00:00.000Z',
    );
  });

  it('returns null for garbage', () => {
    expect(parseIsoDateTime('not a date')).toBeNull();
  });

  it('accepts only existing calendar days', () => {
    expect(isCalendarDate('2028-02-29')).toBe(true);
    expect(isCalendarDate('2030-02-30')).toBe(false);
    expect(isCalendarDate('15-01-2030')).toBe(false);
  });
});
