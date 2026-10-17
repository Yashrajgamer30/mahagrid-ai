/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – useGridStore Hook
   Provides reactive subscription to the central GridStore.
   Any update (adding assets, changing statuses, triggering simulated
   faults, updating work orders) immediately re-renders subscribers.
   ────────────────────────────────────────────────────────────────── */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { gridStore, type GridState } from '@/services/gridStore';
import type {
  Substation,
  Transformer,
  Incident,
  WorkOrder,
  User,
  DashboardKpis,
} from '@/types/models';
import { AssetStatus, IncidentState, Role } from '@/types/enums';

export function useGridStore(filterDistrict?: string) {
  const [state, setState] = useState<GridState>(() => gridStore.getState());

  useEffect(() => {
    const unsubscribe = gridStore.subscribe(() => {
      setState({ ...gridStore.getState() });
    });
    return unsubscribe;
  }, []);

  const isAll = !filterDistrict || filterDistrict === 'All Maharashtra';

  const matchesDistrict = useCallback(
    (item: { city?: string; district?: string }) => {
      if (isAll) return true;
      const target = filterDistrict.toLowerCase();
      return (
        item.city?.toLowerCase().includes(target) ||
        item.district?.toLowerCase().includes(target)
      );
    },
    [isAll, filterDistrict],
  );

  // Filtered collections
  const filteredSubstations = useMemo(
    () => state.substations.filter(matchesDistrict),
    [state.substations, matchesDistrict],
  );

  const filteredTransformers = useMemo(
    () => state.transformers.filter(matchesDistrict),
    [state.transformers, matchesDistrict],
  );

  const filteredFeeders = useMemo(
    () => state.feeders.filter(matchesDistrict),
    [state.feeders, matchesDistrict],
  );

  const filteredJunctions = useMemo(
    () => state.junctions.filter(matchesDistrict),
    [state.junctions, matchesDistrict],
  );

  const filteredMeters = useMemo(
    () => state.meters.filter(matchesDistrict),
    [state.meters, matchesDistrict],
  );

  const filteredIotDevices = useMemo(
    () => state.iotDevices.filter(matchesDistrict),
    [state.iotDevices, matchesDistrict],
  );

  const filteredIncidents = useMemo(
    () => state.incidents.filter(matchesDistrict),
    [state.incidents, matchesDistrict],
  );

  const filteredWorkOrders = useMemo(() => {
    return state.workOrders.filter((wo) => {
      const inc = state.incidents.find((i) => i.id === wo.incidentId);
      return inc ? matchesDistrict(inc) : true;
    });
  }, [state.workOrders, state.incidents, matchesDistrict]);

  const allAssets = useMemo(() => {
    return [
      ...filteredSubstations,
      ...filteredTransformers,
      ...filteredFeeders,
      ...filteredJunctions,
      ...filteredMeters,
      ...filteredIotDevices,
    ];
  }, [
    filteredSubstations,
    filteredTransformers,
    filteredFeeders,
    filteredJunctions,
    filteredMeters,
    filteredIotDevices,
  ]);

  const kpis: DashboardKpis = useMemo(() => {
    void state;
    return gridStore.getDashboardKpis(filterDistrict);
  }, [state, filterDistrict]);

  const unreadNotificationsCount = useMemo(
    () => state.notifications.filter((n) => !n.isRead).length,
    [state.notifications],
  );

  return {
    state,
    kpis,
    unreadNotificationsCount,
    // Filtered lists
    substations: filteredSubstations,
    transformers: filteredTransformers,
    feeders: filteredFeeders,
    junctions: filteredJunctions,
    meters: filteredMeters,
    iotDevices: filteredIotDevices,
    incidents: filteredIncidents,
    workOrders: filteredWorkOrders,
    notifications: state.notifications,
    users: state.users,
    thresholds: state.thresholds,
    simulationSession: state.simulationSession,
    allAssets,

    // Store Actions
    addSubstation: useCallback(
      (sub: Partial<Substation>) => gridStore.addSubstation(sub),
      [],
    ),
    addTransformer: useCallback(
      (trf: Partial<Transformer>) => gridStore.addTransformer(trf),
      [],
    ),
    updateAssetStatus: useCallback(
      (id: string, status: AssetStatus) => gridStore.updateAssetStatus(id, status),
      [],
    ),
    deleteAsset: useCallback((id: string) => gridStore.deleteAsset(id), []),
    createIncident: useCallback(
      (data: Partial<Incident>) => gridStore.createIncident(data),
      [],
    ),
    updateIncidentState: useCallback(
      (id: string, newState: IncidentState, note?: string) =>
        gridStore.updateIncidentState(id, newState, note),
      [],
    ),
    createWorkOrder: useCallback(
      (data: Partial<WorkOrder>) => gridStore.createWorkOrder(data),
      [],
    ),
    updateWorkOrder: useCallback(
      (id: string, updates: Partial<WorkOrder>) =>
        gridStore.updateWorkOrder(id, updates),
      [],
    ),
    addNotification: useCallback(
      (notif: Partial<Notification>) => gridStore.addNotification(notif),
      [],
    ),
    markNotificationAsRead: useCallback(
      (id: string) => gridStore.markNotificationAsRead(id),
      [],
    ),
    markAllNotificationsAsRead: useCallback(
      () => gridStore.markAllNotificationsAsRead(),
      [],
    ),
    clearAllNotifications: useCallback(
      () => gridStore.clearAllNotifications(),
      [],
    ),
    runSimulationScenario: useCallback(
      (key: string) => gridStore.runSimulationScenario(key),
      [],
    ),
    resetToBaseline: useCallback(() => gridStore.resetToBaseline(), []),
    updateUserRole: useCallback(
      (userId: string, newRole: Role) => gridStore.updateUserRole(userId, newRole),
      [],
    ),
    toggleUserActive: useCallback(
      (userId: string) => gridStore.toggleUserActive(userId),
      [],
    ),
    addUser: useCallback((user: Partial<User>) => gridStore.addUser(user), []),
    updateThreshold: useCallback(
      (id: string, val: number) => gridStore.updateThreshold(id, val),
      [],
    ),
  };
}
