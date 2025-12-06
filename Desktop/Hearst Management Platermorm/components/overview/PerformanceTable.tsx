'use client';

import React, { useState } from 'react';
import { PerformanceDataPoint } from '@/lib/mock-overview';
import { formatMonthYear, formatPercentage } from '@/lib/format';
import styles from './PerformanceTable.module.css';

interface PerformanceTableProps {
  data: PerformanceDataPoint[];
}

const PREVIEW_ROWS = 5;

export default function PerformanceTable({ data }: PerformanceTableProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasMoreRows = data.length > PREVIEW_ROWS;
  const displayData = isExpanded ? data : data.slice(0, PREVIEW_ROWS);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Performance Details</h3>
        <p className={styles.subtitle}>Monthly returns and cumulative performance</p>
      </div>
      
      <div className={styles.tableWrapper}>
        <table className={styles.performanceTable}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>Période</th>
              <th className={styles.tableHeader}>Portfolio</th>
              <th className={styles.tableHeader}>Portfolio</th>
              <th className={styles.tableHeader}>Benchmark</th>
              <th className={styles.tableHeader}>Benchmark</th>
              <th className={styles.tableHeader}>Diff.</th>
              <th className={styles.tableHeader}>Diff.</th>
            </tr>
          </thead>
          <tbody className={styles.tableBody}>
            {displayData.map((point, displayIndex) => {
              // Trouver l'index réel dans les données originales
              const realIndex = data.findIndex(d => d.date === point.date);
              const previousPoint = realIndex > 0 ? data[realIndex - 1] : point;
              const previousValue = previousPoint.value;
              const previousBenchmark = previousPoint.benchmark || 100;
              
              // Calcul du retour mensuel
              const portfolioReturn = realIndex > 0 ? ((point.value - previousValue) / previousValue) * 100 : 0;
              const benchmarkReturn = realIndex > 0 && point.benchmark 
                ? ((point.benchmark - previousBenchmark) / previousBenchmark) * 100
                : 0;
              const difference = portfolioReturn - benchmarkReturn;
              
              // Calcul du retour cumulatif depuis le début
              const baseValue = data[0].value;
              const baseBenchmark = data[0].benchmark || 100;
              const cumulativePortfolio = ((point.value - baseValue) / baseValue * 100);
              const cumulativeBenchmark = point.benchmark ? ((point.benchmark - baseBenchmark) / baseBenchmark * 100) : 0;
              const cumulativeDifference = cumulativePortfolio - cumulativeBenchmark;
              
              // Formater la date au format "Jan 2024"
              const monthName = formatMonthYear(point.date + '-01');
              
              return (
                <tr key={point.date} className={styles.tableRow}>
                  <td className={styles.tableCell}>{monthName}</td>
                  <td className={`${styles.tableCell} ${styles.tableCellValue}`}>
                    {realIndex === 0 ? 'Base' : formatPercentage(portfolioReturn, 2)}
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellValue}`}>
                    {realIndex === 0 ? '0.0%' : formatPercentage(cumulativePortfolio, 1)}
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellValue}`}>
                    {realIndex === 0 || !point.benchmark ? 'Base' : formatPercentage(benchmarkReturn, 2)}
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellValue}`}>
                    {realIndex === 0 || !point.benchmark ? '0.0%' : formatPercentage(cumulativeBenchmark, 1)}
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellDifference} ${difference >= 0 ? styles.positive : styles.negative}`}>
                    {realIndex === 0 || !point.benchmark ? '—' : formatPercentage(difference, 2)}
                  </td>
                  <td className={`${styles.tableCell} ${styles.tableCellDifference} ${cumulativeDifference >= 0 ? styles.positive : styles.negative}`}>
                    {realIndex === 0 || !point.benchmark ? '0.0%' : formatPercentage(cumulativeDifference, 1)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {hasMoreRows && (
        <div className={styles.expandContainer}>
          <button 
            className={styles.expandButton}
            onClick={() => setIsExpanded(!isExpanded)}
            aria-expanded={isExpanded}
          >
            <span>{isExpanded ? 'Show Less' : `Show All (${data.length} rows)`}</span>
            <svg 
              className={`${styles.expandIcon} ${isExpanded ? styles.expanded : ''}`}
              width="16" 
              height="16" 
              viewBox="0 0 16 16" 
              fill="none"
            >
              <path 
                d="M4 6L8 10L12 6" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
