/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Socket Client
   socket.io-client wrapper with reconnection, fallback awareness,
   and query-cache integration hooks.
   ────────────────────────────────────────────────────────────────── */

import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ||
  (import.meta.env.VITE_API_BASE_URL
    ? new URL(import.meta.env.VITE_API_BASE_URL).origin
    : 'http://localhost:3001');

let socket: Socket | null = null;

export type ConnectionState = 'connected' | 'connecting' | 'disconnected' | 'error';

type ConnectionCallback = (state: ConnectionState) => void;
const connectionCallbacks = new Set<ConnectionCallback>();

let currentState: ConnectionState = 'disconnected';

function notifyState(state: ConnectionState) {
  currentState = state;
  connectionCallbacks.forEach((cb) => cb(state));
}

export function getConnectionState(): ConnectionState {
  return currentState;
}

export function onConnectionChange(cb: ConnectionCallback): () => void {
  connectionCallbacks.add(cb);
  return () => connectionCallbacks.delete(cb);
}

export function getSocket(): Socket {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 10000,
    timeout: 10000,
    withCredentials: true,
  });

  socket.on('connect', () => notifyState('connected'));
  socket.on('connecting', () => notifyState('connecting'));
  socket.on('disconnect', () => notifyState('disconnected'));
  socket.on('connect_error', () => notifyState('error'));
  socket.on('reconnect_attempt', () => notifyState('connecting'));

  return socket;
}

export function connectSocket(): void {
  const s = getSocket();
  if (!s.connected) {
    notifyState('connecting');
    s.connect();
  }
}

export function disconnectSocket(): void {
  if (socket) {
    socket.disconnect();
    socket = null;
    notifyState('disconnected');
  }
}

/** Subscribe to a socket event, returns cleanup function */
export function onSocketEvent<T = unknown>(
  event: string,
  handler: (data: T) => void,
): () => void {
  const s = getSocket();
  s.on(event, handler);
  return () => {
    s.off(event, handler);
  };
}

/* ── Standard event types for MahaGrid AI ────────────────── */
export const SOCKET_EVENTS = {
  TELEMETRY_NEW: 'telemetry:new',
  INCIDENT_CREATED: 'incident:created',
  INCIDENT_UPDATED: 'incident:updated',
  INCIDENT_RESOLVED: 'incident:resolved',
  WORKORDER_UPDATED: 'workorder:updated',
  ASSET_UPDATED: 'asset:updated',
  NOTIFICATION_NEW: 'notification:new',
  SIMULATION_TICK: 'simulation:tick',
  SIMULATION_EVENT: 'simulation:event',
  SIMULATION_STATE: 'simulation:state',
} as const;
