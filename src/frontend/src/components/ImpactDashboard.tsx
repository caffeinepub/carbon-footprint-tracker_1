import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "motion/react";
import {
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { TransportMode, type Trip } from "../backend";

interface ImpactDashboardProps {
  trips: Trip[];
}

const MODE_COLORS: Record<TransportMode, string> = {
  [TransportMode.car]: "#ef4444",
  [TransportMode.bus]: "#f97316",
  [TransportMode.train]: "#3b82f6",
  [TransportMode.bicycle]: "#22c55e",
  [TransportMode.walk]: "#14b8a6",
  [TransportMode.plane]: "#8b5cf6",
};

const MODE_LABELS: Record<TransportMode, string> = {
  [TransportMode.car]: "Car",
  [TransportMode.bus]: "Bus",
  [TransportMode.train]: "Metro/Train",
  [TransportMode.bicycle]: "Bicycle",
  [TransportMode.walk]: "Walk",
  [TransportMode.plane]: "Plane",
};

export default function ImpactDashboard({ trips }: ImpactDashboardProps) {
  const lineData = trips
    .slice()
    .sort((a, b) => Number(a.timestamp) - Number(b.timestamp))
    .map((t, i) => ({
      name: `Trip ${i + 1}`,
      co2: Number.parseFloat((t.co2Grams / 1000).toFixed(2)),
      mode: MODE_LABELS[t.transportMode],
    }));

  const modeMap: Record<string, number> = {};
  for (const t of trips) {
    const key = t.transportMode;
    modeMap[key] = (modeMap[key] || 0) + t.co2Grams;
  }
  const pieData = Object.entries(modeMap).map(([mode, grams]) => ({
    name: MODE_LABELS[mode as TransportMode],
    value: Number.parseFloat((grams / 1000).toFixed(2)),
    color: MODE_COLORS[mode as TransportMode],
  }));

  const hasData = trips.length > 0;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="shadow-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-eco-navy font-display">
              CO₂ Per Trip Over Time
            </CardTitle>
            <p className="text-xs text-muted-foreground">
              kg CO₂ emitted per trip
            </p>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart
                  data={lineData}
                  margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                >
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    unit=" kg"
                    width={45}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                    formatter={(val: number) => [`${val} kg CO₂`, "Emissions"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="co2"
                    stroke="#23a455"
                    strokeWidth={2.5}
                    dot={{ r: 4, fill: "#23a455", strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Log trips to see your CO₂ trend" />
            )}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-card border border-border rounded-xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg text-eco-navy font-display">
              Emissions by Transport Mode
            </CardTitle>
            <p className="text-xs text-muted-foreground">Total CO₂ breakdown</p>
          </CardHeader>
          <CardContent>
            {hasData ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      borderRadius: 8,
                      border: "1px solid #e2e8f0",
                      fontSize: 12,
                    }}
                    formatter={(val: number) => [`${val} kg CO₂`, "Emissions"]}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart message="Log trips to see mode breakdown" />
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function EmptyChart({ message }: { message: string }) {
  return (
    <div className="h-[220px] flex flex-col items-center justify-center text-center">
      <p className="text-4xl mb-3">📊</p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
