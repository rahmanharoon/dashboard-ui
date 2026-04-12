"use client"

import type { Formatter } from "recharts/types/component/DefaultTooltipContent"
import { Pie, PieChart, type PieSectorDataItem } from "recharts"

import { ChartIcon } from "@/components/charts/chart-icon"
import { ChartLegendCarousel } from "@/components/charts/chart-legend-carousel"
import { DirhamSymbol } from "@/components/dirham-symbol"
import { SpendingGroupDetailsModal } from "@/components/modals/spending-group-details-modal"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { ISheetsData } from "@/interfaces/app.interface"
import { FALLBACK_CHART_COLORS } from "@/lib/constants"
import { cn } from "@/lib/utils"
import { memo, useCallback, useMemo, useState, type CSSProperties } from "react"

const GROUP_FIELD_OWNER = "Owner" as const

const aedAmountFormatter = new Intl.NumberFormat("en-AE", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
})

type PieDatum = {
    owner: string
    value: number
    fill: string
}

type SpendingSelection = {
    name: string
    otherNames: string[] | null
}

const ChartPieDonutActive = ({ title, data }: { title: string; data: ISheetsData[] }) => {
    const [selection, setSelection] = useState<SpendingSelection | null>(null)

    const chartData = useMemo((): PieDatum[] => {
        if (!data?.length) return []
        const ownerSpend = data.reduce((acc: Record<string, number>, item: ISheetsData) => {
            const owner = item["Owner"]
            const value = item["Actual_Budget_AED"]
            if (owner) {
                acc[owner] = (acc[owner] ?? 0) + Number(value)
            }
            return acc
        }, {} as Record<string, number>)
        return Object.entries(ownerSpend).map(([owner, value], i) => ({
            owner,
            value,
            fill: FALLBACK_CHART_COLORS[i % FALLBACK_CHART_COLORS.length],
        }))
    }, [data])

    const chartConfig = useMemo((): ChartConfig => {
        const config: ChartConfig = {}
        for (const item of chartData) {
            config[item.owner] = {
                label: item.owner,
                color: item.fill,
            }
        }
        return config
    }, [chartData])

    const tooltipFormatter = useCallback<Formatter>(
        (value, name, item) => {
            const num =
                typeof value === "number"
                    ? value
                    : value === undefined
                        ? NaN
                        : Array.isArray(value)
                            ? Number(value[0])
                            : Number(String(value).replace(/,/g, ""))
            const amount =
                Number.isFinite(num) ? aedAmountFormatter.format(num) : String(value ?? "")
            const owner =
                (item.payload as PieDatum | undefined)?.owner ??
                (name !== undefined ? String(name) : "")
            const indicatorColor =
                (item.payload as PieDatum | undefined)?.fill ?? item.color

            return (
                <>
                    <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)"
                        style={
                            {
                                "--color-bg": indicatorColor,
                                "--color-border": indicatorColor,
                            } as CSSProperties
                        }
                    />
                    <div className="flex flex-1 justify-between gap-2 leading-none">
                        <span className="text-muted-foreground">{owner}</span>
                        <DirhamSymbol
                            className={cn(
                                "shrink-0 font-mono font-medium text-foreground tabular-nums"
                            )}
                        >
                            {amount}
                        </DirhamSymbol>
                    </div>
                </>
            )
        },
        []
    )

    const onPieClick = (sector: PieSectorDataItem) => {
        const payload = sector.payload as PieDatum | undefined
        const owner =
            payload?.owner ??
            (sector.name != null ? String(sector.name) : null)
        if (!owner) return
        setSelection({ name: owner, otherNames: null })
    }

    const closeModal = () => setSelection(null)

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center justify-center">
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer
                    config={chartConfig}
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    hideLabel
                                    formatter={tooltipFormatter}
                                />
                            }
                        />
                        <Pie
                            data={chartData}
                            dataKey="value"
                            nameKey="owner"
                            stroke="0"
                            cursor="pointer"
                            onClick={onPieClick}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <ChartLegendCarousel
                    className="w-full"
                    items={chartData}
                    getKey={(item) => item.owner}
                    renderItem={(item) => {
                        return (
                            <ChartIcon
                                title={item.owner}
                                color={item.fill}
                                onCardClick={() =>
                                    setSelection({
                                        name: item.owner,
                                        otherNames: null,
                                    })
                                }
                            />
                        )
                    }}
                />
            </CardFooter>
            <SpendingGroupDetailsModal
                open={selection != null}
                groupField={GROUP_FIELD_OWNER}
                groupLabel={selection?.name ?? null}
                otherMemberNames={selection?.otherNames ?? null}
                rows={data}
                onClose={closeModal}
            />
        </Card>
    )
}

export default memo(ChartPieDonutActive)
