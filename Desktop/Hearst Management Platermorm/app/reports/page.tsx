import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import MetricsBanner from '@/components/layout/MetricsBanner';
import ReportsTable from '@/components/reports/ReportsTable';
import { mockReports } from '@/lib/mock-reports';
import styles from './page.module.css';

export default function ReportsPage() {
  const totalReports = mockReports.length;
  const completedCount = mockReports.filter(r => r.status === 'completed').length;
  const scheduledCount = mockReports.filter(r => r.status === 'scheduled').length;
  const generatingCount = mockReports.filter(r => r.status === 'generating').length;
  const failedCount = mockReports.filter(r => r.status === 'failed').length;
  
  const performanceCount = mockReports.filter(r => r.type === 'performance').length;
  const riskCount = mockReports.filter(r => r.type === 'risk').length;
  const complianceCount = mockReports.filter(r => r.type === 'compliance').length;
  const operationalCount = mockReports.filter(r => r.type === 'operational').length;
  const customCount = mockReports.filter(r => r.type === 'custom').length;
  
  const totalSize = mockReports.reduce((sum, r) => sum + (r.size || 0), 0);
  const totalSizeMB = (totalSize / 1024).toFixed(1);
  
  const completionRate = totalReports > 0 ? (completedCount / totalReports) * 100 : 0;

  const metrics = [
    {
      label: 'Total Reports',
      value: totalReports,
      change: `${performanceCount} performance, ${riskCount} risk, ${complianceCount} compliance, ${operationalCount} operational, ${customCount} custom`
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      change: `${completedCount} completed, ${scheduledCount} scheduled, ${generatingCount} generating`,
      isSuccess: completionRate >= 80
    },
    {
      label: 'Total Size',
      value: `${totalSizeMB} MB`,
      change: 'All reports combined'
    },
    {
      label: 'Active Reports',
      value: completedCount,
      change: 'All generated successfully'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <PageHeader title="Reports" />
        <MetricsBanner metrics={metrics} />
        <ReportsTable />
      </div>
    </DashboardLayout>
  );
}



