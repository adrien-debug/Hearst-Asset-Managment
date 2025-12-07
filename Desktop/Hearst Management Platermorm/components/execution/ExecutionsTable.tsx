'use client';

import React, { useState } from 'react';
import { Execution } from '@/lib/mock-executions';
import { mockExecutions } from '@/lib/mock-executions';
import { formatCurrency, formatDate, formatNumber } from '@/lib/format';
import Modal from '@/components/ui/Modal';
import ExecutionDetail from './ExecutionDetail';
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
  const [selectedExecution, setSelectedExecution] = useState<Execution | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
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

      {/* Executions Table - Simplified */}
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr className={styles.tableHeaderRow}>
              <th className={styles.tableHeaderCell}>Order ID</th>
              <th className={styles.tableHeaderCell}>Product</th>
              <th className={styles.tableHeaderCell}>Type</th>
              <th className={styles.tableHeaderCell}>Status</th>
              <th className={styles.tableHeaderCell}>Value</th>
              <th className={styles.tableHeaderCell}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredExecutions.map((execution) => (
              <tr 
                key={execution.id} 
                className={styles.tableBodyRow}
                onClick={() => {
                  setSelectedExecution(execution);
                  setIsModalOpen(true);
                }}
              >
                <td className={styles.tableCell}>
                  <div className={styles.orderId}>{execution.orderId}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className={styles.productName}>{execution.productName}</div>
                  {execution.mandateName && (
                    <div className={styles.mandateName}>{execution.mandateName}</div>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.typeBadge} data-type={execution.type}>
                    {typeLabels[execution.type]}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <span className={styles.statusBadge}>
                    {execution.status.charAt(0).toUpperCase() + execution.status.slice(1)}
                  </span>
                </td>
                <td className={`${styles.tableCell} ${styles.tableCellMetric}`}>
                  {formatCurrency(execution.value)}
                </td>
                <td className={styles.tableCell}>
                  <button 
                    className={styles.actionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExecution(execution);
                      setIsModalOpen(true);
                    }}
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setSelectedExecution(null);
        }}
        title={selectedExecution?.orderId}
      >
        {selectedExecution && <ExecutionDetail execution={selectedExecution} />}
      </Modal>

      {filteredExecutions.length === 0 && (
        <div className={styles.emptyState}>
          No executions found for the selected filters.
        </div>
      )}
    </>
  );
}

