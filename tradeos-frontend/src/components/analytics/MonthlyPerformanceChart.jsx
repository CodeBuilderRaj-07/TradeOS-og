import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from "recharts";

export default function MonthlyPerformanceChart({
  data,
}) {

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <div className="mb-6">

        <h3 className="text-lg font-bold text-white">

          Monthly Performance

        </h3>

        <p className="mt-1 text-sm text-zinc-500">

          Real backend trading analytics

        </p>

      </div>

      <div className="h-[320px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <AreaChart data={data}>

            <defs>

              <linearGradient
                id="growth"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >

                <stop
                  offset="0%"
                  stopColor="#22C55E"
                  stopOpacity={0.4}
                />

                <stop
                  offset="100%"
                  stopColor="#22C55E"
                  stopOpacity={0}
                />

              </linearGradient>

            </defs>

            <XAxis
              dataKey="month"
              tick={{
                fill: "#71717A",
                fontSize: 11,
              }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="pnl"
              stroke="#22C55E"
              strokeWidth={3}
              fill="url(#growth)"
            />

          </AreaChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}