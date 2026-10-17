/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Reusable Module Placeholder Component
   Phase 1 scaffold view with KPIs, active district badge,
   sample CSV download, toast feedback, and clear roadmap notice.
   ────────────────────────────────────────────────────────────────── */

import { type ReactNode } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import {
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Info,
  ChevronRight,
} from 'lucide-react';
import { Button, Badge, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './ModulePlaceholder.module.css';

export interface ModuleKpi {
  label: string;
  value: string;
  unit?: string;
  meta?: string;
  variant?: 'primary' | 'warning' | 'critical' | 'neutral';
}

export interface ModuleFeature {
  title: string;
  desc: string;
}

interface ModulePlaceholderProps {
  title: string;
  subtitle: string;
  category: string;
  icon: ReactNode;
  kpis?: ModuleKpi[];
  features?: ModuleFeature[];
  sampleCsvFilename?: string;
  sampleCsvHeaders?: string[];
  sampleCsvRows?: (string | number | null | undefined)[][];
  children?: ReactNode;
}

export function ModulePlaceholder({
  title,
  subtitle,
  category,
  icon,
  kpis = [],
  features = [],
  sampleCsvFilename,
  sampleCsvHeaders,
  sampleCsvRows,
  children,
}: ModulePlaceholderProps) {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const { addToast } = useToast();

  const handleExportSample = () => {
    if (sampleCsvHeaders && sampleCsvRows) {
      downloadCsv({
        filename: sampleCsvFilename || `${title.toLowerCase().replace(/\s+/g, '_')}_sample.csv`,
        headers: sampleCsvHeaders,
        rows: sampleCsvRows,
        metadata: [`Module: ${title}`, `District: ${selectedDistrict}`],
      });
      addToast({
        type: 'success',
        title: 'Export Started',
        message: `Sample CSV for ${title} (${selectedDistrict}) downloaded successfully.`,
      });
    } else {
      addToast({
        type: 'info',
        title: 'Sample Data',
        message: `Export prepared for ${title}. Connect live backend in Phase 2 for real database extracts.`,
      });
    }
  };

  const handleTestSimulate = () => {
    addToast({
      type: 'info',
      title: 'Simulation Pulse',
      message: `Triggered synthetic ping on ${title} for district: ${selectedDistrict}.`,
    });
  };

  return (
    <div className={styles.pageContainer}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerInfo}>
          <nav className={styles.breadcrumb} aria-label="Breadcrumb">
            <Link to="/dashboard">MahaGrid</Link>
            <ChevronRight size={12} />
            <span>{category}</span>
            <ChevronRight size={12} />
            <span aria-current="page">{title}</span>
          </nav>

          <div className={styles.titleRow}>
            <div className={styles.titleIcon} aria-hidden="true">
              {icon}
            </div>
            <h1 className={styles.title}>{title}</h1>
            <Badge variant="primary">{selectedDistrict}</Badge>
            <Badge variant="muted">Phase 1 Scaffold</Badge>
          </div>

          <p className={styles.description}>{subtitle}</p>
        </div>

        <div className={styles.headerActions}>
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Sparkles size={14} />}
            onClick={handleTestSimulate}
          >
            Simulate Event
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExportSample}
          >
            Export Sample CSV
          </Button>
        </div>
      </header>

      {/* KPI Cards */}
      {kpis.length > 0 && (
        <section className={styles.kpiGrid} aria-label="Key Performance Indicators">
          {kpis.map((kpi, idx) => (
            <div key={idx} className={styles.kpiCard}>
              <div className={styles.kpiHeader}>
                <span>{kpi.label}</span>
                {kpi.variant === 'warning' ? (
                  <AlertCircle size={14} style={{ color: 'var(--saffron)' }} />
                ) : kpi.variant === 'critical' ? (
                  <AlertCircle size={14} style={{ color: 'var(--burnt-orange)' }} />
                ) : (
                  <CheckCircle2 size={14} style={{ color: 'var(--ok-green)' }} />
                )}
              </div>
              <div className={styles.kpiValue}>
                <span>{kpi.value}</span>
                {kpi.unit && <span className={styles.kpiUnit}>{kpi.unit}</span>}
              </div>
              {kpi.meta && <span className={styles.kpiMeta}>{kpi.meta}</span>}
            </div>
          ))}
        </section>
      )}

      {/* Scaffold Banner */}
      <div className={styles.bannerNotice} role="status">
        <Info size={18} className={styles.bannerNoticeIcon} />
        <div>
          <strong>Phase 1 Architecture Active:</strong> This module interface, routing, brand tokens, and navigation shell are fully wired. In Phase 2, live PostgreSQL/Prisma models, real WebSocket telemetry, and sensor ingest feeds will bind to these cards and views.
        </div>
      </div>

      {/* Planned Capabilities */}
      {features.length > 0 && (
        <div className={styles.contentCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Planned Module Capabilities</h2>
            <Badge variant="info">{features.length} Features Defined</Badge>
          </div>
          <div className={styles.featureList}>
            {features.map((feat, idx) => (
              <div key={idx} className={styles.featureItem}>
                <CheckCircle2 size={16} className={styles.featureIcon} />
                <div>
                  <div className={styles.featureTitle}>{feat.title}</div>
                  <div className={styles.featureDesc}>{feat.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Custom Child Content (if any) */}
      {children}
    </div>
  );
}
