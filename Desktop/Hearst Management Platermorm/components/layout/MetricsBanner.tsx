import React from 'react';
import Card from '@/components/ui/Card';
import styles from './MetricsBanner.module.css';

interface Metric {
  label: string;
  value: React.ReactNode;
  change?: string;
  isSuccess?: boolean;
}

interface MetricsBannerProps {
  metrics: Metric[];
}

export default function MetricsBanner({ metrics }: MetricsBannerProps) {
  return (
    <div className={styles.metricsGrid}>
      {metrics.map((metric, index) => (
        <Card key={index} className={styles.metricCard}>
          <div className={styles.metricLabel}>{metric.label}</div>
          <div className={`${styles.metricValue} ${metric.isSuccess ? styles.metricValueSuccess : ''}`}>
            {metric.value}
          </div>
          {metric.change && (
            <div className={styles.metricChange}>{metric.change}</div>
          )}
        </Card>
      ))}
    </div>
  );
}

