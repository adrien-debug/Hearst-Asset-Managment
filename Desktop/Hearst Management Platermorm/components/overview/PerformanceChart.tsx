'use client';

import React, { useRef, useEffect, useState } from 'react';
import { PerformanceDataPoint } from '@/lib/mock-overview';
import styles from './PerformanceChart.module.css';

interface PerformanceChartProps {
  data: PerformanceDataPoint[];
  height?: number;
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getMonthLabel = (isoMonth: string) => {
  const monthPart = isoMonth.split('-')[1];
  const monthIndex = Math.max(0, Math.min(11, Number(monthPart) - 1));
  return MONTH_LABELS[monthIndex] ?? '';
};

export default function PerformanceChart({ data, height = 220 }: PerformanceChartProps) {
  const chartWrapperRef = useRef<HTMLDivElement>(null);
  const [chartWidth, setChartWidth] = useState(600);

  useEffect(() => {
    const updateChartWidth = () => {
      if (chartWrapperRef.current) {
        const containerWidth = chartWrapperRef.current.offsetWidth;
        // Utiliser la largeur du conteneur, minimum 400px pour la lisibilité
        setChartWidth(Math.max(containerWidth, 400));
      }
    };

    // Initialiser la largeur
    updateChartWidth();
    
    // Utiliser ResizeObserver pour une meilleure détection des changements
    const resizeObserver = new ResizeObserver(updateChartWidth);
    if (chartWrapperRef.current) {
      resizeObserver.observe(chartWrapperRef.current);
    }
    
    // Fallback avec window resize
    window.addEventListener('resize', updateChartWidth);
    
    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateChartWidth);
    };
  }, []);

  const baseValue = data[0]?.value || 1;
  const normalizedData = data.map((point) => ({
    ...point,
    pctValue: ((point.value / baseValue) - 1) * 100,
    pctBenchmark:
      point.benchmark !== undefined
        ? ((point.benchmark / baseValue) - 1) * 100
        : undefined,
  }));

  const maxPct = Math.max(
    ...normalizedData.map((d) => Math.max(d.pctValue, d.pctBenchmark ?? d.pctValue))
  );
  const minPct = Math.min(
    ...normalizedData.map((d) => Math.min(d.pctValue, d.pctBenchmark ?? d.pctValue))
  );
  const paddedMin = Math.min(0, minPct);
  const paddedMax = Math.max(maxPct, 0);
  const range = paddedMax - paddedMin || 1; // Éviter division par zéro
  const chartHeight = height;
  const graphWidth = chartWidth;
  const graphHeight = chartHeight;

  const step = graphWidth / normalizedData.length;
  const barWidth = Math.min(step * 0.55, 28); // barres présentes et premium
  const benchmarkBarWidth = Math.max(barWidth * 0.48, 8); // benchmark plus fin mais lisible

  const getX = (index: number) => index * step + (step - barWidth) / 2;
  const getBarHeight = (value: number) => {
    if (range === 0) return 0;
    return ((value - paddedMin) / range) * graphHeight;
  };
  const getY = (value: number) => graphHeight - getBarHeight(value);

  const gridLines = 5;
  const gridValues: number[] = [];
  for (let i = 0; i <= gridLines; i++) {
    gridValues.push(paddedMin + (range / gridLines) * i);
  }

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartHeader}>
        <div>
          <h3 className={styles.chartTitle}>Performance Over Time</h3>
          <p className={styles.chartSubtitle}>Variation mensuelle vs Janvier (en %)</p>
        </div>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: 'var(--color-chart-line-primary)' }}
            />
            <span className={styles.legendLabel}>Portfolio</span>
          </div>
          <div className={styles.legendItem}>
            <span
              className={styles.legendDot}
              style={{ backgroundColor: 'var(--color-chart-line-secondary)' }}
            />
            <span className={styles.legendLabel}>Benchmark</span>
          </div>
        </div>
      </div>
      <div className={styles.chartWrapper} ref={chartWrapperRef}>
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className={styles.chart}
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Grid lines */}
          {gridValues.map((value, index) => (
            <g key={index}>
              <line
                x1="0"
                y1={getY(value)}
                x2={chartWidth}
                y2={getY(value)}
                stroke="var(--color-chart-grid)"
                strokeWidth="1"
                strokeDasharray="4 4"
                opacity="1"
              />
              <text
                x="10"
                y={getY(value) + 4}
                textAnchor="start"
                fontSize={chartWidth > 600 ? "11" : "10"}
                fill="var(--color-text-muted)"
                className={styles.gridLabel}
              >
                {value.toFixed(0)}%
              </text>
            </g>
          ))}

          {/* X-axis labels */}
          {normalizedData.map((point, index) => {
            // Ajuster la fréquence des labels selon la largeur
            const labelInterval = chartWidth > 600 ? 1 : chartWidth > 400 ? 2 : 3;
            if (index % labelInterval === 0 || index === data.length - 1) {
              return (
              <text
                key={index}
                x={getX(index) + barWidth / 2}
                y={chartHeight - 5}
                textAnchor="middle"
                fontSize={chartWidth > 600 ? "11" : "10"}
                fill="var(--color-text-muted)"
                className={styles.axisLabel}
              >
                {getMonthLabel(point.date)}
              </text>
              );
            }
            return null;
          })}

          {/* Gradient definition */}
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-chart-green-1)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-chart-green-3)" stopOpacity="1" />
            </linearGradient>
            <linearGradient id="benchmarkBarGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="var(--color-chart-green-2)" stopOpacity="1" />
              <stop offset="100%" stopColor="var(--color-chart-green-4)" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* Portfolio bars */}
          {normalizedData.map((point, index) => {
            const barHeight = getBarHeight(point.pctValue);
            const barY = getY(point.pctValue);
            return (
              <rect
                key={`portfolio-${index}`}
                className={styles.portfolioBar}
                x={getX(index)}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill="url(#barGradient)"
                opacity="1"
                rx="6"
                ry="6"
                style={{ animationDelay: `${index * 60}ms` }}
              />
            );
          })}

          {/* Benchmark bars (if available) */}
          {normalizedData.map((point, index) => {
            if (point.pctBenchmark !== undefined) {
              const barHeight = getBarHeight(point.pctBenchmark);
              const barY = getY(point.pctBenchmark);
              const benchmarkBarX = getX(index) + (barWidth - benchmarkBarWidth) / 2;
              return (
                <rect
                  key={`benchmark-${index}`}
                  className={styles.benchmarkBar}
                  x={benchmarkBarX}
                  y={barY}
                  width={benchmarkBarWidth}
                  height={barHeight}
                  fill="url(#benchmarkBarGradient)"
                  opacity="0.7"
                  rx="5"
                  ry="5"
                  style={{ animationDelay: `${index * 60}ms` }}
                />
              );
            }
            return null;
          })}
        </svg>
      </div>
    </div>
  );
}


