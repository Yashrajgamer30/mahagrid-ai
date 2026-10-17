/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Fault Locator & Diagnostic Workspace (/fault-locator)
   Rule-based diagnostic explanation engine, electrical evidence
   telemetry, GIS coordinates, and recommended remediation checks.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  AlertTriangle,
  Brain,
  CheckCircle2,
  MapPin,
  Wrench,
  Clock,
  HelpCircle,
  FileText,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge } from '@/components/ui';
import { Severity, FAULT_CATEGORY_LABELS } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './FaultLocatorPage.module.css';

export function FaultLocatorPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { incidents } = useGridStore(selectedDistrict);

  // Active incident selector
  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    incidents[0]?.id || '',
  );

  const activeIncident =
    incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  return (
    <div className={styles.container}>
      <PageHeader
        title="Fault Locator & Root Cause Workspace"
        subtitle="Rule-based diagnostic workspace correlating SCADA alarms, phase impedance telemetry, and topology relationships to localize faults."
        category="Operations"
        icon={<AlertTriangle size={22} />}
        district={selectedDistrict}
        actions={
          <Badge variant="muted">Rule-Based Diagnostic Advisory</Badge>
        }
      />

      {/* Incident Selector Bar */}
      <div className={styles.selectorBar}>
        <div className={styles.selectGroup}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Select Active Incident:
          </label>
          <select
            className={styles.incidentSelect}
            value={activeIncident?.id || ''}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.title} ({inc.city})
              </option>
            ))}
          </select>
        </div>

        {activeIncident && (
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Badge
              variant={
                activeIncident.severity === Severity.CRITICAL
                  ? 'critical'
                  : activeIncident.severity === Severity.HIGH
                  ? 'warning'
                  : 'info'
              }
            >
              {activeIncident.severity}
            </Badge>
            <Badge variant="primary">{activeIncident.state}</Badge>
          </div>
        )}
      </div>

      {activeIncident ? (
        <div className={styles.workspaceGrid}>
          {/* Diagnostic Evidence & Analysis */}
          <div className={styles.diagnosticCard}>
            <h2 className={styles.cardTitle}>
              <Brain size={20} color="var(--forest-green)" />
              Automated Root-Cause Diagnostic Analysis
            </h2>

            {/* Diagnostic Explanation */}
            <div className={styles.causeBox}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)' }}>
                  Why Might This Have Happened?
                </strong>
                <Badge variant="neutral">Confidence: 92% (Simulated Rule Score)</Badge>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text)', lineHeight: 1.6 }}>
                {activeIncident.probableCause ||
                  'Analysis based on numeric relay trip codes, phase voltage sags, and feeder telemetry threshold rules.'}
              </p>
            </div>

            {/* Telemetry Trigger Evidence */}
            <div>
              <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Electrical Evidence Telemetry
              </h3>
              <div className={styles.evidenceGrid}>
                {activeIncident.evidence?.map((ev) => (
                  <div key={ev.id} className={styles.evidenceTile}>
                    <span className={styles.tileHeader}>{ev.type}</span>
                    <span className={styles.tileValue}>{ev.value}</span>
                    <span className={styles.tileLimit}>Threshold: {ev.threshold}</span>
                    <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', marginTop: '4px' }}>
                      <Clock size={10} style={{ display: 'inline', marginRight: '3px' }} />
                      {new Date(ev.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Action & Checks */}
            <div>
              <h3 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Recommended Field Action Steps
              </h3>
              <div className={styles.ruleList}>
                <div className={styles.ruleItem}>
                  <CheckCircle2 size={16} color="var(--ok-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Primary Isolation:</strong> {activeIncident.recommendedAction}
                  </div>
                </div>
                <div className={styles.ruleItem}>
                  <CheckCircle2 size={16} color="var(--ok-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Physical Visual Inspection:</strong> Check cable terminations and earthing conductors within a 1.2 km radius of {activeIncident.assetName}.
                  </div>
                </div>
                <div className={styles.ruleItem}>
                  <CheckCircle2 size={16} color="var(--ok-green)" style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong>Insulation Verification:</strong> Perform 5kV Megger insulation resistance test before re-energizing the circuit.
                  </div>
                </div>
              </div>
            </div>

            {/* Safety & Advisory Disclaimer */}
            <div className={styles.disclaimerBanner}>
              <HelpCircle size={16} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
              <span>
                <strong>Simulated Engineering Advisory:</strong> Diagnoses and confidence scores are deterministic rule-based inferences. Physical lockout-tagout (LOTO) protocols must be observed prior to any high-voltage field intervention.
              </span>
            </div>
          </div>

          {/* Location & Context Sidebar */}
          <div className={styles.diagnosticCard}>
            <h2 className={styles.cardTitle}>
              <MapPin size={20} color="var(--burnt-orange)" />
              Geographic & Asset Context
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--text-xs)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Target Asset:</span>
                <strong>{activeIncident.assetName}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Asset ID:</span>
                <code>{activeIncident.assetId}</code>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Category:</span>
                <span>{FAULT_CATEGORY_LABELS[activeIncident.faultCategory] || activeIncident.faultCategory}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Jurisdiction:</span>
                <span>{activeIncident.city}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Estimated Impact:</span>
                <span>{activeIncident.estimatedConsumers} Consumers</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--color-border)' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>GPS Coordinates:</span>
                <span>
                  {activeIncident.location?.lat.toFixed(4)}°N, {activeIncident.location?.lng.toFixed(4)}°E
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <Button
                variant="primary"
                leftIcon={<MapPin size={14} />}
                onClick={() => navigate('/map')}
              >
                Inspect on GIS Map
              </Button>
              <Button
                variant="outline"
                leftIcon={<Wrench size={14} />}
                onClick={() => navigate('/maintenance')}
              >
                Dispatch Work Order
              </Button>
              <Button
                variant="outline"
                leftIcon={<FileText size={14} />}
                onClick={() => navigate('/ai-analysis')}
              >
                View Explainable AI Model
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.diagnosticCard} style={{ textAlign: 'center', padding: '48px' }}>
          No active faults in the selected jurisdiction.
        </div>
      )}
    </div>
  );
}
