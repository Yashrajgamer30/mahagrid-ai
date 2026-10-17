/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Maintenance & Work Orders (/maintenance)
   Multi-mode workspace featuring Kanban board, tabular order ledger,
   and integrated Field Worker mobile checklist interface.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Wrench,
  CheckCircle2,
  Truck,
  Plus,
  MapPin,
  Kanban,
  List,
  HardHat,
  Camera,
  CheckSquare,
  Square,
  ArrowRight,
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
  useToast,
} from '@/components/ui';
import { Severity, IncidentState } from '@/types/enums';
import type { WorkOrder } from '@/types/models';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './MaintenancePage.module.css';

const LIFECYCLE_STAGES: { state: IncidentState; label: string }[] = [
  { state: IncidentState.WORK_ORDER_CREATED, label: 'Order Created' },
  { state: IncidentState.DISPATCHED, label: 'Dispatched' },
  { state: IncidentState.TEAM_ARRIVED, label: 'Arrived' },
  { state: IncidentState.INSPECTION, label: 'Inspection' },
  { state: IncidentState.REPAIR_IN_PROGRESS, label: 'Repair' },
  { state: IncidentState.TESTING, label: 'Testing' },
  { state: IncidentState.POWER_RESTORED, label: 'Restored' },
  { state: IncidentState.CLOSED, label: 'Archived' },
];

function WorkOrderLifecycleTimeline({
  workOrder,
  onAdvance,
}: {
  workOrder: WorkOrder;
  onAdvance: (wo: WorkOrder) => void;
}) {
  const currentIndex = LIFECYCLE_STAGES.findIndex((s) => s.state === workOrder.state);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const progressPercent = Math.min(100, Math.max(0, (activeIndex / (LIFECYCLE_STAGES.length - 1)) * 100));

  return (
    <div className={styles.timelineCard}>
      <div className={styles.timelineHeader}>
        <div className={styles.timelineTitleGroup}>
          <Wrench size={16} color="var(--burnt-orange)" />
          <h3 className={styles.timelineTitle}>
            Work Order Lifecycle Pipeline: <strong>{workOrder.id}</strong>
          </h3>
          <span style={{ fontSize: '11.5px', color: 'var(--color-text-muted)' }}>
            ({workOrder.incidentTitle})
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Badge
            variant={
              workOrder.state === IncidentState.POWER_RESTORED
                ? 'success'
                : workOrder.state === IncidentState.REPAIR_IN_PROGRESS
                ? 'warning'
                : 'primary'
            }
          >
            {workOrder.state}
          </Badge>
          {workOrder.state !== IncidentState.CLOSED && (
            <Button
              variant="primary"
              size="sm"
              rightIcon={<ArrowRight size={13} />}
              onClick={() => onAdvance(workOrder)}
            >
              Advance Pipeline
            </Button>
          )}
        </div>
      </div>

      <div className={styles.timelineTrackWrapper}>
        <div className={styles.timelineTrack}>
          <div className={styles.timelineBackgroundLine} />
          <div
            className={styles.timelineActiveLine}
            style={{ width: `calc(${progressPercent}% - 30px)` }}
          />

          {LIFECYCLE_STAGES.map((stage, idx) => {
            const isCompleted = idx < activeIndex;
            const isActive = idx === activeIndex;

            return (
              <div key={stage.state} className={styles.timelineStep}>
                <div
                  className={`${styles.stepNode} ${
                    isCompleted
                      ? styles.stepNodeCompleted
                      : isActive
                      ? styles.stepNodeActive
                      : ''
                  }`}
                >
                  {isCompleted ? <CheckCircle2 size={14} /> : idx + 1}
                </div>
                <span
                  className={`${styles.stepLabel} ${
                    isActive ? styles.stepLabelActive : ''
                  }`}
                >
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function MaintenancePage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const { workOrders, updateWorkOrder } = useGridStore(selectedDistrict);

  const [viewMode, setViewMode] = useState<'KANBAN' | 'LIST' | 'FIELD'>('KANBAN');
  const [selectedWorkOrder, setSelectedWorkOrder] = useState<WorkOrder | null>(null);

  // Field worker local checklist state
  const [checklist, setChecklist] = useState<{ [key: string]: boolean }>({
    lotoIsolation: true,
    zeroVoltageTest: true,
    earthingApplied: false,
    componentSwapped: false,
    insulationVerified: false,
  });

  const [fieldNotes, setFieldNotes] = useState(
    'Conductor cut back and thermal paste reapplied. Awaiting final Megger check before circuit energization.',
  );

  const handleAdvanceState = (wo: WorkOrder) => {
    let nextState: IncidentState = wo.state;
    let toastMsg = '';

    switch (wo.state) {
      case IncidentState.WORK_ORDER_CREATED:
        nextState = IncidentState.DISPATCHED;
        toastMsg = 'Work Order Dispatched. Field unit en route.';
        break;
      case IncidentState.DISPATCHED:
        nextState = IncidentState.TEAM_ARRIVED;
        toastMsg = 'Team marked as arrived at substation site.';
        break;
      case IncidentState.TEAM_ARRIVED:
        nextState = IncidentState.INSPECTION;
        toastMsg = 'Inspection initiated. FLIR camera active.';
        break;
      case IncidentState.INSPECTION:
        nextState = IncidentState.REPAIR_IN_PROGRESS;
        toastMsg = 'Repair in progress under LOTO clearance.';
        break;
      case IncidentState.REPAIR_IN_PROGRESS:
        nextState = IncidentState.TESTING;
        toastMsg = 'Testing and insulation verification.';
        break;
      case IncidentState.TESTING:
        nextState = IncidentState.POWER_RESTORED;
        toastMsg = 'Grid power synchronized and restored!';
        break;
      case IncidentState.POWER_RESTORED:
        nextState = IncidentState.CLOSED;
        toastMsg = 'Work order officially closed and archived.';
        break;
      default:
        break;
    }

    if (nextState !== wo.state) {
      updateWorkOrder(wo.id, { state: nextState });
      if (selectedWorkOrder && selectedWorkOrder.id === wo.id) {
        setSelectedWorkOrder({ ...selectedWorkOrder, state: nextState });
      }
      addToast({
        type: 'success',
        title: 'Workflow Updated',
        message: toastMsg,
      });
    }
  };

  const handleSaveFieldNotes = () => {
    if (activeJob) {
      updateWorkOrder(activeJob.id, {
        repairNotes: fieldNotes,
      });
      addToast({
        type: 'success',
        title: 'Notes Saved to Work Order',
        message: 'Field report updated in shared state.',
      });
    }
  };

  const activeJob = workOrders[0] || null;

  return (
    <div className={styles.container}>
      <PageHeader
        title="Maintenance & Field Operations"
        subtitle="End-to-end work-order dispatch pipeline with live Kanban workflow tracking, crew arrival timers, and field-worker safety checklist."
        category="Operations"
        icon={<Wrench size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => {
                navigate('/outages');
                addToast({
                  type: 'info',
                  title: 'Select Fault for Work Order',
                  message: 'Pick an active incident from the list to initiate dispatch.',
                });
              }}
            >
              New Work Order
            </Button>
          </div>
        }
      />

      {/* View Toggle Bar */}
      <div className={styles.viewToggleBar}>
        <div className={styles.tabGroup}>
          <button
            className={`${styles.tabBtn} ${viewMode === 'KANBAN' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('KANBAN')}
          >
            <Kanban size={13} style={{ display: 'inline', marginRight: 4 }} />
            Kanban Board
          </button>
          <button
            className={`${styles.tabBtn} ${viewMode === 'LIST' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('LIST')}
          >
            <List size={13} style={{ display: 'inline', marginRight: 4 }} />
            Work Order List
          </button>
          <button
            className={`${styles.tabBtn} ${viewMode === 'FIELD' ? styles.tabBtnActive : ''}`}
            onClick={() => setViewMode('FIELD')}
          >
            <HardHat size={13} style={{ display: 'inline', marginRight: 4 }} />
            Field Worker App View
          </button>
        </div>

        <Badge variant="neutral">
          {workOrders.length} Orders Active in Maharashtra
        </Badge>
      </div>

      {/* Interactive Lifecycle Pipeline Animation */}
      {(selectedWorkOrder || activeJob) && (
        <WorkOrderLifecycleTimeline
          workOrder={selectedWorkOrder || activeJob}
          onAdvance={handleAdvanceState}
        />
      )}

      {/* ── Mode 1: Kanban Board ── */}
      {viewMode === 'KANBAN' && (
        <div className={styles.kanbanBoard}>
          {/* Column 1: Dispatched / En Route */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <span>Dispatched / En Route</span>
              <Badge variant="primary">
                {
                  workOrders.filter(
                    (w) =>
                      w.state === IncidentState.WORK_ORDER_CREATED ||
                      w.state === IncidentState.DISPATCHED ||
                      w.state === IncidentState.DIAGNOSED,
                  ).length
                }
              </Badge>
            </div>
            {workOrders
              .filter(
                (w) =>
                  w.state === IncidentState.WORK_ORDER_CREATED ||
                  w.state === IncidentState.DISPATCHED ||
                  w.state === IncidentState.DIAGNOSED,
              )
              .map((wo) => (
                <div
                  key={wo.id}
                  className={styles.kanbanCard}
                  onClick={() => setSelectedWorkOrder(wo)}
                >
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardId}>{wo.id}</span>
                    <Badge variant="warning">{wo.priority}</Badge>
                  </div>
                  <h4 className={styles.cardTitle}>{wo.incidentTitle}</h4>
                  <div className={styles.cardMeta}>
                    <Truck size={12} />
                    <span>{wo.assignedTeam || 'Unassigned Squad'}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdvanceState(wo);
                    }}
                  >
                    Advance to Site
                  </Button>
                </div>
              ))}
          </div>

          {/* Column 2: In Inspection / Diagnosis */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <span>On-Site Inspection</span>
              <Badge variant="primary">
                {
                  workOrders.filter(
                    (w) =>
                      w.state === IncidentState.TEAM_ARRIVED ||
                      w.state === IncidentState.INSPECTION,
                  ).length
                }
              </Badge>
            </div>
            {workOrders
              .filter(
                (w) =>
                  w.state === IncidentState.TEAM_ARRIVED ||
                  w.state === IncidentState.INSPECTION,
              )
              .map((wo) => (
                <div
                  key={wo.id}
                  className={styles.kanbanCard}
                  onClick={() => setSelectedWorkOrder(wo)}
                >
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardId}>{wo.id}</span>
                    <Badge variant="warning">{wo.priority}</Badge>
                  </div>
                  <h4 className={styles.cardTitle}>{wo.incidentTitle}</h4>
                  <div className={styles.cardMeta}>
                    <span>Vehicle: {wo.demoVehicle}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    rightIcon={<ArrowRight size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdvanceState(wo);
                    }}
                  >
                    Start Repair
                  </Button>
                </div>
              ))}
          </div>

          {/* Column 3: Repair in Progress */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <span>Repair & Testing</span>
              <Badge variant="warning">
                {
                  workOrders.filter(
                    (w) =>
                      w.state === IncidentState.REPAIR_IN_PROGRESS ||
                      w.state === IncidentState.TESTING,
                  ).length
                }
              </Badge>
            </div>
            {workOrders
              .filter(
                (w) =>
                  w.state === IncidentState.REPAIR_IN_PROGRESS ||
                  w.state === IncidentState.TESTING,
              )
              .map((wo) => (
                <div
                  key={wo.id}
                  className={styles.kanbanCard}
                  onClick={() => setSelectedWorkOrder(wo)}
                >
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardId}>{wo.id}</span>
                    <Badge variant="critical">{wo.priority}</Badge>
                  </div>
                  <h4 className={styles.cardTitle}>{wo.incidentTitle}</h4>
                  <p style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                    {wo.repairNotes || 'Active cable splicing under LOTO'}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ArrowRight size={12} />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdvanceState(wo);
                    }}
                  >
                    Restore Power
                  </Button>
                </div>
              ))}
          </div>

          {/* Column 4: Restored / Closed */}
          <div className={styles.kanbanColumn}>
            <div className={styles.columnHeader}>
              <span>Restored / Completed</span>
              <Badge variant="success">
                {
                  workOrders.filter(
                    (w) =>
                      w.state === IncidentState.POWER_RESTORED ||
                      w.state === IncidentState.CLOSED,
                  ).length
                }
              </Badge>
            </div>
            {workOrders
              .filter(
                (w) =>
                  w.state === IncidentState.POWER_RESTORED ||
                  w.state === IncidentState.CLOSED,
              )
              .map((wo) => (
                <div
                  key={wo.id}
                  className={styles.kanbanCard}
                  onClick={() => setSelectedWorkOrder(wo)}
                >
                  <div className={styles.cardTopRow}>
                    <span className={styles.cardId}>{wo.id}</span>
                    <Badge variant="success">Energized</Badge>
                  </div>
                  <h4 className={styles.cardTitle}>{wo.incidentTitle}</h4>
                  <div className={styles.cardMeta}>
                    <CheckCircle2 size={12} color="var(--ok-green)" />
                    <span>Verified Stable</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ── Mode 2: Work Order List ── */}
      {viewMode === 'LIST' && (
        <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
          <Table>
            <thead>
              <tr>
                <Th>Order ID</Th>
                <Th>Incident / Asset</Th>
                <Th>Priority</Th>
                <Th>Assigned Team</Th>
                <Th>Vehicle</Th>
                <Th>Current Stage</Th>
                <Th>Action</Th>
              </tr>
            </thead>
            <tbody>
              {workOrders.map((wo) => (
                <tr
                  key={wo.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setSelectedWorkOrder(wo)}
                >
                  <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{wo.id}</Td>
                  <Td>{wo.incidentTitle}</Td>
                  <Td>
                    <Badge
                      variant={
                        wo.priority === Severity.CRITICAL
                          ? 'critical'
                          : wo.priority === Severity.HIGH
                          ? 'warning'
                          : 'info'
                      }
                    >
                      {wo.priority}
                    </Badge>
                  </Td>
                  <Td>{wo.assignedTeam}</Td>
                  <Td>{wo.demoVehicle || 'Van #1'}</Td>
                  <Td>
                    <Badge
                      variant={
                        wo.state === IncidentState.POWER_RESTORED
                          ? 'success'
                          : wo.state === IncidentState.REPAIR_IN_PROGRESS
                          ? 'warning'
                          : 'primary'
                      }
                    >
                      {wo.state}
                    </Badge>
                  </Td>
                  <Td onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAdvanceState(wo)}
                    >
                      Advance
                    </Button>
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* ── Mode 3: Field Operations Checklist App ── */}
      {viewMode === 'FIELD' && (
        <div className={styles.fieldOpsContainer}>
          {/* Active Job Assignment */}
          <div className={styles.fieldJobCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Badge variant="primary">Assigned Job</Badge>
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-lg)', margin: '4px 0' }}>
                  {activeJob?.incidentTitle || 'No active jobs assigned'}
                </h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  Work Order {activeJob?.id} • Vehicle: {activeJob?.demoVehicle}
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<MapPin size={14} />}
                onClick={() => navigate('/map')}
              >
                Directions
              </Button>
            </div>

            {/* Safety Clearance Checklist */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Field Safety & Isolation Checklist
              </h4>
              <div className={styles.checklist}>
                <div
                  className={styles.checkItem}
                  onClick={() =>
                    setChecklist({ ...checklist, lotoIsolation: !checklist.lotoIsolation })
                  }
                >
                  {checklist.lotoIsolation ? (
                    <CheckSquare size={16} color="var(--ok-green)" />
                  ) : (
                    <Square size={16} color="var(--warm-gray-400)" />
                  )}
                  <span>Lockout-Tagout (LOTO) breaker isolation executed</span>
                </div>

                <div
                  className={styles.checkItem}
                  onClick={() =>
                    setChecklist({
                      ...checklist,
                      zeroVoltageTest: !checklist.zeroVoltageTest,
                    })
                  }
                >
                  {checklist.zeroVoltageTest ? (
                    <CheckSquare size={16} color="var(--ok-green)" />
                  ) : (
                    <Square size={16} color="var(--warm-gray-400)" />
                  )}
                  <span>3-Phase Zero Voltage capacitive wand verification</span>
                </div>

                <div
                  className={styles.checkItem}
                  onClick={() =>
                    setChecklist({
                      ...checklist,
                      earthingApplied: !checklist.earthingApplied,
                    })
                  }
                >
                  {checklist.earthingApplied ? (
                    <CheckSquare size={16} color="var(--ok-green)" />
                  ) : (
                    <Square size={16} color="var(--warm-gray-400)" />
                  )}
                  <span>Portable protective earth discharge clusters applied</span>
                </div>

                <div
                  className={styles.checkItem}
                  onClick={() =>
                    setChecklist({
                      ...checklist,
                      componentSwapped: !checklist.componentSwapped,
                    })
                  }
                >
                  {checklist.componentSwapped ? (
                    <CheckSquare size={16} color="var(--ok-green)" />
                  ) : (
                    <Square size={16} color="var(--warm-gray-400)" />
                  )}
                  <span>Defective lug terminal / component replaced</span>
                </div>

                <div
                  className={styles.checkItem}
                  onClick={() =>
                    setChecklist({
                      ...checklist,
                      insulationVerified: !checklist.insulationVerified,
                    })
                  }
                >
                  {checklist.insulationVerified ? (
                    <CheckSquare size={16} color="var(--ok-green)" />
                  ) : (
                    <Square size={16} color="var(--warm-gray-400)" />
                  )}
                  <span>5kV Megger insulation resistance test &gt; 200MΩ</span>
                </div>
              </div>
            </div>

            {/* Field Notes Input */}
            <div>
              <h4 style={{ fontSize: 'var(--text-xs)', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Field Repair Observations
              </h4>
              <textarea
                className={styles.notesInput}
                value={fieldNotes}
                onChange={(e) => setFieldNotes(e.target.value)}
                placeholder="Record physical findings, joint temperatures, or parts used..."
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSaveFieldNotes}
              >
                Save Notes
              </Button>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Camera size={14} />}
                onClick={() =>
                  addToast({
                    type: 'info',
                    title: 'Simulated Photo Captured',
                    message: 'FLIR thermal image geotagged and attached to work order.',
                  })
                }
              >
                Attach Photo
              </Button>
            </div>
          </div>

          {/* Job Details Sidebar */}
          <div className={styles.fieldJobCard}>
            <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>
              Parts & Equipment Assigned
            </h4>
            <div style={{ fontSize: 'var(--text-xs)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ padding: '8px', background: 'var(--color-surface-alt)', borderRadius: '6px' }}>
                <strong>Bimetallic Crimp Lug (240 sq mm)</strong>
                <div style={{ color: 'var(--color-text-muted)' }}>Part No: MSEDCL-LUG-240B (Quantity: 3)</div>
              </div>
              <div style={{ padding: '8px', background: 'var(--color-surface-alt)', borderRadius: '6px' }}>
                <strong>Heat-shrink Joint Termination Kit</strong>
                <div style={{ color: 'var(--color-text-muted)' }}>Part No: RAYCHEM-11KV-3C (Quantity: 1)</div>
              </div>
              <div style={{ padding: '8px', background: 'var(--color-surface-alt)', borderRadius: '6px' }}>
                <strong>Insulating Transformer Oil (Shell Diala)</strong>
                <div style={{ color: 'var(--color-text-muted)' }}>Batch: 2026-B-89 (Quantity: 20 Litres)</div>
              </div>
            </div>

            {activeJob && (
              <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => handleAdvanceState(activeJob)}
                >
                  Advance Job Stage ({activeJob.state})
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Work Order Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedWorkOrder)}
        onClose={() => setSelectedWorkOrder(null)}
        title={selectedWorkOrder ? `Work Order: ${selectedWorkOrder.id}` : ''}
      >
        {selectedWorkOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
              <Badge variant="warning">{selectedWorkOrder.priority} Priority</Badge>
              <Badge variant="primary">{selectedWorkOrder.state}</Badge>
            </div>

            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Linked Incident</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {selectedWorkOrder.incidentTitle}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: 'var(--text-xs)' }}>
              <div style={{ background: 'var(--color-surface-alt)', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Assigned Squad:</span>
                <div><strong>{selectedWorkOrder.assignedTeam}</strong></div>
              </div>
              <div style={{ background: 'var(--color-surface-alt)', padding: '8px', borderRadius: '6px' }}>
                <span style={{ color: 'var(--color-text-muted)' }}>Utility Vehicle:</span>
                <div><strong>{selectedWorkOrder.demoVehicle}</strong></div>
              </div>
            </div>

            <div>
              <h4 style={{ fontSize: 'var(--text-sm)', fontWeight: 600 }}>Parts Used</h4>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                {selectedWorkOrder.partsUsed || 'Standard maintenance toolkit'}
              </p>
            </div>

            <Button
              variant="primary"
              onClick={() => handleAdvanceState(selectedWorkOrder)}
            >
              Advance Work Order Stage
            </Button>
          </div>
        )}
      </Drawer>
    </div>
  );
}
