import { useId, useMemo, useState } from "react"
import {
  CartesianGrid,
  Curve,
  Line,
  LineChart,
  type CurveProps,
  XAxis,
  YAxis,
} from "recharts"
import type { YAxisTickContentProps } from "recharts/types/util/types"

import { BudgetPeriodClickDot } from "@/components/charts/budget-period-click-dot"
import { DirhamSymbol } from "@/components/dirham-symbol"
import { BudgetPeriodDetailsModal } from "@/components/modals/budget-period-details-modal"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { ISheetsData } from "@/interfaces/app.interface"
import {
  buildBudgetPeriodChartData,
  type BudgetPeriodRow,
} from "@/lib/budget-period-chart-data"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"

export type { BudgetPeriodRow } from "@/lib/budget-period-chart-data"

const deltaSeriesLabel = (
  <span className="inline-flex items-baseline gap-1">
    <DirhamSymbol />
    <span>Delta</span>
  </span>
)

const chartConfig = {
  delta: {
    label: deltaSeriesLabel,
    color: "var(--chart-4)",
  },
  deltaNegative: {
    label: deltaSeriesLabel,
    color: "var(--destructive)",
  },
} satisfies ChartConfig

const HUGE = 1e6

const formatDeltaYAxisTick = (v: unknown): string => {
  const n = typeof v === "number" ? v : Number(v)
  if (!Number.isFinite(n)) return String(v ?? "")
  if (n === 0) return "0"
  const body = Math.abs(n).toLocaleString("en-US")
  return n < 0 ? `-${body}` : body
}

const BudgetDeltaYAxisTick = (props: YAxisTickContentProps) => {
  const { x, y, payload } = props
  const text = formatDeltaYAxisTick(payload.value)
  return (
    <g transform={`translate(${x},${y})`}>
      <text
        textAnchor="end"
        className="fill-muted-foreground text-xs"
        dy={3}
        dx={-2}
      >
        <tspan className="dirham-symbol">{"\uE000"}</tspan>
        <tspan dx={3} className="tabular-nums">
          {text}
        </tspan>
      </text>
    </g>
  )
}

const yAtDeltaZero = (
  points: ReadonlyArray<{ x?: number | null; y?: number | null; value?: unknown }>,
): number => {
  const withY = points.filter(
    (p): p is { x: number; y: number; value: number } =>
      typeof p.x === "number" &&
      typeof p.y === "number" &&
      p.value != null &&
      Number.isFinite(Number(p.value)),
  )
  if (withY.length === 0) return 0
  for (let i = 0; i < withY.length - 1; i++) {
    const a = withY[i]
    const b = withY[i + 1]
    const va = Number(a.value)
    const vb = Number(b.value)
    if (va === 0) return a.y
    if (vb === 0) return b.y
    if ((va < 0 && vb > 0) || (va > 0 && vb < 0)) {
      const t = va / (va - vb)
      return a.y + t * (b.y - a.y)
    }
  }
  const vals = withY.map((p) => Number(p.value))
  if (vals.every((v) => v > 0)) return Math.max(...withY.map((p) => p.y)) + 1
  if (vals.every((v) => v < 0)) return Math.min(...withY.map((p) => p.y)) - 1
  return (Math.min(...withY.map((p) => p.y)) + Math.max(...withY.map((p) => p.y))) / 2
}

function DeltaZeroSplitCurve({
  clipIdBase,
  ...props
}: CurveProps & { clipIdBase: string }) {
  const {
    points,
    type,
    layout,
    connectNulls,
    pathRef,
    clipPath: chartClipPath,
    stroke: _stroke,
    ...curveRest
  } = props

  if (!points?.length) return null

  const y0 = yAtDeltaZero(points)
  const clipAboveId = `${clipIdBase}-above`
  const clipBelowId = `${clipIdBase}-below`

  return (
    <g clipPath={chartClipPath}>
      <defs>
        <clipPath id={clipAboveId}>
          <rect x={-HUGE} y={-HUGE} width={HUGE * 2} height={HUGE + y0} />
        </clipPath>
        <clipPath id={clipBelowId}>
          <rect x={-HUGE} y={y0} width={HUGE * 2} height={HUGE * 2} />
        </clipPath>
      </defs>
      <Curve
        {...curveRest}
        points={points}
        type={type}
        layout={layout}
        connectNulls={connectNulls}
        stroke="var(--color-delta)"
        clipPath={`url(#${clipAboveId})`}
        pathRef={pathRef}
        pointerEvents="none"
      />
      <Curve
        {...curveRest}
        points={points}
        type={type}
        layout={layout}
        connectNulls={connectNulls}
        stroke="var(--color-deltaNegative)"
        clipPath={`url(#${clipBelowId})`}
        pointerEvents="stroke"
      />
    </g>
  )
}

export function BudgetLineChart({
  title,
  data,
}: {
  title: string
  data: ISheetsData[]
}) {
  const [selectedPeriod, setSelectedPeriod] = useState<string | null>(null)
  const splitClipId = useId().replace(/:/g, "")

  const chartData = useMemo(() => buildBudgetPeriodChartData(data), [data])

  const closeModal = () => setSelectedPeriod(null)

  const dotFill = (row: BudgetPeriodRow) =>
    row.delta < 0 ? "var(--color-deltaNegative)" : "var(--color-delta)"

  return (
    <Card className="flex flex-col gap-3">
      <CardHeader className="items-center justify-center w-full">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-full w-full">
        <ChartContainer config={chartConfig}>
          <LineChart accessibilityLayer data={chartData} margin={{ left: 0, right: 12, top: 20 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="period"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) =>
                String(v).length > 18 ? `${String(v).slice(0, 16)}…` : String(v)
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={80}
              tick={BudgetDeltaYAxisTick}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  formatter={(value) => (
                    <span className="flex items-baseline gap-1 font-mono font-medium tabular-nums">
                      <DirhamSymbol />
                      {formatDeltaYAxisTick(value)}
                    </span>
                  )}
                />
              }
            />
            <Line
              dataKey="delta"
              name="Delta"
              type="natural"
              stroke="var(--color-delta)"
              strokeWidth={2}
              isAnimationActive={false}
              shape={(curveProps) => (
                <DeltaZeroSplitCurve {...curveProps} clipIdBase={splitClipId} />
              )}
              dot={(props) => (
                <BudgetPeriodClickDot
                  cx={props.cx}
                  cy={props.cy}
                  payload={props.payload as BudgetPeriodRow}
                  fill={dotFill(props.payload as BudgetPeriodRow)}
                  onPickPeriod={setSelectedPeriod}
                />
              )}
              activeDot={(props) => (
                <BudgetPeriodClickDot
                  cx={props.cx}
                  cy={props.cy}
                  r={typeof props.r === "number" ? props.r : 6}
                  payload={props.payload as BudgetPeriodRow}
                  fill={dotFill(props.payload as BudgetPeriodRow)}
                  onPickPeriod={setSelectedPeriod}
                />
              )}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      <BudgetPeriodDetailsModal
        open={selectedPeriod != null}
        period={selectedPeriod}
        variant="delta"
        rows={data}
        onClose={closeModal}
      />
    </Card>
  )
}
