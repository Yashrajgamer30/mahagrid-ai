/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Shared Enums (Single Source of Truth)
   These MUST mirror the backend/DB enums exactly.
   ────────────────────────────────────────────────────────────────── */

export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  ENGINEER = 'ENGINEER',
  FIELD_WORKER = 'FIELD_WORKER',
  VIEWER = 'VIEWER',
}

export enum AssetType {
  SUBSTATION = 'SUBSTATION',
  TRANSFORMER = 'TRANSFORMER',
  FEEDER = 'FEEDER',
  JUNCTION = 'JUNCTION',
  METER = 'METER',
  IOT_SENSOR = 'IOT_SENSOR',
  OTHER = 'OTHER',
}

export enum AssetStatus {
  NORMAL = 'NORMAL',
  WARNING = 'WARNING',
  FAULT = 'FAULT',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  DEACTIVATED = 'DEACTIVATED',
}

export enum DataOrigin {
  HARDWARE = 'HARDWARE',
  IMPORTED = 'IMPORTED',
  SIMULATED = 'SIMULATED',
}

export enum QualityState {
  VALID = 'VALID',
  STALE = 'STALE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  MISSING_FIELDS = 'MISSING_FIELDS',
  SUSPECT = 'SUSPECT',
}

export enum Severity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum FaultCategory {
  TRANSFORMER_OVERLOAD = 'TRANSFORMER_OVERLOAD',
  FEEDER_TRIP = 'FEEDER_TRIP',
  SUBSTATION_BREAKER_OPEN = 'SUBSTATION_BREAKER_OPEN',
  UNDER_VOLTAGE = 'UNDER_VOLTAGE',
  OVER_VOLTAGE = 'OVER_VOLTAGE',
  VOLTAGE_INSTABILITY = 'VOLTAGE_INSTABILITY',
  JUNCTION_FAILURE = 'JUNCTION_FAILURE',
  CABLE_FAULT = 'CABLE_FAULT',
  SHORT_CIRCUIT = 'SHORT_CIRCUIT',
  EARTH_FAULT = 'EARTH_FAULT',
  PHASE_FAILURE = 'PHASE_FAILURE',
  EXCESS_TEMPERATURE = 'EXCESS_TEMPERATURE',
  COMMUNICATION_LOSS = 'COMMUNICATION_LOSS',
  WEATHER_SUSPECTED = 'WEATHER_SUSPECTED',
  UNKNOWN = 'UNKNOWN',
}

export enum IncidentState {
  DETECTED = 'DETECTED',
  LOCATED = 'LOCATED',
  DIAGNOSED = 'DIAGNOSED',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  WORK_ORDER_CREATED = 'WORK_ORDER_CREATED',
  TEAM_ASSIGNED = 'TEAM_ASSIGNED',
  DISPATCHED = 'DISPATCHED',
  TEAM_ARRIVED = 'TEAM_ARRIVED',
  INSPECTION = 'INSPECTION',
  REPAIR_IN_PROGRESS = 'REPAIR_IN_PROGRESS',
  REPAIR_COMPLETED = 'REPAIR_COMPLETED',
  TESTING = 'TESTING',
  POWER_RESTORED = 'POWER_RESTORED',
  CLOSED = 'CLOSED',
  REOPENED = 'REOPENED',
}

export enum DiagnosisMode {
  RULE_BASED = 'RULE_BASED',
  LLM_ADVISORY = 'LLM_ADVISORY',
}

/** Ordered lifecycle stages for the WorkflowStepper (excludes REOPENED) */
export const INCIDENT_LIFECYCLE_ORDER: IncidentState[] = [
  IncidentState.DETECTED,
  IncidentState.LOCATED,
  IncidentState.DIAGNOSED,
  IncidentState.ACKNOWLEDGED,
  IncidentState.WORK_ORDER_CREATED,
  IncidentState.TEAM_ASSIGNED,
  IncidentState.DISPATCHED,
  IncidentState.TEAM_ARRIVED,
  IncidentState.INSPECTION,
  IncidentState.REPAIR_IN_PROGRESS,
  IncidentState.REPAIR_COMPLETED,
  IncidentState.TESTING,
  IncidentState.POWER_RESTORED,
  IncidentState.CLOSED,
];

/** Human-readable labels for enums */
export const INCIDENT_STATE_LABELS: Record<IncidentState, string> = {
  [IncidentState.DETECTED]: 'Detected',
  [IncidentState.LOCATED]: 'Located',
  [IncidentState.DIAGNOSED]: 'Diagnosed',
  [IncidentState.ACKNOWLEDGED]: 'Acknowledged',
  [IncidentState.WORK_ORDER_CREATED]: 'Work Order Created',
  [IncidentState.TEAM_ASSIGNED]: 'Team Assigned',
  [IncidentState.DISPATCHED]: 'Dispatched',
  [IncidentState.TEAM_ARRIVED]: 'Team Arrived',
  [IncidentState.INSPECTION]: 'Inspection',
  [IncidentState.REPAIR_IN_PROGRESS]: 'Repair in Progress',
  [IncidentState.REPAIR_COMPLETED]: 'Repair Completed',
  [IncidentState.TESTING]: 'Testing',
  [IncidentState.POWER_RESTORED]: 'Power Restored',
  [IncidentState.CLOSED]: 'Closed',
  [IncidentState.REOPENED]: 'Reopened',
};

export const SEVERITY_LABELS: Record<Severity, string> = {
  [Severity.LOW]: 'Low',
  [Severity.MEDIUM]: 'Medium',
  [Severity.HIGH]: 'High',
  [Severity.CRITICAL]: 'Critical',
};

export const ASSET_STATUS_LABELS: Record<AssetStatus, string> = {
  [AssetStatus.NORMAL]: 'Normal',
  [AssetStatus.WARNING]: 'Warning',
  [AssetStatus.FAULT]: 'Fault',
  [AssetStatus.OFFLINE]: 'Offline',
  [AssetStatus.MAINTENANCE]: 'Maintenance',
  [AssetStatus.DEACTIVATED]: 'Deactivated',
};

export const ASSET_TYPE_LABELS: Record<AssetType, string> = {
  [AssetType.SUBSTATION]: 'Substation',
  [AssetType.TRANSFORMER]: 'Transformer',
  [AssetType.FEEDER]: 'Feeder',
  [AssetType.JUNCTION]: 'Junction',
  [AssetType.METER]: 'Meter',
  [AssetType.IOT_SENSOR]: 'IoT Sensor',
  [AssetType.OTHER]: 'Other',
};

export const FAULT_CATEGORY_LABELS: Record<FaultCategory, string> = {
  [FaultCategory.TRANSFORMER_OVERLOAD]: 'Transformer Overload',
  [FaultCategory.FEEDER_TRIP]: 'Feeder Trip',
  [FaultCategory.SUBSTATION_BREAKER_OPEN]: 'Substation Breaker Open',
  [FaultCategory.UNDER_VOLTAGE]: 'Under Voltage',
  [FaultCategory.OVER_VOLTAGE]: 'Over Voltage',
  [FaultCategory.VOLTAGE_INSTABILITY]: 'Voltage Instability',
  [FaultCategory.JUNCTION_FAILURE]: 'Junction Failure',
  [FaultCategory.CABLE_FAULT]: 'Cable Fault',
  [FaultCategory.SHORT_CIRCUIT]: 'Short Circuit',
  [FaultCategory.EARTH_FAULT]: 'Earth Fault',
  [FaultCategory.PHASE_FAILURE]: 'Phase Failure',
  [FaultCategory.EXCESS_TEMPERATURE]: 'Excess Temperature',
  [FaultCategory.COMMUNICATION_LOSS]: 'Communication Loss',
  [FaultCategory.WEATHER_SUSPECTED]: 'Weather Suspected',
  [FaultCategory.UNKNOWN]: 'Unknown',
};

export const DATA_ORIGIN_LABELS: Record<DataOrigin, string> = {
  [DataOrigin.HARDWARE]: 'Hardware',
  [DataOrigin.IMPORTED]: 'Imported',
  [DataOrigin.SIMULATED]: 'Simulated',
};

export const DIAGNOSIS_MODE_LABELS: Record<DiagnosisMode, string> = {
  [DiagnosisMode.RULE_BASED]: 'Rule-based',
  [DiagnosisMode.LLM_ADVISORY]: 'LLM Advisory (server-side)',
};

export const ROLE_LABELS: Record<Role, string> = {
  [Role.ADMIN]: 'Administrator',
  [Role.MANAGER]: 'Manager',
  [Role.ENGINEER]: 'Engineer',
  [Role.FIELD_WORKER]: 'Field Worker',
  [Role.VIEWER]: 'Viewer',
};
