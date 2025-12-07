import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import MetricsBanner from '@/components/layout/MetricsBanner';
import AdminDashboard from '@/components/admin/AdminDashboard';
import { mockAdminSections, mockSystemMetrics, mockAuditLogs } from '@/lib/mock-admin';
import styles from './page.module.css';

export default function AdminPage() {
  const totalSections = mockAdminSections.length;
  const activeSections = mockAdminSections.filter(s => s.status === 'active').length;
  const maintenanceSections = mockAdminSections.filter(s => s.status === 'maintenance').length;
  const betaSections = mockAdminSections.filter(s => s.status === 'beta').length;
  
  const userManagement = mockAdminSections.find(s => s.id === 'user-management');
  const totalUsers = userManagement?.stats?.find(s => s.label === 'Total Users')?.value || 0;
  const activeUsers = userManagement?.stats?.find(s => s.label === 'Active')?.value || 0;
  
  const auditLogs = mockAdminSections.find(s => s.id === 'audit-logs');
  const todayLogs = auditLogs?.stats?.find(s => s.label === 'Today')?.value || 0;
  const weekLogs = auditLogs?.stats?.find(s => s.label === 'This Week')?.value || 0;
  const alerts = auditLogs?.stats?.find(s => s.label === 'Alerts')?.value || 0;
  
  const healthyMetrics = mockSystemMetrics.filter(m => m.status === 'healthy').length;
  const warningMetrics = mockSystemMetrics.filter(m => m.status === 'warning').length;
  const criticalMetrics = mockSystemMetrics.filter(m => m.status === 'critical').length;
  const systemHealth = mockSystemMetrics.length > 0 
    ? (healthyMetrics / mockSystemMetrics.length) * 100 
    : 100;
  
  const successLogs = mockAuditLogs.filter(l => l.status === 'success').length;
  const failedLogs = mockAuditLogs.filter(l => l.status === 'failed').length;
  const totalLogs = mockAuditLogs.length;

  const metrics = [
    {
      label: 'Total Sections',
      value: totalSections,
      change: `${activeSections} active, ${maintenanceSections} maintenance, ${betaSections} beta`
    },
    {
      label: 'System Health',
      value: `${systemHealth.toFixed(0)}%`,
      change: `${healthyMetrics} healthy, ${warningMetrics} warning, ${criticalMetrics} critical`,
      isSuccess: systemHealth >= 80
    },
    {
      label: 'Total Users',
      value: totalUsers,
      change: `${activeUsers} active users`
    },
    {
      label: 'Audit Logs',
      value: todayLogs,
      change: `${weekLogs} this week, ${alerts} alerts`
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <PageHeader title="Admin" />
        <MetricsBanner metrics={metrics} />
        <AdminDashboard />
      </div>
    </DashboardLayout>
  );
}



