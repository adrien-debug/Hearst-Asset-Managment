'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PerformanceDataPoint } from '@/lib/mock-overview';
import styles from './HeroPerformanceCurve.module.css';

type HeroPerformanceCurveProps = {
  data: PerformanceDataPoint[];
  totalAUM: number;
  avgYTD: number;
};

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formatMonth = (isoMonth: string) => {
  const month = Number(isoMonth?.split?.('-')?.[1] ?? 1) - 1;
  return MONTH_LABELS[Math.max(0, Math.min(11, month))] ?? '';
};

const formatPct = (value: number) => `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;

const formatCompact = (value: number) =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

const buildSmoothPath = (points: { x: number; y: number }[]) => {
  if (!points.length) return '';
  if (points.length === 1) return `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

  let d = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const current = points[i];
    const next = points[i + 1] ?? current;

    const cp1x = prev.x + (current.x - prev.x) / 3;
    const cp1y = prev.y;
    const cp2x = current.x - (next.x - prev.x) / 6;
    const cp2y = current.y;

    d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${current.x.toFixed(2)} ${current.y.toFixed(2)}`;
  }
  return d;
};

export default function HeroPerformanceCurve({ data, totalAUM, avgYTD }: HeroPerformanceCurveProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartShellRef = useRef<HTMLDivElement>(null);
  const [svgWidth, setSvgWidth] = useState(1200);
  const [activeTab, setActiveTab] = useState<'performance' | 'allocation' | 'risk'>('performance');
  const [periodFilter, setPeriodFilter] = useState<'6m' | '1y' | 'all'>('all');
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    portfolio: number;
    benchmark: number;
    date: string;
    visible: boolean;
  } | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const update = () => {
      if (containerRef.current) {
        setSvgWidth(Math.max(containerRef.current.clientWidth, 640));
      }
    };
    
    update();
    const ro = new ResizeObserver(update);
    const currentContainer = containerRef.current;
    
    if (currentContainer) {
      ro.observe(currentContainer);
    }
    
    return () => {
      try {
        ro.disconnect();
      } catch (e) {
        // Ignore errors during cleanup
      }
    };
  }, []);

  const series = useMemo(() => {
    const base = data?.[0]?.value ?? 1;
    return (data ?? []).map((point) => ({
      ...point,
      pct: ((point.value / base) - 1) * 100,
      pctBenchmark: point.benchmark !== undefined ? ((point.benchmark / base) - 1) * 100 : undefined,
    }));
  }, [data]);

  if (!series.length) return null;

  const primaryValues = series.map((s) => s.pct);
  const secondaryValues = series.map((s) => s.pctBenchmark ?? s.pct * 0.9);

  const lastPoint = series[series.length - 1];
  const lastBenchmark = series[series.length - 1].pctBenchmark ?? secondaryValues[secondaryValues.length - 1];
  const outperform = lastPoint.pctBenchmark !== undefined ? lastPoint.pct - lastPoint.pctBenchmark : undefined;

  const metrics = [
    { label: 'Portfolio close', value: formatPct(lastPoint.pct) },
    { label: 'Benchmark close', value: formatPct(lastBenchmark) },
    ...(outperform !== undefined ? [{ label: 'Outperformance', value: formatPct(outperform) }] : []),
  ];

  const height = 320;
  const padding = { top: 32, right: 64, bottom: 64, left: 72 };
  const innerWidth = svgWidth - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;

  const minValue = Math.min(0, ...primaryValues, ...secondaryValues);
  const maxValue = Math.max(...primaryValues, ...secondaryValues, 0);
  const paddedMin = Math.floor(minValue / 5) * 5 - 5;
  const paddedMax = Math.ceil(maxValue / 5) * 5 + 5;
  const range = Math.max(paddedMax - paddedMin, 1);

  const mapPoints = (values: number[]) =>
    values.map((val, index) => {
      const x = padding.left + (innerWidth / Math.max(1, values.length - 1)) * index;
      const y = padding.top + (1 - (val - paddedMin) / range) * innerHeight;
      return { x, y, val };
    });

  const primaryPoints = mapPoints(primaryValues);
  const secondaryPoints = mapPoints(secondaryValues);

  const primaryPath = buildSmoothPath(primaryPoints);
  const secondaryPath = buildSmoothPath(secondaryPoints);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const chartShellRect = chartShellRef.current?.getBoundingClientRect();
    const svgX = e.clientX - rect.left;
    const svgY = e.clientY - rect.top;
    const chartShellX = (chartShellRect?.left ?? 0);
    const chartShellY = (chartShellRect?.top ?? 0);

    const relativeX = svgX - padding.left;
    const clampedRelativeX = Math.max(0, Math.min(relativeX, innerWidth));
    const dataIndex = Math.round((clampedRelativeX / innerWidth) * (primaryPoints.length - 1));
    const clampedIndex = Math.max(0, Math.min(dataIndex, primaryPoints.length - 1));

    setTooltip({
      x: chartShellX + padding.left + clampedRelativeX,
      y: chartShellY + svgY,
      portfolio: primaryValues[clampedIndex],
      benchmark: secondaryValues[clampedIndex],
      date: series[clampedIndex].date,
      visible: true,
    });
  };

  const handleMouseLeave = () => {
    setTooltip(null);
  };

  const yTicks: number[] = [];
  const steps = 5;
  for (let i = 0; i <= steps; i++) {
    yTicks.push(Math.round(paddedMin + (range / steps) * i));
  }

  return (
    <section className={styles.wrapper} ref={containerRef}>
      <div className={styles.header}>
        <div className={styles.headerTexts}>
          <h3 className={styles.title}>Metrics & Chart</h3>
        </div>
      </div>

      <div className={styles.tabsContainer}>
        <div className={styles.tabsRow}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${activeTab === 'performance' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              Performance
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'allocation' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('allocation')}
            >
              Allocation
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'risk' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('risk')}
            >
              Risk Metrics
            </button>
          </div>
          <div className={styles.metricGrid}>
            {metrics.map((metric) => (
              <div key={metric.label} className={styles.metricCard}>
                <span className={styles.metricLabel}>{metric.label}</span>
                <span className={styles.metricValue}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.legend}>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotPrimary}`} />
            <span>Portfolio</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendDot} ${styles.legendDotSecondary}`} />
            <span>Benchmark</span>
          </div>
        </div>
        <div className={styles.periodFilter}>
          <button
            className={`${styles.filterBtn} ${periodFilter === '6m' ? styles.filterBtnActive : ''}`}
            onClick={() => setPeriodFilter('6m')}
          >
            6M
          </button>
          <button
            className={`${styles.filterBtn} ${periodFilter === '1y' ? styles.filterBtnActive : ''}`}
            onClick={() => setPeriodFilter('1y')}
          >
            1Y
          </button>
          <button
            className={`${styles.filterBtn} ${periodFilter === 'all' ? styles.filterBtnActive : ''}`}
            onClick={() => setPeriodFilter('all')}
          >
            All
          </button>
        </div>
      </div>

      <div 
        className={styles.chartShell} 
        ref={chartShellRef}
        onMouseLeave={handleMouseLeave}
      >
        <div className={styles.chartWrapper}>
          <svg
            viewBox={`0 0 ${svgWidth} ${height}`}
            className={styles.chart}
            role="img"
            aria-label="Portfolio vs Benchmark chart"
            preserveAspectRatio="none"
            onMouseMove={handleMouseMove}
          >
          <defs>
            <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#8AFD81" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="benchmarkGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#94a3b8" stopOpacity="0.1" />
              <stop offset="100%" stopColor="#94a3b8" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="outperformanceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8AFD81" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#8AFD81" stopOpacity="0" />
            </linearGradient>
          </defs>

          {yTicks.map((tick) => {
            const y = padding.top + (1 - (tick - paddedMin) / range) * innerHeight;
            return (
              <g key={`grid-${tick}`}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={padding.left + innerWidth}
                  y2={y}
                  className={styles.gridLine}
                />
                <text
                  x={padding.left - 10}
                  y={y + 4}
                  textAnchor="end"
                  className={styles.axisLabel}
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {primaryPoints.map((p, idx) => {
            const showLabel = idx === 0 || idx === primaryPoints.length - 1 || idx % 2 === 0;
            if (!showLabel) return null;
            return (
              <text
                key={`label-${idx}`}
                x={p.x}
                y={padding.top + innerHeight + 20}
                textAnchor="middle"
                className={styles.axisLabel}
              >
                {formatMonth(series[idx].date)}
              </text>
            );
          })}

          <line
            x1={padding.left}
            y1={padding.top + innerHeight}
            x2={padding.left + innerWidth}
            y2={padding.top + innerHeight}
            className={styles.axisLine}
          />

          {paddedMin < 0 && paddedMax > 0 && (
            <line
              x1={padding.left}
              y1={padding.top + (1 - (0 - paddedMin) / range) * innerHeight}
              x2={padding.left + innerWidth}
              y2={padding.top + (1 - (0 - paddedMin) / range) * innerHeight}
              className={styles.zeroLine}
            />
          )}

          {/* Interactive overlay for hover detection */}
          <rect
            x={padding.left}
            y={padding.top}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            style={{ cursor: 'crosshair' }}
          />

          {/* Area under benchmark line */}
          <path
            d={`${secondaryPath} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`}
            fill="url(#benchmarkGradient)"
            className={styles.areaSecondary}
          />

          {/* Area under portfolio line */}
          <path
            d={`${primaryPath} L ${padding.left + innerWidth} ${padding.top + innerHeight} L ${padding.left} ${padding.top + innerHeight} Z`}
            fill="url(#portfolioGradient)"
            className={styles.areaPrimary}
          />

          <path d={secondaryPath} className={styles.lineSecondary} />
          <path d={primaryPath} className={styles.linePrimary} />

          {/* Crosshair line when hovering */}
          {tooltip && (
            <line
              x1={tooltip.x}
              y1={padding.top}
              x2={tooltip.x}
              y2={padding.top + innerHeight}
              stroke="rgba(0, 0, 0, 0.15)"
              strokeWidth="1"
              strokeDasharray="3 3"
              className={styles.crosshair}
            />
          )}

          {/* Value annotations at key points */}
          {(() => {
            const maxIdx = primaryValues.indexOf(Math.max(...primaryValues));
            const minIdx = primaryValues.indexOf(Math.min(...primaryValues));
            const annotations = new Set([0, primaryPoints.length - 1, maxIdx, minIdx]);

            return Array.from(annotations).map((idx) => {
              const p = primaryPoints[idx];
              const isFirst = idx === 0;
              const isLast = idx === primaryPoints.length - 1;

              return (
                <g key={`annotation-${idx}`} className={styles.valueAnnotation}>
                  {!isFirst && !isLast && (
                    <line
                      x1={p.x}
                      y1={padding.top}
                      x2={p.x}
                      y2={padding.top + innerHeight}
                      stroke="rgba(0, 0, 0, 0.03)"
                      strokeWidth="1"
                      strokeDasharray="2 2"
                    />
                  )}
                  <circle cx={p.x} cy={p.y} r="3" fill="#8AFD81" />
                  <text
                    x={p.x}
                    y={isFirst || idx === minIdx ? p.y - 10 : p.y - 8}
                    textAnchor="middle"
                    className={styles.valueLabel}
                  >
                    {formatPct(primaryValues[idx])}
                  </text>
                </g>
              );
            });
          })()}

          {/* Last value annotation for benchmark */}
          {secondaryPoints.length > 0 && (
            <g className={styles.valueAnnotation}>
              <circle
                cx={secondaryPoints[secondaryPoints.length - 1].x}
                cy={secondaryPoints[secondaryPoints.length - 1].y}
                r="2.5"
                fill="#94a3b8"
              />
              <text
                x={secondaryPoints[secondaryPoints.length - 1].x}
                y={secondaryPoints[secondaryPoints.length - 1].y - 8}
                textAnchor="middle"
                className={styles.benchmarkLabel}
              >
                {formatPct(secondaryValues[secondaryValues.length - 1])}
              </text>
            </g>
          )}

          {/* Tooltip markers on chart */}
          {tooltip && (() => {
            const relativeX = tooltip.x - padding.left;
            const dataIndex = Math.round((relativeX / innerWidth) * (primaryPoints.length - 1));
            const clampedIndex = Math.max(0, Math.min(dataIndex, primaryPoints.length - 1));
            const portfolioPoint = primaryPoints[clampedIndex];
            const benchmarkPoint = secondaryPoints[clampedIndex];

            return (
              <g>
                <circle
                  cx={tooltip.x}
                  cy={portfolioPoint.y}
                  r="4"
                  fill="#8AFD81"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx={tooltip.x}
                  cy={benchmarkPoint.y}
                  r="3.5"
                  fill="#94a3b8"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </g>
            );
          })()}
        </svg>

        {/* Tooltip overlay - can go outside chart bounds */}
        {tooltip && (() => {
          const chartShellRect = chartShellRef.current?.getBoundingClientRect();
          const chartShellX = chartShellRect?.left ?? 0;
          const svgCenter = chartShellX + (svgWidth * (chartShellRect ? (chartShellRect.width / svgWidth) : 1) / 2);
          
          const tooltipX = tooltip.x < svgCenter ? tooltip.x + 16 : tooltip.x - 160;
          const tooltipY = tooltip.y - 75;

          return (
            <div
              className={styles.tooltipOverlay}
              style={{
                left: `${tooltipX}px`,
                top: `${tooltipY}px`,
              }}
            >
              <div className={styles.tooltipBox}>
                <div className={styles.tooltipDate}>{formatMonth(tooltip.date)}</div>
                <div className={styles.tooltipPortfolio}>{formatPct(tooltip.portfolio)}</div>
                <div className={styles.tooltipBenchmark}>{formatPct(tooltip.benchmark)}</div>
              </div>
            </div>
          );
        })()}
        </div>
      </div>
    </section>
  );
}

