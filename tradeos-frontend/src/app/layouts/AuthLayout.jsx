import { motion } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import { DollarSign } from "lucide-react";

const tickers = [
  { symbol: "BTC/USD", change: "+2.41", side: "buy" },
  { symbol: "ETH/USD", change: "-1.18", side: "sell" },
  { symbol: "XAU/USD", change: "+0.51", side: "buy" },
  { symbol: "XAG/USD", change: "+1.35", side: "buy" },
  { symbol: "AAPL", change: "+0.83", side: "buy" },
  { symbol: "TSLA", change: "-3.12", side: "sell" },
  { symbol: "NVDA", change: "+5.67", side: "buy" },
  { symbol: "AMZN", change: "-0.92", side: "sell" },
  { symbol: "EUR/USD", change: "-0.27", side: "sell" },
  { symbol: "GBP/JPY", change: "+0.64", side: "buy" },
];

function generateCandle(i) {
  const dir = i % 3 === 0 ? "down" : "up";
  const bodyRange = 28 + ((i * 7) % 50);
  const wickExtra = 14 + ((i * 3) % 26);
  const baseBottom = 12 + ((i * 11) % 42);
  return {
    left: `${(i * 6.8) + 1.2}%`,
    width: 6 + (i % 3) * 3,
    bodyH: bodyRange,
    bodyBottom: baseBottom,
    wickHigh: bodyRange + wickExtra,
    wickLow: 10 + ((i * 5) % 18),
    dir,
  };
}

function Candle({ candle, delay }) {
  const isUp = candle.dir === "up";
  const color = isUp
    ? "hsla(152, 75%, 50%, 0.40)"
    : "hsla(0, 75%, 55%, 0.35)";
  const glowColor = isUp
    ? "rgba(52, 211, 153, 0.15)"
    : "rgba(248, 113, 113, 0.12)";

  return (
    <div className="absolute" style={{ left: candle.left, bottom: 0 }}>
      <div
        className="absolute left-1/2 w-[1.5px] -translate-x-1/2 origin-bottom"
        style={{
          background: color,
          bottom: candle.bodyBottom,
          height: candle.wickHigh,
          transition: "height 2.2s cubic-bezier(0.22, 1, 0.36, 1), bottom 2.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <div
        className="absolute left-1/2 w-[1.5px] -translate-x-1/2"
        style={{
          background: color,
          bottom: Math.max(0, candle.bodyBottom - candle.wickLow),
          height: candle.wickLow,
          transition: "height 2.2s cubic-bezier(0.22, 1, 0.36, 1), bottom 2.2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[1.5px]"
        style={{
          width: candle.width,
          background: `linear-gradient(180deg, ${color}, ${glowColor})`,
          boxShadow: `0 0 18px ${glowColor}, 0 0 36px ${glowColor}`,
          bottom: candle.bodyBottom,
          height: candle.bodyH,
          transform: "translateZ(0)",
          transition: "height 2.2s cubic-bezier(0.22, 1, 0.36, 1), bottom 2.2s cubic-bezier(0.22, 1, 0.36, 1), background 1.2s ease, box-shadow 1.2s ease",
          animation: `candle-flicker ${3 + (delay % 3)}s ease-in-out ${delay * 0.4}s infinite`,
        }}
      />
    </div>
  );
}

function LivePriceLabel({ value, isUp }) {
  const prevRef = useRef(value);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prevRef.current !== value) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 400);
      prevRef.current = value;
      return () => clearTimeout(t);
    }
  }, [value]);

  return (
    <span
      className={`transition-colors duration-300 ${
        flash
          ? isUp
            ? "text-emerald-400/90"
            : "text-red-400/90"
          : isUp
            ? "text-emerald-400/60"
            : "text-red-400/60"
      }`}
    >
      {isUp ? "▲" : "▼"} {value}%
    </span>
  );
}

function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: 80 }, () => ({
      left: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2.5,
      delay: Math.random() * 10,
      duration: 10 + Math.random() * 20,
      opacity: 0.1 + Math.random() * 0.3,
      drift: (Math.random() - 0.5) * 40,
    })),
  []);
  return particles.map((p, i) => (
    <div
      key={i}
      className="absolute rounded-full"
      style={{
        left: p.left,
        bottom: "-4px",
        width: p.size,
        height: p.size,
        opacity: p.opacity,
        background: i % 5 === 0 ? "rgba(147, 197, 253, 0.6)" : "rgba(255, 255, 255, 0.4)",
        boxShadow: i % 5 === 0 ? "0 0 4px rgba(147, 197, 253, 0.4)" : "none",
        animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
        willChange: "transform, opacity",
      }}
    />
  ));
}

function GridDots() {
  const rows = [20, 35, 50, 65, 80];
  const cols = [15, 30, 50, 70, 85];
  return rows.map((r) =>
    cols.map((c) => (
      <div
        key={`${r}-${c}`}
        className="absolute rounded-full"
        style={{
          left: `${c}%`,
          top: `${r}%`,
          width: 2,
          height: 2,
          background: "rgba(255, 255, 255, 0.06)",
          boxShadow: "0 0 4px rgba(59, 130, 246, 0.08)",
        }}
      />
    ))
  );
}

function ChartLine() {
  const pathRef = useRef(null);
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= 100; i++) {
      const x = (i / 100) * 100;
      const y = 55 + Math.sin(i * 0.15) * 18 + Math.sin(i * 0.08) * 10 + Math.cos(i * 0.04) * 8;
      pts.push({ x, y });
    }
    return pts;
  }, []);

  const pathD = useMemo(() => {
    return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
  }, [points]);

  const fillPath = useMemo(() => {
    const top = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");
    return `${top} L 100 80 L 0 80 Z`;
  }, [points]);

  return (
    <svg
      className="pointer-events-none absolute inset-0"
      viewBox="0 0 100 80"
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%" }}
    >
      <defs>
        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.08)" />
          <stop offset="100%" stopColor="rgba(59, 130, 246, 0)" />
        </linearGradient>
      </defs>
      <path
        ref={pathRef}
        d={fillPath}
        fill="url(#chartFill)"
        className="opacity-60"
      />
      <path
        d={pathD}
        fill="none"
        stroke="rgba(59, 130, 246, 0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="opacity-70"
        style={{
          filter: "drop-shadow(0 0 6px rgba(59, 130, 246, 0.2))",
          animation: "chart-draw 3s ease-out forwards",
          strokeDasharray: 400,
          strokeDashoffset: 400,
        }}
      />
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="2"
        fill="rgba(59, 130, 246, 0.4)"
        style={{
          animation: "chart-pulse 2s ease-in-out infinite",
        }}
      />
    </svg>
  );
}

export default function AuthLayout({ children }) {

  const [candles, setCandles] = useState(() =>
    Array.from({ length: 14 }, (_, i) => generateCandle(i))
  );

  const [livePrices, setLivePrices] = useState(() =>
    tickers.map((t) => ({
      symbol: t.symbol,
      change: t.change,
      side: t.side,
      id: Math.random(),
    }))
  );

  const intervalRef = useRef(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCandles((prev) =>
        prev.map((c, i) => {
          const movement = (Math.random() - 0.5) * 14;
          const newBodyH = Math.max(10, Math.min(100, c.bodyH + movement));
          const newBodyBottom = c.dir === "up"
            ? c.bodyBottom - movement * 0.3
            : c.bodyBottom + movement * 0.3;
          const clampedBottom = Math.max(5, Math.min(60, newBodyBottom));

          let dir = c.dir;
          if (Math.random() < 0.04) {
            dir = dir === "up" ? "down" : "up";
          }

          return {
            ...c,
            bodyH: newBodyH,
            bodyBottom: clampedBottom,
            wickHigh: newBodyH + (10 + ((i * 5) % 18)),
            wickLow: 10 + ((i * 5) % 18),
            dir,
          };
        })
      );

      setLivePrices((prev) =>
        prev.map((p) => {
          const delta = (Math.random() - 0.5) * 0.6;
          const newChange = (parseFloat(p.change) + delta).toFixed(2);
          let side = p.side;
          if (Math.random() < 0.03) {
            side = side === "buy" ? "sell" : "buy";
          }
          return { ...p, change: newChange, side, id: Math.random() };
        })
      );
    }, 2200);

    return () => clearInterval(intervalRef.current);
  }, []);

  const tickerTape = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => {
        const t = livePrices[i % livePrices.length];
        const isUp = t.side === "buy";
        return (
          <span
            key={t.id}
            className="inline-flex items-center gap-1.5 mr-8 text-xs font-mono font-medium whitespace-nowrap"
          >
            <span className="text-white/40">{t.symbol}</span>
            <span className={isUp ? "text-emerald-400/60" : "text-red-400/60"}>
              {isUp ? "▲" : "▼"} {t.change}%
            </span>
          </span>
        );
      }),
    [livePrices]
  );

  const badgeLabels = [
    "Momentum ▲", "Breakout ▲", "Support ▸",
    "Resistance ▸",
  ];

  const randIn800 = () => ({
    x: 40 + Math.random() * 760,
    y: 40 + Math.random() * 760,
  });

  const [teleporters, setTeleporters] = useState(() =>
    Array.from({ length: badgeLabels.length }, () => ({
      ...randIn800(),
      scale: 0.85 + Math.random() * 0.5,
      opacityBase: 0.6 + Math.random() * 0.3,
    }))
  );

  useEffect(() => {
    let rafId = null;
    const handleMouse = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = null;
        setTeleporters((prev) =>
          prev.map((t) => {
            const dx = e.clientX - t.x;
            const dy = e.clientY - t.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 140) {
              return { ...t, ...randIn800(), scale: 0.85 + Math.random() * 0.5 };
            }
            return t;
          })
        );
      });
    };
    window.addEventListener("mousemove", handleMouse, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const [btcPrice, setBtcPrice] = useState(45832.60);
  useEffect(() => {
    const interval = setInterval(() => {
      setBtcPrice((prev) => {
        const delta = (Math.random() - 0.5) * 120;
        return Math.max(40000, Math.min(50000, +(prev + delta).toFixed(2)));
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const priceLabels = useMemo(() => {
    const base = btcPrice;
    return [
      (base + 2800).toFixed(2),
      (base + 800).toFixed(2),
      (base - 1200).toFixed(2),
      (base - 3200).toFixed(2),
    ];
  }, [btcPrice]);

  return (
    <div className="relative flex min-h-screen overflow-hidden" style={{ background: "#05080f" }}>

      {/* Deep gradient base */}
      <div className="absolute inset-0 z-0"
        style={{
          background: "radial-gradient(ellipse at 20% 50%, rgba(20, 40, 80, 0.4) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(10, 50, 40, 0.2) 0%, transparent 50%), radial-gradient(ellipse at 50% 80%, rgba(30, 10, 60, 0.15) 0%, transparent 50%)"
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute rounded-full"
          style={{
            width: "650px", height: "650px",
            background: "radial-gradient(circle, rgba(59,130,246,0.2) 0%, transparent 65%)",
            top: "-12%", left: "-8%",
            animation: "blob-drift1 22s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "500px", height: "500px",
            background: "radial-gradient(circle, rgba(20,184,166,0.15) 0%, transparent 65%)",
            bottom: "0%", right: "5%",
            animation: "blob-drift2 26s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "420px", height: "420px",
            background: "radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 65%)",
            top: "35%", right: "25%",
            animation: "blob-drift3 20s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "350px", height: "350px",
            background: "radial-gradient(circle, rgba(251,146,60,0.08) 0%, transparent 65%)",
            top: "55%", left: "15%",
            animation: "blob-drift4 24s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: "300px", height: "300px",
            background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, transparent 65%)",
            top: "10%", right: "10%",
            animation: "blob-drift2 28s ease-in-out infinite reverse",
            willChange: "transform",
          }}
        />
      </div>

      {/* Scan line overlay */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Noise texture */}
      <div className="absolute inset-0 z-[1] opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 z-[2] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, transparent 35%, #05080f 100%)" }}
      />

      {/* Full-screen trading visuals */}
      <div className="absolute inset-0 z-[3]">

        {/* Side fade */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#05080f] via-transparent to-[#05080f]" />

        {/* Chart line overlay */}
        <div className="absolute inset-0 opacity-40" style={{ top: "5%", bottom: "20%" }}>
          <ChartLine />
        </div>

        {/* Grid with glowing intersections */}
        <div className="pointer-events-none absolute inset-0">
          {[20, 35, 50, 65, 80].map((pct) => (
            <div
              key={pct}
              className="absolute inset-x-0 border-t"
              style={{ top: `${pct}%`, borderColor: "rgba(255,255,255,0.035)" }}
            />
          ))}
          <GridDots />
        </div>

        {/* Candles */}
        <div className="pointer-events-none absolute inset-x-[5%] bottom-[15%] top-[8%]">
          {candles.map((candle, i) => (
            <Candle key={i} candle={candle} delay={i + 1} />
          ))}
        </div>

        {/* Particles */}
        <ParticleField />

        {/* Floating tickers */}
        <div className="absolute left-[6%] top-[16%] text-xs font-mono font-medium">
          <LivePriceLabel value={livePrices[0]?.change || "0.00"} isUp={livePrices[0]?.side === "buy"} />
        </div>
        <div className="absolute right-[12%] top-[22%] text-xs font-mono font-medium">
          <LivePriceLabel value={livePrices[1]?.change || "0.00"} isUp={livePrices[1]?.side === "buy"} />
        </div>

        {/* Price axis */}
        <div className="pointer-events-none absolute bottom-[15%] left-3 flex flex-col justify-between text-[10px] font-mono text-white/[0.15]"
          style={{ top: "8%" }}
        >
          {priceLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        {/* Ticker tape */}
        <div className="absolute bottom-0 inset-x-0 h-10 overflow-hidden border-t border-white/[0.05] backdrop-blur-md"
          style={{ background: "rgba(5, 8, 15, 0.6)" }}
        >
          <div
            className="flex h-full w-max items-center"
            style={{ animation: "ticker-scroll 30s linear infinite" }}
          >
            <div className="flex items-center">{tickerTape}</div>
            <div className="flex items-center">{tickerTape}</div>
          </div>
        </div>
      </div>

      {/* Teleporting badges */}
      {teleporters.map((t, i) => {
        const isUp = badgeLabels[i].includes("▲") || badgeLabels[i].includes("▸");
        return (
          <div
            key={i}
            className="pointer-events-none absolute z-[6] whitespace-nowrap rounded-full border-2 px-4 py-1.5 text-xs font-bold font-mono uppercase tracking-wider backdrop-blur-md"
            style={{
              left: t.x,
              top: t.y,
              borderColor: isUp ? "hsla(152, 75%, 45%, 0.3)" : "hsla(0, 75%, 50%, 0.3)",
              background: isUp
                ? "hsla(152, 75%, 45%, 0.06)"
                : "hsla(0, 75%, 50%, 0.06)",
              color: isUp
                ? "hsla(152, 75%, 60%, 0.8)"
                : "hsla(0, 75%, 60%, 0.8)",
            }}
          >
            {badgeLabels[i]}
          </div>
        );
      })}

      {/* Center — Welcome & Market Stats */}
      <div className="pointer-events-none absolute inset-y-0 z-[5] hidden items-center lg:flex" style={{ left: "10%" }}>
        <div className="text-left max-w-md">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="text-5xl font-black tracking-tight"
            style={{
              background: "linear-gradient(135deg, rgba(147,197,253,1) 0%, rgba(96,165,250,1) 50%, rgba(147,197,253,1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 40px rgba(59,130,246,0.3))",
            }}
          >
            Trade Smarter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 text-lg font-medium text-white/40"
          >
            AI-driven insights — real-time discipline — consistent returns
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 flex items-center gap-14"
          >
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white/60">$4.2</span>
                <span className="text-sm font-medium text-white/30">T</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/25">Volume 24h</div>
            </div>
            <div className="h-8 w-px bg-white/[0.06]" />
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400/60">+12.4</span>
                <span className="text-sm font-medium text-emerald-400/30">%</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/25">Market Cap</div>
            </div>
            <div className="h-8 w-px bg-white/[0.06]" />
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white/60">2,847</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/25">Assets</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-10 sm:max-w-md lg:ml-auto lg:mr-10 lg:max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full relative"
        >
          {/* Animated border glow */}
          <div
            className="absolute -inset-[1px] rounded-2xl opacity-60"
            style={{
              background: "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(20,184,166,0.1), rgba(139,92,246,0.1), rgba(59,130,246,0.2))",
              backgroundSize: "300% 300%",
              animation: "border-rotate 8s ease-in-out infinite",
              filter: "blur(1px)",
            }}
          />

          <div className="relative rounded-2xl border border-white/[0.06] backdrop-blur-2xl p-8 shadow-2xl lg:p-10"
            style={{ background: "rgba(10, 15, 30, 0.92)" }}
          >
            {/* Logo */}
            <div className="mb-8 flex flex-col items-center">
              <div
                className="flex h-14 w-14 items-center justify-center rounded-2xl text-xl font-black text-white"
                style={{
                  background: "linear-gradient(135deg, rgba(37,99,235,1), rgba(59,130,246,1))",
                  boxShadow: "0 0 40px rgba(37,99,235,0.25), 0 0 80px rgba(37,99,235,0.1)",
                }}
              >
                <DollarSign size={24} />
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-white/90">
                TradeOS
              </h1>
              <p className="mt-1.5 text-sm text-white/40">
                Professional Trading Workspace
              </p>
            </div>

            {children}
          </div>
        </motion.div>
      </div>

    </div>
  );
}
