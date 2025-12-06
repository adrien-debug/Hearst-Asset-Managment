'use client';

import React, { useState } from 'react';
import { Execution } from '@/lib/mock-executions';
import { mockExecutions } from '@/lib/mock-executions';
import Link from 'next/link';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import styles from './ExecutionsTable.module.css';

const typeLabels = {
  buy: 'Buy',
  sell: 'Sell',
  rebalance: 'Rebalance',
  allocation: 'Allocation'
};

const statusColors = {
  pending: 'var(--color-warning)',
  executing: 'var(--color-accent)',
  completed: 'var(--color-success)',
  failed: 'var(--color-danger)',
  cancelled: 'var(--color-text-muted)'
};

export default function ExecutionsTable() {
  const [filterStatus, setFilterStatus] = useState<'all' | Execution['status']>('all');
  const [filterType, setFilterType] = useState<'all' | Execution['type']>('all');

  const filteredExecutions = mockExecutions.filter(execution => {
    const statusMatch = filterStatus === 'all' || execution.status === filterStatus;
    const typeMatch = filterType === 'all' || execution.type === filterType;
    return statusMatch && typeMatch;
  });

  const totalValue = filteredExecutions.reduce((sum, e) => sum + e.value, 0);
  const totalFees = filteredExecutions.reduce((sum, e) => sum + e.fees, 0);
  const completedCount = filteredExecutions.filter(e => e.status === 'completed').length;
  const pendingCount = filteredExecutions.filter(e => e.status === 'pending' || e.status === 'executing').length;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Execution</h1>
          <p className={styles.subtitle}>
            Monitor and manage trade executions across all products and mandates.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Status</span>
          <button
            onClick={() => setFilterStatus('all')}
            className={`${styles.filterButton} ${filterStatus === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`${styles.filterButton} ${filterStatus === 'pending' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilterStatus('executing')}
            className={`${styles.filterButton} ${filterStatus === 'executing' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Executing
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`${styles.filterButton} ${filterStatus === 'completed' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Completed
          </button>
          <button
            onClick={() => setFilterStatus('failed')}
            className={`${styles.filterButton} ${filterStatus === 'failed' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Failed
          </button>
        </div>
        <div className={styles.filterGroup}>
          <span className={styles.filterLabel}>Type</span>
          <button
            onClick={() => setFilterType('all')}
            className={`${styles.filterButton} ${filterType === 'all' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            All
          </button>
          <button
            onClick={() => setFilterType('buy')}
            className={`${styles.filterButton} ${filterType === 'buy' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Buy
          </button>
          <button
            onClick={() => setFilterType('sell')}
            className={`${styles.filterButton} ${filterType === 'sell' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Sell
          </button>
          <button
            onClick={() => setFilterType('rebalance')}
            className={`${styles.filterButton} ${filterType === 'rebalance' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Rebalance
          </button>
          <button
            onClick={() => setFilterType('allocation')}
            className={`${styles.filterButton} ${filterType === 'allocation' ? styles.filterButtonActive : styles.filterButtonInactive}`}
          >
            Allocation
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Value</div>
          <div className={styles.summaryValue}>{formatCurrency(totalValue)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Total Fees</div>
          <div className={styles.summaryValue}>{formatCurrency(totalFees)}</div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Completed</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
            {completedCount}
          </div>
        </div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryLabel}>Pending/Executing</div>
          <div className={styles.summaryValue} style={{ color: 'var(--color-warning)' }}>
            {pendingCount}
          </div>
        </div>
      </div>

      {/* Executions Table */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Order ID</th>
              <th className={styles.tableHeaderCell}>Product</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Asset</th>
              <th className={styles.tableHeaderCell}>Quantity</th>
              <th className={styles.tableHeaderCell}>Price</th>
              <th className={styles.tableHeaderCell}>Value</th>
              <th className={styles.tableHeaderCell}>Venue</th>
              <th className={styles.tableHeaderCell}>Timestamp</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExecutions.map((execution) => (
              <tr key={execution.id} className={styles.tableBodyRow}>
                <td className={`${styles.tableCell} ${styles.tableCellOrderId}`}>
                  {execution.orderId}
                </td>
                <td className={styles.tableCell}>
                  <div>
                    <div className={styles.productName}>{execution.productName}</div>
                    {execution.mandateName && (
                      <div className={styles.mandateName}>{execution.mandateName}</div>
                    )}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.typeBadge} data-type={execution.type}>
                    {typeLabels[execution.type]}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span 
                    className={styles.statusBadge}
                    style={{ 
                      backgroundColor: `${statusColors[execution.status]}15`,
                      color: statusColors[execution.status],
                      borderColor: `${statusColors[execution.status]}40`
                    }}
                  >
                    {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.assetBadge}>{execution.asset}</span>
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {execution.quantity > 0 ? formatNumber(execution.quantity, { decimals: 1 }) : '—'}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {execution.price > 0 ? formatCurrency(execution.price) : '—'}
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {formatCurrency(execution.value)}
                </td>
                <td className={styles.tableCell}>
                  {execution.executionVenue}
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.timestamp}>
                    {formatDate(execution.timestamp)}
                  </div>
                  {execution.executedAt && (
                    <div className={styles.executedAt}>
                      Exec: {formatDate(execution.executedAt)}
                    </div>
                  )}
                </td>
                <td className={styles.tableCell} style={{ textAlign: 'center' }}>
                  <Link href={`/execution/${execution.id}`} style={{ textDecoration: 'none' }}>
                    <button className={styles.actionButton}>
                      View
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredExecutions.length === 0 && (
        <div className={styles.emptyState}>
          No executions found for the selected filters.
        </div>
      )}
    </div>
  );
}

