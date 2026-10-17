/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – usePermissions hook
   Role-based permission checks. Backend enforces, frontend hides.
   ────────────────────────────────────────────────────────────────── */

import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { Role } from '@/types';

interface Permissions {
  role: Role | null;
  isAdmin: boolean;
  isManager: boolean;
  isEngineer: boolean;
  isFieldWorker: boolean;
  isViewer: boolean;
  /** Can manage users and system settings */
  canManageUsers: boolean;
  /** Can create/edit assets */
  canManageAssets: boolean;
  /** Can acknowledge incidents, create work orders */
  canManageIncidents: boolean;
  /** Can dispatch teams, arrive, inspect, repair */
  canFieldWork: boolean;
  /** Can run simulations */
  canSimulate: boolean;
  /** Can view dashboards and reports */
  canView: boolean;
  /** Can edit rule thresholds */
  canEditThresholds: boolean;
  /** Can drag markers / adjust GPS */
  canAdjustLocation: boolean;
  /** Can manage device credentials */
  canManageDevices: boolean;
  /** Can CSV import assets */
  canImportAssets: boolean;
  /** Check if user has at least one of given roles */
  hasAnyRole: (...roles: Role[]) => boolean;
}

export function usePermissions(): Permissions {
  const { user } = useAuth();
  const role = user?.role ?? null;

  return useMemo(() => {
    const isAdmin = role === Role.ADMIN;
    const isManager = role === Role.MANAGER;
    const isEngineer = role === Role.ENGINEER;
    const isFieldWorker = role === Role.FIELD_WORKER;
    const isViewer = role === Role.VIEWER;

    const hasAnyRole = (...roles: Role[]) =>
      role !== null && roles.includes(role);

    return {
      role,
      isAdmin,
      isManager,
      isEngineer,
      isFieldWorker,
      isViewer,

      canManageUsers: isAdmin,
      canManageAssets: isAdmin || isManager,
      canManageIncidents: isAdmin || isManager || isEngineer,
      canFieldWork: isAdmin || isEngineer || isFieldWorker,
      canSimulate: isAdmin || isManager || isEngineer,
      canView: true, // all roles can view
      canEditThresholds: isAdmin || isManager,
      canAdjustLocation: isAdmin,
      canManageDevices: isAdmin,
      canImportAssets: isAdmin || isManager,
      hasAnyRole,
    };
  }, [role]);
}
