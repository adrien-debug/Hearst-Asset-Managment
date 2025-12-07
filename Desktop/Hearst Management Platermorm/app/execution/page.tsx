import DashboardLayout from '@/components/layout/DashboardLayout';
import PageHeader from '@/components/layout/PageHeader';
import MetricsBanner from '@/components/layout/MetricsBanner';
import ExecutionsTable from '@/components/execution/ExecutionsTable';
import { mockExecutions } from '@/lib/mock-executions';
import { formatCurrency } from '@/lib/format';
import styles from './page.module.css';

export default function ExecutionPage() {
  const totalValue = mockExecutions.reduce((sum, e) => sum + e.value, 0);
  const totalFees = mockExecutions.reduce((sum, e) => sum + e.fees, 0);
  const completedCount = mockExecutions.filter(e => e.status === 'completed').length;
  const pendingCount = mockExecutions.filter(e => e.status === 'pending' || e.status === 'executing').length;
  const totalExecutions = mockExecutions.length;
  const buyCount = mockExecutions.filter(e => e.type === 'buy').length;
  const sellCount = mockExecutions.filter(e => e.type === 'sell').length;
  const rebalanceCount = mockExecutions.filter(e => e.type === 'rebalance').length;
  const allocationCount = mockExecutions.filter(e => e.type === 'allocation').length;
  const completionRate = totalExecutions > 0 ? (completedCount / totalExecutions) * 100 : 0;

  const metrics = [
    {
      label: 'Total Executions',
      value: totalExecutions,
      change: `${buyCount} buy, ${sellCount} sell, ${rebalanceCount} rebalance, ${allocationCount} allocation`
    },
    {
      label: 'Total Value',
      value: formatCurrency(totalValue),
      change: '+8.3% vs last month'
    },
    {
      label: 'Completion Rate',
      value: `${completionRate.toFixed(1)}%`,
      change: `${completedCount} completed, ${pendingCount} pending`,
      isSuccess: completionRate >= 80
    },
    {
      label: 'Total Fees',
      value: formatCurrency(totalFees),
      change: '0.12% avg fee rate'
    }
  ];

  return (
    <DashboardLayout>
      <div className={styles.container}>
        <PageHeader title="Execution" />
        <MetricsBanner metrics={metrics} />
        <ExecutionsTable />
      </div>
    </DashboardLayout>
  );
}



