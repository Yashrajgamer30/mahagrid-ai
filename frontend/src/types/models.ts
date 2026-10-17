/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Domain Types
   ────────────────────────────────────────────────────────────────── */

import {
  AssetType,
  AssetStatus,
  DataOrigin,
  QualityState,
  Severity,
  FaultCategory,
  IncidentState,
  DiagnosisMode,
  Role,
} from './enums';

/* ── API Envelopes ──────────────────────────────────────── */
export interface ApiListResponse<T> {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
}

export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: Record<string, unknown>;
  requestId?: string;
}

export interface ApiErrorResponse {
  error: ApiErrorDetail;
}

/* ── User / Auth ────────────────────────────────────────── */
export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: string;
}

/* ── Assets ─────────────────────────────────────────────── */
export interface GeoCoordinates {
  lat: number;
  lng: number;
}

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  location?: GeoCoordinates;
  address?: string;
  parentId?: string;
  parentName?: string;
  parentType?: AssetType;
  district?: string;
  city?: string;
  isDemo: boolean;
  simulationSessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface Substation extends Asset {
  type: AssetType.SUBSTATION;
  capacityKva?: number;
  voltageLevel?: string;
  feedersCount?: number;
}

export interface Transformer extends Asset {
  type: AssetType.TRANSFORMER;
  capacityKva?: number;
  loadPercent?: number;
  temperatureC?: number;
  oilLevel?: string;
  feederId?: string;
  feederName?: string;
}

export interface Feeder extends Asset {
  type: AssetType.FEEDER;
  substationId?: string;
  substationName?: string;
  lengthKm?: number;
  voltageKv?: number;
  transformerCount?: number;
  coordinates?: GeoCoordinates[];
}

export interface Junction extends Asset {
  type: AssetType.JUNCTION;
  feederId?: string;
  feederName?: string;
  connectedMeters?: number;
}

export interface Meter extends Asset {
  type: AssetType.METER;
  meterNumber?: string;
  lastReading?: number;
  lastReadingUnit?: string;
  lastSeen?: string;
  dataOrigin?: DataOrigin;
  junctionId?: string;
}

export interface IoTDevice extends Asset {
  type: AssetType.IOT_SENSOR;
  deviceId: string;
  firmwareVersion?: string;
  lastSeen?: string;
  isOnline: boolean;
  offlineSince?: string;
  thresholds?: Record<string, number>;
}

/* ── Telemetry ──────────────────────────────────────────── */
export interface TelemetryReading {
  id: string;
  assetId: string;
  timestamp: string;
  voltageV?: number;
  currentA?: number;
  powerKw?: number;
  energyKwh?: number;
  temperatureC?: number;
  frequencyHz?: number;
  powerFactor?: number | null;
  loadPercent?: number;
  dataOrigin: DataOrigin;
  qualityState: QualityState;
  isDemo: boolean;
  simulationSessionId?: string;
}

/* ── Incidents ──────────────────────────────────────────── */
export interface Incident {
  id: string;
  title: string;
  description?: string;
  severity: Severity;
  faultCategory: FaultCategory;
  state: IncidentState;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  location?: GeoCoordinates;
  district?: string;
  city?: string;
  detectedAt: string;
  acknowledgedAt?: string;
  resolvedAt?: string;
  closedAt?: string;
  estimatedConsumers?: number;
  diagnosisMode?: DiagnosisMode;
  probableCause?: string;
  recommendedAction?: string;
  evidence?: IncidentEvidence[];
  timeline?: IncidentTimelineEntry[];
  workOrderId?: string;
  isDemo: boolean;
  simulationSessionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentEvidence {
  id: string;
  type: string;
  description: string;
  value?: string;
  threshold?: string;
  timestamp: string;
}

export interface IncidentTimelineEntry {
  id: string;
  state: IncidentState;
  timestamp: string;
  userId?: string;
  userName?: string;
  notes?: string;
  reason?: string;
}

/* ── Work Orders ────────────────────────────────────────── */
export interface WorkOrder {
  id: string;
  incidentId: string;
  incidentTitle?: string;
  priority: Severity;
  state: IncidentState;
  assignedTeam?: string;
  dueAt?: string;
  dispatchedAt?: string;
  arrivedAt?: string;
  repairStartedAt?: string;
  repairCompletedAt?: string;
  testedAt?: string;
  restoredAt?: string;
  closedAt?: string;
  inspectionFindings?: string;
  repairNotes?: string;
  partsUsed?: string;
  postRepairChecks?: string;
  demoVehicle?: string;
  createdById: string;
  createdByName?: string;
  isDemo: boolean;
  createdAt: string;
  updatedAt: string;
}

/* ── AI Analysis / Diagnosis ────────────────────────────── */
export interface Diagnosis {
  id: string;
  incidentId: string;
  mode: DiagnosisMode;
  probableCause: string;
  confidence?: number;
  recommendedAction: string;
  matchedRules?: MatchedRule[];
  evidence?: IncidentEvidence[];
  explanation?: string;
  disclaimer?: string;
  createdAt: string;
}

export interface MatchedRule {
  ruleId: string;
  ruleName: string;
  description: string;
  threshold: string;
  actualValue: string;
  triggered: boolean;
}

/* ── Notifications ──────────────────────────────────────── */
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  severity?: Severity;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

/* ── Dashboard / Analytics ──────────────────────────────── */
export interface DashboardKpis {
  networkHealth: number;
  totalAssets: number;
  onlineDevices: number;
  offlineDevices: number;
  activeIncidents: number;
  incidentsBySeverity: Record<Severity, number>;
  assetsByType: Record<AssetType, number>;
  assetsByStatus: Record<AssetStatus, number>;
  openWorkOrders: number;
  avgResolutionMinutes?: number;
}

export interface TrendDataPoint {
  timestamp: string;
  value: number;
  label?: string;
}

export interface AnalyticsData {
  mttaMinutes?: number;
  avgDispatchMinutes?: number;
  avgResolveMinutes?: number;
  availability?: number;
  deviceUptime?: number;
  incidentCounts: TrendDataPoint[];
  energyTrends: TrendDataPoint[];
  recurringFaults: Array<{ category: FaultCategory; count: number }>;
}

/* ── Simulation ─────────────────────────────────────────── */
export interface SimulationScenario {
  id: string;
  name: string;
  description: string;
  presetType: string;
  estimatedDuration: number;
}

export interface SimulationSession {
  id: string;
  scenarioId: string;
  scenarioName: string;
  state: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED' | 'ERROR';
  speed: number;
  currentTick: number;
  totalTicks: number;
  events: SimulationEvent[];
  startedAt?: string;
  completedAt?: string;
}

export interface SimulationEvent {
  tick: number;
  timestamp: string;
  type: string;
  description: string;
  assetId?: string;
  severity?: Severity;
}

/* ── Outages ────────────────────────────────────────────── */
export interface Outage {
  id: string;
  incidentId?: string;
  title: string;
  description?: string;
  severity: Severity;
  affectedArea?: string;
  estimatedConsumers?: number;
  state: string;
  startedAt: string;
  estimatedRestorationAt?: string;
  restoredAt?: string;
  isDemo: boolean;
}

/* ── Settings ───────────────────────────────────────────── */
export interface RuleThreshold {
  id: string;
  name: string;
  description: string;
  parameter: string;
  operator: string;
  value: number;
  unit: string;
  isActive: boolean;
}

export interface IntegrationStatus {
  service: string;
  status: 'connected' | 'disconnected' | 'error';
  lastCheck: string;
  details?: string;
}

/* ── Topology ───────────────────────────────────────────── */
export interface TopologyNode {
  id: string;
  assetId: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  parentId?: string;
  children?: TopologyNode[];
  position?: { x: number; y: number };
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  status: AssetStatus;
}

/* ── Misc / Pagination ──────────────────────────────────── */
export interface PaginationParams {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface FilterParams extends PaginationParams {
  type?: AssetType;
  status?: AssetStatus;
  severity?: Severity;
  state?: IncidentState;
  category?: FaultCategory;
  district?: string;
  city?: string;
  dateFrom?: string;
  dateTo?: string;
  dataOrigin?: DataOrigin;
}
