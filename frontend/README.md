# MahaGrid AI — Frontend (Phase 1)

> **DEMO / SIMULATED DATA**: Academic digital twin prototype for electrical distribution monitoring across Maharashtra, India. This application is an educational prototype and does not issue real utility switching commands.

---

## Architecture & Technology Stack

- **Framework**: React 19 + TypeScript + Vite 8
- **Styling**: Tailwind CSS v4 (`@tailwindcss/vite`), Custom CSS Tokens (`src/styles/tokens.css`, `globals.css`)
- **Routing**: React Router DOM v6
- **State & Remote Data**: TanStack Query (React Query v5)
- **Real-time Client**: Socket.IO client (`socketClient.ts`, `useSocket.ts`)
- **Animation**: Framer Motion (with strict `prefers-reduced-motion` compliance)
- **Visuals & Icons**: Lucide React, Recharts, Leaflet / React-Leaflet
- **Forms & Validation**: React Hook Form, Zod

### Brand Design Tokens
- **Background (Ivory)**: `#F6F1E7`
- **Primary Accent (Forest Green)**: `#245746`
- **Critical / Faults (Burnt Orange)**: `#D45C3D`
- **Warning / Medium Severity (Saffron)**: `#E8AB45`
- **Typography & Dark Contrast (Charcoal)**: `#282D29`
- **Heading Font**: Space Grotesk
- **Body Font**: Inter

---

## Getting Started

### 1. Prerequisites
- **Node.js**: `v18.0.0` or higher
- **Package Manager**: `npm` (v9 or v10)

### 2. Installation
From this directory (`mahagrid-ai/frontend`):
```bash
npm install
```

### 3. Environment Configuration
The frontend uses standard Vite environment variables. Copy `.env.example` to `.env` if not already present:
```bash
# Backend API base URL
VITE_API_BASE_URL=http://localhost:3001/api/v1

# Socket.IO Gateway URL
VITE_SOCKET_URL=http://localhost:3001

# Application mode label
VITE_APP_MODE=DEMO
```

### 4. Running the Development Server
```bash
npm run dev
```
The server will start at `http://localhost:5173/`.

### 5. Type Checking & Production Build
```bash
# Type check without emitting files
npm run typecheck

# Full production bundle build (runs tsc -b && vite build)
npm run build

# Preview production build locally
npm run preview
```

---

## Navigation & Module Structure

The application shell provides responsive collapsible desktop navigation, mobile drawer support, a live Maharashtra district selector (36 districts + All Maharashtra), connection status indicator, unread alarm counter, and quick role switching.

### 20 Planned Modules
| Category | Module Route | Description |
| :--- | :--- | :--- |
| **Overview** | `/dashboard` | Executive KPI overview, demand loads, health scores |
| | `/map` | Live Leaflet GIS twin with substations and feeders |
| | `/topology` | Hierarchical electrical tree (Substation → Feeder → DTR → Meter) |
| **Operations** | `/outages` | Outage management, consumer impact counts, restoration ETAs |
| | `/fault-locator` | Line impedance fault calculation & pole distance locator |
| | `/maintenance` | 14-stage work order stepper, crew dispatch, DGA test logs |
| **Assets** | `/assets` | Complete catalogued inventory with multi-criteria filtering |
| | `/substations` | 33/11kV substations, busbar voltages, incomer breakers |
| | `/transformers` | Distribution transformers (DTRs), top-oil temperature |
| | `/feeders` | 11kV/22kV distribution lines, feeder trip telemetry |
| | `/junctions` | Feeder pillars, distribution boxes, tamper sensors |
| | `/meters` | Advanced Metering Infrastructure (AMI), 15-min intervals |
| | `/devices` | IoT edge fleet: ESP32 microcontrollers, Modbus RTUs |
| **Intelligence** | `/ai-analysis` | Advisory ML diagnostics, transformer overload forecasting |
| | `/analytics` | Technical vs commercial (AT&C) loss analytics, load curves |
| | `/reports` | MERC regulatory compliance filings, exportable CSVs |
| | `/simulation` | Synthetic sandbox: storm surges, heatwaves, stress tests |
| **System** | `/notifications` | Priority-tiered control room alarm stream |
| | `/users` | Role-based access control (Admin, Manager, Engineer, Field Worker, Viewer) |
| | `/settings` | System thresholds, nominal voltages, theme tokens |

### Special Routes
- `/login`: Officer sign-in with fast demo role switcher.
- `/403`: Role-based access control forbidden gate.
- `/404`: Catch-all missing route page.

---

## Phase 1 Status & Phase 2 Next Steps

### Completed in Phase 1:
- [x] Corrected Vite and TypeScript configurations (`@/` alias resolution, Tailwind CSS v4 Vite integration).
- [x] Application shell integrating responsive `Sidebar` and `Topbar`.
- [x] Mobile drawer navigation and desktop sidebar collapse/expand toggle.
- [x] Live district selector context (`Pune`, `Mumbai`, `Nagpur`, etc.) updating all views.
- [x] Demo Simulation Mode banners and truthful backend connection state indicators.
- [x] UI primitives and components (`Button`, `Input`, `Select`, `Badge`, `Toast`, `Table`).
- [x] 20 domain module route placeholders populated with Maharashtra smart grid KPIs, features, and sample CSV downloads.
- [x] Verified `npm run build` and `npm run typecheck` pass with 0 errors.
- [x] Verified interactive page execution via browser automation subagent.

### Phase 2 Roadmap:
1. **Backend Foundation**: Set up Express / Fastify API with Prisma ORM and PostgreSQL schema for Assets, Telemetry, Incidents, Work Orders, and Users.
2. **WebSocket Real-time Telemetry**: Implement real Socket.IO room broadcast in backend matching `socketClient.ts` event contracts.
3. **Leaflet GIS Feeder Overlay**: Connect live GPS coordinates and geoJSON feeder polylines to the `/map` module.
4. **Interactive 14-Stage Stepper**: Wire live incident acknowledge and work order progression workflows in `/outages` and `/maintenance`.
