/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Distribution Network Topology Explorer (/topology)
   Interactive SVG node-link hierarchy diagram displaying explicit
   parent-child relationships: Substation → Feeder → Transformer → Junction.
   ────────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Network,
  Zap,
  Activity,
  GitFork,
  Search,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  ExternalLink,
  Cpu,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge } from '@/components/ui';
import {
  AssetType,
  AssetStatus,
  ASSET_STATUS_LABELS,
  ASSET_TYPE_LABELS,
} from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';
import styles from './TopologyPage.module.css';

interface GraphNode {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  city: string;
  parentId?: string;
  meta: string;
  x: number;
  y: number;
}

export function TopologyPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { substations, feeders, transformers, junctions } = useGridStore(selectedDistrict);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('SUB-PUN-01');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Build topology nodes with computed tree layout positions
  const { nodes, edges } = useMemo(() => {
    const nodeList: GraphNode[] = [];
    const edgeList: { from: string; to: string; isFault: boolean }[] = [];

    // Layer 1: Substations (Y = 80)
    substations.slice(0, 3).forEach((sub, sIdx) => {
      const subX = 200 + sIdx * 380;
      const subY = 90;
      nodeList.push({
        id: sub.id,
        name: sub.name,
        type: AssetType.SUBSTATION,
        status: sub.status,
        city: sub.city || 'Pune',
        meta: `${sub.voltageLevel || '33kV'} • ${sub.capacityKva || 25000}kVA`,
        x: subX,
        y: subY,
      });

      // Layer 2: Feeders under this substation (Y = 240)
      const matchingFeeders = feeders.filter((f) => f.substationId === sub.id);
      matchingFeeders.forEach((fdr, fIdx) => {
        const fdrX = subX - 100 + fIdx * 200;
        const fdrY = 240;
        nodeList.push({
          id: fdr.id,
          name: fdr.name,
          type: AssetType.FEEDER,
          status: fdr.status,
          city: fdr.city || sub.city || 'Pune',
          parentId: sub.id,
          meta: `${fdr.voltageKv || 11}kV Feeder • ${fdr.lengthKm || 4}km`,
          x: fdrX,
          y: fdrY,
        });

        edgeList.push({
          from: sub.id,
          to: fdr.id,
          isFault: fdr.status === AssetStatus.FAULT,
        });

        // Layer 3: Transformers on this Feeder (Y = 400)
        const matchingTrfs = transformers.filter((t) => t.feederId === fdr.id);
        matchingTrfs.forEach((trf, tIdx) => {
          const trfX = fdrX - 60 + tIdx * 120;
          const trfY = 390;
          nodeList.push({
            id: trf.id,
            name: trf.name,
            type: AssetType.TRANSFORMER,
            status: trf.status,
            city: trf.city || sub.city || 'Pune',
            parentId: fdr.id,
            meta: `${trf.capacityKva || 500}kVA • ${trf.loadPercent || 70}% Load`,
            x: trfX,
            y: trfY,
          });

          edgeList.push({
            from: fdr.id,
            to: trf.id,
            isFault: trf.status === AssetStatus.FAULT,
          });

          // Layer 4: Junction RMU (Y = 540)
          const matchingJnc = junctions.filter((j) => j.feederId === fdr.id);
          matchingJnc.forEach((jnc, jIdx) => {
            const jncX = trfX + jIdx * 100;
            const jncY = 530;
            if (!nodeList.find((n) => n.id === jnc.id)) {
              nodeList.push({
                id: jnc.id,
                name: jnc.name,
                type: AssetType.JUNCTION,
                status: jnc.status,
                city: jnc.city || sub.city || 'Pune',
                parentId: trf.id,
                meta: `${jnc.connectedMeters || 120} Connected Meters`,
                x: jncX,
                y: jncY,
              });

              edgeList.push({
                from: trf.id,
                to: jnc.id,
                isFault: jnc.status === AssetStatus.FAULT,
              });
            }
          });
        });
      });
    });

    return { nodes: nodeList, edges: edgeList };
  }, [substations, feeders, transformers, junctions]);

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) || nodes[0],
    [nodes, selectedNodeId],
  );

  // Mouse pan handling
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeColor = (status: AssetStatus) => {
    switch (status) {
      case AssetStatus.NORMAL:
        return '#2E9B6F';
      case AssetStatus.WARNING:
        return '#E8AB45';
      case AssetStatus.FAULT:
        return '#D45C3D';
      case AssetStatus.OFFLINE:
        return '#7A7368';
      default:
        return '#245746';
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title="Network Topology Explorer"
        subtitle="Visual node-link structural diagram illustrating hierarchical parent-child circuits from 33kV substations down to consumer RMU pillars."
        category="Network & GIS"
        icon={<Network size={22} />}
        district={selectedDistrict}
        actions={
          <Badge variant="primary">{nodes.length} Connected Nodes Mapped</Badge>
        }
      />

      <div className={styles.explorerLayout}>
        {/* Main Graph Viewport */}
        <div className={styles.graphArea}>
          {/* Top toolbar */}
          <div className={styles.toolbar}>
            <div className={styles.searchBox}>
              <Search size={14} color="var(--color-text-muted)" />
              <input
                type="text"
                className={styles.searchInput}
                placeholder="Search node name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.8))}
              >
                <ZoomIn size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.5))}
              >
                <ZoomOut size={14} />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setZoomLevel(1);
                  setPanOffset({ x: 0, y: 0 });
                }}
              >
                <RotateCcw size={14} />
              </Button>
            </div>
          </div>

          {/* SVG Canvas */}
          <svg
            className={styles.svgViewport}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
          >
            <g
              transform={`translate(${panOffset.x}, ${panOffset.y}) scale(${zoomLevel})`}
            >
              {/* Edges */}
              {edges.map((edge, idx) => {
                const source = nodes.find((n) => n.id === edge.from);
                const target = nodes.find((n) => n.id === edge.to);
                if (!source || !target) return null;

                const isHighlighted =
                  selectedNodeId === source.id || selectedNodeId === target.id;

                return (
                  <g key={`edge-${idx}`}>
                    <line
                      x1={source.x}
                      y1={source.y + 24}
                      x2={target.x}
                      y2={target.y - 24}
                      stroke={
                        edge.isFault
                          ? '#D45C3D'
                          : isHighlighted
                          ? '#245746'
                          : '#C9C3B6'
                      }
                      strokeWidth={edge.isFault ? 3 : isHighlighted ? 2.5 : 1.5}
                      strokeDasharray={edge.isFault ? '5, 5' : undefined}
                    />
                  </g>
                );
              })}

              {/* Nodes */}
              {nodes.map((node) => {
                const isSelected = selectedNodeId === node.id;
                const matches =
                  !searchTerm ||
                  node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  node.id.toLowerCase().includes(searchTerm.toLowerCase());

                if (!matches) return null;

                const color = getNodeColor(node.status);

                return (
                  <g
                    key={node.id}
                    className={styles.nodeCard}
                    transform={`translate(${node.x - 90}, ${node.y - 24})`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedNodeId(node.id);
                    }}
                  >
                    {/* Node background card */}
                    <rect
                      width={180}
                      height={48}
                      rx={8}
                      fill="#FFFFFF"
                      stroke={isSelected ? '#245746' : color}
                      strokeWidth={isSelected ? 3 : 1.5}
                      filter="drop-shadow(0 2px 5px rgba(0,0,0,0.08))"
                    />

                    {/* Status color bar */}
                    <rect
                      x={0}
                      y={0}
                      width={6}
                      height={48}
                      rx={3}
                      fill={color}
                    />

                    {/* Icon */}
                    <g transform="translate(14, 15)">
                      {node.type === AssetType.SUBSTATION && (
                        <Zap size={16} color="#245746" />
                      )}
                      {node.type === AssetType.FEEDER && (
                        <GitFork size={16} color="#3A7A63" />
                      )}
                      {node.type === AssetType.TRANSFORMER && (
                        <Activity size={16} color="#2E9B6F" />
                      )}
                      {node.type === AssetType.JUNCTION && (
                        <Cpu size={16} color="#7A7368" />
                      )}
                    </g>

                    {/* Title */}
                    <text
                      x={38}
                      y={20}
                      fontSize="11"
                      fontWeight="bold"
                      fill="#282D29"
                      fontFamily="var(--font-heading)"
                    >
                      {node.id}
                    </text>

                    {/* Subtitle */}
                    <text
                      x={38}
                      y={36}
                      fontSize="9.5"
                      fill="#7A7368"
                      fontFamily="var(--font-body)"
                    >
                      {node.name.length > 20
                        ? `${node.name.slice(0, 19)}…`
                        : node.name}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        {/* Node Details Inspector Sidebar */}
        {selectedNode && (
          <aside className={styles.inspector}>
            <div className={styles.inspectorHeader}>
              <div>
                <h3 className={styles.inspectorTitle}>{selectedNode.name}</h3>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>
                  {selectedNode.id}
                </span>
              </div>
              <Badge
                variant={
                  selectedNode.status === AssetStatus.NORMAL
                    ? 'success'
                    : selectedNode.status === AssetStatus.WARNING
                    ? 'warning'
                    : selectedNode.status === AssetStatus.FAULT
                    ? 'danger'
                    : 'muted'
                }
              >
                {ASSET_STATUS_LABELS[selectedNode.status]}
              </Badge>
            </div>

            <div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Asset Type</span>
                <span className={styles.telemetryVal}>
                  {ASSET_TYPE_LABELS[selectedNode.type]}
                </span>
              </div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Jurisdiction</span>
                <span className={styles.telemetryVal}>{selectedNode.city}</span>
              </div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Capacity / Meta</span>
                <span className={styles.telemetryVal}>{selectedNode.meta}</span>
              </div>
              <div className={styles.telemetryRow}>
                <span className={styles.telemetryLabel}>Upstream Parent</span>
                <span className={styles.telemetryVal}>
                  {selectedNode.parentId || 'MahaGrid Transmission Bus'}
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              <Button
                variant="outline"
                size="sm"
                leftIcon={<ExternalLink size={14} />}
                onClick={() => navigate('/map')}
              >
                Locate on GIS Map
              </Button>
              {selectedNode.status === AssetStatus.FAULT && (
                <Button
                  variant="danger"
                  size="sm"
                  leftIcon={<AlertTriangle size={14} />}
                  onClick={() => navigate('/fault-locator')}
                >
                  Inspect Active Fault
                </Button>
              )}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
