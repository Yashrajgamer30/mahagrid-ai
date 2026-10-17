/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Energy Grid Infrastructure Background
   Realistic substation, transformer units, high-voltage transmission
   towers, catenary power lines, restrained teal electrical pulses,
   and glowing nodes against a warm dusk cinematic backdrop.
   ────────────────────────────────────────────────────────────────── */

import { memo } from 'react';
import styles from './EnergyGridBackground.module.css';

interface GridNodeCoord {
  id: string;
  x: number;
  y: number;
  accent: 'teal' | 'amber' | 'green';
}

const NODES: GridNodeCoord[] = [
  { id: 'kalwa-sldc', x: 200, y: 340, accent: 'teal' },
  { id: 'pune-cir', x: 380, y: 520, accent: 'teal' },
  { id: 'nashik-stn', x: 310, y: 210, accent: 'green' },
  { id: 'sambhajinagar', x: 560, y: 290, accent: 'amber' },
  { id: 'kolhapur-sub', x: 350, y: 720, accent: 'green' },
  { id: 'solapur-hub', x: 670, y: 630, accent: 'teal' },
  { id: 'amravati-400', x: 900, y: 260, accent: 'teal' },
  { id: 'nagpur-koradi', x: 1130, y: 210, accent: 'amber' },
];

export const EnergyGridBackground = memo(function EnergyGridBackground() {
  return (
    <div className={styles.backgroundContainer} aria-hidden="true">
      <div className={styles.atmosphericGlow} />

      <svg
        className={styles.svgCanvas}
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Subtle Glow & Lighting Filters */}
          <filter id="mg-glow-teal" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="mg-glow-dusk" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Infrastructure Gradients */}
          <linearGradient id="infraTowerGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2dd4bf" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#1e3a2f" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#111c16" stopOpacity="0.05" />
          </linearGradient>

          <linearGradient id="transformerMetalGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#223b30" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#14241e" stopOpacity="0.4" />
          </linearGradient>

          <radialGradient id="duskHorizonRadial" cx="60%" cy="100%" r="55%">
            <stop offset="0%" stopColor="#d97706" stopOpacity="0.22" />
            <stop offset="40%" stopColor="#9a3412" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#0d1712" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Warm Dusk Horizon Atmosphere ── */}
        <rect x="0" y="350" width="1440" height="550" fill="url(#duskHorizonRadial)" opacity="0.85" />

        {/* ── Substation Yard Background Infrastructure (Silhouettes & Schematics) ── */}
        <g className={styles.substationInfrastructure}>
          {/* Main 400kV Gantry Structure at Left Yard */}
          <g transform="translate(60, 600)" opacity="0.38">
            {/* Gantry A-Frame Lattice Tower 1 */}
            <path d="M 0 200 L 30 0 L 60 200 Z" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
            <line x1="8" y1="140" x2="52" y2="140" stroke="#2dd4bf" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="16" y1="85" x2="44" y2="85" stroke="#2dd4bf" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="23" y1="35" x2="37" y2="35" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.6" />
            {/* Internal lattice braces */}
            <line x1="0" y1="200" x2="52" y2="140" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="60" y1="200" x2="8" y2="140" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.4" />

            {/* Gantry A-Frame Lattice Tower 2 */}
            <path d="M 170 200 L 200 0 L 230 200 Z" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.7" fill="none" />
            <line x1="178" y1="140" x2="222" y2="140" stroke="#2dd4bf" strokeWidth="1.2" strokeOpacity="0.6" />
            <line x1="186" y1="85" x2="214" y2="85" stroke="#2dd4bf" strokeWidth="1.2" strokeOpacity="0.6" />
            {/* Horizontal Busbar Beams */}
            <line x1="15" y1="20" x2="215" y2="20" stroke="#2dd4bf" strokeWidth="2.5" strokeOpacity="0.8" />
            <line x1="15" y1="34" x2="215" y2="34" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.6" />
            {/* Suspended Insulator Strings with warm dusk reflection */}
            <line x1="60" y1="34" x2="60" y2="90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="115" y1="34" x2="115" y2="90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="170" y1="34" x2="170" y2="90" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 3" />
          </g>

          {/* Substation Power Transformer Unit (Left foreground yard) */}
          <g transform="translate(150, 700)" opacity="0.48">
            {/* Main Oil Tank */}
            <rect x="0" y="25" width="90" height="58" rx="4" fill="url(#transformerMetalGrad)" stroke="#2dd4bf" strokeWidth="1.5" strokeOpacity="0.5" />
            
            {/* Left Radiator Cooling Fins */}
            <line x1="-12" y1="35" x2="0" y2="35" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="-12" y1="46" x2="0" y2="46" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="-12" y1="57" x2="0" y2="57" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="-12" y1="68" x2="0" y2="68" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="-12" y1="35" x2="-12" y2="68" stroke="#2dd4bf" strokeWidth="2" strokeOpacity="0.6" />

            {/* Right Radiator Cooling Fins */}
            <line x1="90" y1="35" x2="102" y2="35" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="90" y1="46" x2="102" y2="46" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="90" y1="57" x2="102" y2="57" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="90" y1="68" x2="102" y2="68" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.5" />
            <line x1="102" y1="35" x2="102" y2="68" stroke="#2dd4bf" strokeWidth="2" strokeOpacity="0.6" />

            {/* Conservator Oil Drum on top */}
            <rect x="22" y="8" width="46" height="13" rx="4" fill="#1e382e" stroke="#2dd4bf" strokeWidth="1.4" strokeOpacity="0.6" />
            <line x1="45" y1="21" x2="45" y2="25" stroke="#2dd4bf" strokeWidth="2" strokeOpacity="0.6" />

            {/* High-Voltage Bushings (with amber glow) */}
            <path d="M 24 25 L 22 10 L 26 10 Z" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="24" cy="7" r="2.2" fill="#fbbf24" />

            <path d="M 45 25 L 43 7 L 47 7 Z" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="45" cy="4" r="2.2" fill="#fbbf24" />

            <path d="M 66 25 L 64 10 L 68 10 Z" fill="#f59e0b" fillOpacity="0.8" stroke="#d97706" strokeWidth="0.8" />
            <circle cx="66" cy="7" r="2.2" fill="#fbbf24" />
          </g>

          {/* High-Voltage Transmission Lattice Tower 1 (Silhouette against dusk sky) */}
          <g transform="translate(290, 70)" opacity="0.32">
            <path d="M 30 0 L 0 210 L 60 210 Z" stroke="#2dd4bf" strokeWidth="1.4" strokeOpacity="0.6" fill="none" />
            {/* Cross Arms */}
            <line x1="-22" y1="52" x2="82" y2="52" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.7" />
            <line x1="-32" y1="94" x2="92" y2="94" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.7" />
            <line x1="-26" y1="136" x2="86" y2="136" stroke="#2dd4bf" strokeWidth="1.8" strokeOpacity="0.7" />
            {/* Cross Bracing */}
            <line x1="6" y1="170" x2="54" y2="170" stroke="#2dd4bf" strokeWidth="1" strokeOpacity="0.4" />
            <line x1="6" y1="170" x2="48" y2="136" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.4" />
            <line x1="54" y1="170" x2="12" y2="136" stroke="#2dd4bf" strokeWidth="0.8" strokeOpacity="0.4" />
            {/* Suspended Insulators */}
            <line x1="-22" y1="52" x2="-22" y2="70" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="82" y1="52" x2="82" y2="70" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="-32" y1="94" x2="-32" y2="112" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
            <line x1="92" y1="94" x2="92" y2="112" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="2 2" />
          </g>

          {/* High-Voltage Transmission Tower 2 (Central Corridor) */}
          <g transform="translate(740, 130)" opacity="0.25">
            <path d="M 25 0 L 0 180 L 50 180 Z" stroke="#2dd4bf" strokeWidth="1.3" strokeOpacity="0.5" fill="none" />
            <line x1="-16" y1="44" x2="66" y2="44" stroke="#2dd4bf" strokeWidth="1.6" strokeOpacity="0.6" />
            <line x1="-26" y1="82" x2="76" y2="82" stroke="#2dd4bf" strokeWidth="1.6" strokeOpacity="0.6" />
            <line x1="-20" y1="120" x2="70" y2="120" stroke="#2dd4bf" strokeWidth="1.6" strokeOpacity="0.6" />
            <line x1="-16" y1="44" x2="-16" y2="60" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="2 2" />
            <line x1="66" y1="44" x2="66" y2="60" stroke="#f59e0b" strokeWidth="1.4" strokeDasharray="2 2" />
          </g>

          {/* Distribution Power-line Pole with Canister Transformer (Right side) */}
          <g transform="translate(1330, 670)" opacity="0.32">
            <line x1="20" y1="0" x2="20" y2="190" stroke="#2dd4bf" strokeWidth="2.5" strokeOpacity="0.5" />
            <line x1="-15" y1="26" x2="55" y2="26" stroke="#2dd4bf" strokeWidth="2" strokeOpacity="0.5" />
            <circle cx="-10" cy="18" r="2.5" fill="#f59e0b" />
            <circle cx="20" cy="15" r="2.5" fill="#f59e0b" />
            <circle cx="50" cy="18" r="2.5" fill="#f59e0b" />
            {/* Pole transformer canister */}
            <rect x="25" y="60" width="22" height="34" rx="2" fill="#192e25" stroke="#2dd4bf" strokeWidth="1.2" strokeOpacity="0.5" />
          </g>
        </g>

        {/* ── Subdued SCADA Geometric Coordinate Grid ── */}
        <g className={styles.gridBusbar}>
          <line x1="0" y1="120" x2="1440" y2="120" />
          <line x1="0" y1="260" x2="1440" y2="260" />
          <line x1="0" y1="400" x2="1440" y2="400" />
          <line x1="0" y1="540" x2="1440" y2="540" />
          <line x1="0" y1="680" x2="1440" y2="680" />

          <line x1="200" y1="0" x2="200" y2="900" />
          <line x1="420" y1="0" x2="420" y2="900" />
          <line x1="640" y1="0" x2="640" y2="900" />
          <line x1="860" y1="0" x2="860" y2="900" />
          <line x1="1080" y1="0" x2="1080" y2="900" />
          <line x1="1300" y1="0" x2="1300" y2="900" />
        </g>

        {/* ── High-Voltage Catenary Transmission Conductors ── */}
        <g className={styles.transmissionCorridor}>
          {/* Mumbai - Pune Corridor (400kV) */}
          <path d="M 200 340 Q 285 440 380 520" />
          {/* Mumbai - Nashik 400kV */}
          <path d="M 200 340 Q 250 260 310 210" />
          {/* Nashik - Chhatrapati Sambhajinagar */}
          <path d="M 310 210 Q 430 240 560 290" />
          {/* Pune - Kolhapur 220kV */}
          <path d="M 380 520 Q 360 620 350 720" />
          {/* Pune - Solapur 765kV Bulk Inter-tie */}
          <path d="M 380 520 Q 520 590 670 630" />
          {/* Chh. Sambhajinagar - Solapur */}
          <path d="M 560 290 Q 630 460 670 630" />
          {/* Chh. Sambhajinagar - Amravati 400kV */}
          <path d="M 560 290 Q 730 265 900 260" />
          {/* Amravati - Nagpur Koradi STPS (765kV) */}
          <path d="M 900 260 Q 1010 225 1130 210" />
          {/* Nagpur - Solapur Eastern Evacuation */}
          <path d="M 1130 210 Q 930 450 670 630" />
        </g>

        {/* ── Restrained Teal & Dusk Electrical Pulses ── */}
        <g filter="url(#mg-glow-teal)">
          {/* Mumbai -> Pune 400kV Bulk Transfer */}
          <path d="M 200 340 Q 285 440 380 520" className={styles.energyPulseTeal} />
          {/* Nagpur -> Solapur Power Evacuation */}
          <path d="M 1130 210 Q 930 450 670 630" className={styles.energyPulseTealFast} />
          {/* Nashik -> Chh. Sambhajinagar */}
          <path d="M 310 210 Q 430 240 560 290" className={styles.energyPulseSubtle} />
        </g>

        <g filter="url(#mg-glow-dusk)">
          {/* Solapur Solar Evacuation Pulse -> Pune */}
          <path d="M 670 630 Q 520 590 380 520" className={styles.energyPulseDuskAmber} />
          {/* Amravati -> Nagpur */}
          <path d="M 900 260 Q 1010 225 1130 210" className={styles.energyPulseDuskAmber} />
        </g>

        {/* ── Clean Glowing SCADA Grid Nodes (No Cluttering Labels) ── */}
        {NODES.map((node) => {
          const isAmber = node.accent === 'amber';
          const isGreen = node.accent === 'green';
          const nodeColor = isAmber ? '#f59e0b' : isGreen ? '#10b981' : '#2dd4bf';
          const haloClass = isAmber
            ? styles.nodeHaloAmber
            : isGreen
              ? styles.nodeHalo
              : styles.nodeHaloTeal;

          return (
            <g key={node.id} transform={`translate(${node.x}, ${node.y})`}>
              {/* Outer Pulsing Halo */}
              <circle
                r={16}
                fill={nodeColor}
                opacity={0.2}
                className={haloClass}
              />
              {/* Inner Substation Ring */}
              <circle
                r={8}
                fill="none"
                stroke={nodeColor}
                strokeWidth={1.5}
                strokeOpacity={0.75}
              />
              {/* Solid Node Core */}
              <circle
                r={3.8}
                fill={nodeColor}
              />
              {/* Center Bright Spark */}
              <circle
                r={1.5}
                fill="#FFFFFF"
              />
            </g>
          );
        })}

        {/* ── Ambient Floating Particles & Micro-Sparks ── */}
        <circle cx="270" cy="420" r="2" fill="#2dd4bf" className={styles.sparkParticle} />
        <circle cx="490" cy="570" r="1.8" fill="#fbbf24" className={styles.sparkParticle} style={{ animationDelay: '1.5s' }} />
        <circle cx="780" cy="290" r="2.2" fill="#2dd4bf" className={styles.sparkParticle} style={{ animationDelay: '2.8s' }} />
        <circle cx="1060" cy="310" r="1.8" fill="#f59e0b" className={styles.sparkParticle} style={{ animationDelay: '3.6s' }} />
        <circle cx="620" cy="610" r="2" fill="#10b981" className={styles.sparkParticle} style={{ animationDelay: '4.4s' }} />
        <circle cx="1200" cy="480" r="1.6" fill="#2dd4bf" className={styles.sparkParticle} style={{ animationDelay: '5.2s' }} />
      </svg>
    </div>
  );
});
