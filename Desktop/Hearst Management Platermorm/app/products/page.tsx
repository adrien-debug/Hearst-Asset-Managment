import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import MetricsBanner from '@/components/layout/MetricsBanner';
import ProductShelf from '@/components/products/ProductShelf';
import { mockProducts } from '@/lib/mock-data';
import { formatCurrency } from '@/lib/format';
import styles from './page.module.css';

export default function ProductsPage() {
  const totalAUM = mockProducts.reduce((sum, p) => sum + p.aum, 0);
  const avgYTD = mockProducts.reduce((sum, p) => sum + p.ytdPerformance, 0) / mockProducts.length;
  const marketProducts = mockProducts.filter(p => p.type === 'market').length;
  const miningProducts = mockProducts.filter(p => p.type === 'mining').length;
  const bouquetProducts = mockProducts.filter(p => p.type === 'bouquet').length;
  const totalProducts = mockProducts.length;

  const metrics = [
    {
      label: 'Total Products',
      value: totalProducts,
      change: `${marketProducts} market, ${miningProducts} mining, ${bouquetProducts} bouquets`
    },
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
      label: 'Active Strategies',
      value: totalProducts,
      change: 'All performing'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <PageHeader title="Products" />
        <MetricsBanner metrics={metrics} />
        <ProductShelf />
      </div>
    </DashboardLayout>
  );
}



