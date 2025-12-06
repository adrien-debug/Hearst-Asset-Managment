'use client';

import React, { useMemo } from 'react';
import { PerformanceDataPoint } from '@/lib/mock-overview';
import styles from './PerformanceBars.module.css';

interface PerformanceBarsProps {
  data: PerformanceDataPoint[];
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getMonthLabel = (isoMonth: string) => {
  const monthPart = isoMonth.split('-')[1];
  const monthIndex = Math.max(0, Math.min(11, Number(monthPart) - 1));
  return MONTH_LABELS[monthIndex] ?? '';
};

export default function PerformanceBars({ data }: PerformanceBarsProps) {
  const { normalized, maxPct, minPct, yTicks } = useMemo(() => {
    if (!data.length) {
      return { normalized: [], maxPct: 0, minPct: 0, yTicks: [] as number[] };
    }

    const baseValue = data[0].value || 1;
    const normalizedData = data.map((point) => ({
      ...point,
      pct: ((point.value / baseValue) - 1) * 100,
    }));

    const values = normalizedData.map((d) => d.pct);
    const maxVal = Math.max(...values, 0);
    const minVal = Math.min(...values, 0);

    const paddedMax = Math.ceil(maxVal / 5) * 5;
    const paddedMin = Math.floor(minVal / 5) * 5;

    const ticks: number[] = [];
    const steps = 4;
    const range = paddedMax - paddedMin || 1;
    for (let i = 0; i <= steps; i++) {
      const v = paddedMin + (range / steps) * i;
      ticks.push(Math.round(v));
    }

    return { normalized: normalizedData, maxPct: paddedMax, minPct: paddedMin, yTicks: ticks };
  }, [data]);

  const range = maxPct - minPct || 1;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>Performance mensuelle</h3>
        <p className={styles.subtitle}>Variation vs janvier (en %)</p>
      </div>

      <div className={styles.chartArea}>
        <div className={styles.yAxis}>
          {yTicks.slice().reverse().map((tick) => (
            <span key={tick} className={styles.yTick}>
              {tick}%
            </span>
          ))}
        </div>

        <div>
          <div className={styles.barsWrapper}>
            {yTicks.slice(1, -1).map((tick) => {
              const top = ((maxPct - tick) / range) * 100;
              return (
                <div
                  key={`grid-${tick}`}
                  className={styles.gridLine}
                  style={{ top: `${top}%` }}
                />
              );
            })}

            <div className={styles.bars}>
              {normalized.map((point, idx) => {
                const heightPct = ((point.pct - minPct) / range) * 100;
                return (
                  <div
                    key={point.date}
                    className={styles.bar}
                    style={{
                      height: `${heightPct}%`,
                      animationDelay: `${idx * 50}ms`,
                    }}
                    aria-label={`${getMonthLabel(point.date)}: ${point.pct.toFixed(1)}%`}
                  />
                );
              })}
            </div>
          </div>

          <div className={styles.xAxis}>
            {normalized.map((point) => (
              <span key={`label-${point.date}`} className={styles.xLabel}>
                {getMonthLabel(point.date)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.legend}>
        <span className={styles.legendDot} />
        <span>Portefeuille (premium, institutionnel)</span>
      </div>
    </div>
  );
}

