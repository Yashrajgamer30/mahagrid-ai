/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Distribution Transformers Monitoring (/transformers)
   Thermal telemetry, load percentage calculation, oil level health,
   and abnormal temperature warnings.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Activity,
  Download,
  MapPin,
  Flame,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import { AssetStatus, ASSET_STATUS_LABELS } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function TransformersPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { transformers } = useGridStore(selectedDistrict);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filtered = transformers.filter((t) => {
    if (statusFilter !== 'ALL' && t.status !== statusFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return t.name.toLowerCase().includes(term) || t.id.toLowerCase().includes(term);
  });

  const handleExportCsv = () => {
    downloadCsv({
      filename: `mahagrid_transformers_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers: ['DT_ID', 'Name', 'Capacity_kVA', 'Load_Pct', 'Temperature_C', 'Oil_Level', 'Feeder', 'City', 'Status'],
      rows: filtered.map((t) => [
        t.id,
        t.name,
        t.capacityKva,
        t.loadPercent,
        t.temperatureC,
        t.oilLevel,
        t.feederName || '',
        t.city,
        t.status,
      ]),
      metadata: [`District: ${selectedDistrict}`],
    });
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `${filtered.length} transformer records exported.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Distribution Transformers (DT) Telemetry"
        subtitle="Continuous thermal and load monitoring of step-down transformers with automated oil temperature alarm detection."
        category="Asset Management"
        icon={<Activity size={22} />}
        district={selectedDistrict}
        actions={
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={handleExportCsv}>
            Export CSV
          </Button>
        }
      />

      {/* KPI Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Monitored DTs</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold' }}>{transformers.length}</div>
        </div>
        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Overloaded (&gt;85%)</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--color-critical)' }}>
            {transformers.filter((t) => (t.loadPercent || 0) > 85).length}
          </div>
        </div>
        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Thermal Alert (&gt;75°C)</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--saffron)' }}>
            {transformers.filter((t) => (t.temperatureC || 0) > 75).length}
          </div>
        </div>
        <div style={{ background: '#ffffff', padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Optimal Operation</div>
          <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 'bold', color: 'var(--ok-green)' }}>
            {transformers.filter((t) => t.status === AssetStatus.NORMAL).length}
          </div>
        </div>
      </div>

      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="text"
              placeholder="Search transformer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '220px' }}
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', background: '#ffffff' }}
            >
              <option value="ALL">All Statuses</option>
              <option value={AssetStatus.NORMAL}>Normal</option>
              <option value={AssetStatus.WARNING}>Warning</option>
              <option value={AssetStatus.FAULT}>Fault</option>
              <option value={AssetStatus.OFFLINE}>Offline</option>
            </select>
          </div>
          <Badge variant="primary">{filtered.length} Transformers Listed</Badge>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>DT ID</Th>
              <Th>Transformer Name</Th>
              <Th>Capacity</Th>
              <Th>Load %</Th>
              <Th>Temperature</Th>
              <Th>Oil Level</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((trf) => (
              <tr key={trf.id}>
                <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{trf.id}</Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{trf.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{trf.city} • {trf.feederName}</div>
                </Td>
                <Td>{trf.capacityKva} kVA</Td>
                <Td>
                  <span
                    style={{
                      fontWeight: 'bold',
                      color:
                        (trf.loadPercent || 0) > 90
                          ? 'var(--color-critical)'
                          : (trf.loadPercent || 0) > 80
                          ? 'var(--saffron)'
                          : 'var(--color-text)',
                    }}
                  >
                    {trf.loadPercent}%
                  </span>
                </Td>
                <Td>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {(trf.temperatureC || 0) > 75 && <Flame size={14} color="var(--color-critical)" />}
                    {trf.temperatureC}°C
                  </span>
                </Td>
                <Td>{trf.oilLevel}</Td>
                <Td>
                  <Badge
                    variant={
                      trf.status === AssetStatus.NORMAL
                        ? 'success'
                        : trf.status === AssetStatus.WARNING
                        ? 'warning'
                        : trf.status === AssetStatus.FAULT
                        ? 'danger'
                        : 'muted'
                    }
                  >
                    {ASSET_STATUS_LABELS[trf.status]}
                  </Badge>
                </Td>
                <Td>
                  <Button variant="outline" size="sm" leftIcon={<MapPin size={12} />} onClick={() => navigate('/map')}>
                    Map
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
