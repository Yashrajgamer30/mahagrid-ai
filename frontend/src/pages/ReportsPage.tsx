/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Formal Engineering Reports (/reports)
   Regulatory grid performance logs, equipment inventory audits,
   printable executive summaries, and CSV data extracts.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FileText, Printer, Download } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, useToast } from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import type { AppLayoutContext } from '@/app/AppLayout';

export function ReportsPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const { addToast } = useToast();
  const { incidents, substations, transformers, workOrders } = useGridStore(selectedDistrict);

  const [reportType, setReportType] = useState<'INCIDENTS' | 'ASSETS' | 'WORK_ORDERS'>('INCIDENTS');
  const [generatedDate] = useState(() => new Date().toLocaleDateString());

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    if (reportType === 'INCIDENTS') {
      downloadCsv({
        filename: `mahagrid_incident_report_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
        headers: ['ID', 'Title', 'Severity', 'State', 'Asset', 'City', 'Detected_At'],
        rows: incidents.map((i) => [i.id, i.title, i.severity, i.state, i.assetName, i.city, i.detectedAt]),
        metadata: [`Report Type: Grid Incident Audit`, `District: ${selectedDistrict}`],
      });
    } else if (reportType === 'ASSETS') {
      downloadCsv({
        filename: `mahagrid_asset_report_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
        headers: ['ID', 'Name', 'Capacity_kVA', 'City', 'Status'],
        rows: [...substations, ...transformers].map((a) => [a.id, a.name, a.capacityKva || 0, a.city, a.status]),
        metadata: [`Report Type: Grid Equipment Inventory`, `District: ${selectedDistrict}`],
      });
    } else {
      downloadCsv({
        filename: `mahagrid_workorders_report_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
        headers: ['Order_ID', 'Incident', 'Priority', 'Assigned_Squad', 'State'],
        rows: workOrders.map((w) => [w.id, w.incidentTitle, w.priority, w.assignedTeam, w.state]),
        metadata: [`Report Type: Maintenance Performance Log`, `District: ${selectedDistrict}`],
      });
    }

    addToast({
      type: 'success',
      title: 'Report Downloaded',
      message: 'CSV file generated with verified audit headers.',
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Official Reports & Regulatory Audits"
        subtitle="Formal compliance documents and operational CSV extracts prepared for Maharashtra State Electricity Distribution inspection."
        category="Intelligence"
        icon={<FileText size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button variant="outline" size="sm" leftIcon={<Printer size={14} />} onClick={handlePrint}>
              Print Report
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Download size={14} />} onClick={handleExport}>
              Download CSV
            </Button>
          </div>
        }
      />

      {/* Report Type Selector */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', border: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {[
          { id: 'INCIDENTS', label: '1. Incident & Outage Log' },
          { id: 'ASSETS', label: '2. Substation & DT Asset Register' },
          { id: 'WORK_ORDERS', label: '3. Field Maintenance & Work Orders' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as never)}
            style={{
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              background: reportType === tab.id ? 'var(--forest-green)' : 'var(--warm-gray-100)',
              color: reportType === tab.id ? '#ffffff' : 'var(--color-text)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Report Document Preview */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-6)', border: '1px solid var(--color-border)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ borderBottom: '2px solid var(--forest-green)', paddingBottom: '16px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--forest-green)', letterSpacing: '0.06em' }}>
              GOVERNMENT OF MAHARASHTRA • SMART GRID DIGITAL TWIN
            </div>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '20px', margin: '4px 0', color: 'var(--color-text)' }}>
              {reportType === 'INCIDENTS' && 'Distribution Grid Incident & Outage Ledger'}
              {reportType === 'ASSETS' && 'Substation & Distribution Transformer Equipment Audit'}
              {reportType === 'WORK_ORDERS' && 'Field Maintenance Dispatch & SLA Resolution Report'}
            </h2>
            <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
              Jurisdiction: <strong>{selectedDistrict}</strong> • Generated on: {generatedDate}
            </div>
          </div>
          <Badge variant="primary">Validated Document</Badge>
        </div>

        {/* Content Table */}
        {reportType === 'INCIDENTS' && (
          <Table>
            <thead>
              <tr>
                <Th>Ref ID</Th>
                <Th>Incident Description</Th>
                <Th>Severity</Th>
                <Th>Status</Th>
                <Th>Asset</Th>
                <Th>Consumers Impacted</Th>
              </tr>
            </thead>
            <tbody>
              {incidents.map((inc) => (
                <tr key={inc.id}>
                  <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{inc.id}</Td>
                  <Td>{inc.title}</Td>
                  <Td><Badge variant="danger">{inc.severity}</Badge></Td>
                  <Td><Badge variant="primary">{inc.state}</Badge></Td>
                  <Td>{inc.assetName}</Td>
                  <Td>{inc.estimatedConsumers?.toLocaleString() || 0}</Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {reportType === 'ASSETS' && (
          <Table>
            <thead>
              <tr>
                <Th>Asset ID</Th>
                <Th>Asset Name</Th>
                <Th>Category</Th>
                <Th>Capacity</Th>
                <Th>City</Th>
                <Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              {[...substations, ...transformers].map((asset) => (
                <tr key={asset.id}>
                  <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{asset.id}</Td>
                  <Td>{asset.name}</Td>
                  <Td>{asset.type}</Td>
                  <Td>{(asset.capacityKva || 0).toLocaleString()} kVA</Td>
                  <Td>{asset.city}</Td>
                  <Td><Badge variant="success">{asset.status}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {reportType === 'WORK_ORDERS' && (
          <Table>
            <thead>
              <tr>
                <Th>Work Order ID</Th>
                <Th>Linked Incident</Th>
                <Th>Assigned Squad</Th>
                <Th>Emergency Vehicle</Th>
                <Th>Stage</Th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo) => (
                <tr key={wo.id}>
                  <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{wo.id}</Td>
                  <Td>{wo.incidentTitle}</Td>
                  <Td>{wo.assignedTeam}</Td>
                  <Td>{wo.demoVehicle}</Td>
                  <Td><Badge variant="primary">{wo.state}</Badge></Td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </div>
  );
}
