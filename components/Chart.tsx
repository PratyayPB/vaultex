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
  const percentage = used && calculatePercentage(used)
    ? calculatePercentage(used).toString().replace(/^0+/, "")
    : "0";

  return (
    <Card className="chart w-full rounded-2xl bg-brand text-white shadow-drop-2 p-4 xs:p-5 sm:p-6 border-none flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center justify-between gap-4">
      <CardContent className="p-0 flex items-center justify-center w-full sm:w-1/2 lg:w-full xl:w-1/2">
        <div className="w-full max-w-[200px] xs:max-w-[220px] h-[180px] xs:h-[200px] flex items-center justify-center">
          <ChartContainer
            config={chartConfig}
            className="chart-container w-full h-full [&_.recharts-radial-bar-background-sector]:!fill-white/20 [&_.recharts-radial-bar-sector]:!fill-white"
          >
            <RadialBarChart
              data={chartData}
              startAngle={90}
              endAngle={Number(calculatePercentage(used)) + 90}
              innerRadius={70}
              outerRadius={105}
            >
              <PolarGrid
                gridType="circle"
                radialLines={false}
                stroke="rgba(255, 255, 255, 0.2)"
                className="polar-grid"
                polarRadius={[78, 65]}
              />
              <RadialBar
                dataKey="storage"
                background={{ fill: "rgba(255, 255, 255, 0.2)" }}
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
                            className="chart-total-percentage font-bold text-xl xs:text-2xl fill-white"
                          >
                            {percentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 20}
                            className="fill-white/80 font-medium text-xs xs:text-sm"
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
      <CardHeader className="chart-details p-0 flex flex-col items-center sm:items-start lg:items-center xl:items-start text-center sm:text-left lg:text-center xl:text-left">
        <CardTitle className="chart-title text-sm xs:text-base text-white/80 font-medium">
          Available Storage
        </CardTitle>
        <CardDescription className="chart-description text-xl xs:text-2xl sm:text-3xl font-bold text-white mt-1">
          {used ? convertFileSize(used) : "0 Bytes"} / 2GB
        </CardDescription>
        <p className="caption text-white/70 mt-1 text-xs">
          2GB Free Storage Tier
        </p>
      </CardHeader>
    </Card>
  );
};
