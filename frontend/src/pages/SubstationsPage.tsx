/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Substations Management (/substations)
   Substation register, busbar voltage levels, transformer feeds,
   capacity utilization, and direct GIS links.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Zap, MapPin, Download } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import { AssetStatus, ASSET_STATUS_LABELS } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function SubstationsPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { substations } = useGridStore(selectedDistrict);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = substations.filter((s) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return s.name.toLowerCase().includes(term) || s.id.toLowerCase().includes(term);
  });

  const handleExportCsv = () => {
    downloadCsv({
      filename: `mahagrid_substations_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers: ['Substation_ID', 'Name', 'Voltage_Level', 'Capacity_kVA', 'Feeders_Count', 'City', 'Status'],
      rows: filtered.map((s) => [s.id, s.name, s.voltageLevel, s.capacityKva, s.feedersCount, s.city, s.status]),
      metadata: [`District: ${selectedDistrict}`],
    });
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `${filtered.length} substations exported.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="33/11kV & 132/33kV Substations"
        subtitle="Distribution grid transformer stations supplying municipal rings and industrial feeders across Maharashtra."
        category="Asset Management"
        icon={<Zap size={22} />}
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
            placeholder="Search substation name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '260px' }}
          />
          <Badge variant="primary">{filtered.length} Substations Monitored</Badge>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Station ID</Th>
              <Th>Substation Name</Th>
              <Th>Voltage Level</Th>
              <Th>Capacity</Th>
              <Th>Feeders</Th>
              <Th>District</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((sub) => (
              <tr key={sub.id}>
                <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{sub.id}</Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{sub.name}</div>
                </Td>
                <Td><Badge variant="neutral">{sub.voltageLevel || '33/11 kV'}</Badge></Td>
                <Td>{(sub.capacityKva || 0).toLocaleString()} kVA</Td>
                <Td>{sub.feedersCount || 4} Circuits</Td>
                <Td>{sub.city}</Td>
                <Td>
                  <Badge
                    variant={
                      sub.status === AssetStatus.NORMAL
                        ? 'success'
                        : sub.status === AssetStatus.FAULT
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {ASSET_STATUS_LABELS[sub.status]}
                  </Badge>
                </Td>
                <Td>
                  <Button variant="outline" size="sm" leftIcon={<MapPin size={12} />} onClick={() => navigate('/map')}>
                    GIS Map
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
