/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Formatters
   Date/time in Asia/Kolkata, unit formatting with tabular numerals.
   ────────────────────────────────────────────────────────────────── */

const IST_TIMEZONE = 'Asia/Kolkata';

const dateTimeFormat = new Intl.DateTimeFormat('en-IN', {
  timeZone: IST_TIMEZONE,
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const dateOnlyFormat = new Intl.DateTimeFormat('en-IN', {
  timeZone: IST_TIMEZONE,
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const timeOnlyFormat = new Intl.DateTimeFormat('en-IN', {
  timeZone: IST_TIMEZONE,
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const relativeFormat = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

/** Format ISO timestamp to IST date-time string */
export function formatDateTime(iso: string | Date | undefined | null): string {
  if (!iso) return '—';
  try {
    return dateTimeFormat.format(new Date(iso));
  } catch {
    return '—';
  }
}

/** Format ISO timestamp to date-only IST string */
export function formatDate(iso: string | Date | undefined | null): string {
  if (!iso) return '—';
  try {
    return dateOnlyFormat.format(new Date(iso));
  } catch {
    return '—';
  }
}

/** Format ISO timestamp to time-only IST string */
export function formatTime(iso: string | Date | undefined | null): string {
  if (!iso) return '—';
  try {
    return timeOnlyFormat.format(new Date(iso));
  } catch {
    return '—';
  }
}

/** Relative time (e.g., "2 hours ago", "in 5 minutes") */
export function formatRelative(iso: string | Date | undefined | null): string {
  if (!iso) return '—';
  try {
    const now = Date.now();
    const then = new Date(iso).getTime();
    const diffSec = (then - now) / 1000;
    const absDiff = Math.abs(diffSec);

    if (absDiff < 60) return relativeFormat.format(Math.round(diffSec), 'second');
    if (absDiff < 3600) return relativeFormat.format(Math.round(diffSec / 60), 'minute');
    if (absDiff < 86400) return relativeFormat.format(Math.round(diffSec / 3600), 'hour');
    return relativeFormat.format(Math.round(diffSec / 86400), 'day');
  } catch {
    return '—';
  }
}

/** Format duration in minutes to human-readable */
export function formatDuration(minutes: number | undefined | null): string {
  if (minutes === null || minutes === undefined) return '—';
  if (minutes < 1) return '<1 min';
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m > 0 ? `${h}h ${m}m` : `${h}h`;
}

/* ── Unit Formatters ────────────────────────────────────── */

/** Format a number with specified decimal places */
function fmtNum(value: number | null | undefined, decimals = 1): string {
  if (value === null || value === undefined) return '—';
  return value.toFixed(decimals);
}

export function formatVoltage(v: number | null | undefined): string {
  return `${fmtNum(v, 1)} V`;
}

export function formatCurrent(a: number | null | undefined): string {
  return `${fmtNum(a, 2)} A`;
}

export function formatPower(kw: number | null | undefined): string {
  return `${fmtNum(kw, 2)} kW`;
}

export function formatEnergy(kwh: number | null | undefined): string {
  return `${fmtNum(kwh, 2)} kWh`;
}

export function formatTemperature(c: number | null | undefined): string {
  return `${fmtNum(c, 1)} °C`;
}

export function formatFrequency(hz: number | null | undefined): string {
  return `${fmtNum(hz, 2)} Hz`;
}

export function formatPowerFactor(pf: number | null | undefined): string {
  if (pf === null || pf === undefined) return '—';
  return pf.toFixed(3);
}

export function formatPercent(v: number | null | undefined): string {
  if (v === null || v === undefined) return '—';
  return `${v.toFixed(1)}%`;
}

export function formatCount(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return new Intl.NumberFormat('en-IN').format(n);
}

/** Generic value + unit formatter */
export function formatValue(
  value: number | null | undefined,
  unit: string,
  decimals = 1,
): string {
  return `${fmtNum(value, decimals)} ${unit}`;
}
