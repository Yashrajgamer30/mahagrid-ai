/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Analytics & Performance Metrics (/analytics)
   Distribution network performance, MTTR resolution curves,
   district comparisons, and historical telemetry trends.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { BarChart3, TrendingDown } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui';
import type { AppLayoutContext } from '@/app/AppLayout';

const INCIDENT_TREND = [
  { month: 'May', incidents: 14, resolved: 14, mttaMin: 8, mttrMin: 48 },
  { month: 'Jun', incidents: 22, resolved: 21, mttaMin: 7, mttrMin: 52 },
  { month: 'Jul', incidents: 38, resolved: 36, mttaMin: 9, mttrMin: 65 }, // Monsoon spike
  { month: 'Aug', incidents: 31, resolved: 30, mttaMin: 8, mttrMin: 58 },
  { month: 'Sep', incidents: 18, resolved: 18, mttaMin: 6, mttrMin: 44 },
  { month: 'Oct', incidents: 12, resolved: 11, mttaMin: 5, mttrMin: 39 },
];

const FAULT_TYPE_BREAKDOWN = [
  { category: 'Overload', count: 18 },
  { category: 'Earth Fault', count: 24 },
  { category: 'Voltage Sag', count: 12 },
  { category: 'Cable Joint', count: 9 },
  { category: 'Lightning', count: 15 },
  { category: 'Comm Loss', count: 6 },
];

export function AnalyticsPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const { kpis } = useGridStore(selectedDistrict);
  const [timeRange, setTimeRange] = useState('6M');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Grid Reliability & Analytical Performance"
        subtitle="System Average Interruption Duration (SAIDI), MTTA/MTTR resolution indices, and multi-district fault telemetry trends."
        category="Intelligence"
        icon={<BarChart3 size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: '4px', background: 'var(--warm-gray-100)', padding: '2px', borderRadius: '8px' }}>
            {['1M', '3M', '6M', '1Y'].map((t) => (
              <button
                key={t}
                onClick={() => setTimeRange(t)}
                style={{
                  border: 'none',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: timeRange === t ? '#ffffff' : 'transparent',
                  color: timeRange === t ? 'var(--forest-green)' : 'var(--color-text-muted)',
                }}
              >
                {t}
              </button>
            ))}
          </div>
        }
      />

      {/* KPI Highlight Strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Average MTTA (Acknowledge)</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--forest-green)' }}>5.8 min</div>
          <div style={{ fontSize: '11px', color: 'var(--ok-green)', display: 'flex', alignItems: 'center', gap: 2 }}>
            <TrendingDown size={12} /> 18% improvement vs prior month
          </div>
        </div>

        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Average MTTR (Resolution)</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>42.4 min</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Across 36 Maharashtra circles</div>
        </div>

        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Grid System Availability</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--ok-green)' }}>99.82%</div>
          <div style={{ fontSize: '11px', color: 'var(--ok-green)' }}>Nominal statutory band</div>
        </div>

        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Active Work Orders</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{kpis.openWorkOrders}</div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Field squads mobilized</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: 'var(--space-6)' }}>
        {/* Incident Frequency vs Restoration Curve */}
        <div style={{ background: '#ffffff', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: 0 }}>
                Monthly Fault Incidents vs Resolved
              </h3>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Demonstrates seasonal peak during Maharashtra monsoon (Jul-Aug)
              </span>
            </div>
            <Badge variant="primary">{timeRange} View</Badge>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={INCIDENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--warm-gray-200)" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Legend />
                <Bar dataKey="incidents" name="Reported Faults" fill="#D45C3D" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Power Restored" fill="#245746" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* MTTR Progression Curve */}
        <div style={{ background: '#ffffff', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-3)' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: 0 }}>
                Mean Time to Restoration (MTTR Trend)
              </h3>
              <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                Average dispatch and restoration duration in minutes
              </span>
            </div>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={INCIDENT_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--warm-gray-200)" />
                <XAxis dataKey="month" fontSize={11} />
                <YAxis fontSize={11} unit=" m" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mttrMin" name="MTTR (Minutes)" stroke="#D45C3D" strokeWidth={2.5} />
                <Line type="monotone" dataKey="mttaMin" name="MTTA (Minutes)" stroke="#E8AB45" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Fault Category Distribution */}
      <div style={{ background: '#ffffff', padding: 'var(--space-5)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--color-border)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: '0 0 12px 0' }}>
          Historical Fault Category Breakdown
        </h3>
        <div style={{ width: '100%', height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={FAULT_TYPE_BREAKDOWN} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--warm-gray-200)" />
              <XAxis type="number" fontSize={11} />
              <YAxis dataKey="category" type="category" width={100} fontSize={11} />
              <Tooltip />
              <Bar dataKey="count" name="Recorded Incidents" fill="#245746" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
