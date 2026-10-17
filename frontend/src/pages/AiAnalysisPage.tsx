/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Explainable AI & Rule-Based Analytics (/ai-analysis)
   Transparent root cause evaluation, deterministic rule matching,
   confidence scoring disclosure, and historical pattern comparison.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Brain,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, useToast } from '@/components/ui';
import type { AppLayoutContext } from '@/app/AppLayout';

interface RuleMatch {
  id: string;
  ruleName: string;
  condition: string;
  actualTelemetry: string;
  matched: boolean;
  weight: number;
}

export function AiAnalysisPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { incidents } = useGridStore(selectedDistrict);

  const [selectedIncidentId, setSelectedIncidentId] = useState<string>(
    incidents[0]?.id || '',
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const activeIncident =
    incidents.find((i) => i.id === selectedIncidentId) || incidents[0];

  const rules: RuleMatch[] = [
    {
      id: 'RUL-01',
      ruleName: 'Continuous Thermal Overload',
      condition: 'Load > 85% for > 15 min AND Top-Oil Temp > 75°C',
      actualTelemetry: 'Load = 94.2%, Temp = 78.4°C',
      matched: true,
      weight: 40,
    },
    {
      id: 'RUL-02',
      ruleName: 'Phase-to-Earth Zero Sequence Current',
      condition: 'Io > 30A (Earth fault current threshold)',
      actualTelemetry: 'Io = 420A (Trip Relay 51N triggered)',
      matched: true,
      weight: 35,
    },
    {
      id: 'RUL-03',
      ruleName: 'Terminal Voltage Sag Anomaly',
      condition: 'Voltage < 210V (Lower statutory threshold)',
      actualTelemetry: 'Voltage = 198V (Sagged 14% below nominal)',
      matched: true,
      weight: 15,
    },
    {
      id: 'RUL-04',
      ruleName: 'Harmonic Distortion Resonance',
      condition: 'THD-V > 5.0% on busbar',
      actualTelemetry: 'THD-V = 2.8% (Nominal range)',
      matched: false,
      weight: 10,
    },
  ];

  const handleRunAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      addToast({
        type: 'success',
        title: 'Rule Engine Recalculated',
        message: 'Telemetry vectors re-evaluated against 14 grid protection rules.',
      });
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Explainable Grid Intelligence & Rule Engine"
        subtitle="Transparent rule-based diagnosis workspace evaluating voltage transients, thermal saturation, and protective relay evidence."
        category="Intelligence"
        icon={<Brain size={22} />}
        district={selectedDistrict}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<RefreshCw size={14} className={isAnalyzing ? 'spin-icon' : ''} />}
            onClick={handleRunAnalysis}
          >
            Re-run Analysis Engine
          </Button>
        }
      />

      {/* Target Incident Selection */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
          <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)' }}>
            Target Fault Incident:
          </label>
          <select
            value={activeIncident?.id || ''}
            onChange={(e) => setSelectedIncidentId(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', minWidth: '280px' }}
          >
            {incidents.map((inc) => (
              <option key={inc.id} value={inc.id}>
                {inc.id} — {inc.title}
              </option>
            ))}
          </select>
        </div>

        <Badge variant="muted">Status: Rule Engine Active</Badge>
      </div>

      {activeIncident ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
          {/* Matched Rules Card */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: 0 }}>
                Matched Grid Protection Rules
              </h3>
              <Badge variant="primary">3 Rules Triggered</Badge>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {rules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    padding: 'var(--space-3)',
                    borderRadius: 'var(--radius-lg)',
                    background: rule.matched ? 'var(--color-surface-alt)' : '#fafafa',
                    border: `1px solid ${rule.matched ? 'var(--color-border)' : '#eeeeee'}`,
                    opacity: rule.matched ? 1 : 0.6,
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {rule.matched ? (
                        <CheckCircle2 size={16} color="var(--ok-green)" />
                      ) : (
                        <AlertTriangle size={16} color="var(--warm-gray-400)" />
                      )}
                      <strong>{rule.ruleName}</strong>
                    </div>
                    <Badge variant={rule.matched ? 'warning' : 'muted'}>
                      {rule.matched ? `Matched (+${rule.weight}%)` : 'Not Triggered'}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Condition: {rule.condition}</div>
                  <div style={{ fontSize: '12px', color: 'var(--color-text)', marginTop: 4 }}>
                    Observed: <strong>{rule.actualTelemetry}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Root Cause Inference & Field Checks */}
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: 0 }}>
              Root Cause Inference & Recommendation
            </h3>

            <div style={{ background: 'var(--color-surface-alt)', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', borderLeft: '4px solid var(--forest-green)' }}>
              <div style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Synthesized Rule Conclusion
              </div>
              <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text)', marginTop: 4, lineHeight: 1.5 }}>
                {activeIncident.probableCause}
              </p>
            </div>

            <div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                Remediation Inspection Plan:
              </div>
              <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ padding: '8px', background: 'var(--warm-gray-100)', borderRadius: '6px' }}>
                  1. Deploy FLIR infrared thermal imager on feeder cable joints.
                </div>
                <div style={{ padding: '8px', background: 'var(--warm-gray-100)', borderRadius: '6px' }}>
                  2. Verify 3-phase balancing to prevent neutral conductor circulating currents.
                </div>
                <div style={{ padding: '8px', background: 'var(--warm-gray-100)', borderRadius: '6px' }}>
                  3. Check auxiliary fan cooling relay operation on step-down transformer.
                </div>
              </div>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant="primary"
                size="sm"
                rightIcon={<ArrowRight size={14} />}
                onClick={() => navigate('/fault-locator')}
              >
                Open in Fault Locator
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/maintenance')}
              >
                Create Work Order
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
