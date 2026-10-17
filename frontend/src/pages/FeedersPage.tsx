/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – 11kV/22kV Feeders Register (/feeders)
   Circuit length, line flow, substation parent, and GIS routing.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { GitFork, MapPin, Download } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import { AssetStatus, ASSET_STATUS_LABELS } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function FeedersPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { feeders } = useGridStore(selectedDistrict);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = feeders.filter((f) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return f.name.toLowerCase().includes(term) || f.id.toLowerCase().includes(term);
  });

  const handleExportCsv = () => {
    downloadCsv({
      filename: `mahagrid_feeders_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers: ['Feeder_ID', 'Name', 'Voltage_kV', 'Length_km', 'Transformers_Count', 'Substation', 'City', 'Status'],
      rows: filtered.map((f) => [f.id, f.name, f.voltageKv, f.lengthKm, f.transformerCount, f.substationName, f.city, f.status]),
      metadata: [`District: ${selectedDistrict}`],
    });
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `${filtered.length} feeders exported.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="11kV / 22kV Distribution Feeders"
        subtitle="Distribution overhead and underground feeder network radiating from 33kV substations to consumer clusters."
        category="Asset Management"
        icon={<GitFork size={22} />}
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
            placeholder="Search feeder name or code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '240px' }}
          />
          <Badge variant="primary">{filtered.length} Feeders Mapped</Badge>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Feeder ID</Th>
              <Th>Feeder Name</Th>
              <Th>Voltage Level</Th>
              <Th>Route Length</Th>
              <Th>DT Count</Th>
              <Th>Feeding Substation</Th>
              <Th>Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((fdr) => (
              <tr key={fdr.id}>
                <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{fdr.id}</Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{fdr.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{fdr.city}</div>
                </Td>
                <Td><Badge variant="neutral">{fdr.voltageKv || 11} kV</Badge></Td>
                <Td>{fdr.lengthKm} km</Td>
                <Td>{fdr.transformerCount || 8} DTs</Td>
                <Td>{fdr.substationName || 'Shivajinagar Substation'}</Td>
                <Td>
                  <Badge
                    variant={
                      fdr.status === AssetStatus.NORMAL
                        ? 'success'
                        : fdr.status === AssetStatus.FAULT
                        ? 'danger'
                        : 'warning'
                    }
                  >
                    {ASSET_STATUS_LABELS[fdr.status]}
                  </Badge>
                </Td>
                <Td>
                  <Button variant="outline" size="sm" leftIcon={<MapPin size={12} />} onClick={() => navigate('/map')}>
                    Route
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
