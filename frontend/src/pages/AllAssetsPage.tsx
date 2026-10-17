/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – All Assets Register (/assets)
   Master grid inventory with multi-type filters, search, CSV export,
   live map navigation, and "Add Asset" modal dialog.
   ────────────────────────────────────────────────────────────────── */

import { useState, useMemo } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  CircuitBoard,
  Plus,
  Download,
  MapPin,
  Trash2,
  Edit,
} from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import {
  Button,
  Badge,
  Table,
  Th,
  Td,
  Dialog,
  useToast,
} from '@/components/ui';
import { downloadCsv } from '@/lib/csv';
import {
  AssetType,
  AssetStatus,
  ASSET_STATUS_LABELS,
  ASSET_TYPE_LABELS,
} from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function AllAssetsPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const {
    allAssets,
    addSubstation,
    addTransformer,
    updateAssetStatus,
    deleteAsset,
  } = useGridStore(selectedDistrict);

  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Add Asset modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAssetType, setNewAssetType] = useState<AssetType>(AssetType.TRANSFORMER);
  const [newAssetName, setNewAssetName] = useState('');
  const [newAssetCity, setNewAssetCity] = useState(
    selectedDistrict !== 'All Maharashtra' ? selectedDistrict : 'Pune',
  );
  const [newAssetCapacity, setNewAssetCapacity] = useState('500');

  const filteredAssets = useMemo(() => {
    return allAssets.filter((a) => {
      if (typeFilter !== 'ALL' && a.type !== typeFilter) return false;
      if (statusFilter !== 'ALL' && a.status !== statusFilter) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          a.name.toLowerCase().includes(term) ||
          a.id.toLowerCase().includes(term) ||
          (a.city && a.city.toLowerCase().includes(term))
        );
      }
      return true;
    });
  }, [allAssets, typeFilter, statusFilter, searchTerm]);

  const handleExportCsv = () => {
    const headers = [
      'Asset_ID',
      'Name',
      'Type',
      'Status',
      'City',
      'Latitude',
      'Longitude',
      'Data_Origin',
    ];
    const rows = filteredAssets.map((a) => [
      a.id,
      a.name,
      a.type,
      a.status,
      a.city || 'Maharashtra',
      a.location?.lat || '',
      a.location?.lng || '',
      'Simulated Twin',
    ]);

    downloadCsv({
      filename: `mahagrid_assets_${selectedDistrict.toLowerCase().replace(/\s+/g, '_')}.csv`,
      headers,
      rows,
      metadata: [`District: ${selectedDistrict}`, `Export Time: ${new Date().toISOString()}`],
    });

    addToast({
      type: 'success',
      title: 'Asset Inventory Exported',
      message: `${rows.length} asset records saved to CSV.`,
    });
  };

  const handleCreateAsset = () => {
    if (!newAssetName.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Please enter a valid asset name.',
      });
      return;
    }

    if (newAssetType === AssetType.SUBSTATION) {
      addSubstation({
        name: newAssetName,
        city: newAssetCity,
        district: newAssetCity,
        capacityKva: Number(newAssetCapacity) || 25000,
        voltageLevel: '33/11 kV',
      });
    } else {
      addTransformer({
        name: newAssetName,
        city: newAssetCity,
        district: newAssetCity,
        capacityKva: Number(newAssetCapacity) || 500,
        loadPercent: 65,
        temperatureC: 44,
      });
    }

    setIsAddModalOpen(false);
    setNewAssetName('');
    addToast({
      type: 'success',
      title: 'Asset Created',
      message: `${newAssetName} added to digital twin register and GIS map!`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Comprehensive Asset Register"
        subtitle="Unified electrical equipment inventory covering Maharashtra substations, transformers, feeders, junctions, and IoT monitoring gateways."
        category="Asset Management"
        icon={<CircuitBoard size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Download size={14} />}
              onClick={handleExportCsv}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              leftIcon={<Plus size={14} />}
              onClick={() => setIsAddModalOpen(true)}
            >
              Add Grid Asset
            </Button>
          </div>
        }
      />

      <div
        style={{
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-xl)',
          padding: 'var(--space-5)',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)',
        }}
      >
        {/* Filters Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
            <input
              type="text"
              placeholder="Search assets by name or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                width: '240px',
              }}
            />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: '#ffffff',
              }}
            >
              <option value="ALL">All Asset Types</option>
              <option value={AssetType.SUBSTATION}>Substations</option>
              <option value={AssetType.TRANSFORMER}>Transformers</option>
              <option value={AssetType.FEEDER}>Feeders</option>
              <option value={AssetType.JUNCTION}>Junctions</option>
              <option value={AssetType.METER}>Smart Meters</option>
              <option value={AssetType.IOT_SENSOR}>IoT Gateways</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={{
                padding: 'var(--space-2) var(--space-3)',
                fontSize: 'var(--text-xs)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
                background: '#ffffff',
              }}
            >
              <option value="ALL">All Statuses</option>
              <option value={AssetStatus.NORMAL}>Normal</option>
              <option value={AssetStatus.WARNING}>Warning</option>
              <option value={AssetStatus.FAULT}>Fault</option>
              <option value={AssetStatus.OFFLINE}>Offline</option>
            </select>
          </div>

          <Badge variant="neutral">{filteredAssets.length} Matching Records</Badge>
        </div>

        {/* Assets Table */}
        <Table>
          <thead>
            <tr>
              <Th>Asset ID</Th>
              <Th>Name / Description</Th>
              <Th>Type</Th>
              <Th>Jurisdiction</Th>
              <Th>Status</Th>
              <Th>Coordinates</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <Td colSpan={7} style={{ textAlign: 'center', padding: '32px' }}>
                  No grid assets found matching filters.
                </Td>
              </tr>
            ) : (
              filteredAssets.map((asset) => (
                <tr key={asset.id}>
                  <Td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{asset.id}</Td>
                  <Td>
                    <div style={{ fontWeight: 600 }}>{asset.name}</div>
                  </Td>
                  <Td>
                    <Badge variant="primary">{ASSET_TYPE_LABELS[asset.type] || asset.type}</Badge>
                  </Td>
                  <Td>{asset.city || 'Maharashtra'}</Td>
                  <Td>
                    <Badge
                      variant={
                        asset.status === AssetStatus.NORMAL
                          ? 'success'
                          : asset.status === AssetStatus.WARNING
                          ? 'warning'
                          : asset.status === AssetStatus.FAULT
                          ? 'danger'
                          : 'muted'
                      }
                    >
                      {ASSET_STATUS_LABELS[asset.status] || asset.status}
                    </Badge>
                  </Td>
                  <Td style={{ fontSize: '11px', fontFamily: 'monospace' }}>
                    {asset.location
                      ? `${asset.location.lat.toFixed(4)}, ${asset.location.lng.toFixed(4)}`
                      : '—'}
                  </Td>
                  <Td>
                    <div style={{ display: 'flex', gap: 'var(--space-1)' }}>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Locate on GIS Map"
                        onClick={() => navigate('/map')}
                      >
                        <MapPin size={12} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Toggle Status"
                        onClick={() =>
                          updateAssetStatus(
                            asset.id,
                            asset.status === AssetStatus.NORMAL
                              ? AssetStatus.WARNING
                              : AssetStatus.NORMAL,
                          )
                        }
                      >
                        <Edit size={12} />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        title="Delete Asset"
                        onClick={() => {
                          deleteAsset(asset.id);
                          addToast({
                            type: 'info',
                            title: 'Asset Removed',
                            message: `${asset.name} removed from state.`,
                          });
                        }}
                      >
                        <Trash2 size={12} color="var(--color-critical)" />
                      </Button>
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>

      {/* Add Asset Modal Dialog */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Grid Asset"
        confirmLabel="Save to Register"
        onConfirm={handleCreateAsset}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-2) 0' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Asset Category:
            </label>
            <select
              value={newAssetType}
              onChange={(e) => setNewAssetType(e.target.value as AssetType)}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            >
              <option value={AssetType.TRANSFORMER}>Distribution Transformer</option>
              <option value={AssetType.SUBSTATION}>33/11kV Substation</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Asset Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Aundh Road DT-18"
              value={newAssetName}
              onChange={(e) => setNewAssetName(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Jurisdiction / City:
            </label>
            <input
              type="text"
              value={newAssetCity}
              onChange={(e) => setNewAssetCity(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Rated Capacity (kVA):
            </label>
            <input
              type="number"
              value={newAssetCapacity}
              onChange={(e) => setNewAssetCapacity(e.target.value)}
              style={{
                width: '100%',
                padding: 'var(--space-2)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--color-border)',
              }}
            />
          </div>
        </div>
      </Dialog>
    </div>
  );
}
