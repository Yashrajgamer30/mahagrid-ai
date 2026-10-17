/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Table + Pagination + Tabs + Tooltip + Drawer
   Compact primitives for the app shell and data views.
   ────────────────────────────────────────────────────────────────── */

import {
  type ReactNode,
  type ThHTMLAttributes,
  type TdHTMLAttributes,
  type TableHTMLAttributes,
  useState,
  useEffect,
  useRef,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUp,
  ArrowDown,
  X,
} from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ── Table ──────────────────────────────────────────────── */
export function Table({ className = '', children, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
      <table
        className={className}
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-sm)',
        }}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}

interface ThProps extends ThHTMLAttributes<HTMLTableCellElement> {
  sortable?: boolean;
  sorted?: 'asc' | 'desc' | false;
  onSort?: () => void;
}

export function Th({ children, sortable, sorted, onSort, style, ...props }: ThProps) {
  return (
    <th
      style={{
        padding: 'var(--space-3) var(--space-4)',
        textAlign: 'left',
        fontWeight: 'var(--weight-semibold)' as never,
        fontSize: 'var(--text-xs)',
        color: 'var(--color-text-muted)',
        textTransform: 'uppercase',
        letterSpacing: '0.04em',
        background: 'var(--color-surface-alt)',
        borderBottom: '1px solid var(--color-border)',
        cursor: sortable ? 'pointer' : 'default',
        userSelect: sortable ? 'none' : undefined,
        whiteSpace: 'nowrap',
        position: 'sticky',
        top: 0,
        zIndex: 1,
        ...style,
      }}
      onClick={sortable ? onSort : undefined}
      aria-sort={sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : undefined}
      {...props}
    >
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)' }}>
        {children}
        {sortable && sorted === 'asc' && <ArrowUp size={12} />}
        {sortable && sorted === 'desc' && <ArrowDown size={12} />}
      </span>
    </th>
  );
}

export function Td({ children, style, ...props }: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      style={{
        padding: 'var(--space-3) var(--space-4)',
        borderBottom: '1px solid var(--color-border)',
        color: 'var(--color-text)',
        fontVariantNumeric: 'tabular-nums',
        ...style,
      }}
      {...props}
    >
      {children}
    </td>
  );
}

/* ── Pagination ─────────────────────────────────────────── */
interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 25, 50, 100],
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  const btnStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
    border: '1px solid var(--color-border)',
    background: 'var(--color-surface)',
    borderRadius: 'var(--radius-md)',
    cursor: 'pointer',
    color: 'var(--color-text)',
    fontSize: 'var(--text-sm)',
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 'var(--space-3) var(--space-4)',
        fontSize: 'var(--text-sm)',
        color: 'var(--color-text-muted)',
        flexWrap: 'wrap',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
        <span>Showing {from}–{to} of {total}</span>
        {onPageSizeChange && (
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            style={{
              padding: '2px var(--space-2)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--color-border)',
              fontSize: 'var(--text-xs)',
              background: 'var(--color-surface)',
            }}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map((size) => (
              <option key={size} value={size}>{size}/page</option>
            ))}
          </select>
        )}
      </div>
      <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
        <button style={btnStyle} onClick={() => onPageChange(1)} disabled={page <= 1} aria-label="First page">
          <ChevronsLeft size={14} />
        </button>
        <button style={btnStyle} onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Previous page">
          <ChevronLeft size={14} />
        </button>
        <span style={{ display: 'flex', alignItems: 'center', padding: '0 var(--space-2)', fontSize: 'var(--text-sm)' }}>
          {page} / {totalPages}
        </span>
        <button style={btnStyle} onClick={() => onPageChange(page + 1)} disabled={page >= totalPages} aria-label="Next page">
          <ChevronRight size={14} />
        </button>
        <button style={btnStyle} onClick={() => onPageChange(totalPages)} disabled={page >= totalPages} aria-label="Last page">
          <ChevronsRight size={14} />
        </button>
      </div>
    </div>
  );
}

/* ── Tabs ───────────────────────────────────────────────── */
interface TabItem {
  value: string;
  label: string;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (value: string) => void;
}

export function Tabs({ items, value, onChange }: TabsProps) {
  return (
    <div
      role="tablist"
      style={{
        display: 'flex',
        gap: '0',
        borderBottom: '2px solid var(--color-border)',
        overflowX: 'auto',
      }}
    >
      {items.map((item) => {
        const isActive = item.value === value;
        return (
          <button
            key={item.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(item.value)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)',
              padding: 'var(--space-3) var(--space-4)',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              fontSize: 'var(--text-sm)',
              fontWeight: isActive ? 'var(--weight-semibold)' : 'var(--weight-normal)',
              color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
              marginBottom: '-2px',
              whiteSpace: 'nowrap',
              transition: 'color 0.15s, border-color 0.15s',
            } as React.CSSProperties}
          >
            {item.icon}
            {item.label}
            {item.count !== undefined && (
              <span
                style={{
                  fontSize: 'var(--text-xs)',
                  background: isActive ? 'var(--color-primary-light)' : 'var(--color-surface-alt)',
                  padding: '0 var(--space-2)',
                  borderRadius: 'var(--radius-full)',
                  fontWeight: 'var(--weight-medium)' as never,
                }}
              >
                {item.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ── Tooltip ────────────────────────────────────────────── */
interface TooltipProps {
  content: string;
  children: ReactNode;
  side?: 'top' | 'bottom';
}

export function Tooltip({ content, children, side = 'top' }: TooltipProps) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onFocus={() => setShow(true)}
      onBlur={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          role="tooltip"
          style={{
            position: 'absolute',
            [side === 'top' ? 'bottom' : 'top']: 'calc(100% + 6px)',
            left: '50%',
            transform: 'translateX(-50%)',
            padding: 'var(--space-1) var(--space-2)',
            background: 'var(--charcoal)',
            color: 'var(--color-text-inverse)',
            fontSize: 'var(--text-xs)',
            borderRadius: 'var(--radius-sm)',
            whiteSpace: 'nowrap',
            zIndex: 'var(--z-tooltip)',
            pointerEvents: 'none',
            boxShadow: 'var(--shadow-md)',
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
}

/* ── Drawer ─────────────────────────────────────────────── */
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  side?: 'right' | 'left';
  width?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = 'right',
  width: customWidth,
  size = 'md',
}: DrawerProps) {
  const width = customWidth || (size === 'sm' ? '360px' : size === 'lg' ? '540px' : '480px');
  const reducedMotion = useReducedMotion();
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
      };
      document.addEventListener('keydown', handleKey);
      return () => {
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleKey);
      };
    }
  }, [isOpen, onClose]);

  const slideFrom = side === 'right' ? { x: '100%' } : { x: '-100%' };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'var(--color-backdrop)',
              zIndex: 'var(--z-overlay)',
            }}
          />
          <motion.div
            ref={drawerRef}
            initial={reducedMotion ? {} : slideFrom}
            animate={{ x: 0 }}
            exit={reducedMotion ? {} : slideFrom}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            style={{
              position: 'fixed',
              top: 0,
              [side]: 0,
              bottom: 0,
              width,
              maxWidth: '95vw',
              background: 'var(--color-surface)',
              zIndex: 'var(--z-modal)',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: 'var(--shadow-xl)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 'var(--space-4) var(--space-5)',
                borderBottom: '1px solid var(--color-border)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', margin: 0 }}>
                {title}
              </h2>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  padding: 'var(--space-1)',
                  borderRadius: 'var(--radius-md)',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-5)' }}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
