import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import MetricsBanner from '@/components/layout/MetricsBanner';
import MandatesTable from '@/components/mandates/MandatesTable';
import { mockMandates } from '@/lib/mock-mandates';
import { formatCurrency } from '@/lib/format';
import styles from './page.module.css';

export default function MandatesPage() {
  const totalAUM = mockMandates.reduce((sum, m) => sum + m.aum, 0);
  const activeMandates = mockMandates.filter(m => m.status === 'active');
  const avgYTD = activeMandates.length > 0
    ? activeMandates.reduce((sum, m) => sum + m.ytdPerformance, 0) / activeMandates.length
    : 0;
  const totalMandates = mockMandates.length;
  const activeCount = activeMandates.length;
  const sovereignCount = mockMandates.filter(m => m.type === 'sovereign').length;
  const institutionalCount = mockMandates.filter(m => m.type === 'institutional').length;
  const corporateCount = mockMandates.filter(m => m.type === 'corporate').length;
  const familyOfficeCount = mockMandates.filter(m => m.type === 'family-office').length;

  const metrics = [
    {
      label: 'Total Mandates',
      value: totalMandates,
      change: `${sovereignCount} sovereign, ${institutionalCount} institutional, ${corporateCount} corporate, ${familyOfficeCount} family office`
    },
    {
      label: 'Total AUM',
      value: formatCurrency(totalAUM),
      change: '+15.2% vs last quarter'
    },
    {
      label: 'Average YTD',
      value: `+${avgYTD.toFixed(1)}%`,
      change: '+3.4% vs benchmark',
      isSuccess: true
    },
    {
      label: 'Active Mandates',
      value: activeCount,
      change: 'All performing'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <PageHeader title="Portfolio" />
        <MetricsBanner metrics={metrics} />
        <MandatesTable />
      </div>
    </DashboardLayout>
  );
}



