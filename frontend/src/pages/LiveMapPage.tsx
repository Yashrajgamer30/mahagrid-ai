/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Interactive GIS Digital Twin Map (/map)
   React Leaflet integration with OpenStreetMap tiles, Maharashtra
   regions, multi-layer asset filtering, SVG vector markers,
   simulated fault injector, popup telemetry, details drawer,
   and robust zoom control collision prevention with ResizeObserver.
   ────────────────────────────────────────────────────────────────── */

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  ZoomControl,
  useMap,
} from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Map as MapIcon,
  Filter,
  Layers,
  RotateCcw,
  Sparkles,
  AlertTriangle,
  Zap,
  Activity,
  Cpu,
  Gauge,
  Radio,
  Search,
  X,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, useToast } from '@/components/ui';
import { createAssetIcon, createIncidentIcon } from '@/components/map/MapIcons';
import { CITY_COORDINATES, MAHARASHTRA_CITIES } from '@/services/gridStore';
import {
  AssetStatus,
  Severity,
  FaultCategory,
  ASSET_STATUS_LABELS,
  ASSET_TYPE_LABELS,
} from '@/types/enums';
import type { Asset, Incident } from '@/types/models';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './LiveMapPage.module.css';

/** Helper to smoothly fly map to new coordinates */
function MapViewController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  const prevCenterRef = useRef(center);
  const prevZoomRef = useRef(zoom);

  useEffect(() => {
    if (
      prevCenterRef.current[0] !== center[0] ||
      prevCenterRef.current[1] !== center[1] ||
      prevZoomRef.current !== zoom
    ) {
      prevCenterRef.current = center;
      prevZoomRef.current = zoom;
      map.flyTo(center, zoom, { duration: 1.1 });
    }
  }, [center, zoom, map]);

  return null;
}

/** Robust Leaflet resize observer ensuring no tiles cut off when panels toggle */
function MapResizeObserverHandler({
  isDrawerOpen,
  isFilterOpen,
}: {
  isDrawerOpen: boolean;
  isFilterOpen: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    // Invalidate size immediately and after panel transition frames
    const t1 = setTimeout(() => map.invalidateSize(), 60);
    const t2 = setTimeout(() => map.invalidateSize(), 300);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isDrawerOpen, isFilterOpen, map]);

  useEffect(() => {
    const container = map.getContainer();
    if (!container) return;

    const observer = new ResizeObserver(() => {
      map.invalidateSize();
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

export function LiveMapPage() {
  const { selectedDistrict, setSelectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    substations,
    transformers,
    feeders,
    junctions,
    meters,
    iotDevices,
    incidents,
    createIncident,
  } = useGridStore(selectedDistrict);

  // Map center and active city state
  const [activeCity, setActiveCity] = useState<string>(
    selectedDistrict !== 'All Maharashtra' ? selectedDistrict : 'Pune',
  );
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    CITY_COORDINATES[selectedDistrict] || CITY_COORDINATES['Pune'],
  );
  const [mapZoom, setMapZoom] = useState<number>(selectedDistrict === 'All Maharashtra' ? 7 : 12);

  // Search & Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Layer visibility toggles
  const [layers, setLayers] = useState({
    substations: true,
    transformers: true,
    feeders: true,
    junctions: true,
    meters: true,
    devices: true,
    incidents: true,
  });

  // Sync with global district selector
  const prevDistrictRef = useRef(selectedDistrict);
  useEffect(() => {
    if (prevDistrictRef.current !== selectedDistrict && CITY_COORDINATES[selectedDistrict]) {
      prevDistrictRef.current = selectedDistrict;
      setActiveCity(selectedDistrict);
      setMapCenter(CITY_COORDINATES[selectedDistrict]);
      setMapZoom(selectedDistrict === 'All Maharashtra' ? 7 : 13);
    }
  }, [selectedDistrict]);

  const handleCitySelect = (city: string) => {
    setActiveCity(city);
    setSelectedDistrict(city);
    if (CITY_COORDINATES[city]) {
      setMapCenter(CITY_COORDINATES[city]);
      setMapZoom(city === 'All Maharashtra' ? 7 : 13);
    }
  };

  const handleResetView = () => {
    handleCitySelect('All Maharashtra');
  };

  const handleSimulateFault = () => {
    const targetCity = activeCity === 'All Maharashtra' ? 'Pune' : activeCity;
    const targetCoord = CITY_COORDINATES[targetCity] || [18.5204, 73.8567];

    const newInc = createIncident({
      title: `Simulated Line Grounding Anomaly (${targetCity})`,
      description: `Rapid impedance drop detected by feeder distance protection in ${targetCity}.`,
      severity: Severity.CRITICAL,
      faultCategory: FaultCategory.SHORT_CIRCUIT,
      city: targetCity,
      district: targetCity,
      location: {
        lat: targetCoord[0] + (Math.random() - 0.5) * 0.04,
        lng: targetCoord[1] + (Math.random() - 0.5) * 0.04,
      },
      estimatedConsumers: 1100,
      probableCause: 'Simulated high-voltage transient surge or physical conductor contact.',
      recommendedAction: 'Isolate affected feeder segment via SCADA RMU and send patrol van.',
    });

    addToast({
      type: 'warning',
      title: 'Fault Simulated on Map',
      message: `${newInc.title} created with critical incident marker.`,
    });

    setSelectedIncident(newInc);
    setSelectedAsset(null);
    setMapCenter([newInc.location!.lat, newInc.location!.lng]);
    setMapZoom(14);
  };

  // Filter matching
  const matchFilter = useCallback(
    (item: { name?: string; title?: string; id: string }) => {
      if (!searchTerm) return true;
      const term = searchTerm.toLowerCase();
      const name = item.name?.toLowerCase() || '';
      const title = item.title?.toLowerCase() || '';
      const id = item.id.toLowerCase();
      return name.includes(term) || title.includes(term) || id.includes(term);
    },
    [searchTerm],
  );

  const visibleSubstations = useMemo(
    () => (layers.substations ? substations.filter(matchFilter) : []),
    [layers.substations, substations, matchFilter],
  );

  const visibleTransformers = useMemo(
    () => (layers.transformers ? transformers.filter(matchFilter) : []),
    [layers.transformers, transformers, matchFilter],
  );

  const visibleFeeders = useMemo(
    () => (layers.feeders ? feeders.filter(matchFilter) : []),
    [layers.feeders, feeders, matchFilter],
  );

  const visibleJunctions = useMemo(
    () => (layers.junctions ? junctions.filter(matchFilter) : []),
    [layers.junctions, junctions, matchFilter],
  );

  const visibleMeters = useMemo(
    () => (layers.meters ? meters.filter(matchFilter) : []),
    [layers.meters, meters, matchFilter],
  );

  const visibleDevices = useMemo(
    () => (layers.devices ? iotDevices.filter(matchFilter) : []),
    [layers.devices, iotDevices, matchFilter],
  );

  const visibleIncidents = useMemo(
    () => (layers.incidents ? incidents.filter(matchFilter) : []),
    [layers.incidents, incidents, matchFilter],
  );

  const totalVisibleMarkers =
    visibleSubstations.length +
    visibleTransformers.length +
    visibleFeeders.length +
    visibleJunctions.length +
    visibleMeters.length +
    visibleDevices.length +
    visibleIncidents.length;

  const isDetailsOpen = Boolean(selectedAsset || selectedIncident);

  return (
    <div className={styles.container}>
      <PageHeader
        title="Maharashtra GIS Digital Twin Map"
        subtitle="Geospatial visualization of 765kV/400kV transmission corridors, 33kV distribution substations, and automated fault markers."
        category="Spatial Grid"
        icon={<MapIcon size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
              leftIcon={<Filter size={14} />}
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Close Filters' : 'Layers & Search'}
            </Button>
            <Button
              variant="critical"
              size="sm"
              leftIcon={<Sparkles size={14} />}
              onClick={handleSimulateFault}
            >
              Simulate Fault
            </Button>
          </div>
        }
      />

      <div className={styles.mapWrapper}>
        {/* Floating Top Controls (Collision-free layout) */}
        <div className={styles.topControls}>
          {/* Left: Filter Toggle Chip */}
          <div className={styles.controlsLeft}>
            <button
              type="button"
              className={`${styles.filterToggleBtn} ${showFilters ? styles.filterToggleBtnActive : ''}`}
              onClick={() => setShowFilters(!showFilters)}
              title="Toggle Layer Controls & Search"
            >
              <Filter size={14} />
              <span>Layers</span>
              <span className={styles.filterCountBadge}>{totalVisibleMarkers}</span>
            </button>
          </div>

          {/* Center: City Switcher Horizontal Scroll */}
          <div className={styles.cityBar}>
            {MAHARASHTRA_CITIES.map((city) => (
              <button
                key={city}
                className={`${styles.cityBtn} ${activeCity === city ? styles.cityBtnActive : ''}`}
                onClick={() => handleCitySelect(city)}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Right: Map Action Buttons */}
          <div className={styles.mapActionGroup}>
            <button className={styles.actionBtn} onClick={handleResetView} title="Reset Maharashtra State View">
              <RotateCcw size={13} />
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Filter Sidebar Overlay (Left, well clear of bottom-right zoom buttons) */}
        <AnimatePresence>
          {showFilters && (
            <motion.aside
              className={styles.filterSidebar}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              <div className={styles.filterHeader}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Layers size={16} color="var(--forest-green)" />
                  <h3 className={styles.filterTitle}>Layers & Search</h3>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setShowFilters(false)}
                  aria-label="Close filters panel"
                >
                  <X size={16} />
                </button>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Search Grid Assets</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    placeholder="Search asset ID or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchInput}
                  />
                  <Search
                    size={14}
                    style={{
                      position: 'absolute',
                      left: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--warm-gray-500)',
                    }}
                  />
                </div>
              </div>

              <div className={styles.filterGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className={styles.filterLabel}>Asset Layers</label>
                  <span style={{ fontSize: '11px', color: 'var(--forest-green)', fontWeight: 700 }}>
                    {totalVisibleMarkers} On Map
                  </span>
                </div>

                <div className={styles.layerCheckboxList}>
                  <label className={styles.layerItem}>
                    <div className={styles.layerLeft}>
                      <input
                        type="checkbox"
                        checked={layers.substations}
                        onChange={(e) => setLayers({ ...layers, substations: e.target.checked })}
                      />
                      <Zap size={14} color="#245746" />
                      <span>Substations ({substations.length})</span>
                    </div>
                  </label>

                  <label className={styles.layerItem}>
                    <div className={styles.layerLeft}>
                      <input
                        type="checkbox"
                        checked={layers.transformers}
                        onChange={(e) => setLayers({ ...layers, transformers: e.target.checked })}
                      />
                      <Activity size={14} color="#2E9B6F" />
                      <span>Transformers ({transformers.length})</span>
                    </div>
                  </label>

                  <label className={styles.layerItem}>
                    <div className={styles.layerLeft}>
                      <input
                        type="checkbox"
                        checked={layers.feeders}
                        onChange={(e) => setLayers({ ...layers, feeders: e.target.checked })}
                      />
                      <Layers size={14} color="#3A7A63" />
                      <span>Feeders / Lines ({feeders.length})</span>
                    </div>
                  </label>

                  <label className={styles.layerItem}>
                    <div className={styles.layerLeft}>
                      <input
                        type="checkbox"
                        checked={layers.junctions}
                        onChange={(e) => setLayers({ ...layers, junctions: e.target.checked })}
                      />
                      <Cpu size={14} color="#7A7368" />
                      <span>Junction RMUs ({junctions.length})</span>
                    </div>
                  </label>

                  <label className={styles.layerItem}>
                    <div className={styles.layerLeft}>
                      <input
                        type="checkbox"
                        checked={layers.meters}
                        onChange={(e) => setLayers({ ...layers, meters: e.target.checked })}
                      />
                      <Gauge size={14} color="#4A8FBA" />
                      <span>Smart Meters ({meters.length})</span>
                    </div>
                  </label>

                  <label className={styles.layerItem}>
                    <div className={styles.layerLeft}>
                      <input
                        type="checkbox"
                        checked={layers.devices}
                        onChange={(e) => setLayers({ ...layers, devices: e.target.checked })}
                      />
                      <Radio size={14} color="#E8AB45" />
                      <span>IoT Gateways ({iotDevices.length})</span>
                    </div>
                  </label>

                  <label className={styles.layerItem}>
                    <div className={styles.layerLeft}>
                      <input
                        type="checkbox"
                        checked={layers.incidents}
                        onChange={(e) => setLayers({ ...layers, incidents: e.target.checked })}
                      />
                      <AlertTriangle size={14} color="#D45C3D" />
                      <span style={{ fontWeight: 600, color: 'var(--burnt-orange)' }}>
                        Active Outages ({incidents.length})
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Selected Asset Details Drawer (Right side, leaving room above bottom zoom control) */}
        <AnimatePresence>
          {selectedAsset && (
            <motion.aside
              className={styles.detailsDrawer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22 }}
            >
              <div className={styles.detailsHeader}>
                <div>
                  <h3 className={styles.detailsTitle}>{selectedAsset.name}</h3>
                  <span className={styles.detailsId}>{selectedAsset.id}</span>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedAsset(null)}
                  aria-label="Close asset details"
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Badge
                  variant={
                    selectedAsset.status === AssetStatus.NORMAL
                      ? 'success'
                      : selectedAsset.status === AssetStatus.WARNING
                      ? 'warning'
                      : selectedAsset.status === AssetStatus.FAULT
                      ? 'critical'
                      : 'neutral'
                  }
                >
                  {ASSET_STATUS_LABELS[selectedAsset.status]}
                </Badge>
                <Badge variant="primary">{ASSET_TYPE_LABELS[selectedAsset.type]}</Badge>
                <Badge variant="neutral">{selectedAsset.city}</Badge>
              </div>

              <div className={styles.telemetryGrid}>
                <div className={styles.telemetryCard}>
                  <div className={styles.telemetryLabel}>Data Origin</div>
                  <div className={styles.telemetryValue} style={{ fontSize: '13px' }}>
                    {selectedAsset.isDemo ? 'SIMULATED' : 'LIVE SCADA'}
                  </div>
                </div>
                <div className={styles.telemetryCard}>
                  <div className={styles.telemetryLabel}>Jurisdiction</div>
                  <div className={styles.telemetryValue} style={{ fontSize: '13px' }}>
                    {selectedAsset.district || selectedAsset.city || 'State Grid'}
                  </div>
                </div>
              </div>

              <div className={styles.detailsActions}>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ChevronRight size={14} />}
                  onClick={() => navigate('/assets')}
                >
                  Open in Asset Ledger
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ExternalLink size={14} />}
                  onClick={() => navigate('/topology')}
                >
                  Inspect SCADA Topology
                </Button>
              </div>
            </motion.aside>
          )}

          {selectedIncident && (
            <motion.aside
              className={styles.detailsDrawer}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.22 }}
            >
              <div className={styles.detailsHeader}>
                <div>
                  <h3 className={styles.detailsTitle} style={{ color: 'var(--burnt-orange)' }}>
                    {selectedIncident.title}
                  </h3>
                  <span className={styles.detailsId}>{selectedIncident.id}</span>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelectedIncident(null)}
                  aria-label="Close incident details"
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
                <Badge variant="critical">{selectedIncident.severity} SEVERITY</Badge>
                <Badge variant="warning">{selectedIncident.state}</Badge>
                <Badge variant="neutral">{selectedIncident.city}</Badge>
              </div>

              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.45 }}>
                {selectedIncident.description}
              </p>

              <div className={styles.telemetryGrid}>
                <div className={styles.telemetryCard}>
                  <div className={styles.telemetryLabel}>Affected Asset</div>
                  <div className={styles.telemetryValue} style={{ fontSize: '12px' }}>
                    {selectedIncident.assetName}
                  </div>
                </div>
                <div className={styles.telemetryCard}>
                  <div className={styles.telemetryLabel}>Est. Consumers</div>
                  <div className={styles.telemetryValue}>
                    {selectedIncident.estimatedConsumers || 0}
                  </div>
                </div>
              </div>

              <div className={styles.detailsActions}>
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<ChevronRight size={14} />}
                  onClick={() => navigate('/fault-locator')}
                >
                  Open Fault Diagnosis
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<ExternalLink size={14} />}
                  onClick={() => navigate('/maintenance')}
                >
                  Dispatch Work Order
                </Button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Leaflet Map Area with Zoom Control configured cleanly at bottom-right */}
        <div className={styles.mapArea}>
          <MapContainer
            center={mapCenter}
            zoom={mapZoom}
            zoomControl={false}
            scrollWheelZoom={true}
            style={{ width: '100%', height: '100%' }}
          >
            {/* View controller & automatic container resize invalidator */}
            <MapViewController center={mapCenter} zoom={mapZoom} />
            <MapResizeObserverHandler isDrawerOpen={isDetailsOpen} isFilterOpen={showFilters} />

            {/* Custom bottom-right zoom control: visible, clickable, zero overlap */}
            <ZoomControl position="bottomright" />

            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Feeder Polylines */}
            {visibleFeeders.map((feeder) => {
              if (!feeder.coordinates || feeder.coordinates.length < 2) return null;
              const positions: [number, number][] = feeder.coordinates.map((c) => [c.lat, c.lng]);
              const isFault = feeder.status === AssetStatus.FAULT;
              return (
                <Polyline
                  key={feeder.id}
                  positions={positions}
                  pathOptions={{
                    color: isFault ? '#D45C3D' : '#245746',
                    weight: isFault ? 4 : 3,
                    dashArray: isFault ? '6, 6' : undefined,
                    opacity: 0.85,
                  }}
                  eventHandlers={{
                    click: () => {
                      setSelectedAsset(feeder);
                      setSelectedIncident(null);
                    },
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <strong>{feeder.name}</strong>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        Voltage: {feeder.voltageKv}kV | Status: {feeder.status}
                      </div>
                    </div>
                  </Popup>
                </Polyline>
              );
            })}

            {/* Substations */}
            {visibleSubstations.map((sub) => {
              if (!sub.location) return null;
              return (
                <Marker
                  key={sub.id}
                  position={[sub.location.lat, sub.location.lng]}
                  icon={createAssetIcon(sub.type, sub.status, selectedAsset?.id === sub.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedAsset(sub);
                      setSelectedIncident(null);
                    },
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <strong>{sub.name}</strong>
                      <div style={{ fontSize: '12px' }}>
                        Capacity: {sub.capacityKva} kVA | Level: {sub.voltageLevel}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        Status: {sub.status} ({sub.city})
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Transformers */}
            {visibleTransformers.map((trf) => {
              if (!trf.location) return null;
              return (
                <Marker
                  key={trf.id}
                  position={[trf.location.lat, trf.location.lng]}
                  icon={createAssetIcon(trf.type, trf.status, selectedAsset?.id === trf.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedAsset(trf);
                      setSelectedIncident(null);
                    },
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <strong>{trf.name}</strong>
                      <div style={{ fontSize: '12px' }}>
                        Load: {trf.loadPercent}% | Temp: {trf.temperatureC}°C
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        Status: {trf.status} | {trf.oilLevel}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Junctions */}
            {visibleJunctions.map((jnc) => {
              if (!jnc.location) return null;
              return (
                <Marker
                  key={jnc.id}
                  position={[jnc.location.lat, jnc.location.lng]}
                  icon={createAssetIcon(jnc.type, jnc.status, selectedAsset?.id === jnc.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedAsset(jnc);
                      setSelectedIncident(null);
                    },
                  }}
                />
              );
            })}

            {/* Smart Meters */}
            {visibleMeters.map((mtr) => {
              if (!mtr.location) return null;
              return (
                <Marker
                  key={mtr.id}
                  position={[mtr.location.lat, mtr.location.lng]}
                  icon={createAssetIcon(mtr.type, mtr.status, selectedAsset?.id === mtr.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedAsset(mtr);
                      setSelectedIncident(null);
                    },
                  }}
                />
              );
            })}

            {/* IoT Sensors */}
            {visibleDevices.map((dev) => {
              if (!dev.location) return null;
              return (
                <Marker
                  key={dev.id}
                  position={[dev.location.lat, dev.location.lng]}
                  icon={createAssetIcon(dev.type, dev.status, selectedAsset?.id === dev.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedAsset(dev);
                      setSelectedIncident(null);
                    },
                  }}
                />
              );
            })}

            {/* Incidents / Fault Overlay */}
            {visibleIncidents.map((inc) => {
              if (!inc.location) return null;
              return (
                <Marker
                  key={inc.id}
                  position={[inc.location.lat, inc.location.lng]}
                  icon={createIncidentIcon(inc.severity, selectedIncident?.id === inc.id)}
                  eventHandlers={{
                    click: () => {
                      setSelectedIncident(inc);
                      setSelectedAsset(null);
                    },
                  }}
                >
                  <Popup>
                    <div style={{ padding: '4px' }}>
                      <strong style={{ color: '#D45C3D' }}>{inc.title}</strong>
                      <div style={{ fontSize: '11px', marginTop: '2px' }}>
                        Severity: {inc.severity} | State: {inc.state}
                      </div>
                      <div style={{ fontSize: '11px', color: '#666' }}>
                        Asset: {inc.assetName}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Bottom-Left Map Legend */}
        <div className={styles.mapLegend}>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#2E9B6F' }} />
            <span>Normal</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#E8AB45' }} />
            <span>Warning</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#D45C3D' }} />
            <span>Tripped</span>
          </div>
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{ background: '#7A7368' }} />
            <span>Offline</span>
          </div>
          <div className={styles.legendItem}>
            <span
              style={{
                display: 'inline-block',
                width: 14,
                height: 3,
                background: '#245746',
                borderRadius: 2,
              }}
            />
            <span>Feeder Line</span>
          </div>
        </div>
      </div>
    </div>
  );
}
