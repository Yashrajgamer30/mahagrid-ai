/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Reusable Page Header Component
   Consistent typography, breadcrumbs, district indicators,
   and operational action toolbars.
   ────────────────────────────────────────────────────────────────── */

import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui';
import styles from './PageHeader.module.css';

interface BreadcrumbItem {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  category: string;
  icon?: ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  district?: string;
  actions?: ReactNode;
  badges?: ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  category,
  icon,
  breadcrumbs,
  district,
  actions,
  badges,
}: PageHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/dashboard">MahaGrid</Link>
          <ChevronRight size={12} className={styles.chevron} />
          {breadcrumbs ? (
            breadcrumbs.map((b, i) => (
              <span key={i} className={styles.crumbItem}>
                {b.to ? <Link to={b.to}>{b.label}</Link> : <span>{b.label}</span>}
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight size={12} className={styles.chevron} />
                )}
              </span>
            ))
          ) : (
            <>
              <span>{category}</span>
              <ChevronRight size={12} className={styles.chevron} />
              <span aria-current="page">{title}</span>
            </>
          )}
        </nav>

        <div className={styles.titleRow}>
          <div className={styles.titleWithIcon}>
            {icon && <div className={styles.iconWrapper}>{icon}</div>}
            <h1 className={styles.title}>{title}</h1>
          </div>
          <div className={styles.badgesGroup}>
            {district && <Badge variant="primary">{district}</Badge>}
            <Badge variant="muted">DEMO TWIN</Badge>
            {badges}
          </div>
        </div>

        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {actions && <div className={styles.actions}>{actions}</div>}
    </header>
  );
}
