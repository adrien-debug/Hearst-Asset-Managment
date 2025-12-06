'use client';

import React from 'react';
import { AllocationData } from '@/lib/mock-overview';
import styles from './AllocationChart.module.css';

interface AllocationChartProps {
  data: AllocationData[];
}

export default function AllocationChart({ data }: AllocationChartProps) {
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);
  const totalPercentage = data.reduce((sum, item) => sum + item.percentage, 0);

  // Réordonner la légende pour placer "Bouquets" au centre
  const legendOrder = ['Market Only', 'Bouquets', 'Mining-Enhanced'];
  const legendData: AllocationData[] = legendOrder
    .map((label) => data.find((item) => item.category === label))
    .filter(Boolean) as AllocationData[];

  const radius = 140;
  const strokeWidth = 36;
  const circumference = 2 * Math.PI * radius;
  const gradients = [
    ['var(--color-primary)', 'var(--color-primary-vibrant)'],
    ['var(--color-primary-light)', 'var(--color-primary)'],
    ['var(--color-primary-medium)', 'var(--color-primary-vibrant)'],
    ['var(--color-primary)', 'var(--color-primary-soft)'],
    ['var(--color-primary-vibrant-alt)', 'var(--color-primary-vibrant-alt2)'],
  ];

  const legendGradients = gradients.map(
    ([from, to]) => `linear-gradient(135deg, ${from}, ${to})`
  );

  let offset = 0;

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <h3 className={styles.chartTitle}>AUM Allocation</h3>
        <p className={styles.chartSubtitle}>Répartition par produit</p>
      </div>

      <div className={styles.chartContent}>
        <div className={styles.donutWrapper}>
          <svg viewBox="0 0 360 360" className={styles.donut}>
            <defs>
              {gradients.map(([from, to], index) => (
                <linearGradient
                  key={`grad-${index}`}
                  id={`grad-${index}`}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop offset="0%" stopColor={from} stopOpacity="1" />
                  <stop offset="100%" stopColor={to} stopOpacity="1" />
                </linearGradient>
              ))}
            </defs>
            <circle
              className={styles.track}
              cx="180"
              cy="180"
              r={radius}
              strokeWidth={strokeWidth}
              fill="none"
            />
            {data.map((item, index) => {
              const segmentLength = (item.percentage / 100) * circumference;
              const dasharray = `${segmentLength} ${circumference - segmentLength}`;
              const dashoffset = -offset;
              offset += segmentLength;

              return (
                <circle
                  key={item.category}
                  className={styles.segment}
                  cx="180"
                  cy="180"
                  r={radius}
                  strokeWidth={strokeWidth}
                  stroke={`url(#grad-${index % gradients.length})`}
                  fill="none"
                  strokeDasharray={dasharray}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="round"
                  transform="rotate(-90 180 180)"
                  style={{ animationDelay: `${index * 90}ms` }}
                />
              );
            })}
          </svg>

          <div className={styles.centerLabel}>
            <div className={styles.centerValue}>${(totalValue / 1_000_000).toFixed(0)}M</div>
            <div className={styles.centerHint}>Total AUM</div>
          </div>
        </div>

        <div className={styles.legendGrid}>
          {legendData.map((item, index) => (
            <div key={item.category} className={styles.legendItem}>
              <div className={styles.legendLeft}>
                <span
                  className={styles.legendDot}
                  style={{
                    background: legendGradients[index % legendGradients.length],
                  }}
                />
                <span className={styles.legendLabel}>{item.category}</span>
              </div>
              <div className={styles.legendRight}>
                <span className={styles.legendValue}>
                  ${(item.value / 1_000_000).toFixed(1)}M
                </span>
                <span className={styles.legendPercentage}>{item.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
