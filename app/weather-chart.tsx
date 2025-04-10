"use client";

import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import {
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import type { SensorReadings } from "./utils/data-utils";

interface WeatherChartProps {
	data: SensorReadings[];
}

export function WeatherChart({ data }: WeatherChartProps) {
	return (
		<ChartContainer
			config={{
				temperature: {
					label: "Temperature (°C)",
					color: "hsl(var(--chart-1))",
				},
				humidity: {
					label: "Humidity (%)",
					color: "hsl(var(--chart-2))",
				},
			}}
			className="h-full"
		>
			<ResponsiveContainer width="100%" height="100%">
				<LineChart
					data={data}
					margin={{
						top: 10,
						right: 10,
						left: 10,
						bottom: 20,
					}}
				>
					<XAxis
						dataKey="time"
						tickLine={false}
						axisLine={false}
						tickMargin={10}
					/>
					<YAxis
						yAxisId="temperature"
						domain={[15, 30]}
						tickLine={false}
						axisLine={false}
						tickMargin={10}
					/>
					<YAxis
						yAxisId="humidity"
						orientation="right"
						domain={[30, 70]}
						tickLine={false}
						axisLine={false}
						tickMargin={10}
					/>
					<Tooltip
						content={({ active, payload }) => {
							if (active && payload && payload.length) {
								const { timestamp, temperature, humidity } = payload[0].payload;
								return (
									<div className="p-2 bg-white shadow rounded">
										<p className="text-sm text-gray-700">
											Time: {new Date(timestamp).toLocaleTimeString()}
										</p>
										<p className="text-sm text-gray-700">
											Temperature: {temperature}°C
										</p>
										<p className="text-sm text-gray-700">
											Humidity: {humidity}%
										</p>
										<p className="text-sm text-gray-700">
											Alert: {payload[0].payload.alert ? "Yes" : "No"}
										</p>
									</div>
								);
							}
							return null;
						}}
					/>
					<Line
						yAxisId="temperature"
						type="monotone"
						dataKey="temperature"
						strokeWidth={2}
						activeDot={{ r: 6 }}
						stroke="var(--color-temperature)"
					/>
					<Line
						yAxisId="humidity"
						type="monotone"
						dataKey="humidity"
						strokeWidth={2}
						activeDot={{ r: 6 }}
						stroke="var(--color-humidity)"
					/>
				</LineChart>
			</ResponsiveContainer>
		</ChartContainer>
	);
}
