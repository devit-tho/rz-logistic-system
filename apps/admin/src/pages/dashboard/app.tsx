import { useCargos, useCustomers, useShipments } from "@/api";
import { useTruckings } from "@/api/trucking-management";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import config from "@/config";
import { useIsMobile } from "@/hooks/use-mobile";
import { format, isSameDay } from "date-fns";
import { TrendingUpIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  shipments: {
    label: "Shipments",
    color: "#347433",
  },
  cargos: {
    label: "Cargos",
    color: "#00809D",
  },
  truckings: {
    label: "Truckings",
    color: "#00CAFF",
  },
  customers: {
    label: "Customers",
    color: "#FF6F3C",
  },
} satisfies ChartConfig;

const options = [
  { value: "90d", label: "Last 3 months" },
  { value: "30d", label: "Last 30 days" },
  { value: "7d", label: "Last 7 days" },
];

function AppPage() {
  const { shipmentsData, shipmentsLoading } = useShipments();
  const { cargosData, cargosLoading } = useCargos();
  const { truckingsData, truckingsLoading } = useTruckings();
  const { customersData, customersLoading } = useCustomers();

  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredDatas = useMemo(() => {
    const allDates = [
      ...shipmentsData.map((d) => d.createdAt),
      ...cargosData.map((d) => d.createdAt),
      ...truckingsData.map((d) => d.createdAt),
      ...customersData.map((d) => d.createdAt),
    ].map((d) => format(new Date(d), "yyyy-MM-dd"));

    const uniqueDates = [...new Set(allDates)].map((d) => new Date(d));

    const summaryDatas = uniqueDates.map((date) => ({
      date: format(date, "yyyy-MM-dd"),
      shipments: shipmentsData.filter((d) => isSameDay(d.createdAt, date))
        .length,
      cargos: cargosData.filter((d) => isSameDay(d.createdAt, date)).length,
      truckings: truckingsData.filter((d) => isSameDay(d.createdAt, date))
        .length,
      customers: customersData.filter((d) => isSameDay(d.createdAt, date))
        .length,
    }));

    return summaryDatas.filter((item) => {
      const date = new Date(item.date);
      const referenceDate = new Date();
      let daysToSubtract = 90;
      if (timeRange === "30d") {
        daysToSubtract = 30;
      } else if (timeRange === "7d") {
        daysToSubtract = 7;
      }
      const startDate = new Date(referenceDate);
      startDate.setDate(startDate.getDate() - daysToSubtract);
      return date >= startDate;
    });
  }, [
    shipmentsLoading,
    cargosLoading,
    truckingsLoading,
    customersLoading,
    timeRange,
  ]);

  const totalDatas = useMemo(
    () => [
      {
        title: "Total Shipments",
        value: shipmentsData.length,
        loading: shipmentsLoading,
        description:
          "Overview of all shipments handled in the current period, including completed and upcoming deliveries.",
        status: "Expected to increase due to upcoming orders",
      },
      {
        title: "Total Cargos",
        value: cargosData.length,
        loading: cargosLoading,
        description:
          "All cargo units scheduled and processed, both inbound and outbound over recent months.",
        status: "Stable, with moderate incoming loads",
      },
      {
        title: "Total Truckings",
        value: truckingsData.length,
        loading: truckingsLoading,
        description:
          "Total trucking jobs dispatched or planned, covering both local and long-distance logistics.",
        status: "Trending upward with new contracts",
      },
      {
        title: "Total Customers",
        value: customersData.length,
        loading: customersLoading,
        description:
          "Active and registered customers engaging with shipments, cargo, or trucking services.",
        status: "Growing customer base",
      },
    ],
    [shipmentsLoading, cargosLoading, truckingsLoading, customersLoading],
  );

  const showCharts =
    !shipmentsLoading &&
    !cargosLoading &&
    !truckingsLoading &&
    !customersLoading;

  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
              {totalDatas.map((data, index) => (
                <Card key={index} className="@container/card">
                  <CardHeader className="relative">
                    <CardDescription>{data.title}</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                      {data.loading ? "Loading..." : data.value}
                    </CardTitle>
                  </CardHeader>
                  <CardFooter className="flex-col items-start gap-1 text-sm">
                    <div className="line-clamp-1 flex gap-2 font-medium">
                      {data.status} <TrendingUpIcon className="size-4" />
                    </div>
                    <div className="text-muted-foreground">
                      {data.description}
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>

            <div className="px-4 lg:px-6">
              {showCharts && (
                <Card className="@container/card">
                  <CardHeader className="relative">
                    <CardTitle>Total Summary</CardTitle>
                    <CardDescription>
                      <span className="hidden @[540px]/card:block">
                        Total for the last 3 months
                      </span>
                      <span className="@[540px]/card:hidden">
                        Last 3 months
                      </span>
                    </CardDescription>
                    <div className="absolute top-4 right-4">
                      <ToggleGroup
                        type="single"
                        value={timeRange}
                        onValueChange={setTimeRange}
                        variant="outline"
                        className="hidden @[767px]/card:flex"
                      >
                        {options.map((option) => (
                          <ToggleGroupItem
                            key={option.value}
                            value={option.value}
                            className="h-8 px-2.5"
                          >
                            {option.label}
                          </ToggleGroupItem>
                        ))}
                      </ToggleGroup>
                      <Select value={timeRange} onValueChange={setTimeRange}>
                        <SelectTrigger
                          className="flex w-40 @[767px]/card:hidden"
                          aria-label="Select a value"
                        >
                          <SelectValue placeholder="Last 3 months" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl">
                          {options.map((option) => (
                            <SelectItem
                              key={option.value}
                              value={option.value}
                              className="rounded-lg"
                            >
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-[250px] w-full"
                    >
                      <AreaChart data={filteredDatas}>
                        <defs>
                          <linearGradient
                            id="fillShipments"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-shipments)"
                              stopOpacity={1.0}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-shipments)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="fillCargos"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-cargos)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-cargos)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="fillTruckings"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-truckings)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-truckings)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                          <linearGradient
                            id="fillCustomers"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="var(--color-customers)"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="var(--color-customers)"
                              stopOpacity={0.1}
                            />
                          </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="date"
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          minTickGap={32}
                          tickFormatter={(value) =>
                            format(new Date(value), config.date_format)
                          }
                        />
                        <ChartTooltip
                          cursor={false}
                          defaultIndex={isMobile ? -1 : 10}
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value) =>
                                format(new Date(value), config.date_format)
                              }
                              indicator="dot"
                            />
                          }
                        />
                        <Area
                          dataKey="shipments"
                          type="natural"
                          fill="url(#fillShipments)"
                          stroke="var(--color-shipments)"
                          stackId="a"
                        />
                        <Area
                          dataKey="cargos"
                          type="natural"
                          fill="url(#fillCargos)"
                          stroke="var(--color-cargos)"
                          stackId="b"
                        />
                        <Area
                          dataKey="truckings"
                          type="natural"
                          fill="url(#fillTruckings)"
                          stroke="var(--color-truckings)"
                          stackId="c"
                        />
                        <Area
                          dataKey="customers"
                          type="natural"
                          fill="url(#fillCustomers)"
                          stroke="var(--color-customers)"
                          stackId="d"
                        />
                      </AreaChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppPage;
