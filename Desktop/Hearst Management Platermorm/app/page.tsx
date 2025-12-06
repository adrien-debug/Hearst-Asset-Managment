import DashboardLayout from '@/components/layout/DashboardLayout';
import { mockProducts } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/format';
import {
  mockPerformanceData,
  mockAllocationData,
  mockTopPerformers
} from '@/lib/mock-overview';
import PerformanceTable from '@/components/overview/PerformanceTable';
import AllocationChart from '@/components/overview/AllocationChart';
import PerformanceBars from '@/components/overview/PerformanceBars';
import TopPerformers from '@/components/overview/TopPerformers';
import styles from './page.module.css';

export default function HomePage() {
  const totalAUM = mockProducts.reduce((sum, p) => sum + p.aum, 0);
  const avgYTD = mockProducts.reduce((sum, p) => sum + p.ytdPerformance, 0) / mockProducts.length;
  const marketProducts = mockProducts.filter(p => p.type === 'market').length;
  const miningProducts = mockProducts.filter(p => p.type === 'mining').length;
  const bouquetProducts = mockProducts.filter(p => p.type === 'bouquet').length;

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Overview</h1>
          <p className={styles.subtitle}>
            Comprehensive view of platform performance, allocations, and key metrics
          </p>
        </div>

        {/* Key Metrics - Institutional Table Format */}
        <div className={styles.metricsGrid}>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Total AUM</div>
            <div className={styles.metricValue}>{formatCurrency(totalAUM)}</div>
            <div className={styles.metricChange}>+12.4% vs last quarter</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Average YTD</div>
            <div className={`${styles.metricValue} ${styles.metricValueSuccess}`}>
              +{avgYTD.toFixed(1)}%
            </div>
            <div className={styles.metricChange}>+2.1% vs benchmark</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Total Products</div>
            <div className={styles.metricValue}>{mockProducts.length}</div>
            <div className={styles.metricChange}>{marketProducts + miningProducts + bouquetProducts} active</div>
          </div>
          <div className={styles.metricCard}>
            <div className={styles.metricLabel}>Active Strategies</div>
            <div className={styles.metricValue}>{mockProducts.length}</div>
            <div className={styles.metricChange}>All performing</div>
          </div>
        </div>

        {/* Charts Grid - Performance & Allocation */}
        <div className={styles.chartsGrid}>
          <AllocationChart data={mockAllocationData} />
          <PerformanceBars data={mockPerformanceData} />
        </div>

        {/* Performance Table */}
        <PerformanceTable data={mockPerformanceData} />

        {/* Top Performers */}
        <TopPerformers data={mockTopPerformers} />

      </div>
    </DashboardLayout>
  );
}



