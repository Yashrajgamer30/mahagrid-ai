/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Skeleton, EmptyState, ErrorState
   ────────────────────────────────────────────────────────────────── */

import type { ReactNode } from 'react';
import { AlertTriangle, Inbox, RefreshCw } from 'lucide-react';
import { Button } from './Button';

/* ── Skeleton ───────────────────────────────────────────── */
interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  className?: string;
  count?: number;
}

export function Skeleton({
  width = '100%',
  height = 16,
  borderRadius = 'var(--radius-md)',
  className = '',
  count = 1,
}: SkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton-pulse ${className}`}
          style={{
            width: typeof width === 'number' ? `${width}px` : width,
            height: typeof height === 'number' ? `${height}px` : height,
            borderRadius,
            background: 'var(--warm-gray-200)',
            animation: 'skeleton-pulse 1.5s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
      ))}
      <style>{`
        @keyframes skeleton-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @media (prefers-reduced-motion: reduce) {
          .skeleton-pulse { animation: none !important; opacity: 0.6; }
        }
      `}</style>
    </>
  );
}

/* ── EmptyState ─────────────────────────────────────────── */
interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export function EmptyState({
  icon = <Inbox size={48} />,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-6)',
        textAlign: 'center',
        color: 'var(--color-text-muted)',
        gap: 'var(--space-3)',
      }}
    >
      <div style={{ opacity: 0.5 }}>{icon}</div>
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>
        {title}
      </h3>
      {description && <p style={{ fontSize: 'var(--text-sm)', maxWidth: '400px' }}>{description}</p>}
      {action}
    </div>
  );
}

/* ── ErrorState ─────────────────────────────────────────── */
interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
  retryLabel = 'Retry',
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-12) var(--space-6)',
        textAlign: 'center',
        gap: 'var(--space-3)',
      }}
    >
      <AlertTriangle size={48} color="var(--color-critical)" style={{ opacity: 0.8 }} />
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', color: 'var(--color-text)' }}>
        {title}
      </h3>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', maxWidth: '400px' }}>
        {message}
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} leftIcon={<RefreshCw size={14} />}>
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
