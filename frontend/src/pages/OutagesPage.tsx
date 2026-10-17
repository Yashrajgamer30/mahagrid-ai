/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Outages & Incident Management (/outages)
   Comprehensive incident log with status tabs, lifecycle timeline,
   action transitions, CSV export, and drawer inspector.
   ────────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Power,
  Download,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import {
  Button,
  Badge,
  Table,
  Th,
  Td,
  Drawer,
  Dialog,
  useToast,
} from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import {
  Severity,
  IncidentState,
  INCIDENT_STATE_LABELS,
  FAULT_CATEGORY_LABELS,
} from '@/types/enums';
import type { Incident } from '@/types/models';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './OutagesPage.module.css';

export function OutagesPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { incidents, updateIncidentState, createWorkOrder } =
    useGridStore(selectedDistrict);

  const [activeTab, setActiveTab] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    incidentId: string;
    nextState: IncidentState;
    title: string;
    message: string;
  }>({
    isOpen: false,
    incidentId: '',
    nextState: IncidentState.ACKNOWLEDGED,
    title: '',
    message: '',
  });

  // Filtered incidents
  const filteredIncidents = useMemo(() => {
    return incidents.filter((inc) => {
      // Tab filter
      if (activeTab === 'ACTIVE') {
        if (
          inc.state === IncidentState.CLOSED ||
          inc.state === IncidentState.POWER_RESTORED
        )
          return false;
      } else if (activeTab === 'ACKNOWLEDGED') {
        if (inc.state !== IncidentState.ACKNOWLEDGED) return false;
      } else if (activeTab === 'IN_REPAIR') {
        if (
          inc.state !== IncidentState.REPAIR_IN_PROGRESS &&
          inc.state !== IncidentState.DISPATCHED
        )
          return false;
      } else if (activeTab === 'RESTORED') {
        if (inc.state !== IncidentState.POWER_RESTORED) return false;
      } else if (activeTab === 'CLOSED') {
        if (inc.state !== IncidentState.CLOSED) return false;
      }

      // Severity filter
      if (severityFilter !== 'ALL' && inc.severity !== severityFilter) {
        return false;
      }

      // Search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          inc.title.toLowerCase().includes(term) ||
          inc.assetName.toLowerCase().includes(term) ||
          inc.id.toLowerCase().includes(term) ||
          (inc.city && inc.city.toLowerCase().includes(term))
        );
      }

      return true;
    });
  }, [incidents, activeTab, severityFilter, searchTerm]);

  const handleExportCsv = () => {
    const headers = [
      'Incident_ID',
      'Title',
      'Severity',
      'Category',
      'State',
      'Asset_Name',
      'District',
      'Estimated_Consumers',
      'Detected_At',
    ];
    const rows = filteredIncidents.map((i) => [
      i.id,
      i.title,
      i.severity,
      i.faultCategory,
      i.state,
      i.assetName,
      i.city,
      i.estimatedConsumers || 0,
      i.detectedAt,
    ]);

    downloadCsv({
      filename: `mahagrid_outages_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers,
      rows,
      metadata: [`District: ${selectedDistrict}`, `Export Time: ${new Date().toISOString()}`],
    });

    addToast({
      type: 'success',
      title: 'CSV Export Generated',
      message: `${rows.length} incident records exported.`,
    });
  };

  const promptTransition = (
    incidentId: string,
    nextState: IncidentState,
    title: string,
    message: string,
  ) => {
    setConfirmDialog({
      isOpen: true,
      incidentId,
      nextState,
      title,
      message,
    });
  };

  const executeTransition = () => {
    updateIncidentState(confirmDialog.incidentId, confirmDialog.nextState);
    setConfirmDialog({ ...confirmDialog, isOpen: false });

    // If updated the currently open drawer incident, update state
    if (selectedIncident && selectedIncident.id === confirmDialog.incidentId) {
      setSelectedIncident({
        ...selectedIncident,
        state: confirmDialog.nextState,
      });
    }

    addToast({
      type: 'success',
      title: 'State Updated',
      message: `Incident transitioned to ${confirmDialog.nextState}.`,
    });
  };

  const handleCreateWorkOrderForIncident = (inc: Incident) => {
    const wo = createWorkOrder({
      incidentId: inc.id,
      incidentTitle: inc.title,
      priority: inc.severity,
      assignedTeam: `${inc.city || 'Maharashtra'} Rapid Response Team Alpha`,
    });

    addToast({
      type: 'success',
      title: 'Work Order Dispatched',
      message: `Work Order ${wo.id} generated and team assigned.`,
    });

    if (selectedIncident && selectedIncident.id === inc.id) {
      setSelectedIncident({
        ...selectedIncident,
        state: IncidentState.WORK_ORDER_CREATED,
        workOrderId: wo.id,
      });
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Outage & Incident Management"
        subtitle="Real-time incident response ledger tracking faults from automatic grid detection through crew dispatch to final power restoration."
        category="Operations"
        icon={<Power size={22} />}
        district={selectedDistrict}
        actions={
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Download size={14} />}
            onClick={handleExportCsv}
          >
            Export Filtered CSV
          </Button>
        }
      />

      <div className={styles.tableCard}>
        {/* Filters Toolbar */}
        <div className={styles.filterBar}>
          {/* Status Tabs */}
          <div style={{ display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `All (${incidents.length})` },
              {
                id: 'ACTIVE',
                label: `Active (${
                  incidents.filter(
                    (i) =>
                      i.state !== IncidentState.CLOSED &&
                      i.state !== IncidentState.POWER_RESTORED,
                  ).length
                })`,
              },
              { id: 'ACKNOWLEDGED', label: 'Acknowledged' },
              { id: 'IN_REPAIR', label: 'Dispatched / In Repair' },
              { id: 'RESTORED', label: 'Restored' },
              { id: 'CLOSED', label: 'Closed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  background: activeTab === tab.id ? 'var(--forest-green)' : 'var(--warm-gray-100)',
                  color: activeTab === tab.id ? '#ffffff' : 'var(--color-text)',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search & Severity filters */}
          <div className={styles.searchInputs}>
            <input
              type="text"
              placeholder="Search incidents or assets..."
              className={styles.searchInput}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              className={styles.selectInput}
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="ALL">All Severities</option>
              <option value={Severity.CRITICAL}>Critical</option>
              <option value={Severity.HIGH}>High</option>
              <option value={Severity.MEDIUM}>Medium</option>
              <option value={Severity.LOW}>Low</option>
            </select>
          </div>
        </div>

        {/* Incidents Table */}
        <Table>
          <thead>
            <tr>
              <Th>Incident ID</Th>
              <Th>Title / Affected Asset</Th>
              <Th>Severity</Th>
              <Th>Category</Th>
              <Th>Stage</Th>
              <Th>Consumers</Th>
              <Th>Reported</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.length === 0 ? (
              <tr>
                <Td colSpan={8} style={{ textAlign: 'center', padding: '32px' }}>
                  No incidents matching the active filter criteria.
                </Td>
              </tr>
            ) : (
              filteredIncidents.map((inc) => (
                <tr
                  key={inc.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedIncident(inc)}
                >
                  <Td style={{ fontWeight: 600, fontFamily: 'monospace' }}>{inc.id}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{inc.title}</div>
                    <div style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                      {inc.assetName} • {inc.city}
                    </div>
                  </Td>
                  <Td>
                    <Badge
                      variant={
                        inc.severity === Severity.CRITICAL
                          ? 'critical'
                          : inc.severity === Severity.HIGH
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {inc.severity}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge variant="neutral">
                      {FAULT_CATEGORY_LABELS[inc.faultCategory] || inc.faultCategory}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge
                      variant={
                        inc.state === IncidentState.POWER_RESTORED
                          ? 'success'
                          : inc.state === IncidentState.DETECTED
                          ? 'critical'
                          : 'primary'
                      }
                    >
                      {INCIDENT_STATE_LABELS[inc.state] || inc.state}
                    </Badge>
                  </Td>
                  <Td>{inc.estimatedConsumers?.toLocaleString() || '0'}</Td>
                  <Td style={{ whiteSpace: 'nowrap', fontSize: '11px' }}>
                    {new Date(inc.detectedAt).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </Td>
                  <Td onClick={(e) => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                      {inc.state === IncidentState.DETECTED && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            promptTransition(
                              inc.id,
                              IncidentState.ACKNOWLEDGED,
                              'Acknowledge Incident',
                              `Confirm acknowledgment of ${inc.id}?`,
                            )
                          }
                        >
                          Ack
                        </Button>
                      )}
                      {inc.state !== IncidentState.CLOSED &&
                        inc.state !== IncidentState.POWER_RESTORED &&
                        !inc.workOrderId && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => handleCreateWorkOrderForIncident(inc)}
                          >
                            Dispatch
                          </Button>
                        )}
                      {inc.state !== IncidentState.POWER_RESTORED &&
                        inc.state !== IncidentState.CLOSED && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              promptTransition(
                                inc.id,
                                IncidentState.POWER_RESTORED,
                                'Restore Power',
                                `Confirm grid power restoration for ${inc.assetName}?`,
                              )
                            }
                          >
                            Restore
                          </Button>
                        )}
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Incident Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
        title={selectedIncident ? selectedIncident.title : ''}
        size="lg"
      >
        {selectedIncident && (
          <div className={styles.drawerContent}>
            <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
              <Badge variant="critical">{selectedIncident.severity} SEVERITY</Badge>
              <Badge variant="primary">{selectedIncident.state}</Badge>
              <Badge variant="neutral">{selectedIncident.city}</Badge>
            </div>

            <div>
              <h4 className={styles.sectionTitle}>Incident Summary</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {selectedIncident.description}
              </p>
            </div>

            {/* Diagnostic Evidence */}
            {selectedIncident.evidence && selectedIncident.evidence.length > 0 && (
              <div>
                <h4 className={styles.sectionTitle}>Telemetry Trigger Evidence</h4>
                <div className={styles.evidenceBox}>
                  {selectedIncident.evidence.map((ev, i) => (
                    <div key={i} className={styles.evidenceItem}>
                      <span>{ev.description}</span>
                      <strong style={{ color: 'var(--color-critical)' }}>
                        {ev.value} (Limit: {ev.threshold})
                      </strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Lifecycle Timeline */}
            <div>
              <h4 className={styles.sectionTitle}>14-Stage Lifecycle Progression</h4>
              <div className={styles.timeline}>
                {selectedIncident.timeline?.map((item, idx) => (
                  <div key={idx} className={styles.timelineItem}>
                    <span className={styles.timelineDot} />
                    <span className={styles.timelineState}>
                      {INCIDENT_STATE_LABELS[item.state] || item.state}
                    </span>
                    <span className={styles.timelineTime}>
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                    {item.notes && (
                      <span className={styles.timelineNotes}>{item.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
              <Button
                variant="primary"
                leftIcon={<Sparkles size={14} />}
                onClick={() => navigate('/fault-locator')}
              >
                Inspect in AI Fault Locator
              </Button>
              <Button
                variant="outline"
                leftIcon={<MapPin size={14} />}
                onClick={() => navigate('/map')}
              >
                View Fault Location on GIS Map
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Confirmation Dialog */}
      <Dialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        title={confirmDialog.title}
        confirmLabel="Confirm Action"
        onConfirm={executeTransition}
      >
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>
          {confirmDialog.message}
        </p>
      </Dialog>
    </div>
  );
}
