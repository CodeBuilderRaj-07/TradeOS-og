import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

import LegendItem
  from "./LegendItem";

const COLORS = [
  "#22C55E",
  "#EF4444",
];

export default function WinRatioChart({
  pieData,
}) {

  return (

    <div className="<GlassPanel /> p-6 backdrop-blur-2xl">

      <div className="mb-6">

        <h3 className="text-lg font-bold text-white">

          Win Ratio

        </h3>

        <p className="mt-1 text-sm text-zinc-500">

          Real trade distribution

        </p>

      </div>

      <div className="h-[260px] w-full">

        <ResponsiveContainer
          width="100%"
          height="100%"
        >

          <PieChart>

            <Pie
              data={pieData}
              innerRadius={70}
              outerRadius={100}
              paddingAngle={4}
              dataKey="value"
            >

              {pieData.map(
                (entry, index) => (

                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />

                )
              )}

            </Pie>

            <Tooltip />

          </PieChart>

        </ResponsiveContainer>

      </div>

      <div className="mt-4 flex justify-center gap-6">

        <LegendItem
          color="#22C55E"
          title="Winning"
        />

        <LegendItem
          color="#EF4444"
          title="Losing"
        />

      </div>

    </div>
  );
}