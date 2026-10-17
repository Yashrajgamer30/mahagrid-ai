/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – useSocket hook
   Connects on auth, subscribes to events, patches query caches,
   falls back to polling when socket is down.
   ────────────────────────────────────────────────────────────────── */

import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  connectSocket,
  disconnectSocket,
  onSocketEvent,
  onConnectionChange,
  getConnectionState,
  SOCKET_EVENTS,
  type ConnectionState,
} from '@/services/socketClient';
import { useAuth } from './useAuth';

export function useSocket() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    getConnectionState,
  );
  const cleanupRef = useRef<(() => void)[]>([]);

  const cleanup = useCallback(() => {
    cleanupRef.current.forEach((fn) => fn());
    cleanupRef.current = [];
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      disconnectSocket();
      return;
    }

    connectSocket();

    const unsubs: (() => void)[] = [];

    // Connection state tracking
    unsubs.push(onConnectionChange(setConnectionState));

    // Telemetry → invalidate asset/telemetry queries
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.TELEMETRY_NEW, () => {
        queryClient.invalidateQueries({ queryKey: ['telemetry'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }),
    );

    // Incidents
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.INCIDENT_CREATED, () => {
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['outages'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }),
    );
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.INCIDENT_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
        queryClient.invalidateQueries({ queryKey: ['workorders'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['map'] });
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }),
    );
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.INCIDENT_RESOLVED, () => {
        queryClient.invalidateQueries({ queryKey: ['incidents'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['outages'] });
      }),
    );

    // Work orders
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.WORKORDER_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ['workorders'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }),
    );

    // Assets
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.ASSET_UPDATED, () => {
        queryClient.invalidateQueries({ queryKey: ['assets'] });
        queryClient.invalidateQueries({ queryKey: ['map'] });
        queryClient.invalidateQueries({ queryKey: ['topology'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      }),
    );

    // Notifications
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.NOTIFICATION_NEW, () => {
        queryClient.invalidateQueries({ queryKey: ['notifications'] });
      }),
    );

    // Simulation
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.SIMULATION_TICK, () => {
        queryClient.invalidateQueries({ queryKey: ['simulation'] });
      }),
    );
    unsubs.push(
      onSocketEvent(SOCKET_EVENTS.SIMULATION_STATE, () => {
        queryClient.invalidateQueries({ queryKey: ['simulation'] });
      }),
    );

    cleanupRef.current = unsubs;

    return () => {
      cleanup();
      disconnectSocket();
    };
  }, [isAuthenticated, queryClient, cleanup]);

  return { connectionState };
}
