/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Smart Meters Telemetry (/meters)
   Smart meter register, accumulated energy (kWh), last-seen timestamps,
   communication quality, and CSV export.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Gauge, Download, MapPin } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import { AssetStatus, ASSET_STATUS_LABELS } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function MetersPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { meters } = useGridStore(selectedDistrict);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = meters.filter((m) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      m.name.toLowerCase().includes(term) ||
      m.id.toLowerCase().includes(term) ||
      (m.meterNumber && m.meterNumber.toLowerCase().includes(term))
    );
  });

  const handleExportCsv = () => {
    downloadCsv({
      filename: `mahagrid_smart_meters_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers: ['Meter_ID', 'Meter_Number', 'Name', 'Accumulated_kWh', 'Last_Seen', 'City', 'Status'],
      rows: filtered.map((m) => [m.id, m.meterNumber, m.name, m.lastReading, m.lastSeen, m.city, m.status]),
      metadata: [`District: ${selectedDistrict}`],
    });
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `${filtered.length} smart meter records exported.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Smart Electricity Meters Telemetry"
        subtitle="Automated Meter Reading (AMR/AMI) infrastructure delivering interval consumption and voltage profiles."
        category="Asset Management"
        icon={<Gauge size={22} />}
        district={selectedDistrict}
        actions={
          <Button variant="outline" size="sm" leftIcon={<Download size={14} />} onClick={handleExportCsv}>
            Export CSV
          </Button>
        }
      />

      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <input
            type="text"
            placeholder="Search meter number or landmark..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '260px' }}
          />
          <Badge variant="primary">{filtered.length} Smart Meters Connected</Badge>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Internal ID</Th>
              <Th>Meter Serial No.</Th>
              <Th>Node Description</Th>
              <Th>Accumulated Energy</Th>
              <Th>Last Seen</Th>
              <Th>City</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((mtr) => (
              <tr key={mtr.id}>
                <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{mtr.id}</Td>
                <Td style={{ fontFamily: 'monospace' }}>{mtr.meterNumber || 'MSEDCL-4091'}</Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{mtr.name}</div>
                </Td>
                <Td>
                  <strong>{(mtr.lastReading || 0).toLocaleString()}</strong> kWh
                </Td>
                <Td style={{ fontSize: '11px' }}>
                  {mtr.lastSeen ? new Date(mtr.lastSeen).toLocaleTimeString() : 'Recent'}
                </Td>
                <Td>{mtr.city}</Td>
                <Td>
                  <Badge
                    variant={
                      mtr.status === AssetStatus.NORMAL
                        ? 'success'
                        : mtr.status === AssetStatus.FAULT
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {ASSET_STATUS_LABELS[mtr.status]}
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
