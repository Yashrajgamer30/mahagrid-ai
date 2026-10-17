/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – IoT Sensors & Edge Gateways (/devices)
   ESP32 & Modbus edge sensor inventory, online/offline diagnostics,
   simulated ping tester, and firmware version tracking.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Radio, Download, MapPin, Power } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import { AssetStatus } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function IoTSensorsPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const { iotDevices, updateAssetStatus } = useGridStore(selectedDistrict);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = iotDevices.filter((d) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return d.name.toLowerCase().includes(term) || d.id.toLowerCase().includes(term) || d.deviceId.toLowerCase().includes(term);
  });

  const handleToggleDevice = (id: string, currentStatus: AssetStatus) => {
    const nextStatus = currentStatus === AssetStatus.NORMAL ? AssetStatus.OFFLINE : AssetStatus.NORMAL;
    updateAssetStatus(id, nextStatus);
    addToast({
      type: 'info',
      title: 'Sensor Status Toggled',
      message: `Gateway ${id} status set to ${nextStatus}.`,
    });
  };

  const handleExportCsv = () => {
    downloadCsv({
      filename: `mahagrid_iot_devices_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers: ['Gateway_ID', 'Hardware_ID', 'Name', 'Firmware', 'Associated_Asset', 'City', 'Status'],
      rows: filtered.map((d) => [d.id, d.deviceId, d.name, d.firmwareVersion, d.parentName || '', d.city, d.status]),
      metadata: [`District: ${selectedDistrict}`],
    });
    addToast({
      type: 'success',
      title: 'CSV Exported',
      message: `${filtered.length} sensor gateway records exported.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="IoT Sensors & Edge Gateways (ESP32 / Modbus)"
        subtitle="Edge telemetry devices publishing real-time phase voltage, thermal probe temperatures, and breaker auxiliary contact states."
        category="Asset Management"
        icon={<Radio size={22} />}
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
            placeholder="Search gateway ID or firmware..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '260px' }}
          />
          <Badge variant="primary">{filtered.length} Edge Nodes</Badge>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Node ID</Th>
              <Th>Hardware Chipset</Th>
              <Th>Gateway Name</Th>
              <Th>Associated Asset</Th>
              <Th>Firmware</Th>
              <Th>Link Status</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((dev) => (
              <tr key={dev.id}>
                <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{dev.id}</Td>
                <Td style={{ fontFamily: 'monospace' }}>
                  <Badge variant="neutral">{dev.deviceId}</Badge>
                </Td>
                <Td>
                  <div style={{ fontWeight: 600 }}>{dev.name}</div>
                  <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{dev.city}</div>
                </Td>
                <Td>{dev.parentName || 'Independent Node'}</Td>
                <Td>{dev.firmwareVersion || 'v2.4.1'}</Td>
                <Td>
                  <Badge
                    variant={
                      dev.status === AssetStatus.NORMAL
                        ? 'success'
                        : dev.status === AssetStatus.FAULT
                        ? 'danger'
                        : 'muted'
                    }
                  >
                    {dev.status === AssetStatus.NORMAL ? 'ONLINE' : 'OFFLINE'}
                  </Badge>
                </Td>
                <Td>
                  <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                    <Button
                      variant="outline"
                      size="sm"
                      title="Toggle simulated connection"
                      onClick={() => handleToggleDevice(dev.id, dev.status)}
                    >
                      <Power size={12} color={dev.status === AssetStatus.NORMAL ? 'var(--color-critical)' : 'var(--ok-green)'} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/map')}
                    >
                      <MapPin size={12} />
                    </Button>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
}
