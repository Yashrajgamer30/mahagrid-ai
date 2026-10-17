/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – 20 Planned Module Page Components
   Each module is populated with Maharashtra smart grid domain KPIs,
   scaffold features, sample CSV datasets, and interactive simulation.
   ────────────────────────────────────────────────────────────────── */

import {
  LayoutDashboard,
  Map,
  Network,
  Power,
  AlertTriangle,
  Wrench,
  CircuitBoard,
  Zap,
  Activity,
  GitFork,
  Cpu,
  Gauge,
  Radio,
  Brain,
  BarChart3,
  FileText,
  FlaskConical,
  Bell,
  Users,
  Settings,
} from 'lucide-react';
import { ModulePlaceholder } from './ModulePlaceholder';

/* ── 1. Dashboard ────────────────────────────────────────── */
export function DashboardPage() {
  return (
    <ModulePlaceholder
      title="Executive Grid Dashboard"
      subtitle="Holistic digital twin telemetry and state estimation for Maharashtra's electricity distribution network."
      category="Overview"
      icon={<LayoutDashboard size={22} />}
      kpis={[
        { label: 'Network Health', value: '98.4', unit: '%', meta: 'Nominal operational status across 36 districts', variant: 'primary' },
        { label: 'Total Grid Assets', value: '24,850', meta: 'Substations, Transformers & Feeders', variant: 'neutral' },
        { label: 'Active Incidents', value: '4', meta: '2 under investigation, 2 dispatched', variant: 'warning' },
        { label: 'Total Demand', value: '18,420', unit: 'MW', meta: 'Maharashtra aggregate load', variant: 'primary' },
      ]}
      features={[
        { title: 'Real-Time State Estimation', desc: 'Weighted Least Squares (WLS) state estimation calculating bus voltages and feeder line flows.' },
        { title: 'District Drill-down', desc: 'Aggregated health metrics filtered dynamically by Maharashtra district and municipal zone.' },
        { title: 'Live Alarm Ticker', desc: 'Streaming WebSocket telemetry updates for threshold breaches and fault trips.' },
        { title: 'Incident Resolution Stepper', desc: 'Visual 14-stage lifecycle tracking from fault detection to grid power restoration.' },
      ]}
      sampleCsvFilename="dashboard_kpi_summary.csv"
      sampleCsvHeaders={['District', 'Health_Score_Pct', 'Total_Assets', 'Active_Alarms', 'Load_MW']}
      sampleCsvRows={[
        ['Mumbai Suburban', 99.2, 4200, 0, 3100],
        ['Pune', 98.7, 5100, 1, 2850],
        ['Nagpur', 97.9, 3200, 1, 1620],
        ['Nashik', 98.1, 2900, 0, 1400],
        ['Aurangabad', 97.4, 2600, 2, 1250],
      ]}
    />
  );
}

/* ── 2. Live Map ─────────────────────────────────────────── */
export function LiveMapPage() {
  return (
    <ModulePlaceholder
      title="Live Geospatial Map"
      subtitle="Interactive GIS digital twin mapping Maharashtra substations, 11kV/22kV distribution feeders, and DT locations."
      category="Geospatial"
      icon={<Map size={22} />}
      kpis={[
        { label: 'Mapped Coordinates', value: '18,920', meta: 'GPS validated nodes', variant: 'primary' },
        { label: 'Substations on Map', value: '840', meta: '33/11kV & 132/33kV substations', variant: 'neutral' },
        { label: 'Feeder Routes', value: '2,410', meta: 'Active vector polylines', variant: 'neutral' },
        { label: 'Critical Zones', value: '2', meta: 'High thermal or load risk areas', variant: 'critical' },
      ]}
      features={[
        { title: 'Leaflet Vector Layers', desc: 'Dynamic SVG feeder rendering with animated flow vectors for normal circuits and red alerts for trips.' },
        { title: 'Geographic Search', desc: 'Direct lookup by substation code, feeder feeder ID, or consumer cluster landmark.' },
        { title: 'GPS Drift Detection', desc: 'Automated warnings when field-reported GPS coordinates deviate from GIS master records.' },
        { title: 'Weather & Lightning Overlay', desc: 'Monsoon storm tracking to correlate high-voltage trips with weather anomalies.' },
      ]}
      sampleCsvFilename="geospatial_assets_sample.csv"
      sampleCsvHeaders={['Asset_ID', 'Name', 'Type', 'District', 'Latitude', 'Longitude', 'Status']}
      sampleCsvRows={[
        ['SUB-PUN-01', 'Shivajinagar 33/11kV', 'SUBSTATION', 'Pune', 18.5308, 73.8475, 'NORMAL'],
        ['TRF-MUM-44', 'Bandra West DT-12', 'TRANSFORMER', 'Mumbai Suburban', 19.0596, 72.8295, 'WARNING'],
        ['SUB-NAG-03', 'Sitabuldi Substation', 'SUBSTATION', 'Nagpur', 21.1458, 79.0882, 'NORMAL'],
        ['TRF-NSK-19', 'Panchavati DT-04', 'TRANSFORMER', 'Nashik', 20.0110, 73.7903, 'FAULT'],
      ]}
    />
  );
}

/* ── 3. Topology ─────────────────────────────────────────── */
export function TopologyPage() {
  return (
    <ModulePlaceholder
      title="Network Topology Explorer"
      subtitle="Hierarchical electrical tree graph showing Substation → Feeder → Distribution Transformer → Smart Meter lineage."
      category="Overview"
      icon={<Network size={22} />}
      kpis={[
        { label: 'Connected Trees', value: '840', meta: 'Isolated electrical topologies', variant: 'primary' },
        { label: 'Hierarchy Depth', value: '4 Levels', meta: 'Substation to End Consumer', variant: 'neutral' },
        { label: 'Orphaned Nodes', value: '0', meta: 'Strict graph integrity enforced', variant: 'primary' },
        { label: 'Branching Factor', value: '4.8', meta: 'Average feeders per substation', variant: 'neutral' },
      ]}
      features={[
        { title: 'Interactive Graph Explorer', desc: 'Drill down from grid parent substations down into individual distribution transformer feeders.' },
        { title: 'Back-Feeding Route Simulation', desc: 'Visualizes alternative tie-switches for rerouting power during emergency feeder maintenance.' },
        { title: 'Upstream/Downstream Tracing', desc: 'Click any transformer to instantly trace the supplying feeder and circuit breaker path.' },
        { title: 'Circuit Connectivity Validation', desc: 'Automatic detection of loops or broken branch connections in the distribution twin.' },
      ]}
    />
  );
}

/* ── 4. Outages ──────────────────────────────────────────── */
export function OutagesPage() {
  return (
    <ModulePlaceholder
      title="Outage Management System (OMS)"
      subtitle="Real-time tracking of active blackouts, unscheduled feeder trips, consumer impact estimates, and restoration timelines."
      category="Operations"
      icon={<Power size={22} />}
      kpis={[
        { label: 'Active Outages', value: '3', meta: '1 Planned, 2 Unplanned', variant: 'warning' },
        { label: 'Estimated Consumers', value: '4,120', meta: 'Estimated (seeded model)', variant: 'critical' },
        { label: 'Average Restoration (MTTR)', value: '42', unit: 'min', meta: 'Past 30 days', variant: 'primary' },
        { label: 'Grid Availability', value: '99.87', unit: '%', meta: 'Distribution reliability metric', variant: 'primary' },
      ]}
      features={[
        { title: 'Automated Consumer Tally', desc: 'Downstream consumer counting based on transformer meter counts with clear estimation labels.' },
        { title: 'SAIDI / SAIFI Tracking', desc: 'IEEE standard reliability indices calculated continuously per district.' },
        { title: 'Restoration ETA Engine', desc: 'Field repair progress calculations updating estimated power restoration times.' },
        { title: 'Consumer Notification Dispatch', desc: 'Automated SMS/WhatsApp outage alerts triggered upon feeder trip confirmation.' },
      ]}
      sampleCsvFilename="active_outages.csv"
      sampleCsvHeaders={['Outage_ID', 'District', 'Affected_Feeder', 'Consumers_Affected', 'Started_At', 'Status']}
      sampleCsvRows={[
        ['OUT-2026-101', 'Pune', 'FDR-HAD-02', 2450, '2026-10-14 14:15:00', 'IN_PROGRESS'],
        ['OUT-2026-102', 'Nashik', 'FDR-PAN-05', 1200, '2026-10-14 15:30:00', 'DISPATCHED'],
        ['OUT-2026-103', 'Amravati', 'FDR-BAD-01', 470, '2026-10-14 16:00:00', 'INVESTIGATING'],
      ]}
    />
  );
}

/* ── 5. Fault Locator ────────────────────────────────────── */
export function FaultLocatorPage() {
  return (
    <ModulePlaceholder
      title="Intelligent Fault Locator"
      subtitle="Impedance and travel-time fault distance estimation to pin down cable breakdowns and line trips within meters."
      category="Operations"
      icon={<AlertTriangle size={22} />}
      kpis={[
        { label: 'Recent Faults Analyzed', value: '18', meta: 'Past 7 days', variant: 'neutral' },
        { label: 'Average Location Error', value: '±45', unit: 'm', meta: 'High precision calibration', variant: 'primary' },
        { label: 'Prevalent Fault Type', value: 'Line-to-Ground', meta: '68% of monsoon incidents', variant: 'warning' },
        { label: 'Auto-Dispatched Orders', value: '16', meta: '92% direct work order conversion', variant: 'primary' },
      ]}
      features={[
        { title: 'Takagi & Reactance Algorithms', desc: 'Mathematical impedance models comparing pre-fault and fault voltage/current phasors.' },
        { title: 'GIS Marker Snapping', desc: 'Calculated fault km distance projected directly onto the geographic feeder line segment.' },
        { title: 'Nearest Tower / Pole ID', desc: 'Pinpoints the exact MSEDCL pole reference number closest to the calculated fault zone.' },
        { title: 'Multi-Phase Fault Classifier', desc: 'Distinguishes single line-to-ground (SLG), line-to-line (LL), and double line-to-ground (DLG) faults.' },
      ]}
    />
  );
}

/* ── 6. Maintenance ──────────────────────────────────────── */
export function MaintenancePage() {
  return (
    <ModulePlaceholder
      title="Predictive & Routine Maintenance"
      subtitle="Work order lifecycle management, crew dispatch tracking, transformer oil sampling (DGA), and post-repair validation."
      category="Operations"
      icon={<Wrench size={22} />}
      kpis={[
        { label: 'Open Work Orders', value: '7', meta: '3 Urgent, 4 Scheduled', variant: 'warning' },
        { label: 'Field Crews Active', value: '12', meta: 'Connected via mobile field app', variant: 'primary' },
        { label: 'DGA Tests Pending', value: '5', meta: 'Dissolved Gas Analysis for DTRs', variant: 'neutral' },
        { label: 'First-Time Fix Rate', value: '94.2', unit: '%', meta: 'Post-repair verification metric', variant: 'primary' },
      ]}
      features={[
        { title: '14-Stage Work Order Stepper', desc: 'Enforces proper procedural signoffs: inspection, isolation, permit-to-work, repair, and test.' },
        { title: 'Spare Parts Inventory Link', desc: 'Tracks cable joints, insulator bushings, silica gel breathers, and HT fuses used in repairs.' },
        { title: 'Field Crew GPS Geofencing', desc: 'Ensures crew has physically arrived on-site before allowing work order status advancement.' },
        { title: 'Safety Permit Verification', desc: 'Mandatory lockout/tagout (LOTO) photographic checklist verification prior to re-energization.' },
      ]}
    />
  );
}

/* ── 7. All Assets ───────────────────────────────────────── */
export function AllAssetsPage() {
  return (
    <ModulePlaceholder
      title="Asset Registry & Digital Twin Inventory"
      subtitle="Unified catalogue of all electrical distribution hardware with ratings, installation dates, health scores, and parent linkages."
      category="Assets"
      icon={<CircuitBoard size={22} />}
      kpis={[
        { label: 'Total Catalogued Assets', value: '24,850', meta: 'Verified in database', variant: 'primary' },
        { label: 'Operational Assets', value: '24,310', meta: '97.8% normal service', variant: 'primary' },
        { label: 'Under Maintenance', value: '412', meta: 'Scheduled servicing', variant: 'neutral' },
        { label: 'Critical / Faulted', value: '128', meta: 'Requires engineering attention', variant: 'critical' },
      ]}
      features={[
        { title: 'Multi-Criteria Facet Filtering', desc: 'Filter instantly by district, asset type, operational status, voltage class, or installation year.' },
        { title: 'Batch CSV Import / Export', desc: 'Full bulk import validation with Zod schema verification and sample template generation.' },
        { title: 'Digital Twin Asset Dossier', desc: 'Complete historical logs including repair records, thermal scans, and real-time telemetry graphs.' },
        { title: 'QR Code & Asset Tagging', desc: 'Unique asset identifiers compatible with field RFID tags and handheld scanner lookup.' },
      ]}
      sampleCsvFilename="asset_inventory_template.csv"
      sampleCsvHeaders={['Asset_ID', 'Name', 'Type', 'District', 'Voltage_kV', 'Capacity_kVA', 'Status']}
      sampleCsvRows={[
        ['SUB-001', 'Kothrud Substation', 'SUBSTATION', 'Pune', 33, 20000, 'NORMAL'],
        ['TRF-102', 'Karve Road DTR 14', 'TRANSFORMER', 'Pune', 11, 250, 'NORMAL'],
        ['FDR-204', 'Warje 11kV Feeder', 'FEEDER', 'Pune', 11, null, 'NORMAL'],
        ['JNC-308', 'Chandani Chowk Junction', 'JUNCTION', 'Pune', 0.415, null, 'WARNING'],
      ]}
    />
  );
}

/* ── 8. Substations ──────────────────────────────────────── */
export function SubstationsPage() {
  return (
    <ModulePlaceholder
      title="Substations (33/11kV & 132/33kV)"
      subtitle="Primary transformation nodes: busbar voltages, incomer breakers, bay controllers, and station service telemetry."
      category="Assets"
      icon={<Zap size={22} />}
      kpis={[
        { label: 'Monitored Substations', value: '840', meta: 'Across Maharashtra zones', variant: 'primary' },
        { label: 'Average Incomer Bus V', value: '33.1', unit: 'kV', meta: 'Nominal 33.0 kV target', variant: 'primary' },
        { label: 'Breakers Tripped', value: '1', meta: 'Auto-reclosure in standby', variant: 'warning' },
        { label: 'Total Transformer Cap', value: '16.8', unit: 'GVA', meta: 'Installed capacity', variant: 'neutral' },
      ]}
      features={[
        { title: 'Substation Single-Line Diagram (SLD)', desc: 'Interactive bus coupler and breaker status visualization conforming to IEC 61850.' },
        { title: 'Bus Voltage Stability Monitor', desc: 'Continuous 3-phase voltage monitoring with automatic warning triggers on ±6% deviations.' },
        { title: 'SF6 Gas Pressure Telemetry', desc: 'Breaker SF6 gas density tracking to prevent arc extinction failures.' },
        { title: 'Transformer Bay Load Balancing', desc: 'Monitors load distribution between parallel step-down power transformers.' },
      ]}
    />
  );
}

/* ── 9. Transformers ─────────────────────────────────────── */
export function TransformersPage() {
  return (
    <ModulePlaceholder
      title="Distribution Transformers (DTRs)"
      subtitle="Step-down 11kV to 415V pole-mounted and plinth-mounted transformers with top-oil temperature and oil level monitoring."
      category="Assets"
      icon={<Activity size={22} />}
      kpis={[
        { label: 'Active Transformers', value: '12,400', meta: '25kVA to 1000kVA ratings', variant: 'primary' },
        { label: 'Overloaded (>90%)', value: '28', meta: 'Cooling upgrade required', variant: 'critical' },
        { label: 'Avg Top-Oil Temp', value: '62.4', unit: '°C', meta: 'Safe operating limit < 85°C', variant: 'primary' },
        { label: 'DGA Alarm Level', value: '4', meta: 'High ethylene or acetylene detected', variant: 'warning' },
      ]}
      features={[
        { title: 'Thermal Life Consumption Model', desc: 'Calculates transformer insulation aging factor based on ambient temperature and load curves.' },
        { title: 'Neutral Current & Unbalance Tracker', desc: 'Detects heavy single-phase tapping causing overheating in star-point neutral conductors.' },
        { title: 'Oil Level Float Telemetry', desc: 'Alerts when oil level drops below minimum mark, preventing internal flashover.' },
        { title: 'Preventive Overload Shedding', desc: 'AI-assisted load shedding suggestions before catastrophic coil burnout occurs.' },
      ]}
    />
  );
}

/* ── 10. Feeders ─────────────────────────────────────────── */
export function FeedersPage() {
  return (
    <ModulePlaceholder
      title="11kV / 22kV Distribution Feeders"
      subtitle="Medium-voltage radial and ring-main overhead lines and underground cables feeding municipal and rural pockets."
      category="Assets"
      icon={<GitFork size={22} />}
      kpis={[
        { label: 'Active Feeder Lines', value: '2,410', meta: '34,200 total circuit km', variant: 'primary' },
        { label: 'Tripped Feeders', value: '2', meta: 'Protection relay operated', variant: 'critical' },
        { label: 'Avg Technical Losses', value: '8.4', unit: '%', meta: 'I²R transmission loss', variant: 'neutral' },
        { label: 'Feeder Peak Loading', value: '74.2', unit: '%', meta: 'Ample reserve capacity', variant: 'primary' },
      ]}
      features={[
        { title: 'Line Current Imbalance Metering', desc: 'Real-time phase-A, phase-B, phase-C current balancing indicators.' },
        { title: 'Auto-Recloser Telemetry', desc: 'Tracks transient tree-touch events vs permanent short-circuit lockouts.' },
        { title: 'Feeder Interconnection Matrix', desc: 'Pre-computed tie-switch paths for back-feeding adjacent zones.' },
        { title: 'Thermal Line Capacity Ratings', desc: 'Dynamic line ratings (DLR) adjusting safe ampacity based on wind and ambient temperature.' },
      ]}
    />
  );
}

/* ── 11. Junctions ───────────────────────────────────────── */
export function JunctionsPage() {
  return (
    <ModulePlaceholder
      title="Distribution Junctions & Pillars"
      subtitle="Low-voltage distribution boxes, feeder pillars, and cable tee-junctions connecting secondary distribution to consumers."
      category="Assets"
      icon={<Cpu size={22} />}
      kpis={[
        { label: 'Tracked Pillar Boxes', value: '8,200', meta: 'Low-voltage distribution points', variant: 'primary' },
        { label: 'Thermal Hotspots', value: '14', meta: 'Loose lug connection detected', variant: 'warning' },
        { label: 'Water Ingress Sensor Alerts', value: '0', meta: 'Monsoon submersible enclosures safe', variant: 'primary' },
        { label: 'Door Open / Tamper', value: '3', meta: 'Physical security check triggered', variant: 'warning' },
      ]}
      features={[
        { title: 'Pillar Thermal Monitoring', desc: 'Contact-point thermistor sensors detecting high-resistance connection fires.' },
        { title: 'Physical Enclosure Security', desc: 'Magnetic tamper switch alarms notifying dispatch when unauthorized doors are opened.' },
        { title: 'Phase Balancing Matrix', desc: 'Guides field workers on which service phase to land new consumer connections.' },
        { title: 'Flood / Moisture Detection', desc: 'Water ingress sensors in underground pits triggering preventive circuit isolation.' },
      ]}
    />
  );
}

/* ── 12. Meters ──────────────────────────────────────────── */
export function MetersPage() {
  return (
    <ModulePlaceholder
      title="Advanced Metering Infrastructure (AMI)"
      subtitle="Smart energy meters, consumer interval data, power factor compliance, and meter tamper detection."
      category="Assets"
      icon={<Gauge size={22} />}
      kpis={[
        { label: 'Connected Smart Meters', value: '184,200', meta: 'Cellular & RF mesh connected', variant: 'primary' },
        { label: 'Read Success Rate', value: '99.4', unit: '%', meta: '15-minute interval telemetry', variant: 'primary' },
        { label: 'Reverse Power / Tamper', value: '19', meta: 'Suspicious bypass events', variant: 'critical' },
        { label: 'Average Power Factor', value: '0.96', meta: 'Target >= 0.95 maintained', variant: 'primary' },
      ]}
      features={[
        { title: '15-Minute Interval Profiles', desc: 'Active kWh, reactive kVARh, voltage, and current time-series logging.' },
        { title: 'Automated Tamper Detection', desc: 'Neutral bypass, cover open, magnet detection, and reverse energy logging.' },
        { title: 'Last-Gasp Outage Signaling', desc: 'Capacitor-backed final radio beacon transmitted when mains power cuts off.' },
        { title: 'Power Quality Compliance', desc: 'Voltage sag, swell, and total harmonic distortion (THD) threshold alerts.' },
      ]}
    />
  );
}

/* ── 13. IoT Devices ─────────────────────────────────────── */
export function IoTSensorsPage() {
  return (
    <ModulePlaceholder
      title="IoT Telemetry & Edge Sensor Fleet"
      subtitle="ESP32 microcontrollers, Modbus RS485 RTUs, Rogowski current coils, and MQTT/LoRaWAN field gateways."
      category="Assets"
      icon={<Radio size={22} />}
      kpis={[
        { label: 'Active Edge Devices', value: '1,420', meta: 'ESP32 & Industrial RTUs', variant: 'primary' },
        { label: 'Gateway Online Ratio', value: '98.9', unit: '%', meta: 'LoRaWAN & 4G cellular links', variant: 'primary' },
        { label: 'Firmware Up to Date', value: '96.2', unit: '%', meta: 'v2.4.1 stable firmware', variant: 'neutral' },
        { label: 'Telemetry Packets / Min', value: '14,200', meta: 'Sub-second edge sampling', variant: 'primary' },
      ]}
      features={[
        { title: 'Hardware Heartbeat Monitoring', desc: 'Automated detection of edge device silence with fallback to synthetic interpolation.' },
        { title: 'Over-the-Air (OTA) Updates', desc: 'Remote firmware management and cryptographic signed binary deployment.' },
        { title: 'Modbus / DNP3 / IEC 104 Bridging', desc: 'Standard utility protocol translation into unified JSON WebSocket packets.' },
        { title: 'Edge Anomaly Pre-Filtering', desc: 'ESP32 on-chip threshold checking reducing unnecessary cellular bandwidth usage.' },
      ]}
    />
  );
}

/* ── 14. AI Analysis ─────────────────────────────────────── */
export function AiAnalysisPage() {
  return (
    <ModulePlaceholder
      title="AI Grid Diagnostics & Advisory"
      subtitle="Machine learning anomaly detection, predictive transformer failure forecasting, and rule-based diagnostic suggestions."
      category="Intelligence"
      icon={<Brain size={22} />}
      kpis={[
        { label: 'AI Health Index', value: '94.8', unit: '%', meta: 'Grid stability confidence', variant: 'primary' },
        { label: 'Predicted Failures (48h)', value: '2', meta: 'DTR thermal breakdown risk', variant: 'warning' },
        { label: 'Diagnosis Accuracy', value: '96.1', unit: '%', meta: 'Validated against field work orders', variant: 'primary' },
        { label: 'Safety Guardrails Active', value: 'Enforced', meta: 'AI never issues direct switching', variant: 'primary' },
      ]}
      features={[
        { title: 'Strict Advisory Mode Only', desc: 'All machine learning recommendations require human engineer signoff; zero automated grid actuation.' },
        { title: 'Transformer Thermal Overload Prediction', desc: 'LSTM neural network forecasting next 48-hour coil temperatures based on forecast weather.' },
        { title: 'Rule-Engine Diagnostic Trace', desc: 'Transparent rule breakdown explaining exactly why an alert was categorized as high risk.' },
        { title: 'Synthetic Twin Sandbox', desc: 'Simulate the impact of proposed re-routing before dispatching field crews.' },
      ]}
    />
  );
}

/* ── 15. Analytics ───────────────────────────────────────── */
export function AnalyticsPage() {
  return (
    <ModulePlaceholder
      title="Grid Analytics & Loss Analysis"
      subtitle="Aggregate demand profiles, technical vs commercial (AT&C) loss calculations, and reliability metric trend charts."
      category="Intelligence"
      icon={<BarChart3 size={22} />}
      kpis={[
        { label: 'Total Energy Billed', value: '412.4', unit: 'MU', meta: 'Current billing cycle', variant: 'primary' },
        { label: 'AT&C Loss Aggregate', value: '14.2', unit: '%', meta: 'Reduced 1.8% year-over-year', variant: 'primary' },
        { label: 'Peak Grid Demand', value: '21,400', unit: 'MW', meta: 'Recorded during afternoon peak', variant: 'neutral' },
        { label: 'Average SAIDI', value: '38.4', unit: 'min', meta: 'System Average Interruption Duration', variant: 'primary' },
      ]}
      features={[
        { title: 'AT&C Loss Hotspot Identification', desc: 'Compares substation bus metering against consumer smart meter sums to pinpoint theft.' },
        { title: 'Daily Load Curve Clustering', desc: 'Categorizes feeders into industrial, commercial, and agricultural consumption signatures.' },
        { title: 'Harmonic Distortion Analysis', desc: 'Tracks 3rd, 5th, and 7th order harmonics degrading capacitor bank lifespan.' },
        { title: 'Renewable Solar Influx Tracking', desc: 'Monitors reverse daytime power flow from rooftop photovoltaic installations.' },
      ]}
    />
  );
}

/* ── 16. Reports ─────────────────────────────────────────── */
export function ReportsPage() {
  return (
    <ModulePlaceholder
      title="Audit & Regulatory Compliance Reports"
      subtitle="Standardized reporting for MERC (Maharashtra Electricity Regulatory Commission), CEA guidelines, and internal audits."
      category="Intelligence"
      icon={<FileText size={22} />}
      kpis={[
        { label: 'Generated Reports', value: '142', meta: 'Past 30 days', variant: 'neutral' },
        { label: 'Regulatory Filings', value: '100', unit: '%', meta: 'MERC compliance on schedule', variant: 'primary' },
        { label: 'Audit Trail Records', value: '1.2M', meta: 'Immutable event log entries', variant: 'neutral' },
        { label: 'Scheduled Exports', value: '8', meta: 'Weekly and monthly automated digests', variant: 'primary' },
      ]}
      features={[
        { title: 'MERC Regulatory Formats', desc: 'Automated generation of quarterly reliability indices and unplanned interruption summaries.' },
        { title: 'Cryptographic Audit Trail', desc: 'Timestamped user action logs recording every acknowledgment, threshold edit, and dispatch.' },
        { title: 'One-Click CSV & PDF Generation', desc: 'High-resolution vector charts and tabulated data exports with persistent demo disclaimers.' },
        { title: 'Automated Email Schedules', desc: 'Configurable automated distribution to district executive engineers and substation managers.' },
      ]}
      sampleCsvFilename="merc_monthly_compliance_sample.csv"
      sampleCsvHeaders={['Month', 'District', 'SAIFI', 'SAIDI_Min', 'MAIFI', 'ATC_Loss_Pct']}
      sampleCsvRows={[
        ['2026-09', 'Pune', 1.42, 42.1, 0.84, 12.1],
        ['2026-09', 'Mumbai Suburban', 0.82, 18.4, 0.31, 8.4],
        ['2026-09', 'Nagpur', 1.88, 56.2, 1.12, 16.2],
        ['2026-09', 'Nashik', 1.61, 48.0, 0.95, 14.0],
      ]}
    />
  );
}

/* ── 17. Simulation Lab ──────────────────────────────────── */
export function SimulationLabPage() {
  return (
    <ModulePlaceholder
      title="Digital Twin Simulation Lab"
      subtitle="Interactive academic sandbox: run synthetic grid stress scenarios, monsoon storm surges, and solar back-feed tests."
      category="Intelligence"
      icon={<FlaskConical size={22} />}
      kpis={[
        { label: 'Simulation Engine', value: 'Ready', meta: 'Synthetic Monte-Carlo generator', variant: 'primary' },
        { label: 'Available Scenarios', value: '8 Scenarios', meta: 'Lightning, Overload, Cable Fault...', variant: 'neutral' },
        { label: 'Execution Speed', value: '1.0×', meta: 'Configurable 0.5× to 10×', variant: 'primary' },
        { label: 'Simulated Nodes', value: '1,200', meta: 'Sandboxed virtual network', variant: 'neutral' },
      ]}
      features={[
        { title: 'Monsoon Lightning Surge Scenario', desc: 'Simulates multiple simultaneous feeder trips across coastal Konkan and Western Ghats.' },
        { title: 'Transformer Heatwave Overload', desc: 'Models peak summer agricultural pump load triggering cascading thermal alerts.' },
        { title: 'Speed & Step Controls', desc: 'Play, pause, advance tick, and fast-forward simulation time with instant UI telemetry updates.' },
        { title: 'Reset to Clean Baseline', desc: 'Single-click purge of synthetic test incidents without affecting persistent configuration.' },
      ]}
    />
  );
}

/* ── 18. Notifications ───────────────────────────────────── */
export function NotificationsPage() {
  return (
    <ModulePlaceholder
      title="Alerts & Notification Inbox"
      subtitle="Centralized event stream for system alarms, critical threshold excursions, field work order updates, and security logs."
      category="System"
      icon={<Bell size={22} />}
      kpis={[
        { label: 'Unread Alerts', value: '3', meta: 'Requires review', variant: 'warning' },
        { label: 'Critical Alarms (24h)', value: '1', meta: 'Feeder trip event acknowledged', variant: 'critical' },
        { label: 'Avg Acknowledge Time', value: '2.4', unit: 'min', meta: 'Control room operator response', variant: 'primary' },
        { label: 'Escalation Triggers', value: '0', meta: 'No breached response SLAs', variant: 'primary' },
      ]}
      features={[
        { title: 'Priority-Tiered Categorization', desc: 'Critical (red), High (orange), Medium (saffron), and Info (blue) visual separation.' },
        { title: 'Single-Click Incident Navigation', desc: 'Jump directly from an alarm notification to the affected asset dossier or GIS map pin.' },
        { title: 'Operator Acknowledgment Notes', desc: 'Require operator initials and response comments when clearing critical alarms.' },
        { title: 'Multi-Channel Push Support', desc: 'Integrated webhook dispatch for SMS, email, and mobile control room alerts.' },
      ]}
    />
  );
}

/* ── 19. User Management ─────────────────────────────────── */
export function UserManagementPage() {
  return (
    <ModulePlaceholder
      title="Role-Based Access Control (RBAC)"
      subtitle="Operator account provisioning, permissions, session monitoring, and role enforcement (Admin, Manager, Engineer, Field Worker, Viewer)."
      category="System"
      icon={<Users size={22} />}
      kpis={[
        { label: 'Registered Users', value: '48', meta: 'Active directory accounts', variant: 'primary' },
        { label: 'Current Sessions', value: '6', meta: 'Logged into control room UI', variant: 'neutral' },
        { label: 'Admin Accounts', value: '3', meta: 'Strict credential policies', variant: 'neutral' },
        { label: 'Failed Logins (24h)', value: '0', meta: 'Zero suspicious brute-force attempts', variant: 'primary' },
      ]}
      features={[
        { title: 'Granular Role Definitions', desc: 'Admins control settings; Managers approve work orders; Field Workers update repair states.' },
        { title: 'Session Expiry & Inactivity Logout', desc: 'Automatic 15-minute inactivity timeout protecting unattended control room terminals.' },
        { title: 'Audit Trail of User Changes', desc: 'Immutable logging of role promotions, password resets, and user deactivations.' },
        { title: 'Demo Quick-Switch Helper', desc: 'Instant demo credential switching to inspect the interface from different role perspectives.' },
      ]}
      sampleCsvFilename="users_directory_sample.csv"
      sampleCsvHeaders={['User_ID', 'Name', 'Email', 'Role', 'District', 'Status']}
      sampleCsvRows={[
        ['USR-01', 'Yashraj Jadhav', 'admin@mahagrid.gov.in', 'ADMIN', 'All Maharashtra', 'ACTIVE'],
        ['USR-02', 'Sunil Deshmukh', 'manager.pune@mahagrid.gov.in', 'MANAGER', 'Pune', 'ACTIVE'],
        ['USR-03', 'Pooja Kulkarni', 'engineer.mumbai@mahagrid.gov.in', 'ENGINEER', 'Mumbai Suburban', 'ACTIVE'],
        ['USR-04', 'Ramesh Patil', 'field.nashik@mahagrid.gov.in', 'FIELD_WORKER', 'Nashik', 'ACTIVE'],
        ['USR-05', 'Anjali Shinde', 'viewer@mahagrid.gov.in', 'VIEWER', 'All Maharashtra', 'ACTIVE'],
      ]}
    />
  );
}

/* ── 20. Settings ────────────────────────────────────────── */
export function SettingsPage() {
  return (
    <ModulePlaceholder
      title="System Configuration & Thresholds"
      subtitle="Engineering parameter thresholds, WebSocket endpoints, GIS default centers, API timeouts, and brand UI tokens."
      category="System"
      icon={<Settings size={22} />}
      kpis={[
        { label: 'Active Rule Thresholds', value: '24 Rules', meta: 'Voltage, Thermal, Current limits', variant: 'primary' },
        { label: 'API Base URL', value: 'Configured', meta: 'import.meta.env.VITE_API_BASE_URL', variant: 'primary' },
        { label: 'Socket Connection', value: 'Monitoring', meta: 'Auto-reconnect with polling fallback', variant: 'neutral' },
        { label: 'Design Tokens', value: 'Ivory / Forest', meta: 'No navy-blue AI theme', variant: 'primary' },
      ]}
      features={[
        { title: 'Electrical Threshold Adjustments', desc: 'Set nominal voltages (230V / 415V / 11kV / 33kV) and allowed percentage tolerance bands.' },
        { title: 'Transformer Oil Temperature Limits', desc: 'Configure Warning (75°C) and Critical Trip (85°C) thermal thresholds.' },
        { title: 'Backend Endpoint Configuration', desc: 'Customizable API and WebSocket connection targets without rebuilding the bundle.' },
        { title: 'Reduced Motion Preference Override', desc: 'Force reduced motion or follow system-level accessibility settings.' },
      ]}
    />
  );
}
