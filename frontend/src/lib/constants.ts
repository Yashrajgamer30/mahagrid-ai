/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Constants
   ────────────────────────────────────────────────────────────────── */

/** Maharashtra districts (for geography filter) */
export const MAHARASHTRA_DISTRICTS = [
  'All Maharashtra',
  'Mumbai City',
  'Mumbai Suburban',
  'Pune',
  'Nagpur',
  'Nashik',
  'Aurangabad',
  'Thane',
  'Solapur',
  'Kolhapur',
  'Amravati',
  'Nanded',
  'Sangli',
  'Jalgaon',
  'Akola',
  'Latur',
  'Dhule',
  'Ahmednagar',
  'Chandrapur',
  'Parbhani',
  'Jalna',
  'Satara',
  'Raigad',
  'Ratnagiri',
  'Sindhudurg',
  'Wardha',
  'Bhandara',
  'Gondia',
  'Gadchiroli',
  'Washim',
  'Hingoli',
  'Yavatmal',
  'Buldhana',
  'Osmanabad',
  'Beed',
  'Nandurbar',
  'Palghar',
] as const;

/** Default map center (Maharashtra) */
export const DEFAULT_MAP_CENTER: [number, number] = [19.7515, 75.7139];
export const DEFAULT_MAP_ZOOM = 7;

/** Time range presets for chart filters */
export const TIME_RANGES = [
  { label: '1h', value: '1h', hours: 1 },
  { label: '6h', value: '6h', hours: 6 },
  { label: '24h', value: '24h', hours: 24 },
  { label: '7d', value: '7d', hours: 168 },
  { label: 'Custom', value: 'custom', hours: 0 },
] as const;

/** Simulation speed options */
export const SIMULATION_SPEEDS = [
  { label: '0.5×', value: 0.5 },
  { label: '1×', value: 1 },
  { label: '2×', value: 2 },
  { label: '5×', value: 5 },
  { label: '10×', value: 10 },
] as const;

/** Page size options */
export const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const;

/** App metadata */
export const APP_NAME = 'MahaGrid AI';
export const APP_DESCRIPTION = 'Smart-Grid Digital Twin & Fault Management Platform';
export const DEMO_LABEL = 'DEMO / SIMULATED DATA';
export const SAFETY_DISCLAIMER =
  'This is a low-voltage educational prototype. Never connect to mains or high-voltage equipment. AI/rules never issue real switching or protection commands.';
export const ESTIMATED_CONSUMERS_LABEL = 'Estimated (seeded model)';
