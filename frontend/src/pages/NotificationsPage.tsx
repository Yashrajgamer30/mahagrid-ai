/* ──────────────────────────────────────────────────────────────────
   MahaGrid AI – Notifications Centre (/notifications)
   Real-time event alerts for grid faults, telemetry threshold breaches,
   maintenance squad dispatches, and gateway connectivity states.
   ────────────────────────────────────────────────────────────────── */

import { useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { Bell, CheckCheck, Trash2, ExternalLink, AlertTriangle, Activity, Radio, Info } from 'lucide-react';
import { useGridStore } from '@/hooks/useGridStore';
import { PageHeader } from '@/components/PageHeader';
import { Button, Badge, useToast } from '@/components/ui';
import { Severity } from '@/types/enums';
import type { AppLayoutContext } from '@/app/AppLayout';

export function NotificationsPage() {
  const { selectedDistrict } = useOutletContext<AppLayoutContext>();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearAllNotifications,
  } = useGridStore(selectedDistrict);

  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filtered = notifications.filter((n) => {
    if (categoryFilter !== 'ALL' && n.type !== categoryFilter) return false;
    return true;
  });

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'INCIDENT':
        return <AlertTriangle size={18} color="var(--color-critical)" />;
      case 'MAINTENANCE':
        return <Activity size={18} color="var(--forest-green)" />;
      case 'DEVICE':
        return <Radio size={18} color="var(--saffron)" />;
      default:
        return <Info size={18} color="var(--color-info)" />;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
      <PageHeader
        title="Grid Event Notifications Centre"
        subtitle="Chronological feed of protective relay trips, telemetry alarms, field dispatch updates, and system pings."
        category="System"
        icon={<Bell size={22} />}
        district={selectedDistrict}
        actions={
          <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<CheckCheck size={14} />}
              onClick={() => {
                markAllNotificationsAsRead();
                addToast({
                  type: 'success',
                  title: 'Notifications Cleared',
                  message: 'All notifications marked as read.',
                });
              }}
            >
              Mark All Read
            </Button>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<Trash2 size={14} />}
              onClick={() => {
                clearAllNotifications();
                addToast({
                  type: 'info',
                  title: 'Feed Cleared',
                  message: 'Cleared all notification records.',
                });
              }}
            >
              Clear Feed
            </Button>
          </div>
        }
      />

      {/* Filter Tabs */}
      <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: 'var(--space-4)', border: '1px solid var(--color-border)', display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' }}>
        {[
          { id: 'ALL', label: `All Alerts (${notifications.length})` },
          { id: 'INCIDENT', label: 'Faults & Alarms' },
          { id: 'MAINTENANCE', label: 'Work Orders' },
          { id: 'DEVICE', label: 'IoT Gateways' },
          { id: 'SYSTEM', label: 'System Pings' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategoryFilter(tab.id)}
            style={{
              border: 'none',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              background: categoryFilter === tab.id ? 'var(--forest-green)' : 'var(--warm-gray-100)',
              color: categoryFilter === tab.id ? '#ffffff' : 'var(--color-text)',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
        {filtered.length === 0 ? (
          <div style={{ background: '#ffffff', borderRadius: 'var(--radius-xl)', padding: '48px', textAlign: 'center', color: 'var(--color-text-muted)', border: '1px solid var(--color-border)' }}>
            No notifications in this category.
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              style={{
                background: notif.isRead ? '#ffffff' : 'var(--color-surface-alt)',
                border: `1px solid ${notif.isRead ? 'var(--color-border)' : 'var(--forest-green)'}`,
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-4) var(--space-5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-4)',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
                <div style={{ marginTop: '2px' }}>{getNotificationIcon(notif.type)}</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-sm)', margin: 0, fontWeight: 700 }}>
                      {notif.title}
                    </h4>
                    <Badge variant={notif.severity === Severity.CRITICAL ? 'danger' : 'neutral'}>
                      {notif.type}
                    </Badge>
                    {!notif.isRead && (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--burnt-orange)' }} />
                    )}
                  </div>
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', margin: 0 }}>
                    {notif.message}
                  </p>
                  <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                    {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                {!notif.isRead && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markNotificationAsRead(notif.id)}
                  >
                    Mark Read
                  </Button>
                )}
                {notif.link && (
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={<ExternalLink size={12} />}
                    onClick={() => {
                      markNotificationAsRead(notif.id);
                      if (notif.link) {
                        navigate(notif.link);
                      }
                    }}
                  >
                    Inspect
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
