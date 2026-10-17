/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Simulation Lab & Scenario Engine (/simulation)
   End-to-end replayable grid scenario lab featuring 8 operational
   scenarios (A through H) with coherent multi-module state mutations.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  FlaskConical,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ArrowRight,
  Flame,
  Radio,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, useToast } from '@/components/ui';
import type { AppLayoutContext } from '@/app/AppLayout';

interface ScenarioDef {
  key: string;
  code: string;
  name: string;
  location: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  description: string;
  expectedOutcome: string;
  icon: typeof Zap;
}

const SCENARIOS: ScenarioDef[] = [
  {
    key: 'RESTORE_ALL',
    code: 'Scenario A / H',
    name: 'Normal Operation / Grid Restoration',
    location: 'State-wide (Maharashtra)',
    severity: 'LOW',
    description: 'Synchronizes all busbars, clears simulated alarms, restores 100% nominal voltage & temperature.',
    expectedOutcome: 'All assets return to NORMAL status; incidents marked POWER_RESTORED.',
    icon: CheckCircle2,
  },
  {
    key: 'OVERLOAD_PUNE',
    code: 'Scenario B',
    name: 'Transformer Thermal Overload',
    location: 'Pune (TRF-PUN-14 Senapati Bapat Marg)',
    severity: 'CRITICAL',
    description: 'Simulates sudden commercial A/C demand surge pushing transformer load to 98.6% and top oil to 81.2°C.',
    expectedOutcome: 'TRF-PUN-14 marked FAULT; critical alarm created on Map and Dashboard.',
    icon: Flame,
  },
  {
    key: 'VOLTAGE_SAG_MUMBAI',
    code: 'Scenario C',
    name: 'Severe Low Voltage Sag (194V)',
    location: 'Mumbai Suburban (Bandra Feeder)',
    severity: 'HIGH',
    description: 'Elevated line impedance causes statutory undervoltage breach (198V terminal voltage).',
    expectedOutcome: 'Bandra Feeder flagged WARNING; voltage compliance indicator dips.',
    icon: Zap,
  },
  {
    key: 'FEEDER_TRIP_NASHIK',
    code: 'Scenario D',
    name: '11kV Feeder Short Circuit Trip',
    location: 'Nashik (Satpur MIDC Feeder-2)',
    severity: 'CRITICAL',
    description: 'Simulates tree branch contact causing 420A zero-sequence overcurrent breaker trip.',
    expectedOutcome: 'Satpur Feeder-2 trips; 1,800 consumers impacted; dispatch workflow triggers.',
    icon: AlertTriangle,
  },
  {
    key: 'COMM_LOSS_CSN',
    code: 'Scenario E',
    name: 'IoT Telemetry Gateway Offline',
    location: 'Chhatrapati Sambhajinagar (Waluj RTU)',
    severity: 'MEDIUM',
    description: 'Cellular uplink packet timeout simulator triggers gateway disconnection alarm.',
    expectedOutcome: 'ESP32 node status changes to OFFLINE; gateway health drops.',
    icon: Radio,
  },
];

export function SimulationLabPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    simulationSession,
    runSimulationScenario,
    resetToBaseline,
  } = useGridStore(selectedDistrict);

  const [activeScenarioKey, setActiveScenarioKey] = useState<string>('OVERLOAD_PUNE');
  const [isRunning, setIsRunning] = useState(false);

  const handleExecuteScenario = (key: string) => {
    setIsRunning(true);
    setTimeout(() => {
      runSimulationScenario(key);
      setIsRunning(false);
      addToast({
        type: key === 'RESTORE_ALL' ? 'success' : 'warning',
        title: 'Simulation Injected',
        message: `Activated ${key}. Shared digital twin state updated across all views.`,
      });
    }, 500);
  };

  const handleReset = () => {
    resetToBaseline();
    addToast({
      type: 'info',
      title: 'State Reset',
      message: 'Restored deterministic Maharashtra baseline data.',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Digital Twin Simulation Lab"
        subtitle="End-to-end replayable scenario lab. Injects controlled grid anomalies to validate operator notification, fault localization, and automated crew dispatch."
        category="Intelligence"
        icon={<FlaskConical size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw size={14} />}
              onClick={handleReset}
            >
              Reset Baseline
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={isRunning}
              leftIcon={<Play size={14} />}
              onClick={() => handleExecuteScenario(activeScenarioKey)}
            >
              Trigger Selected Scenario
            </Button>
          </div>
        }
      />

      {/* Active Session Status Bar */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4) var(--space-5)', border: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
        <div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            Active Simulation State
          </span>
          <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: '2px 0' }}>
            {simulationSession.scenarioName}
          </h3>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
          <Badge
            variant={
              simulationSession.state === 'RUNNING'
                ? 'warning'
                : simulationSession.state === 'COMPLETED'
                ? 'success'
                : 'muted'
            }
          >
            {simulationSession.state}
          </Badge>
          <Badge variant="neutral">Simulation Speed: {simulationSession.speed}x</Badge>
        </div>
      </div>

      {/* Scenarios Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-4)' }}>
        {SCENARIOS.map((sc) => {
          const isSelected = activeScenarioKey === sc.key;
          const Icon = sc.icon;

          return (
            <div
              key={sc.key}
              onClick={() => setActiveScenarioKey(sc.key)}
              style={{
                background: '#ffffff',
                border: `2px solid ${isSelected ? 'var(--forest-green)' : 'var(--color-border)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-5)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-3)',
                cursor: 'pointer',
                boxShadow: isSelected ? 'var(--shadow-md)' : 'var(--shadow-xs)',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
                  {sc.code}
                </span>
                <Badge
                  variant={
                    sc.severity === 'CRITICAL'
                      ? 'danger'
                      : sc.severity === 'HIGH'
                      ? 'warning'
                      : 'info'
                  }
                >
                  {sc.severity}
                </Badge>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{ width: 32, height: 32, borderRadius: '8px', background: 'var(--color-surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={18} color="var(--forest-green)" />
                </div>
                <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: 0 }}>
                  {sc.name}
                </h4>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 600 }}>
                Location: {sc.location}
              </div>

              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                {sc.description}
              </p>

              <div style={{ marginTop: 'auto', paddingTop: 'var(--space-2)' }}>
                <Button
                  variant={isSelected ? 'primary' : 'outline'}
                  size="sm"
                  fullWidth
                  leftIcon={<Play size={12} />}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveScenarioKey(sc.key);
                    handleExecuteScenario(sc.key);
                  }}
                >
                  Execute Scenario
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Execution Event Log */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--color-border)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: '0 0 var(--space-3) 0' }}>
          Simulation Event Stream
        </h3>
        <div style={{ background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontFamily: 'monospace', fontSize: '12px' }}>
          {simulationSession.log.map((logMsg, i) => (
            <div key={i} style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--forest-green)' }}>[SIM-{i + 1}]</span>
              <span>{logMsg}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="outline" size="sm" onClick={() => navigate('/map')}>
            Verify on GIS Map <ArrowRight size={14} />
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/outages')}>
            Inspect in Outages <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
}
