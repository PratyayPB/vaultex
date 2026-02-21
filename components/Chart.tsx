"use client";

import React from "react";
import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChartConfig, ChartContainer } from "./ui/chart";
import { convertFileSize, calculatePercentage } from "@/lib/utils";

const chartConfig = {
  size: {
    label: "Size",
  },
  used: {
    label: "Used",
    color: "white",
  },
} satisfies ChartConfig;

export const Chart = ({ used = 0 }: { used: number }) => {
  const chartData = [{ storage: "used", 10: used, fill: "white" }];

  return (
    <Card className="chart max-w-full  rounded-2xl bg-brand-100   max-h-90 h-90 flex flex-col items-center pb-19">
      <CardContent className="flex-1 p-0  items-center justify-center rounded-t-2xl">
        <div className=" w-full h-60 flex items-center justify-center ">
          <ChartContainer
            config={chartConfig}
            className="
    chart-container
    w-full h-full
    [&_.recharts-radial-bar-background-sector]:!fill-gray-200
    [&_.recharts-radial-bar-sector]:!fill-indigo-600
  "
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={Number(calculatePercentage(used)) + 90}
              innerRadius={86}
              outerRadius={140}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="hsl(0, 83%, 90.5%)"
                className="polar-grid"
                polarRadius={[96, 75.7]}
              />
              <RadialBar
                dataKey="storage"
                background={{ fill: "transparent" }}
                cornerRadius={10}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="chart-total-percentage font-bold text-xl fill-white/90"
                          >
                            {used && calculatePercentage(used)
                              ? calculatePercentage(used)
                                  .toString()
                                  .replace(/^0+/, "")
                              : "0"}
                            %
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-white/90 font-semibold"
                          >
                            Space used
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
            </RadialBarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardHeader className="chart-details flex flex-col items-center">
        <CardTitle className="chart-title text-xl text-gray-100 font-medium">
          Storage Used
        </CardTitle>
        <CardDescription className="chart-description text-2xl font-bold text-white">
          {used ? convertFileSize(used) : "2GB"} / 2GB
        </CardDescription>
      </CardHeader>
    </Card>
  );
};
