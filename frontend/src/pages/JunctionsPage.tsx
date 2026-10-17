/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Junctions & Ring Main Units (/junctions)
   Junction RMU register, connected meters, and operational state.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Cpu, MapPin, Download } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import { AssetStatus, ASSET_STATUS_LABELS } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function JunctionsPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { junctions } = useGridStore(selectedDistrict);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = junctions.filter((j) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return j.name.toLowerCase().includes(term) || j.id.toLowerCase().includes(term);
  });

  const handleExportCsv = () => {
    downloadCsv({
      filename: `mahagrid_junctions_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers: ['Junction_ID', 'Name', 'Connected_Meters', 'Feeding_Feeder', 'City', 'Status'],
      rows: filtered.map((j) => [j.id, j.name, j.connectedMeters, j.feederName || '', j.city, j.status]),
      metadata: [`District: ${selectedDistrict}`],
    });
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `${filtered.length} junction records exported.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Junctions & Ring Main Units (RMU)"
        subtitle="Sectionalizing points and feeder interchange nodes distributing power to consumer clusters."
        category="Asset Management"
        icon={<Cpu size={22} />}
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
            placeholder="Search junction..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '240px' }}
          />
          <Badge variant="primary">{filtered.length} Junctions Active</Badge>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Junction ID</Th>
              <Th>Junction Name</Th>
              <Th>Feeding Feeder</Th>
              <Th>Connected Meters</Th>
              <Th>District</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((jnc) => (
              <tr key={jnc.id}>
                <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{jnc.id}</Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{jnc.name}</div>
                </Td>
                <Td>{jnc.feederName || 'Express Feeder'}</Td>
                <Td>{jnc.connectedMeters || 100} Meters</Td>
                <Td>{jnc.city}</Td>
                <Td>
                  <Badge
                    variant={
                      jnc.status === AssetStatus.NORMAL
                        ? 'success'
                        : jnc.status === AssetStatus.FAULT
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {ASSET_STATUS_LABELS[jnc.status]}
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
