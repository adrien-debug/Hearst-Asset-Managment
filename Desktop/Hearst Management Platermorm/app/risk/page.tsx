import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import MetricsBanner from '@/components/layout/MetricsBanner';
import RiskComplianceDashboard from '@/components/risk/RiskComplianceDashboard';
import { mockComplianceChecks, mockRiskAlerts, mockRiskMetrics } from '@/lib/mock-risk';
import styles from './page.module.css';

export default function RiskPage() {
  const totalChecks = mockComplianceChecks.length;
  const compliantCount = mockComplianceChecks.filter(c => c.status === 'compliant').length;
  const warningCount = mockComplianceChecks.filter(c => c.status === 'warning').length;
  const nonCompliantCount = mockComplianceChecks.filter(c => c.status === 'non-compliant').length;
  const pendingCount = mockComplianceChecks.filter(c => c.status === 'pending').length;
  const complianceRate = totalChecks > 0 ? (compliantCount / totalChecks) * 100 : 0;
  
  const openAlerts = mockRiskAlerts.filter(a => a.status === 'open').length;
  const acknowledgedAlerts = mockRiskAlerts.filter(a => a.status === 'acknowledged').length;
  const resolvedAlerts = mockRiskAlerts.filter(a => a.status === 'resolved').length;
  const totalAlerts = mockRiskAlerts.length;
  
  const avgStressTestScore = mockRiskMetrics.length > 0
    ? mockRiskMetrics.reduce((sum, m) => sum + m.stressTestScore, 0) / mockRiskMetrics.length
    : 0;
  
  const regulatoryCount = mockComplianceChecks.filter(c => c.type === 'regulatory').length;
  const operationalCount = mockComplianceChecks.filter(c => c.type === 'operational').length;
  const legalCount = mockComplianceChecks.filter(c => c.type === 'legal').length;
  const auditCount = mockComplianceChecks.filter(c => c.type === 'audit').length;

  const metrics = [
    {
      label: 'Total Checks',
      value: totalChecks,
      change: `${regulatoryCount} regulatory, ${operationalCount} operational, ${legalCount} legal, ${auditCount} audit`
    },
    {
      label: 'Compliance Rate',
      value: `${complianceRate.toFixed(1)}%`,
      change: `${compliantCount} compliant, ${warningCount} warning, ${nonCompliantCount} non-compliant`,
      isSuccess: complianceRate >= 80
    },
    {
      label: 'Risk Alerts',
      value: openAlerts,
      change: `${openAlerts} open, ${acknowledgedAlerts} acknowledged, ${resolvedAlerts} resolved`
    },
    {
      label: 'Avg Stress Score',
      value: `${avgStressTestScore.toFixed(1)}`,
      change: 'Out of 100 points',
      isSuccess: avgStressTestScore >= 70
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <PageHeader title="Compliance" />
        <MetricsBanner metrics={metrics} />
        <RiskComplianceDashboard />
      </div>
    </DashboardLayout>
  );
}



