/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Badge Component
   ────────────────────────────────────────────────────────────────── */

import type { ReactNode } from 'react';
import styles from './Badge.module.css';

export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'critical' | 'info' | 'muted' | 'neutral';

interface BadgeProps {
  variant?: BadgeVariant;
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant = 'default', children, icon, dot, className = '' }: BadgeProps) {
  const resolvedClass =
    variant === 'critical' ? styles.danger : variant === 'neutral' ? styles.default : styles[variant] || styles.default;

  return (
    <span className={`${styles.badge} ${resolvedClass} ${className}`}>
      {dot && <span className={styles.dot} aria-hidden="true" />}
      {icon && <span className={styles.icon} aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}
