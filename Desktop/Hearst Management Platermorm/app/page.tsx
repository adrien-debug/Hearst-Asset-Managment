import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import MetricsBanner from '@/components/layout/MetricsBanner';
import { mockProducts } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/format';
import {
  mockPerformanceData,
  mockTopPerformers
} from '@/lib/mock-overview';
import HeroPerformanceCurve from '@/components/overview/HeroPerformanceCurve';
import PerformanceTable from '@/components/overview/PerformanceTable';
import TopPerformers from '@/components/overview/TopPerformers';
import styles from './page.module.css';

export default function HomePage() {
  const totalAUM = mockProducts.reduce((sum, p) => sum + p.aum, 0);
  const avgYTD = mockProducts.reduce((sum, p) => sum + p.ytdPerformance, 0) / mockProducts.length;
  const marketProducts = mockProducts.filter(p => p.type === 'market').length;
  const miningProducts = mockProducts.filter(p => p.type === 'mining').length;
  const bouquetProducts = mockProducts.filter(p => p.type === 'bouquet').length;

  const metrics = [
    {
      label: 'Total AUM',
      value: formatCurrency(totalAUM),
      change: '+12.4% vs last quarter'
    },
    {
      label: 'Average YTD',
      value: `+${avgYTD.toFixed(1)}%`,
      change: '+2.1% vs benchmark',
      isSuccess: true
    },
    {
      label: 'Total Products',
      value: mockProducts.length,
      change: `${marketProducts + miningProducts + bouquetProducts} active`
    },
    {
      label: 'Active Strategies',
      value: mockProducts.length,
      change: 'All performing'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <PageHeader title="Overview" />

        {/* Key Metrics - Horizontal */}
        <MetricsBanner metrics={metrics} />

        {/* Hero Performance Curve */}
        <HeroPerformanceCurve data={mockPerformanceData} totalAUM={totalAUM} avgYTD={avgYTD} />

        {/* Performance Table */}
        <PerformanceTable data={mockPerformanceData} />

        {/* Top Performers */}
        <TopPerformers data={mockTopPerformers} />
      </div>
    </DashboardLayout>
  );
}



