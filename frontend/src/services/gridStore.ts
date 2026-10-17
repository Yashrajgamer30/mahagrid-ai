/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Central Reactive Grid Store & Shared State
   Maintains synthetic digital twin state for Maharashtra:
   Substations, Transformers, Feeders, Junctions, Meters, IoT devices,
   Incidents, Work Orders, Notifications, Users, Settings, Telemetry.
   ────────────────────────────────────────────────────────────────── */

import {
  AssetType,
  AssetStatus,
  DataOrigin,
  Severity,
  FaultCategory,
  IncidentState,
  DiagnosisMode,
  Role,
} from '@/types/enums';
import type {
  Substation,
  Transformer,
  Feeder,
  Junction,
  Meter,
  IoTDevice,
  Incident,
  WorkOrder,
  Notification,
  User,
  RuleThreshold,
  DashboardKpis,
} from '@/types/models';

export interface GridState {
  substations: Substation[];
  transformers: Transformer[];
  feeders: Feeder[];
  junctions: Junction[];
  meters: Meter[];
  iotDevices: IoTDevice[];
  incidents: Incident[];
  workOrders: WorkOrder[];
  notifications: Notification[];
  users: User[];
  thresholds: RuleThreshold[];
  simulationSession: {
    scenarioId: string | null;
    scenarioName: string;
    state: 'IDLE' | 'RUNNING' | 'PAUSED' | 'COMPLETED';
    step: number;
    totalSteps: number;
    speed: number;
    log: string[];
  };
}

export const MAHARASHTRA_CITIES = [
  'All Maharashtra',
  'Mumbai Suburban',
  'Mumbai City',
  'Pune',
  'Nagpur',
  'Nashik',
  'Chhatrapati Sambhajinagar',
  'Kolhapur',
  'Solapur',
  'Amravati',
] as const;

export const CITY_COORDINATES: Record<string, [number, number]> = {
  'All Maharashtra': [19.7515, 75.7139],
  'Mumbai City': [18.9388, 72.8354],
  'Mumbai Suburban': [19.0600, 72.8400],
  'Pune': [18.5204, 73.8567],
  'Nagpur': [21.1458, 79.0882],
  'Nashik': [19.9975, 73.7898],
  'Chhatrapati Sambhajinagar': [19.8762, 75.3433],
  'Kolhapur': [16.7050, 74.2433],
  'Solapur': [17.6599, 75.9064],
  'Amravati': [20.9374, 77.7796],
};

/* ── Initial Deterministic Seed Data ────────────────────────────── */

export const INITIAL_SUBSTATIONS: Substation[] = [
  {
    id: 'SUB-PUN-01',
    name: 'Shivajinagar 33/11kV Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5308, lng: 73.8475 },
    capacityKva: 25000,
    voltageLevel: '33/11 kV',
    feedersCount: 6,
    isDemo: true,
    createdAt: '2026-01-10T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-PUN-02',
    name: 'Kothrud 132/33kV Grid Station',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5074, lng: 73.8077 },
    capacityKva: 100000,
    voltageLevel: '132/33 kV',
    feedersCount: 12,
    isDemo: true,
    createdAt: '2026-01-12T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-MUM-01',
    name: 'Worli Coastal 110/33kV Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Mumbai City',
    district: 'Mumbai City',
    location: { lat: 19.0144, lng: 72.8181 },
    capacityKva: 75000,
    voltageLevel: '110/33 kV',
    feedersCount: 8,
    isDemo: true,
    createdAt: '2026-01-15T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-MUM-02',
    name: 'BKC Smart Grid Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.WARNING,
    city: 'Mumbai Suburban',
    district: 'Mumbai Suburban',
    location: { lat: 19.0657, lng: 72.8680 },
    capacityKva: 50000,
    voltageLevel: '33/11 kV',
    feedersCount: 10,
    isDemo: true,
    createdAt: '2026-01-18T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-NAG-01',
    name: 'Sitabuldi Central Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Nagpur',
    district: 'Nagpur',
    location: { lat: 21.1458, lng: 79.0882 },
    capacityKva: 31500,
    voltageLevel: '33/11 kV',
    feedersCount: 7,
    isDemo: true,
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-NSK-01',
    name: 'Satpur MIDC 33/11kV Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.FAULT,
    city: 'Nashik',
    district: 'Nashik',
    location: { lat: 19.9882, lng: 73.7441 },
    capacityKva: 40000,
    voltageLevel: '33/11 kV',
    feedersCount: 8,
    isDemo: true,
    createdAt: '2026-01-22T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-CSN-01',
    name: 'Waluj Industrial Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Chhatrapati Sambhajinagar',
    district: 'Chhatrapati Sambhajinagar',
    location: { lat: 19.8519, lng: 75.2415 },
    capacityKva: 31500,
    voltageLevel: '33/11 kV',
    feedersCount: 6,
    isDemo: true,
    createdAt: '2026-01-25T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-KOL-01',
    name: 'Shiroli MIDC Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Kolhapur',
    district: 'Kolhapur',
    location: { lat: 16.7450, lng: 74.2750 },
    capacityKva: 25000,
    voltageLevel: '33/11 kV',
    feedersCount: 5,
    isDemo: true,
    createdAt: '2026-01-28T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-SOL-01',
    name: 'Hotgi Road Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Solapur',
    district: 'Solapur',
    location: { lat: 17.6412, lng: 75.9230 },
    capacityKva: 20000,
    voltageLevel: '33/11 kV',
    feedersCount: 4,
    isDemo: true,
    createdAt: '2026-02-01T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'SUB-AMR-01',
    name: 'Badnera Junction Substation',
    type: AssetType.SUBSTATION,
    status: AssetStatus.NORMAL,
    city: 'Amravati',
    district: 'Amravati',
    location: { lat: 20.8654, lng: 77.7262 },
    capacityKva: 20000,
    voltageLevel: '33/11 kV',
    feedersCount: 4,
    isDemo: true,
    createdAt: '2026-02-05T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
];

export const INITIAL_FEEDERS: Feeder[] = [
  {
    id: 'FDR-PUN-101',
    name: 'Shivajinagar Express Feeder 11kV',
    type: AssetType.FEEDER,
    status: AssetStatus.NORMAL,
    city: 'Pune',
    district: 'Pune',
    substationId: 'SUB-PUN-01',
    substationName: 'Shivajinagar 33/11kV Substation',
    lengthKm: 4.8,
    voltageKv: 11,
    transformerCount: 8,
    location: { lat: 18.5320, lng: 73.8490 },
    coordinates: [
      { lat: 18.5308, lng: 73.8475 },
      { lat: 18.5320, lng: 73.8490 },
      { lat: 18.5350, lng: 73.8520 },
      { lat: 18.5385, lng: 73.8550 },
    ],
    isDemo: true,
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'FDR-PUN-102',
    name: 'Aundh IT Corridor Feeder',
    type: AssetType.FEEDER,
    status: AssetStatus.WARNING,
    city: 'Pune',
    district: 'Pune',
    substationId: 'SUB-PUN-01',
    substationName: 'Shivajinagar 33/11kV Substation',
    lengthKm: 7.2,
    voltageKv: 11,
    transformerCount: 12,
    location: { lat: 18.5580, lng: 73.8070 },
    coordinates: [
      { lat: 18.5308, lng: 73.8475 },
      { lat: 18.5420, lng: 73.8290 },
      { lat: 18.5580, lng: 73.8070 },
      { lat: 18.5640, lng: 73.7990 },
    ],
    isDemo: true,
    createdAt: '2026-02-12T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'FDR-MUM-201',
    name: 'Bandra Reclamation Feeder 11kV',
    type: AssetType.FEEDER,
    status: AssetStatus.WARNING,
    city: 'Mumbai Suburban',
    district: 'Mumbai Suburban',
    substationId: 'SUB-MUM-02',
    substationName: 'BKC Smart Grid Substation',
    lengthKm: 3.5,
    voltageKv: 11,
    transformerCount: 6,
    location: { lat: 19.0510, lng: 72.8350 },
    coordinates: [
      { lat: 19.0657, lng: 72.8680 },
      { lat: 19.0580, lng: 72.8520 },
      { lat: 19.0510, lng: 72.8350 },
    ],
    isDemo: true,
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'FDR-NSK-401',
    name: 'Satpur MIDC Feeder-2',
    type: AssetType.FEEDER,
    status: AssetStatus.FAULT,
    city: 'Nashik',
    district: 'Nashik',
    substationId: 'SUB-NSK-01',
    substationName: 'Satpur MIDC 33/11kV Substation',
    lengthKm: 5.6,
    voltageKv: 11,
    transformerCount: 9,
    location: { lat: 19.9920, lng: 73.7580 },
    coordinates: [
      { lat: 19.9882, lng: 73.7441 },
      { lat: 19.9920, lng: 73.7580 },
      { lat: 20.0010, lng: 73.7710 },
    ],
    isDemo: true,
    createdAt: '2026-02-18T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'FDR-NAG-301',
    name: 'Sitabuldi Commercial Ring Feeder',
    type: AssetType.FEEDER,
    status: AssetStatus.NORMAL,
    city: 'Nagpur',
    district: 'Nagpur',
    substationId: 'SUB-NAG-01',
    substationName: 'Sitabuldi Central Substation',
    lengthKm: 4.1,
    voltageKv: 11,
    transformerCount: 7,
    location: { lat: 21.1490, lng: 79.0940 },
    coordinates: [
      { lat: 21.1458, lng: 79.0882 },
      { lat: 21.1490, lng: 79.0940 },
      { lat: 21.1550, lng: 79.0990 },
    ],
    isDemo: true,
    createdAt: '2026-02-20T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
];

export const INITIAL_TRANSFORMERS: Transformer[] = [
  {
    id: 'TRF-PUN-11',
    name: 'FC Road DT-02 Distribution Transformer',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.NORMAL,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5284, lng: 73.8423 },
    capacityKva: 500,
    loadPercent: 71,
    temperatureC: 46.5,
    oilLevel: 'Optimal (88%)',
    feederId: 'FDR-PUN-101',
    feederName: 'Shivajinagar Express Feeder 11kV',
    isDemo: true,
    createdAt: '2026-02-22T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-PUN-14',
    name: 'Senapati Bapat Marg DT-05 Transformer',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.WARNING,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5342, lng: 73.8315 },
    capacityKva: 630,
    loadPercent: 94.2,
    temperatureC: 78.4,
    oilLevel: 'Normal (79%)',
    feederId: 'FDR-PUN-102',
    feederName: 'Aundh IT Corridor Feeder',
    isDemo: true,
    createdAt: '2026-02-24T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-MUM-21',
    name: 'Bandra West Hill Road DT-12',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.NORMAL,
    city: 'Mumbai Suburban',
    district: 'Mumbai Suburban',
    location: { lat: 19.0558, lng: 72.8312 },
    capacityKva: 1000,
    loadPercent: 78.0,
    temperatureC: 51.2,
    oilLevel: 'Optimal (85%)',
    feederId: 'FDR-MUM-201',
    feederName: 'Bandra Reclamation Feeder 11kV',
    isDemo: true,
    createdAt: '2026-02-25T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-NSK-41',
    name: 'Satpur MIDC DT-04 Heavy Duty DT',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.FAULT,
    city: 'Nashik',
    district: 'Nashik',
    location: { lat: 19.9940, lng: 73.7620 },
    capacityKva: 800,
    loadPercent: 0,
    temperatureC: 84.1,
    oilLevel: 'Low (42%)',
    feederId: 'FDR-NSK-401',
    feederName: 'Satpur MIDC Feeder-2',
    isDemo: true,
    createdAt: '2026-02-27T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-NAG-31',
    name: 'Dharampeth Metro DT-03',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.NORMAL,
    city: 'Nagpur',
    district: 'Nagpur',
    location: { lat: 21.1420, lng: 79.0680 },
    capacityKva: 400,
    loadPercent: 62.5,
    temperatureC: 44.0,
    oilLevel: 'Optimal (90%)',
    feederId: 'FDR-NAG-301',
    feederName: 'Sitabuldi Commercial Ring Feeder',
    isDemo: true,
    createdAt: '2026-03-01T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-CSN-51',
    name: 'Cidco Sector-4 DT-01',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.OFFLINE,
    city: 'Chhatrapati Sambhajinagar',
    district: 'Chhatrapati Sambhajinagar',
    location: { lat: 19.8710, lng: 75.3620 },
    capacityKva: 315,
    loadPercent: 0,
    temperatureC: 38.0,
    oilLevel: 'Adequate (72%)',
    isDemo: true,
    createdAt: '2026-03-03T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-KOL-61',
    name: 'Shahupuri Market DT-02',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.NORMAL,
    city: 'Kolhapur',
    district: 'Kolhapur',
    location: { lat: 16.7020, lng: 74.2380 },
    capacityKva: 400,
    loadPercent: 68.2,
    temperatureC: 43.1,
    oilLevel: 'Optimal (87%)',
    isDemo: true,
    createdAt: '2026-03-05T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-SOL-71',
    name: 'Hotgi MIDC Textile DT-01',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.NORMAL,
    city: 'Solapur',
    district: 'Solapur',
    location: { lat: 17.6520, lng: 75.9180 },
    capacityKva: 500,
    loadPercent: 74.8,
    temperatureC: 48.0,
    oilLevel: 'Adequate (80%)',
    isDemo: true,
    createdAt: '2026-03-08T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'TRF-AMR-81',
    name: 'Badnera Railway Colony DT-01',
    type: AssetType.TRANSFORMER,
    status: AssetStatus.NORMAL,
    city: 'Amravati',
    district: 'Amravati',
    location: { lat: 20.8710, lng: 77.7320 },
    capacityKva: 315,
    loadPercent: 58.4,
    temperatureC: 41.2,
    oilLevel: 'Optimal (89%)',
    isDemo: true,
    createdAt: '2026-03-10T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
];

export const INITIAL_JUNCTIONS: Junction[] = [
  {
    id: 'JNC-PUN-01',
    name: 'Shivajinagar Bus Stand Junction RMU',
    type: AssetType.JUNCTION,
    status: AssetStatus.NORMAL,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5315, lng: 73.8505 },
    feederId: 'FDR-PUN-101',
    feederName: 'Shivajinagar Express Feeder 11kV',
    connectedMeters: 148,
    isDemo: true,
    createdAt: '2026-03-12T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'JNC-MUM-01',
    name: 'Bandra Reclamation RMU Node',
    type: AssetType.JUNCTION,
    status: AssetStatus.NORMAL,
    city: 'Mumbai Suburban',
    district: 'Mumbai Suburban',
    location: { lat: 19.0520, lng: 72.8380 },
    feederId: 'FDR-MUM-201',
    feederName: 'Bandra Reclamation Feeder 11kV',
    connectedMeters: 230,
    isDemo: true,
    createdAt: '2026-03-14T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'JNC-NSK-01',
    name: 'Satpur MIDC Ring Pillar-03',
    type: AssetType.JUNCTION,
    status: AssetStatus.FAULT,
    city: 'Nashik',
    district: 'Nashik',
    location: { lat: 19.9910, lng: 73.7550 },
    feederId: 'FDR-NSK-401',
    feederName: 'Satpur MIDC Feeder-2',
    connectedMeters: 85,
    isDemo: true,
    createdAt: '2026-03-16T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
  {
    id: 'JNC-NAG-01',
    name: 'Sitabuldi Metro Interchange RMU',
    type: AssetType.JUNCTION,
    status: AssetStatus.NORMAL,
    city: 'Nagpur',
    district: 'Nagpur',
    location: { lat: 21.1475, lng: 79.0910 },
    feederId: 'FDR-NAG-301',
    feederName: 'Sitabuldi Commercial Ring Feeder',
    connectedMeters: 190,
    isDemo: true,
    createdAt: '2026-03-18T08:00:00Z',
    updatedAt: '2026-10-15T09:00:00Z',
  },
];

export const INITIAL_METERS: Meter[] = [
  {
    id: 'MTR-PUN-8801',
    name: 'FC Road Commercial Plaza Smart Meter',
    type: AssetType.METER,
    status: AssetStatus.NORMAL,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5290, lng: 73.8430 },
    meterNumber: 'MSEDCL-PUN-9921',
    lastReading: 4218.4,
    lastReadingUnit: 'kWh',
    lastSeen: '2026-10-15T09:20:00Z',
    dataOrigin: DataOrigin.SIMULATED,
    junctionId: 'JNC-PUN-01',
    isDemo: true,
    createdAt: '2026-03-20T08:00:00Z',
    updatedAt: '2026-10-15T09:20:00Z',
  },
  {
    id: 'MTR-PUN-8802',
    name: 'SB Road Tech Park Bulk Meter',
    type: AssetType.METER,
    status: AssetStatus.WARNING,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5345, lng: 73.8320 },
    meterNumber: 'MSEDCL-PUN-9944',
    lastReading: 8940.1,
    lastReadingUnit: 'kWh',
    lastSeen: '2026-10-15T09:22:00Z',
    dataOrigin: DataOrigin.SIMULATED,
    isDemo: true,
    createdAt: '2026-03-22T08:00:00Z',
    updatedAt: '2026-10-15T09:22:00Z',
  },
  {
    id: 'MTR-MUM-8803',
    name: 'Bandra Reclamation Commercial Meter',
    type: AssetType.METER,
    status: AssetStatus.NORMAL,
    city: 'Mumbai Suburban',
    district: 'Mumbai Suburban',
    location: { lat: 19.0530, lng: 72.8390 },
    meterNumber: 'ADANI-MUM-4102',
    lastReading: 6150.8,
    lastReadingUnit: 'kWh',
    lastSeen: '2026-10-15T09:25:00Z',
    dataOrigin: DataOrigin.SIMULATED,
    junctionId: 'JNC-MUM-01',
    isDemo: true,
    createdAt: '2026-03-25T08:00:00Z',
    updatedAt: '2026-10-15T09:25:00Z',
  },
  {
    id: 'MTR-NSK-8804',
    name: 'Satpur MIDC Foundry Feeder Meter',
    type: AssetType.METER,
    status: AssetStatus.FAULT,
    city: 'Nashik',
    district: 'Nashik',
    location: { lat: 19.9925, lng: 73.7570 },
    meterNumber: 'MSEDCL-NSK-1120',
    lastReading: 12450.0,
    lastReadingUnit: 'kWh',
    lastSeen: '2026-10-15T08:15:00Z',
    dataOrigin: DataOrigin.SIMULATED,
    junctionId: 'JNC-NSK-01',
    isDemo: true,
    createdAt: '2026-03-28T08:00:00Z',
    updatedAt: '2026-10-15T08:15:00Z',
  },
];

export const INITIAL_IOT_DEVICES: IoTDevice[] = [
  {
    id: 'IOT-PUN-01',
    name: 'FC Road DT-02 Telemetry Gateway (ESP32)',
    type: AssetType.IOT_SENSOR,
    status: AssetStatus.NORMAL,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5285, lng: 73.8425 },
    deviceId: 'ESP32-PUN-001',
    firmwareVersion: 'v2.4.1-build88',
    isOnline: true,
    lastSeen: '2026-10-15T09:28:00Z',
    thresholds: { maxVoltageV: 245, maxTempC: 70 },
    parentId: 'TRF-PUN-11',
    parentName: 'FC Road DT-02 Distribution Transformer',
    parentType: AssetType.TRANSFORMER,
    isDemo: true,
    createdAt: '2026-04-01T08:00:00Z',
    updatedAt: '2026-10-15T09:28:00Z',
  },
  {
    id: 'IOT-PUN-02',
    name: 'SB Road DT-05 Thermal Sentinel (ESP32)',
    type: AssetType.IOT_SENSOR,
    status: AssetStatus.WARNING,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5340, lng: 73.8318 },
    deviceId: 'ESP32-PUN-005',
    firmwareVersion: 'v2.4.1-build88',
    isOnline: true,
    lastSeen: '2026-10-15T09:29:00Z',
    thresholds: { maxVoltageV: 245, maxTempC: 75 },
    parentId: 'TRF-PUN-14',
    parentName: 'Senapati Bapat Marg DT-05 Transformer',
    parentType: AssetType.TRANSFORMER,
    isDemo: true,
    createdAt: '2026-04-05T08:00:00Z',
    updatedAt: '2026-10-15T09:29:00Z',
  },
  {
    id: 'IOT-NSK-01',
    name: 'Satpur MIDC Feeder Monitor (Modbus/ESP32)',
    type: AssetType.IOT_SENSOR,
    status: AssetStatus.FAULT,
    city: 'Nashik',
    district: 'Nashik',
    location: { lat: 19.9922, lng: 73.7575 },
    deviceId: 'ESP32-NSK-002',
    firmwareVersion: 'v2.3.9',
    isOnline: false,
    offlineSince: '2026-10-15T08:14:00Z',
    lastSeen: '2026-10-15T08:14:00Z',
    thresholds: { maxVoltageV: 250, maxCurrentA: 400 },
    parentId: 'FDR-NSK-401',
    parentName: 'Satpur MIDC Feeder-2',
    parentType: AssetType.FEEDER,
    isDemo: true,
    createdAt: '2026-04-10T08:00:00Z',
    updatedAt: '2026-10-15T08:14:00Z',
  },
  {
    id: 'IOT-CSN-01',
    name: 'Waluj MIDC Substation Telemetry Node',
    type: AssetType.IOT_SENSOR,
    status: AssetStatus.OFFLINE,
    city: 'Chhatrapati Sambhajinagar',
    district: 'Chhatrapati Sambhajinagar',
    location: { lat: 19.8522, lng: 75.2420 },
    deviceId: 'ESP32-CSN-001',
    firmwareVersion: 'v2.4.0',
    isOnline: false,
    offlineSince: '2026-10-15T06:30:00Z',
    lastSeen: '2026-10-15T06:30:00Z',
    thresholds: { maxVoltageV: 245, maxTempC: 70 },
    parentId: 'SUB-CSN-01',
    parentName: 'Waluj Industrial Substation',
    parentType: AssetType.SUBSTATION,
    isDemo: true,
    createdAt: '2026-04-15T08:00:00Z',
    updatedAt: '2026-10-15T06:30:00Z',
  },
];

export const INITIAL_INCIDENTS: Incident[] = [
  {
    id: 'INC-2026-001',
    title: 'Severe Thermal Overload on SB Road DT-05',
    description: 'Calculated load breached 94% threshold with winding temperature at 78.4°C. High risk of insulation breakdown.',
    severity: Severity.HIGH,
    faultCategory: FaultCategory.TRANSFORMER_OVERLOAD,
    state: IncidentState.DIAGNOSED,
    assetId: 'TRF-PUN-14',
    assetName: 'Senapati Bapat Marg DT-05 Transformer',
    assetType: AssetType.TRANSFORMER,
    city: 'Pune',
    district: 'Pune',
    location: { lat: 18.5342, lng: 73.8315 },
    detectedAt: '2026-10-15T08:42:00Z',
    acknowledgedAt: '2026-10-15T08:48:00Z',
    estimatedConsumers: 620,
    diagnosisMode: DiagnosisMode.RULE_BASED,
    probableCause: 'Transformer capacity saturation during peak commercial air conditioning demand combined with ambient temperature rise.',
    recommendedAction: 'Shift 180kVA commercial load to adjacent Aundh Feeder tie-line and verify transformer cooling fins.',
    evidence: [
      { id: 'EV-1', type: 'Load Percent', description: 'Winding active current measurement', value: '94.2%', threshold: '85.0%', timestamp: '2026-10-15T08:42:00Z' },
      { id: 'EV-2', type: 'Temperature', description: 'Top oil thermometer sensor', value: '78.4°C', threshold: '70.0°C', timestamp: '2026-10-15T08:42:00Z' },
    ],
    timeline: [
      { id: 'TL-1', state: IncidentState.DETECTED, timestamp: '2026-10-15T08:42:00Z', notes: 'Automated telemetry threshold breach detected.' },
      { id: 'TL-2', state: IncidentState.LOCATED, timestamp: '2026-10-15T08:43:00Z', notes: 'GIS asset cross-referenced: TRF-PUN-14 on Feeder 102.' },
      { id: 'TL-3', state: IncidentState.DIAGNOSED, timestamp: '2026-10-15T08:45:00Z', notes: 'Rule-based engine identified sustained thermal overload pattern.' },
      { id: 'TL-4', state: IncidentState.ACKNOWLEDGED, timestamp: '2026-10-15T08:48:00Z', userName: 'Yashraj Jadhav', notes: 'Operator acknowledged. Preparing dispatch.' },
    ],
    workOrderId: 'WO-2026-101',
    isDemo: true,
    createdAt: '2026-10-15T08:42:00Z',
    updatedAt: '2026-10-15T08:48:00Z',
  },
  {
    id: 'INC-2026-002',
    title: 'Earth Fault / Circuit Breaker Trip on Satpur MIDC Feeder',
    description: 'Zero-sequence overcurrent protection relay triggered at Satpur 33kV substation. 11kV Feeder-2 tripped.',
    severity: Severity.CRITICAL,
    faultCategory: FaultCategory.FEEDER_TRIP,
    state: IncidentState.DISPATCHED,
    assetId: 'FDR-NSK-401',
    assetName: 'Satpur MIDC Feeder-2',
    assetType: AssetType.FEEDER,
    city: 'Nashik',
    district: 'Nashik',
    location: { lat: 19.9920, lng: 73.7580 },
    detectedAt: '2026-10-15T08:14:00Z',
    acknowledgedAt: '2026-10-15T08:18:00Z',
    estimatedConsumers: 1450,
    diagnosisMode: DiagnosisMode.RULE_BASED,
    probableCause: 'Phase-to-ground flashover on overhead section near Ring Pillar-03 due to tree limb contact or damaged insulator pin.',
    recommendedAction: 'Visual line patrol between pole 24 and pillar 03. Perform 5kV insulation resistance Megger check.',
    evidence: [
      { id: 'EV-3', type: 'Breaker Status', description: 'Numeric Protection Relay Relay 50/51N', value: 'TRIPPED', threshold: 'CLOSED', timestamp: '2026-10-15T08:14:00Z' },
      { id: 'EV-4', type: 'Zero Sequence Current', description: 'Io earth fault current', value: '420A', threshold: '40A', timestamp: '2026-10-15T08:14:00Z' },
    ],
    timeline: [
      { id: 'TL-5', state: IncidentState.DETECTED, timestamp: '2026-10-15T08:14:00Z', notes: 'Breaker auxiliary contact opened.' },
      { id: 'TL-6', state: IncidentState.WORK_ORDER_CREATED, timestamp: '2026-10-15T08:20:00Z', notes: 'Work order WO-2026-102 generated.' },
      { id: 'TL-7', state: IncidentState.DISPATCHED, timestamp: '2026-10-15T08:26:00Z', notes: 'Nashik Substation Field Squad en route.' },
    ],
    workOrderId: 'WO-2026-102',
    isDemo: true,
    createdAt: '2026-10-15T08:14:00Z',
    updatedAt: '2026-10-15T08:26:00Z',
  },
  {
    id: 'INC-2026-003',
    title: 'Communication Loss on Waluj Substation RTU',
    description: 'No telemetry heartbeat received from ESP32 gateway node for over 180 minutes.',
    severity: Severity.MEDIUM,
    faultCategory: FaultCategory.COMMUNICATION_LOSS,
    state: IncidentState.ACKNOWLEDGED,
    assetId: 'IOT-CSN-01',
    assetName: 'Waluj MIDC Substation Telemetry Node',
    assetType: AssetType.IOT_SENSOR,
    city: 'Chhatrapati Sambhajinagar',
    district: 'Chhatrapati Sambhajinagar',
    location: { lat: 19.8522, lng: 75.2420 },
    detectedAt: '2026-10-15T06:30:00Z',
    acknowledgedAt: '2026-10-15T07:00:00Z',
    estimatedConsumers: 0,
    diagnosisMode: DiagnosisMode.RULE_BASED,
    probableCause: 'Cellular network SIM timeout or local 12V DC power adapter failure at gateway enclosure.',
    recommendedAction: 'Check gateway auxiliary DC supply and restart LTE-M modem module.',
    evidence: [
      { id: 'EV-5', type: 'Heartbeat Missing', description: 'Consecutive dropped telemetry frames', value: '18 pings', threshold: '3 pings', timestamp: '2026-10-15T06:30:00Z' },
    ],
    timeline: [
      { id: 'TL-8', state: IncidentState.DETECTED, timestamp: '2026-10-15T06:30:00Z', notes: 'Gateway offline timer expired.' },
      { id: 'TL-9', state: IncidentState.ACKNOWLEDGED, timestamp: '2026-10-15T07:00:00Z', notes: 'Operator verified lack of ping.' },
    ],
    isDemo: true,
    createdAt: '2026-10-15T06:30:00Z',
    updatedAt: '2026-10-15T07:00:00Z',
  },
  {
    id: 'INC-2026-004',
    title: 'Under-Voltage Anomaly on Bandra Reclamation Feeder',
    description: 'Phase R voltage sagged to 198V (nominal 230V ±6%). Feeder line resistance abnormally elevated.',
    severity: Severity.HIGH,
    faultCategory: FaultCategory.UNDER_VOLTAGE,
    state: IncidentState.REPAIR_IN_PROGRESS,
    assetId: 'FDR-MUM-201',
    assetName: 'Bandra Reclamation Feeder 11kV',
    assetType: AssetType.FEEDER,
    city: 'Mumbai Suburban',
    district: 'Mumbai Suburban',
    location: { lat: 19.0510, lng: 72.8350 },
    detectedAt: '2026-10-15T07:15:00Z',
    acknowledgedAt: '2026-10-15T07:20:00Z',
    estimatedConsumers: 890,
    diagnosisMode: DiagnosisMode.RULE_BASED,
    probableCause: 'High-resistance joint degradation on 11kV XLPE underground cable transition joint near Reclamation.',
    recommendedAction: 'Thermal imaging of joint box followed by splicing replacement of degraded lug terminal.',
    evidence: [
      { id: 'EV-6', type: 'Terminal Voltage', description: 'Phase-neutral terminal voltage', value: '198V', threshold: '216V min', timestamp: '2026-10-15T07:15:00Z' },
    ],
    timeline: [
      { id: 'TL-10', state: IncidentState.DETECTED, timestamp: '2026-10-15T07:15:00Z', notes: 'Smart meter voltage alert received.' },
      { id: 'TL-11', state: IncidentState.DISPATCHED, timestamp: '2026-10-15T07:35:00Z', notes: 'Mumbai Coastal Line Unit dispatched.' },
      { id: 'TL-12', state: IncidentState.TEAM_ARRIVED, timestamp: '2026-10-15T08:05:00Z', notes: 'Technicians on site, thermal camera active.' },
      { id: 'TL-13', state: IncidentState.REPAIR_IN_PROGRESS, timestamp: '2026-10-15T08:40:00Z', notes: 'Joint box opened, cable lug crimping in progress.' },
    ],
    workOrderId: 'WO-2026-103',
    isDemo: true,
    createdAt: '2026-10-15T07:15:00Z',
    updatedAt: '2026-10-15T08:40:00Z',
  },
];

export const INITIAL_WORK_ORDERS: WorkOrder[] = [
  {
    id: 'WO-2026-101',
    incidentId: 'INC-2026-001',
    incidentTitle: 'Severe Thermal Overload on SB Road DT-05',
    priority: Severity.HIGH,
    state: IncidentState.DIAGNOSED,
    assignedTeam: 'Pune Fast Response Alpha',
    dueAt: '2026-10-15T12:00:00Z',
    createdById: 'usr-demo-admin',
    createdByName: 'Yashraj Jadhav',
    demoVehicle: 'MH-12-GR-4021 (E-Utility Van)',
    inspectionFindings: 'Awaiting team dispatch. Thermal sensor shows 78.4°C.',
    repairNotes: 'Load shifting plan approved via SCADA supervisor.',
    partsUsed: 'N/A (Load Balancing)',
    isDemo: true,
    createdAt: '2026-10-15T08:50:00Z',
    updatedAt: '2026-10-15T08:50:00Z',
  },
  {
    id: 'WO-2026-102',
    incidentId: 'INC-2026-002',
    incidentTitle: 'Earth Fault / Circuit Breaker Trip on Satpur MIDC Feeder',
    priority: Severity.CRITICAL,
    state: IncidentState.DISPATCHED,
    assignedTeam: 'Nashik Substation Field Squad',
    dueAt: '2026-10-15T11:00:00Z',
    dispatchedAt: '2026-10-15T08:26:00Z',
    createdById: 'usr-demo-admin',
    createdByName: 'Yashraj Jadhav',
    demoVehicle: 'MH-15-TR-8812 (Line Bucket Truck)',
    inspectionFindings: 'Patrolling 11kV alignment between Substation and Ring Pillar 03.',
    repairNotes: 'Pending visual fault localization.',
    partsUsed: '11kV Disc Insulator (reserved in truck)',
    isDemo: true,
    createdAt: '2026-10-15T08:20:00Z',
    updatedAt: '2026-10-15T08:26:00Z',
  },
  {
    id: 'WO-2026-103',
    incidentId: 'INC-2026-004',
    incidentTitle: 'Under-Voltage Anomaly on Bandra Reclamation Feeder',
    priority: Severity.HIGH,
    state: IncidentState.REPAIR_IN_PROGRESS,
    assignedTeam: 'Mumbai Coastal Line Unit',
    dueAt: '2026-10-15T13:30:00Z',
    dispatchedAt: '2026-10-15T07:35:00Z',
    arrivedAt: '2026-10-15T08:05:00Z',
    repairStartedAt: '2026-10-15T08:40:00Z',
    createdById: 'usr-demo-admin',
    createdByName: 'Yashraj Jadhav',
    demoVehicle: 'MH-02-EE-1990 (Cable Jointing Unit)',
    inspectionFindings: 'FLIR thermal imaging confirmed 82°C hotspot on terminal R-phase lug at joint box #4.',
    repairNotes: 'De-energized feeder isolated via RMU. Cut back oxidized conductor, crimping heavy-duty bimetallic lug.',
    partsUsed: '240 sq mm Bimetallic Crimp Lug (1 pc), Raychem Heat-shrink Joint Kit (1 set)',
    postRepairChecks: '5kV DC Megger test scheduled before energization.',
    isDemo: true,
    createdAt: '2026-10-15T07:30:00Z',
    updatedAt: '2026-10-15T08:40:00Z',
  },
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'NOTIF-01',
    type: 'INCIDENT',
    title: 'Severe Overload Alarm',
    message: 'Transformer TRF-PUN-14 reached 94.2% capacity (78.4°C). Immediate action required.',
    severity: Severity.HIGH,
    isRead: false,
    link: '/fault-locator',
    createdAt: '2026-10-15T08:42:00Z',
  },
  {
    id: 'NOTIF-02',
    type: 'INCIDENT',
    title: 'Feeder Tripped Offline',
    message: '11kV Feeder-2 at Satpur Substation tripped due to Earth Fault current (420A).',
    severity: Severity.CRITICAL,
    isRead: false,
    link: '/outages',
    createdAt: '2026-10-15T08:14:00Z',
  },
  {
    id: 'NOTIF-03',
    type: 'MAINTENANCE',
    title: 'Work Order Dispatched',
    message: 'Nashik Field Squad dispatched for emergency feeder inspection (WO-2026-102).',
    severity: Severity.MEDIUM,
    isRead: false,
    link: '/maintenance',
    createdAt: '2026-10-15T08:26:00Z',
  },
  {
    id: 'NOTIF-04',
    type: 'DEVICE',
    title: 'Sensor Gateway Offline',
    message: 'ESP32 Gateway node at Waluj Substation dropped offline (>180 min).',
    severity: Severity.LOW,
    isRead: true,
    link: '/devices',
    createdAt: '2026-10-15T06:30:00Z',
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-demo-admin',
    email: 'admin@mahagrid.gov.in',
    name: 'Yashraj Jadhav',
    role: Role.ADMIN,
    isActive: true,
    lastLogin: '2026-10-15T08:00:00Z',
    createdAt: '2026-01-01T00:00:00Z',
  },
  {
    id: 'usr-demo-mgr',
    email: 'rajesh.patil@mahagrid.gov.in',
    name: 'Rajesh Patil',
    role: Role.MANAGER,
    isActive: true,
    lastLogin: '2026-10-15T07:30:00Z',
    createdAt: '2026-01-05T00:00:00Z',
  },
  {
    id: 'usr-demo-eng',
    email: 'snehal.deshmukh@mahagrid.gov.in',
    name: 'Snehal Deshmukh',
    role: Role.ENGINEER,
    isActive: true,
    lastLogin: '2026-10-15T08:15:00Z',
    createdAt: '2026-01-10T00:00:00Z',
  },
  {
    id: 'usr-demo-field',
    email: 'amit.shinde@mahagrid.gov.in',
    name: 'Amit Shinde',
    role: Role.FIELD_WORKER,
    isActive: true,
    lastLogin: '2026-10-15T08:20:00Z',
    createdAt: '2026-01-12T00:00:00Z',
  },
  {
    id: 'usr-demo-viewer',
    email: 'vikram.kulkarni@mahagrid.gov.in',
    name: 'Vikram Kulkarni',
    role: Role.VIEWER,
    isActive: true,
    lastLogin: '2026-10-14T16:00:00Z',
    createdAt: '2026-01-15T00:00:00Z',
  },
];

export const INITIAL_THRESHOLDS: RuleThreshold[] = [
  {
    id: 'RUL-01',
    name: 'Over-Voltage Limit',
    description: 'Trigger alert when phase voltage exceeds safe statutory threshold',
    parameter: 'voltageV',
    operator: '>',
    value: 245,
    unit: 'V',
    isActive: true,
  },
  {
    id: 'RUL-02',
    name: 'Under-Voltage Limit',
    description: 'Trigger alarm when voltage drops below statutory lower limit',
    parameter: 'voltageV',
    operator: '<',
    value: 212,
    unit: 'V',
    isActive: true,
  },
  {
    id: 'RUL-03',
    name: 'Transformer Peak Load',
    description: 'Alert when transformer load exceeds continuous thermal rating',
    parameter: 'loadPercent',
    operator: '>',
    value: 90,
    unit: '%',
    isActive: true,
  },
  {
    id: 'RUL-04',
    name: 'Transformer Oil Temperature',
    description: 'Critical alarm when top-oil thermal probe reaches high danger level',
    parameter: 'temperatureC',
    operator: '>',
    value: 75,
    unit: '°C',
    isActive: true,
  },
  {
    id: 'RUL-05',
    name: 'IoT Sensor Heartbeat Timeout',
    description: 'Flag sensor offline when no ping received within window',
    parameter: 'heartbeatSec',
    operator: '>',
    value: 120,
    unit: 's',
    isActive: true,
  },
];

/* ── Central Reactive Store Class ────────────────────────────────── */

const STORE_STORAGE_KEY = 'mahagrid_demo_state_v2';

class GridStore {
  private state: GridState;
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.state = this.loadState();
  }

  private loadState(): GridState {
    try {
      const saved = localStorage.getItem(STORE_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.substations && parsed.incidents && parsed.workOrders) {
          return parsed;
        }
      }
    } catch {
      // ignore parse errors and fallback to initial seed
    }
    return this.getInitialState();
  }

  private getInitialState(): GridState {
    return {
      substations: INITIAL_SUBSTATIONS,
      transformers: INITIAL_TRANSFORMERS,
      feeders: INITIAL_FEEDERS,
      junctions: INITIAL_JUNCTIONS,
      meters: INITIAL_METERS,
      iotDevices: INITIAL_IOT_DEVICES,
      incidents: INITIAL_INCIDENTS,
      workOrders: INITIAL_WORK_ORDERS,
      notifications: INITIAL_NOTIFICATIONS,
      users: INITIAL_USERS,
      thresholds: INITIAL_THRESHOLDS,
      simulationSession: {
        scenarioId: null,
        scenarioName: 'Normal Baseline Operations',
        state: 'IDLE',
        step: 0,
        totalSteps: 5,
        speed: 1,
        log: ['System initialized in normal Maharashtra grid operational state.'],
      },
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      // storage full or disabled
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((l) => l());
  }

  public getState(): GridState {
    return this.state;
  }

  /* ── Reset to Deterministic Baseline ────────────────────────── */
  public resetToBaseline() {
    this.state = this.getInitialState();
    this.persist();
  }

  /* ── KPIs Calculation ────────────────────────────────────────── */
  public getDashboardKpis(filterDistrict?: string): DashboardKpis {
    const isAll = !filterDistrict || filterDistrict === 'All Maharashtra';
    const match = (item: { city?: string; district?: string }) => {
      if (isAll) return true;
      return (
        item.city?.toLowerCase().includes(filterDistrict.toLowerCase()) ||
        item.district?.toLowerCase().includes(filterDistrict.toLowerCase())
      );
    };

    const substations = this.state.substations.filter(match);
    const transformers = this.state.transformers.filter(match);
    const feeders = this.state.feeders.filter(match);
    const junctions = this.state.junctions.filter(match);
    const meters = this.state.meters.filter(match);
    const devices = this.state.iotDevices.filter(match);
    const incidents = this.state.incidents.filter(match);
    const workOrders = this.state.workOrders.filter((wo) => {
      const inc = this.state.incidents.find((i) => i.id === wo.incidentId);
      return inc ? match(inc) : true;
    });

    const totalAssets =
      substations.length +
      transformers.length +
      feeders.length +
      junctions.length +
      meters.length +
      devices.length;

    const onlineDevices = devices.filter((d) => d.isOnline).length;
    const offlineDevices = devices.length - onlineDevices;

    const activeIncidents = incidents.filter(
      (i) => i.state !== IncidentState.CLOSED && i.state !== IncidentState.POWER_RESTORED,
    ).length;

    const incidentsBySeverity: Record<Severity, number> = {
      [Severity.LOW]: 0,
      [Severity.MEDIUM]: 0,
      [Severity.HIGH]: 0,
      [Severity.CRITICAL]: 0,
    };
    incidents.forEach((inc) => {
      incidentsBySeverity[inc.severity] = (incidentsBySeverity[inc.severity] || 0) + 1;
    });

    const assetsByType: Record<AssetType, number> = {
      [AssetType.SUBSTATION]: substations.length,
      [AssetType.TRANSFORMER]: transformers.length,
      [AssetType.FEEDER]: feeders.length,
      [AssetType.JUNCTION]: junctions.length,
      [AssetType.METER]: meters.length,
      [AssetType.IOT_SENSOR]: devices.length,
      [AssetType.OTHER]: 0,
    };

    const allFiltered = [
      ...substations,
      ...transformers,
      ...feeders,
      ...junctions,
      ...meters,
      ...devices,
    ];

    const assetsByStatus: Record<AssetStatus, number> = {
      [AssetStatus.NORMAL]: 0,
      [AssetStatus.WARNING]: 0,
      [AssetStatus.FAULT]: 0,
      [AssetStatus.OFFLINE]: 0,
      [AssetStatus.MAINTENANCE]: 0,
      [AssetStatus.DEACTIVATED]: 0,
    };
    allFiltered.forEach((a) => {
      assetsByStatus[a.status] = (assetsByStatus[a.status] || 0) + 1;
    });

    const openWorkOrders = workOrders.filter(
      (wo) => wo.state !== IncidentState.CLOSED && wo.state !== IncidentState.POWER_RESTORED,
    ).length;

    // Health formula based on percentage of normal assets
    const healthPercent =
      allFiltered.length > 0
        ? Math.round((assetsByStatus[AssetStatus.NORMAL] / allFiltered.length) * 1000) / 10
        : 100;

    return {
      networkHealth: healthPercent,
      totalAssets,
      onlineDevices,
      offlineDevices,
      activeIncidents,
      incidentsBySeverity,
      assetsByType,
      assetsByStatus,
      openWorkOrders,
      avgResolutionMinutes: 42,
    };
  }

  /* ── Asset Actions ───────────────────────────────────────────── */
  public addSubstation(sub: Partial<Substation>): Substation {
    const id = sub.id || `SUB-${Date.now().toString().slice(-4)}`;
    const newSub: Substation = {
      id,
      name: sub.name || 'New Maharashtra Substation',
      type: AssetType.SUBSTATION,
      status: sub.status || AssetStatus.NORMAL,
      city: sub.city || 'Pune',
      district: sub.district || sub.city || 'Pune',
      location: sub.location || { lat: 18.5204, lng: 73.8567 },
      capacityKva: sub.capacityKva || 25000,
      voltageLevel: sub.voltageLevel || '33/11 kV',
      feedersCount: sub.feedersCount || 4,
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...sub,
    };
    this.state.substations = [newSub, ...this.state.substations];
    this.addNotification({
      type: 'ASSET',
      title: 'New Substation Added',
      message: `${newSub.name} (${newSub.id}) registered in ${newSub.city}.`,
      severity: Severity.LOW,
      link: '/substations',
    });
    this.persist();
    return newSub;
  }

  public addTransformer(trf: Partial<Transformer>): Transformer {
    const id = trf.id || `TRF-${Date.now().toString().slice(-4)}`;
    const newTrf: Transformer = {
      id,
      name: trf.name || 'New Distribution Transformer',
      type: AssetType.TRANSFORMER,
      status: trf.status || AssetStatus.NORMAL,
      city: trf.city || 'Pune',
      district: trf.district || trf.city || 'Pune',
      location: trf.location || { lat: 18.525, lng: 73.85 },
      capacityKva: trf.capacityKva || 500,
      loadPercent: trf.loadPercent || 50,
      temperatureC: trf.temperatureC || 40,
      oilLevel: trf.oilLevel || 'Optimal (90%)',
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...trf,
    };
    this.state.transformers = [newTrf, ...this.state.transformers];
    this.addNotification({
      type: 'ASSET',
      title: 'Transformer Added',
      message: `${newTrf.name} registered in ${newTrf.city}.`,
      severity: Severity.LOW,
      link: '/transformers',
    });
    this.persist();
    return newTrf;
  }

  public updateAssetStatus(id: string, newStatus: AssetStatus) {
    let found = false;
    this.state.substations = this.state.substations.map((a) => {
      if (a.id === id) {
        found = true;
        return { ...a, status: newStatus, updatedAt: new Date().toISOString() };
      }
      return a;
    });
    if (!found) {
      this.state.transformers = this.state.transformers.map((a) => {
        if (a.id === id) {
          found = true;
          return { ...a, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return a;
      });
    }
    if (!found) {
      this.state.feeders = this.state.feeders.map((a) => {
        if (a.id === id) {
          found = true;
          return { ...a, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return a;
      });
    }
    if (!found) {
      this.state.junctions = this.state.junctions.map((a) => {
        if (a.id === id) {
          found = true;
          return { ...a, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return a;
      });
    }
    if (!found) {
      this.state.meters = this.state.meters.map((a) => {
        if (a.id === id) {
          found = true;
          return { ...a, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return a;
      });
    }
    if (!found) {
      this.state.iotDevices = this.state.iotDevices.map((a) => {
        if (a.id === id) {
          found = true;
          return { ...a, status: newStatus, updatedAt: new Date().toISOString() };
        }
        return a;
      });
    }
    this.persist();
  }

  public deleteAsset(id: string) {
    this.state.substations = this.state.substations.filter((a) => a.id !== id);
    this.state.transformers = this.state.transformers.filter((a) => a.id !== id);
    this.state.feeders = this.state.feeders.filter((a) => a.id !== id);
    this.state.junctions = this.state.junctions.filter((a) => a.id !== id);
    this.state.meters = this.state.meters.filter((a) => a.id !== id);
    this.state.iotDevices = this.state.iotDevices.filter((a) => a.id !== id);
    this.persist();
  }

  /* ── Incident Actions ────────────────────────────────────────── */
  public createIncident(data: Partial<Incident>): Incident {
    const id = data.id || `INC-${new Date().getFullYear()}-${String(this.state.incidents.length + 1).padStart(3, '0')}`;
    const newInc: Incident = {
      id,
      title: data.title || 'Simulated Grid Incident',
      description: data.description || 'Simulated abnormal grid state triggered in control room.',
      severity: data.severity || Severity.HIGH,
      faultCategory: data.faultCategory || FaultCategory.TRANSFORMER_OVERLOAD,
      state: data.state || IncidentState.DETECTED,
      assetId: data.assetId || 'TRF-PUN-14',
      assetName: data.assetName || 'Senapati Bapat Marg DT-05 Transformer',
      assetType: data.assetType || AssetType.TRANSFORMER,
      city: data.city || 'Pune',
      district: data.district || data.city || 'Pune',
      location: data.location || { lat: 18.5342, lng: 73.8315 },
      detectedAt: new Date().toISOString(),
      estimatedConsumers: data.estimatedConsumers || 350,
      diagnosisMode: DiagnosisMode.RULE_BASED,
      probableCause: data.probableCause || 'Automated rule match based on simulated grid telemetry breach.',
      recommendedAction: data.recommendedAction || 'Dispatch field team and inspect asset telemetry.',
      evidence: data.evidence || [
        {
          id: `EV-${Date.now()}`,
          type: 'Grid Sensor Alert',
          description: 'Simulated threshold trigger',
          value: 'ABNORMAL',
          threshold: 'NORMAL',
          timestamp: new Date().toISOString(),
        },
      ],
      timeline: [
        {
          id: `TL-${Date.now()}`,
          state: IncidentState.DETECTED,
          timestamp: new Date().toISOString(),
          notes: 'Incident created via MahaGrid Control Centre simulation.',
        },
      ],
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    this.state.incidents = [newInc, ...this.state.incidents];

    // Also update asset status to FAULT
    this.updateAssetStatus(newInc.assetId, AssetStatus.FAULT);

    // Also create notification
    this.addNotification({
      type: 'INCIDENT',
      title: `Fault Alert: ${newInc.title}`,
      message: `Severe incident registered on ${newInc.assetName} in ${newInc.city}.`,
      severity: newInc.severity,
      link: '/outages',
    });

    this.persist();
    return newInc;
  }

  public updateIncidentState(id: string, newState: IncidentState, note?: string) {
    const incIndex = this.state.incidents.findIndex((i) => i.id === id);
    if (incIndex === -1) return;

    const inc = this.state.incidents[incIndex];
    const newTimeline = [
      ...(inc.timeline || []),
      {
        id: `TL-${Date.now()}`,
        state: newState,
        timestamp: new Date().toISOString(),
        notes: note || `State transitioned to ${newState}`,
      },
    ];

    const updates: Partial<Incident> = {
      state: newState,
      timeline: newTimeline,
      updatedAt: new Date().toISOString(),
    };

    if (newState === IncidentState.ACKNOWLEDGED && !inc.acknowledgedAt) {
      updates.acknowledgedAt = new Date().toISOString();
    }
    if (newState === IncidentState.POWER_RESTORED && !inc.resolvedAt) {
      updates.resolvedAt = new Date().toISOString();
      // Restore asset to NORMAL
      this.updateAssetStatus(inc.assetId, AssetStatus.NORMAL);
    }
    if (newState === IncidentState.CLOSED) {
      updates.closedAt = new Date().toISOString();
    }

    this.state.incidents[incIndex] = { ...inc, ...updates };

    // Also sync linked work order if exists
    if (inc.workOrderId) {
      const woIndex = this.state.workOrders.findIndex((w) => w.id === inc.workOrderId);
      if (woIndex !== -1) {
        this.state.workOrders[woIndex] = {
          ...this.state.workOrders[woIndex],
          state: newState,
          updatedAt: new Date().toISOString(),
        };
      }
    }

    this.persist();
  }

  /* ── Work Order Actions ──────────────────────────────────────── */
  public createWorkOrder(data: Partial<WorkOrder>): WorkOrder {
    const id = data.id || `WO-${new Date().getFullYear()}-${String(this.state.workOrders.length + 101).padStart(3, '0')}`;
    const newWo: WorkOrder = {
      id,
      incidentId: data.incidentId || 'INC-2026-001',
      incidentTitle: data.incidentTitle || 'Grid Maintenance Task',
      priority: data.priority || Severity.HIGH,
      state: data.state || IncidentState.WORK_ORDER_CREATED,
      assignedTeam: data.assignedTeam || 'Maharashtra Quick Response Team #1',
      dueAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
      createdById: 'usr-demo-admin',
      createdByName: 'Yashraj Jadhav',
      demoVehicle: 'MH-12-GR-4021 (E-Utility Van)',
      inspectionFindings: 'Work order initiated.',
      repairNotes: 'Standard safety lockout procedure applicable.',
      isDemo: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data,
    };

    this.state.workOrders = [newWo, ...this.state.workOrders];

    // Link back to incident
    if (newWo.incidentId) {
      const incIndex = this.state.incidents.findIndex((i) => i.id === newWo.incidentId);
      if (incIndex !== -1) {
        this.state.incidents[incIndex].workOrderId = newWo.id;
        this.state.incidents[incIndex].state = IncidentState.WORK_ORDER_CREATED;
      }
    }

    this.addNotification({
      type: 'MAINTENANCE',
      title: `Work Order ${newWo.id} Created`,
      message: `Assigned to ${newWo.assignedTeam} with ${newWo.priority} priority.`,
      severity: newWo.priority,
      link: '/maintenance',
    });

    this.persist();
    return newWo;
  }

  public updateWorkOrder(id: string, updates: Partial<WorkOrder>) {
    const index = this.state.workOrders.findIndex((w) => w.id === id);
    if (index === -1) return;

    this.state.workOrders[index] = {
      ...this.state.workOrders[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    // If state changed, sync incident
    if (updates.state && this.state.workOrders[index].incidentId) {
      this.updateIncidentState(
        this.state.workOrders[index].incidentId,
        updates.state,
        `Work order ${id} updated to ${updates.state}`,
      );
    } else {
      this.persist();
    }
  }

  /* ── Notification Actions ────────────────────────────────────── */
  public addNotification(notif: Partial<Notification>) {
    const newNotif: Notification = {
      id: `NOTIF-${Date.now()}`,
      type: notif.type || 'SYSTEM',
      title: notif.title || 'Notification',
      message: notif.message || '',
      severity: notif.severity || Severity.LOW,
      isRead: false,
      link: notif.link || '/dashboard',
      createdAt: new Date().toISOString(),
      ...notif,
    };
    this.state.notifications = [newNotif, ...this.state.notifications];
    this.persist();
  }

  public markNotificationAsRead(id: string) {
    this.state.notifications = this.state.notifications.map((n) =>
      n.id === id ? { ...n, isRead: true } : n,
    );
    this.persist();
  }

  public markAllNotificationsAsRead() {
    this.state.notifications = this.state.notifications.map((n) => ({ ...n, isRead: true }));
    this.persist();
  }

  public clearAllNotifications() {
    this.state.notifications = [];
    this.persist();
  }

  /* ── User Management Actions ─────────────────────────────────── */
  public updateUserRole(userId: string, newRole: Role) {
    this.state.users = this.state.users.map((u) =>
      u.id === userId ? { ...u, role: newRole } : u,
    );
    this.persist();
  }

  public toggleUserActive(userId: string) {
    this.state.users = this.state.users.map((u) =>
      u.id === userId ? { ...u, isActive: !u.isActive } : u,
    );
    this.persist();
  }

  public addUser(user: Partial<User>) {
    const newUser: User = {
      id: user.id || `usr-${Date.now()}`,
      name: user.name || 'New Officer',
      email: user.email || `officer-${Date.now().toString().slice(-4)}@mahagrid.gov.in`,
      role: user.role || Role.ENGINEER,
      isActive: true,
      createdAt: new Date().toISOString(),
      ...user,
    };
    this.state.users = [newUser, ...this.state.users];
    this.persist();
  }

  /* ── Settings / Thresholds ───────────────────────────────────── */
  public updateThreshold(id: string, newValue: number) {
    this.state.thresholds = this.state.thresholds.map((t) =>
      t.id === id ? { ...t, value: newValue } : t,
    );
    this.persist();
  }

  /* ── Simulation Scenario Runner ──────────────────────────────── */
  public runSimulationScenario(scenarioKey: string) {
    // 8 Predefined Scenarios (A to H)
    switch (scenarioKey) {
      case 'OVERLOAD_PUNE': {
        // Scenario B: Transformer Overload on TRF-PUN-14
        const inc = this.createIncident({
          title: 'Simulated Thermal Overload on Pune TRF-14',
          description: 'Load spike to 98.6% with top-oil temperature at 81.2°C.',
          severity: Severity.CRITICAL,
          faultCategory: FaultCategory.TRANSFORMER_OVERLOAD,
          assetId: 'TRF-PUN-14',
          assetName: 'Senapati Bapat Marg DT-05 Transformer',
          assetType: AssetType.TRANSFORMER,
          city: 'Pune',
          district: 'Pune',
          location: { lat: 18.5342, lng: 73.8315 },
          estimatedConsumers: 650,
          probableCause: 'High simultaneous peak load on Aundh feeder network.',
          recommendedAction: 'Transfer load block to adjacent feeder and dispatch thermal survey crew.',
        });

        // Set transformer to 98.6% load
        this.state.transformers = this.state.transformers.map((t) =>
          t.id === 'TRF-PUN-14'
            ? { ...t, loadPercent: 98.6, temperatureC: 81.2, status: AssetStatus.FAULT }
            : t,
        );

        this.state.simulationSession = {
          scenarioId: 'OVERLOAD_PUNE',
          scenarioName: 'Scenario B: Pune DT-14 Transformer Overload',
          state: 'RUNNING',
          step: 2,
          totalSteps: 5,
          speed: 1,
          log: [
            'Triggered transformer overload simulation.',
            `Created incident ${inc.id}.`,
            'Telemetry updated: 98.6% load, 81.2°C.',
            'Notification broadcasted to Control Room.',
          ],
        };
        this.persist();
        break;
      }

      case 'FEEDER_TRIP_NASHIK': {
        // Scenario D: Feeder Trip
        const inc = this.createIncident({
          title: 'Simulated 11kV Feeder Trip at Satpur MIDC',
          description: 'Overcurrent protection trip at substation busbar.',
          severity: Severity.CRITICAL,
          faultCategory: FaultCategory.FEEDER_TRIP,
          assetId: 'FDR-NSK-401',
          assetName: 'Satpur MIDC Feeder-2',
          assetType: AssetType.FEEDER,
          city: 'Nashik',
          district: 'Nashik',
          location: { lat: 19.9920, lng: 73.7580 },
          estimatedConsumers: 1800,
        });

        this.updateAssetStatus('FDR-NSK-401', AssetStatus.FAULT);

        this.state.simulationSession = {
          scenarioId: 'FEEDER_TRIP_NASHIK',
          scenarioName: 'Scenario D: Nashik Feeder Short Circuit Trip',
          state: 'RUNNING',
          step: 2,
          totalSteps: 5,
          speed: 1,
          log: [
            'Triggered 11kV Feeder trip simulation.',
            `Created incident ${inc.id}.`,
            '1800 estimated consumers affected.',
          ],
        };
        this.persist();
        break;
      }

      case 'VOLTAGE_SAG_MUMBAI': {
        // Scenario C: Severe Voltage Sag
        const inc = this.createIncident({
          title: 'Severe Voltage Sag (194V) in Bandra Reclamation',
          description: 'Bus voltage dropped 15% below nominal tolerance.',
          severity: Severity.HIGH,
          faultCategory: FaultCategory.UNDER_VOLTAGE,
          assetId: 'FDR-MUM-201',
          assetName: 'Bandra Reclamation Feeder 11kV',
          assetType: AssetType.FEEDER,
          city: 'Mumbai Suburban',
          district: 'Mumbai Suburban',
          location: { lat: 19.0510, lng: 72.8350 },
          estimatedConsumers: 920,
        });

        this.updateAssetStatus('FDR-MUM-201', AssetStatus.WARNING);

        this.state.simulationSession = {
          scenarioId: 'VOLTAGE_SAG_MUMBAI',
          scenarioName: 'Scenario C: Bandra Voltage Sag Anomaly',
          state: 'RUNNING',
          step: 2,
          totalSteps: 5,
          speed: 1,
          log: [
            'Triggered voltage sag simulation.',
            `Incident ${inc.id} logged.`,
            'Voltage compliance score impacted.',
          ],
        };
        this.persist();
        break;
      }

      case 'COMM_LOSS_CSN': {
        // Scenario E: Communication Loss
        const inc = this.createIncident({
          title: 'Substation RTU Telemetry Link Lost',
          description: 'No telemetry frames received from Waluj node.',
          severity: Severity.MEDIUM,
          faultCategory: FaultCategory.COMMUNICATION_LOSS,
          assetId: 'IOT-CSN-01',
          assetName: 'Waluj MIDC Substation Telemetry Node',
          assetType: AssetType.IOT_SENSOR,
          city: 'Chhatrapati Sambhajinagar',
          district: 'Chhatrapati Sambhajinagar',
          location: { lat: 19.8522, lng: 75.2420 },
          estimatedConsumers: 0,
        });

        this.state.iotDevices = this.state.iotDevices.map((d) =>
          d.id === 'IOT-CSN-01' ? { ...d, isOnline: false, status: AssetStatus.OFFLINE } : d,
        );

        this.state.simulationSession = {
          scenarioId: 'COMM_LOSS_CSN',
          scenarioName: 'Scenario E: IoT Gateway Offline',
          state: 'RUNNING',
          step: 2,
          totalSteps: 4,
          speed: 1,
          log: [
            'Simulated gateway communication loss.',
            `Created incident ${inc.id}.`,
            'Device status flipped to OFFLINE.',
          ],
        };
        this.persist();
        break;
      }

      case 'RESTORE_ALL': {
        // Scenario H: Repair & Power Restoration
        // Mark all incidents as POWER_RESTORED and restore assets to NORMAL
        this.state.incidents = this.state.incidents.map((i) => ({
          ...i,
          state: IncidentState.POWER_RESTORED,
          resolvedAt: new Date().toISOString(),
        }));
        this.state.workOrders = this.state.workOrders.map((w) => ({
          ...w,
          state: IncidentState.POWER_RESTORED,
          restoredAt: new Date().toISOString(),
        }));
        this.state.substations = this.state.substations.map((s) => ({ ...s, status: AssetStatus.NORMAL }));
        this.state.transformers = this.state.transformers.map((t) => ({
          ...t,
          status: AssetStatus.NORMAL,
          loadPercent: Math.min(t.loadPercent || 65, 75),
          temperatureC: Math.min(t.temperatureC || 45, 52),
        }));
        this.state.feeders = this.state.feeders.map((f) => ({ ...f, status: AssetStatus.NORMAL }));
        this.state.junctions = this.state.junctions.map((j) => ({ ...j, status: AssetStatus.NORMAL }));
        this.state.iotDevices = this.state.iotDevices.map((d) => ({
          ...d,
          isOnline: true,
          status: AssetStatus.NORMAL,
        }));

        this.addNotification({
          type: 'SYSTEM',
          title: 'Grid Power Restored',
          message: 'All simulated faults resolved. Circuits verified and synchronized.',
          severity: Severity.LOW,
          link: '/dashboard',
        });

        this.state.simulationSession = {
          scenarioId: 'RESTORE_ALL',
          scenarioName: 'Scenario H: Full Grid Restoration',
          state: 'COMPLETED',
          step: 5,
          totalSteps: 5,
          speed: 1,
          log: [
            'All circuits energized and verified.',
            'Telemetry returned to nominal values.',
            'Power restored across all districts.',
          ],
        };
        this.persist();
        break;
      }

      default: {
        // Reset to baseline
        this.resetToBaseline();
        break;
      }
    }
  }
}

export const gridStore = new GridStore();
