/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – User & Role Administration (/users)
   Role-based access control (RBAC), operator directory,
   permission matrix explanation, and active status toggles.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Users, UserPlus } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, Table, Th, Td, Dialog, useToast } from '@/components/ui';
import { Role, ROLE_LABELS } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function UserManagementPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const { addToast } = useToast();
  const { users, updateUserRole, toggleUserActive, addUser } = useGridStore(selectedDistrict);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Add User Dialog
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<Role>(Role.ENGINEER);

  const filtered = users.filter((u) => {
    if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term);
  });

  const handleCreateUser = () => {
    if (!newUserName.trim() || !newUserEmail.trim()) {
      addToast({
        type: 'error',
        title: 'Validation Error',
        message: 'Name and email are required.',
      });
      return;
    }

    addUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
    });

    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
    addToast({
      type: 'success',
      title: 'User Registered',
      message: `${newUserName} added to operator directory.`,
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="User & Access Role Administration"
        subtitle="Role-Based Access Control (RBAC) governing SCADA switching clearance, dispatch management, and audit inspection privileges."
        category="System"
        icon={<Users size={22} />}
        district={selectedDistrict}
        actions={
          <Button
            variant="primary"
            size="sm"
            leftIcon={<UserPlus size={14} />}
            onClick={() => setIsAddUserOpen(true)}
          >
            Add Grid Operator
          </Button>
        }
      />

      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 'var(--space-4)', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <input
              type="text"
              placeholder="Search user name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', width: '240px' }}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '13px', borderRadius: '6px', border: '1px solid var(--color-border)', background: '#ffffff' }}
            >
              <option value="ALL">All Roles</option>
              <option value={Role.ADMIN}>Administrator</option>
              <option value={Role.MANAGER}>Manager</option>
              <option value={Role.ENGINEER}>Engineer</option>
              <option value={Role.FIELD_WORKER}>Field Worker</option>
              <option value={Role.VIEWER}>Viewer</option>
            </select>
          </div>
          <Badge variant="primary">{filtered.length} Active Accounts</Badge>
        </div>

        <Table>
          <thead>
            <tr>
              <Th>Officer Name</Th>
              <Th>Email Address</Th>
              <Th>Assigned Role</Th>
              <Th>Account Status</Th>
              <Th>Change Role</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id}>
                <Td>
                  <strong>{user.name}</strong>
                </Td>
                <Td style={{ fontFamily: 'monospace' }}>{user.email}</Td>
                <Td>
                  <Badge variant="primary">{ROLE_LABELS[user.role]}</Badge>
                </Td>
                <Td>
                  <Badge variant={user.isActive ? 'success' : 'muted'}>
                    {user.isActive ? 'Active' : 'Suspended'}
                  </Badge>
                </Td>
                <Td>
                  <select
                    value={user.role}
                    onChange={(e) => {
                      updateUserRole(user.id, e.target.value as Role);
                      addToast({
                        type: 'info',
                        title: 'Role Changed',
                        message: `${user.name} reassigned to ${e.target.value}.`,
                      });
                    }}
                    style={{ padding: '4px 8px', fontSize: '12px', borderRadius: '6px', border: '1px solid var(--color-border)', background: '#ffffff' }}
                  >
                    <option value={Role.ADMIN}>Admin</option>
                    <option value={Role.MANAGER}>Manager</option>
                    <option value={Role.ENGINEER}>Engineer</option>
                    <option value={Role.FIELD_WORKER}>Field Worker</option>
                    <option value={Role.VIEWER}>Viewer</option>
                  </select>
                </Td>
                <Td>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      toggleUserActive(user.id);
                      addToast({
                        type: 'info',
                        title: 'Status Toggled',
                        message: `${user.name} account status updated.`,
                      });
                    }}
                  >
                    {user.isActive ? 'Suspend' : 'Activate'}
                  </Button>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      {/* Role Permission Matrix Card */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-5)', border: '1px solid var(--color-border)' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-md)', margin: '0 0 var(--space-3) 0' }}>
          Role Permission Matrix Overview
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 'var(--space-3)', fontSize: 'var(--text-xs)' }}>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)' }}>
            <strong>Administrator</strong>
            <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
              Full system control, threshold tuning, user provisioning, and audit sign-off.
            </div>
          </div>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)' }}>
            <strong>Manager / Operator</strong>
            <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
              Control room overview, work order assignment, dispatch approval, and outage ack.
            </div>
          </div>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)' }}>
            <strong>Maintenance Engineer</strong>
            <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
              Root cause diagnostic analysis, substation telemetry logging, test verification.
            </div>
          </div>
          <div style={{ padding: 'var(--space-3)', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius-lg)' }}>
            <strong>Field Worker</strong>
            <div style={{ color: 'var(--color-text-muted)', marginTop: 4 }}>
              Mobile checklist execution, arrival verification, repair notes, and photo uploads.
            </div>
          </div>
        </div>
      </div>

      {/* Add User Dialog */}
      <Dialog
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Add New Grid Operator Account"
        confirmLabel="Register Operator"
        onConfirm={handleCreateUser}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', padding: 'var(--space-2) 0' }}>
          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Full Name:
            </label>
            <input
              type="text"
              placeholder="e.g. Ramesh Joshi"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Official Email:
            </label>
            <input
              type="email"
              placeholder="e.g. ramesh.joshi@mahagrid.gov.in"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            />
          </div>

          <div>
            <label style={{ fontSize: 'var(--text-xs)', fontWeight: 600, display: 'block', marginBottom: 4 }}>
              Assigned Role:
            </label>
            <select
              value={newUserRole}
              onChange={(e) => setNewUserRole(e.target.value as Role)}
              style={{ width: '100%', padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}
            >
              <option value={Role.ADMIN}>Administrator</option>
              <option value={Role.MANAGER}>Manager</option>
              <option value={Role.ENGINEER}>Engineer</option>
              <option value={Role.FIELD_WORKER}>Field Worker</option>
              <option value={Role.VIEWER}>Viewer</option>
            </select>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
