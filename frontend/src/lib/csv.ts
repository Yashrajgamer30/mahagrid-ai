/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – CSV Export Helpers
   ────────────────────────────────────────────────────────────────── */

interface CsvOptions {
  filename: string;
  headers: string[];
  rows: (string | number | null | undefined)[][];
  /** Optional metadata lines prepended at top (e.g. filter info) */
  metadata?: string[];
}

/** Escape a CSV cell value */
function escapeCell(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Generate CSV content string */
export function generateCsv(options: CsvOptions): string {
  const { headers, rows, metadata } = options;
  const lines: string[] = [];

  // Metadata header
  if (metadata?.length) {
    lines.push(`# MahaGrid AI Export — DEMO / SIMULATED DATA`);
    lines.push(`# Generated: ${new Date().toISOString()}`);
    metadata.forEach((m) => lines.push(`# ${m}`));
    lines.push('');
  }

  // Column headers
  lines.push(headers.map(escapeCell).join(','));

  // Data rows
  rows.forEach((row) => {
    lines.push(row.map(escapeCell).join(','));
  });

  return lines.join('\n');
}

/** Trigger browser download of CSV */
export function downloadCsv(options: CsvOptions): void {
  const csv = generateCsv(options);
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = options.filename.endsWith('.csv')
    ? options.filename
    : `${options.filename}.csv`;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
