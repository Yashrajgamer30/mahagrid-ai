/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Custom SVG Leaflet Map Icons
   Uses L.divIcon with crisp SVG vectors, zero broken asset PNGs,
   custom status colors, and optional pulsing animation for incidents.
   ────────────────────────────────────────────────────────────────── */

import L from 'leaflet';
import { AssetType, AssetStatus, Severity } from '@/types/enums';

function getStatusColor(status: AssetStatus): string {
  switch (status) {
    case AssetStatus.NORMAL:
      return '#2E9B6F';
    case AssetStatus.WARNING:
      return '#E8AB45';
    case AssetStatus.FAULT:
      return '#D45C3D';
    case AssetStatus.OFFLINE:
      return '#7A7368';
    case AssetStatus.MAINTENANCE:
      return '#4A8FBA';
    default:
      return '#245746';
  }
}

export function createAssetIcon(type: AssetType, status: AssetStatus, isSelected = false): L.DivIcon {
  const color = getStatusColor(status);
  const size = isSelected ? 38 : 30;
  const stroke = isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.9)';
  const strokeWidth = isSelected ? 3 : 2;

  let symbolSvg = '';
  switch (type) {
    case AssetType.SUBSTATION:
      // High voltage bolt
      symbolSvg = '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="#FFFFFF" transform="scale(0.85) translate(4, 2)" />';
      break;
    case AssetType.TRANSFORMER:
      // Dual coils / AC symbol
      symbolSvg = '<circle cx="10" cy="14" r="5" stroke="#FFF" stroke-width="2" fill="none"/><circle cx="18" cy="14" r="5" stroke="#FFF" stroke-width="2" fill="none"/>';
      break;
    case AssetType.FEEDER:
      // Feeder branch fork
      symbolSvg = '<circle cx="14" cy="7" r="3" fill="#FFF"/><circle cx="8" cy="20" r="3" fill="#FFF"/><circle cx="20" cy="20" r="3" fill="#FFF"/><path d="M14 10v4l-6 6M14 14l6 6" stroke="#FFF" stroke-width="2"/>';
      break;
    case AssetType.JUNCTION:
      // Junction box / CPU
      symbolSvg = '<rect x="7" y="7" width="14" height="14" rx="3" fill="#FFF"/><rect x="10" y="10" width="8" height="8" rx="1" fill="' + color + '"/>';
      break;
    case AssetType.METER:
      // Dial / gauge
      symbolSvg = '<circle cx="14" cy="14" r="7" stroke="#FFF" stroke-width="2" fill="none"/><path d="M14 14l4 -3" stroke="#FFF" stroke-width="2"/>';
      break;
    case AssetType.IOT_SENSOR:
      // Radio antenna waves
      symbolSvg = '<path d="M7 10a8 8 0 0 1 14 0M10 13a4 4 0 0 1 8 0" stroke="#FFF" stroke-width="2" fill="none"/><circle cx="14" cy="17" r="2" fill="#FFF"/>';
      break;
    default:
      symbolSvg = '<circle cx="14" cy="14" r="5" fill="#FFF"/>';
  }

  const html = `
    <div style="
      width: ${size}px;
      height: ${size}px;
      border-radius: 50%;
      background: ${color};
      border: ${strokeWidth}px solid ${stroke};
      box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: transform 0.15s ease;
      transform: ${isSelected ? 'scale(1.2)' : 'scale(1)'};
    ">
      <svg width="28" height="28" viewBox="0 0 28 28">
        ${symbolSvg}
      </svg>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-mahagrid-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}

export function createIncidentIcon(severity: Severity, isSelected = false): L.DivIcon {
  const isCritical = severity === Severity.CRITICAL;
  const color = isCritical ? '#D45C3D' : severity === Severity.HIGH ? '#E8AB45' : '#4A8FBA';
  const size = isSelected ? 42 : 34;

  const html = `
    <div style="
      position: relative;
      width: ${size}px;
      height: ${size}px;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${
        isCritical
          ? `<div style="
              position: absolute;
              inset: -6px;
              border-radius: 50%;
              background: rgba(212, 92, 61, 0.4);
              animation: marker-pulse 1.8s infinite ease-out;
            "></div>`
          : ''
      }
      <div style="
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        background: ${color};
        border: 2px solid #FFFFFF;
        box-shadow: 0 3px 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2;
        transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
      ">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
          <line x1="12" y1="9" x2="12" y2="13" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
      </div>
    </div>
  `;

  return L.divIcon({
    html,
    className: 'custom-mahagrid-incident',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  });
}
