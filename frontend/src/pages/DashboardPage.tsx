/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Executive Maharashtra Grid Operations Dashboard
   Live Recharts visualizations, interactive KPI cards with animated
   count-up, recent incidents stream, active work orders, and health distribution.
   ────────────────────────────────────────────────────────────────── */

import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import {
  LayoutDashboard,
  Zap,
  Activity,
  GitFork,
  Radio,
  AlertTriangle,
  CheckCircle2,
  Map,
  ArrowUpRight,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, useToast } from '@/components/ui';
import { TIME_RANGES } from '@/lib/constants';
import { Severity, IncidentState } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './DashboardPage.module.css';

const CHART_COLORS = {
  forestGreen: '#245746',
  burntOrange: '#D45C3D',
  saffron: '#E8AB45',
  warmGray: '#7A7368',
  lightGreen: '#D3E8DF',
  okGreen: '#2E9B6F',
  infoBlue: '#4A8FBA',
};

// Synthetic load profile points over time
const DEMO_HOURLY_LOAD = [
  { time: '00:00', loadMw: 14200, solarMw: 0, baseline: 13800 },
  { time: '03:00', loadMw: 13100, solarMw: 0, baseline: 12900 },
  { time: '06:00', loadMw: 15400, solarMw: 450, baseline: 14800 },
  { time: '09:00', loadMw: 19800, solarMw: 3200, baseline: 18500 },
  { time: '12:00', loadMw: 21400, solarMw: 5400, baseline: 20200 },
  { time: '15:00', loadMw: 20900, solarMw: 4100, baseline: 19900 },
  { time: '18:00', loadMw: 22800, solarMw: 300, baseline: 21500 },
  { time: '21:00', loadMw: 18900, solarMw: 0, baseline: 18200 },
];

const REGIONAL_CONSUMPTION = [
  { city: 'Mumbai', consumptionGwh: 84.5 },
  { city: 'Pune', consumptionGwh: 68.2 },
  { city: 'Nagpur', consumptionGwh: 42.1 },
  { city: 'Nashik', consumptionGwh: 36.8 },
  { city: 'Chh. Sambhajinagar', consumptionGwh: 31.4 },
  { city: 'Kolhapur', consumptionGwh: 24.6 },
  { city: 'Solapur', consumptionGwh: 22.0 },
  { city: 'Amravati', consumptionGwh: 18.2 },
];

/** Smooth numerical count-up micro-animation */
function AnimatedCounter({ targetValue }: { targetValue: number }) {
  const prefersReduced = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(() => targetValue);

  useEffect(() => {
    if (prefersReduced) {
      return;
    }

    let start = 0;
    const duration = 400;
    const stepTime = 25;
    const steps = duration / stepTime;
    const increment = (targetValue - start) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(targetValue);
        clearInterval(timer);
      } else {
        start += increment;
        setDisplayValue(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [targetValue, prefersReduced]);

  return <span>{displayValue}</span>;
}

export function DashboardPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const prefersReduced = useReducedMotion();
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const {
    kpis,
    substations,
    transformers,
    feeders,
    iotDevices,
    incidents,
    workOrders,
    updateIncidentState,
  } = useGridStore(selectedDistrict);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast({
        type: 'info',
        title: 'Telemetry Refreshed',
        message: 'Metrics synchronized from Maharashtra digital twin nodes.',
      });
    }, 500);
  };

  // Health distribution data for Pie Chart
  const healthData = [
    { name: 'Normal', value: kpis.assetsByStatus.NORMAL || 18, color: CHART_COLORS.okGreen },
    { name: 'Warning', value: kpis.assetsByStatus.WARNING || 3, color: CHART_COLORS.saffron },
    { name: 'Fault', value: kpis.assetsByStatus.FAULT || 2, color: CHART_COLORS.burntOrange },
    { name: 'Offline', value: kpis.assetsByStatus.OFFLINE || 2, color: CHART_COLORS.warmGray },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: prefersReduced ? 0 : 0.35,
        staggerChildren: prefersReduced ? 0 : 0.06,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: prefersReduced ? 0 : 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: prefersReduced ? 0 : 0.3 },
    },
  };

  return (
    <motion.div
      className={styles.container}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <PageHeader
        title="Maharashtra Grid Operations Centre"
        subtitle="Holistic digital twin telemetry, dynamic state estimation, and automated dispatch control for Maharashtra State Electricity Distribution."
        category="Overview"
        icon={<LayoutDashboard size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)', alignItems: 'center' }}>
            <div style={{ display: 'flex', background: 'var(--warm-gray-100)', borderRadius: 'var(--radius-lg)', padding: '2px' }}>
              {TIME_RANGES.filter(t => t.value !== 'custom').map((tr) => (
                <button
                  key={tr.value}
                  onClick={() => setSelectedTimeRange(tr.value)}
                  style={{
                    border: 'none',
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    background: selectedTimeRange === tr.value ? '#ffffff' : 'transparent',
                    color: selectedTimeRange === tr.value ? 'var(--forest-green)' : 'var(--color-text-muted)',
                    boxShadow: selectedTimeRange === tr.value ? 'var(--shadow-xs)' : 'none',
                  }}
                >
                  {tr.label}
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw size={14} className={isRefreshing ? 'spin-icon' : ''} />}
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </div>
        }
      />

      {/* KPI Cards Grid with Staggered Entrance & Count-up */}
      <motion.section
        className={styles.kpiGrid}
        variants={itemVariants}
        aria-label="Grid Operational KPIs"
      >
        {/* Network Health */}
        <div className={styles.kpiCard} onClick={() => navigate('/analytics')}>
          <div className={styles.kpiHeader}>
            <span>Network Health Index</span>
            <ShieldCheck size={16} color="var(--ok-green)" />
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>
              <AnimatedCounter targetValue={Math.round(kpis.networkHealth)} />
            </span>
            <span className={styles.kpiUnit}>%</span>
          </div>
          <div className={styles.kpiMeta}>
            <CheckCircle2 size={12} color="var(--ok-green)" />
            <span>Nominal operational compliance</span>
          </div>
        </div>

        {/* Total Substations */}
        <div className={styles.kpiCard} onClick={() => navigate('/substations')}>
          <div className={styles.kpiHeader}>
            <span>Substations (33/11kV)</span>
            <Zap size={16} color="var(--forest-green)" />
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>
              <AnimatedCounter targetValue={substations.length} />
            </span>
            <span className={styles.kpiUnit}>Units</span>
          </div>
          <div className={styles.kpiMeta}>
            <span>Distribution & transmission yards</span>
          </div>
        </div>

        {/* Monitored Transformers */}
        <div className={styles.kpiCard} onClick={() => navigate('/transformers')}>
          <div className={styles.kpiHeader}>
            <span>Distribution Transformers</span>
            <Activity size={16} color="var(--color-info)" />
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>
              <AnimatedCounter targetValue={transformers.length} />
            </span>
            <span className={styles.kpiUnit}>DTs</span>
          </div>
          <div className={styles.kpiMeta}>
            <span>Continuous thermal & DGA telemetry</span>
          </div>
        </div>

        {/* Active Feeders */}
        <div className={styles.kpiCard} onClick={() => navigate('/feeders')}>
          <div className={styles.kpiHeader}>
            <span>11kV/22kV Feeders</span>
            <GitFork size={16} color="var(--forest-green)" />
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>
              <AnimatedCounter targetValue={feeders.length} />
            </span>
            <span className={styles.kpiUnit}>Circuits</span>
          </div>
          <div className={styles.kpiMeta}>
            <span>Ring main & radial feeders</span>
          </div>
        </div>

        {/* Online IoT Devices */}
        <div className={styles.kpiCard} onClick={() => navigate('/devices')}>
          <div className={styles.kpiHeader}>
            <span>Online IoT Gateways</span>
            <Radio size={16} color="var(--ok-green)" />
          </div>
          <div className={styles.kpiValueRow}>
            <span className={styles.kpiValue}>
              <AnimatedCounter targetValue={kpis.onlineDevices} />
            </span>
            <span className={styles.kpiUnit}>/ {iotDevices.length}</span>
          </div>
          <div className={styles.kpiMeta}>
            <span>ESP32 & Modbus RTU telemetry</span>
          </div>
        </div>

        {/* Active Incidents */}
        <div className={styles.kpiCard} onClick={() => navigate('/outages')}>
          <div className={styles.kpiHeader}>
            <span>Active Outages</span>
            <AlertTriangle
              size={16}
              color={kpis.activeIncidents > 0 ? 'var(--burnt-orange)' : 'var(--ok-green)'}
            />
          </div>
          <div className={styles.kpiValueRow}>
            <span
              className={styles.kpiValue}
              style={{
                color: kpis.activeIncidents > 0 ? 'var(--burnt-orange)' : 'var(--color-text)',
              }}
            >
              <AnimatedCounter targetValue={kpis.activeIncidents} />
            </span>
            <span className={styles.kpiUnit}>Active</span>
          </div>
          <div className={styles.kpiMeta}>
            <span>{kpis.incidentsBySeverity.CRITICAL} critical priority</span>
          </div>
        </div>
      </motion.section>

      {/* Charts Grid */}
      <motion.div className={styles.chartGrid} variants={itemVariants}>
        {/* Real-time Load Demand Curve */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h2 className={styles.chartTitle}>Maharashtra Aggregate Grid Demand</h2>
              <span className={styles.chartSubtitle}>
                State-wide active load (MW) vs solar generation profile ({selectedTimeRange})
              </span>
            </div>
            <Badge variant="primary">Peak: 22,800 MW</Badge>
          </div>
          <div className={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DEMO_HOURLY_LOAD} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <defs>
                  <linearGradient id="loadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.forestGreen} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={CHART_COLORS.forestGreen} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="solarGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={CHART_COLORS.saffron} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={CHART_COLORS.saffron} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--warm-gray-200)" />
                <XAxis dataKey="time" stroke="var(--warm-gray-500)" fontSize={11} />
                <YAxis stroke="var(--warm-gray-500)" fontSize={11} unit=" MW" />
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-md)',
                    fontSize: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="loadMw"
                  name="Grid Load (MW)"
                  stroke={CHART_COLORS.forestGreen}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#loadGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="solarMw"
                  name="Solar Infeed (MW)"
                  stroke={CHART_COLORS.saffron}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#solarGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Asset Health Distribution */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h2 className={styles.chartTitle}>Asset Health Index</h2>
              <span className={styles.chartSubtitle}>Operational status across monitored grid assets</span>
            </div>
          </div>
          <div className={styles.chartWrapper} style={{ height: '220px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={healthData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {healthData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#ffffff',
                    border: '1px solid var(--color-border)',
                    borderRadius: 'var(--radius-lg)',
                    fontSize: '12px',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
            {healthData.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: h.color }} />
                <span>{h.name}: <strong>{h.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Regional Consumption Comparison */}
      <motion.div className={styles.chartCard} variants={itemVariants}>
        <div className={styles.chartHeader}>
          <div>
            <h2 className={styles.chartTitle}>Regional Consumption Summary</h2>
            <span className={styles.chartSubtitle}>
              Daily power distributed by major Maharashtra distribution zones (GWh)
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/analytics')}>
            Detailed Analytics <ArrowUpRight size={14} />
          </Button>
        </div>
        <div className={styles.chartWrapper} style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={REGIONAL_CONSUMPTION} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--warm-gray-200)" />
              <XAxis dataKey="city" stroke="var(--warm-gray-500)" fontSize={11} />
              <YAxis stroke="var(--warm-gray-500)" fontSize={11} unit=" GWh" />
              <Tooltip
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  fontSize: '12px',
                }}
              />
              <Bar dataKey="consumptionGwh" name="Energy (GWh)" fill={CHART_COLORS.forestGreen} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Active Incidents & Work Orders Grid */}
      <motion.div className={styles.opsGrid} variants={itemVariants}>
        {/* Recent Incidents Table */}
        <div className={styles.tableCard}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleGroup}>
              <AlertTriangle size={18} color="var(--burnt-orange)" />
              <h2 className={styles.chartTitle}>Active Grid Incidents</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/outages')}>
              View All ({incidents.length})
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className={styles.miniTable}>
              <thead>
                <tr>
                  <th>Incident / Title</th>
                  <th>District</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {incidents.slice(0, 4).map((inc) => (
                  <tr
                    key={inc.id}
                    className={styles.clickableRow}
                    onClick={() => navigate('/outages')}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{inc.title}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>{inc.assetName}</div>
                    </td>
                    <td>{inc.city}</td>
                    <td>
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
                    </td>
                    <td>
                      <Badge variant="neutral">{inc.state}</Badge>
                    </td>
                    <td>
                      {inc.state === IncidentState.DETECTED && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateIncidentState(inc.id, IncidentState.ACKNOWLEDGED);
                            addToast({
                              type: 'success',
                              title: 'Incident Acknowledged',
                              message: `Incident ${inc.id} marked as acknowledged.`,
                            });
                          }}
                        >
                          Ack
                        </Button>
                      )}
                      {inc.state !== IncidentState.DETECTED && (
                        <ArrowUpRight size={14} color="var(--color-text-muted)" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active Work Orders */}
        <div className={styles.tableCard}>
          <div className={styles.cardHeaderRow}>
            <div className={styles.cardTitleGroup}>
              <Activity size={18} color="var(--forest-green)" />
              <h2 className={styles.chartTitle}>Dispatched Work Orders</h2>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/maintenance')}>
              Manage ({workOrders.length})
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className={styles.miniTable}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Assigned Squad</th>
                  <th>Vehicle</th>
                  <th>Stage</th>
                </tr>
              </thead>
              <tbody>
                {workOrders.slice(0, 4).map((wo) => (
                  <tr
                    key={wo.id}
                    className={styles.clickableRow}
                    onClick={() => navigate('/maintenance')}
                  >
                    <td>
                      <div style={{ fontWeight: 600 }}>{wo.id}</div>
                      <div style={{ color: 'var(--color-text-muted)' }}>{wo.incidentTitle}</div>
                    </td>
                    <td>{wo.assignedTeam || 'Unassigned'}</td>
                    <td>{wo.demoVehicle || 'Van #1'}</td>
                    <td>
                      <Badge
                        variant={
                          wo.state === IncidentState.REPAIR_IN_PROGRESS
                            ? 'warning'
                            : wo.state === IncidentState.POWER_RESTORED
                            ? 'success'
                            : 'primary'
                        }
                      >
                        {wo.state}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>

      {/* Mini GIS Map Quick Link Banner */}
      <motion.div className={styles.mapBanner} variants={itemVariants}>
        <div className={styles.bannerText}>
          <h2 className={styles.bannerTitle}>Explore Maharashtra GIS Digital Twin</h2>
          <p className={styles.bannerDesc}>
            View geographical distribution lines, zoom into 33kV substations across Mumbai, Pune, Nagpur, Nashik, and monitor real-time fault telemetry coordinates.
          </p>
        </div>
        <Button
          variant="secondary"
          size="lg"
          leftIcon={<Map size={18} />}
          onClick={() => navigate('/map')}
        >
          Open GIS Control Map
        </Button>
      </motion.div>
    </motion.div>
  );
}
