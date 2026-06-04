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
  const bodyRange = 25 + ((i * 7) % 55);
  const wickExtra = 12 + ((i * 3) % 28);
  const baseBottom = 10 + ((i * 11) % 45);
  return {
    left: `${(i * 6.8) + 1.2}%`,
    width: 5 + (i % 3) * 3,
    bodyH: bodyRange,
    bodyBottom: baseBottom,
    wickHigh: bodyRange + wickExtra,
    wickLow: 8 + ((i * 5) % 20),
    dir,
  };
}

function Candle({ candle, delay }) {
  const isUp = candle.dir === "up";
  const color = isUp
    ? "hsla(142, 71%, 50%, 0.40)"
    : "hsla(0, 72%, 55%, 0.35)";
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
          transition: "height 2s cubic-bezier(0.22, 1, 0.36, 1), bottom 2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <div
        className="absolute left-1/2 w-[1.5px] -translate-x-1/2"
        style={{
          background: color,
          bottom: Math.max(0, candle.bodyBottom - candle.wickLow),
          height: candle.wickLow,
          transition: "height 2s cubic-bezier(0.22, 1, 0.36, 1), bottom 2s cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      />
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[1.5px]"
        style={{
          width: candle.width,
          background: `linear-gradient(180deg, ${color}, ${glowColor})`,
          boxShadow: `0 0 16px ${glowColor}, 0 0 32px ${glowColor}`,
          bottom: candle.bodyBottom,
          height: candle.bodyH,
          transform: "translateZ(0)",
          transition: "height 2s cubic-bezier(0.22, 1, 0.36, 1), bottom 2s cubic-bezier(0.22, 1, 0.36, 1), background 1.2s ease, box-shadow 1.2s ease",
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
            ? "text-success/80"
            : "text-destructive/80"
          : isUp
            ? "text-success/60"
            : "text-destructive/60"
      }`}
    >
      {isUp ? "▲" : "▼"} {value}%
    </span>
  );
}

const PARTICLES = 40;
function ParticleField() {
  const particles = useMemo(() =>
    Array.from({ length: PARTICLES }, (_, i) => ({
      left: `${Math.random() * 100}%`,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 8,
      duration: 8 + Math.random() * 12,
      opacity: 0.15 + Math.random() * 0.25,
    })),
  []);
  return particles.map((p, i) => (
    <div
      key={i}
      className="absolute rounded-full bg-foreground"
      style={{
        left: p.left,
        bottom: "-4px",
        width: p.size,
        height: p.size,
        opacity: p.opacity,
        animation: `particle-rise ${p.duration}s linear ${p.delay}s infinite`,
        willChange: "transform, opacity",
      }}
    />
  ));
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) =>
        prev.map((c, i) => {
          const movement = (Math.random() - 0.5) * 14;
          const newBodyH = Math.max(8, Math.min(100, c.bodyH + movement));
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
            wickHigh: newBodyH + (8 + ((i * 5) % 20)),
            wickLow: 8 + ((i * 5) % 20),
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
    }, 2000);

    return () => clearInterval(interval);
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
            <span className="text-muted-foreground/60">{t.symbol}</span>
            <span className={isUp ? "text-success/60" : "text-destructive/60"}>
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
    <div className="relative flex min-h-screen overflow-hidden bg-[#0a0e1a]">

      {/* Animated gradient mesh */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute h-[600px] w-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, rgba(59,130,246,0.25) 0%, transparent 70%)",
            top: "-10%",
            left: "-5%",
            animation: "blob-drift1 20s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute h-[500px] w-[500px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(52,211,153,0.2) 0%, transparent 70%)",
            bottom: "5%",
            right: "10%",
            animation: "blob-drift2 25s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute h-[400px] w-[400px] rounded-full opacity-15"
          style={{
            background: "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
            top: "40%",
            right: "30%",
            animation: "blob-drift3 18s ease-in-out infinite",
            willChange: "transform",
          }}
        />
        <div
          className="absolute h-[350px] w-[350px] rounded-full opacity-10"
          style={{
            background: "radial-gradient(circle, rgba(244,114,182,0.12) 0%, transparent 70%)",
            top: "60%",
            left: "20%",
            animation: "blob-drift4 22s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 z-[1] opacity-[0.025] pointer-events-none mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 512 512\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />

      {/* Vignette */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 40%, #0a0e1a 100%)" }} />

      {/* Full-screen Trading Visuals Background */}
      <div className="absolute inset-0 z-[3]">

        {/* Fading gradient overlay at edges */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#0a0e1a] via-transparent to-[#0a0e1a]" />

        {/* Horizontal grid lines */}
        <div className="pointer-events-none absolute inset-0">
          {[20, 35, 50, 65, 80].map((pct) => (
            <div
              key={pct}
              className="absolute inset-x-0 border-t border-white/[0.04]"
              style={{ top: `${pct}%` }}
            />
          ))}
        </div>

        {/* Candles */}
        <div className="pointer-events-none absolute inset-x-[5%] bottom-[15%] top-[8%]">
          {candles.map((candle, i) => (
            <Candle key={i} candle={candle} delay={i + 1} />
          ))}
        </div>

        {/* Floating particles */}
        <ParticleField />

        {/* Floating Ticker Symbols */}
        <div className="absolute left-[6%] top-[16%] text-xs font-mono font-medium">
          <LivePriceLabel value={livePrices[0]?.change || "0.00"} isUp={livePrices[0]?.side === "buy"} />
        </div>
        <div className="absolute right-[12%] top-[22%] text-xs font-mono font-medium">
          <LivePriceLabel value={livePrices[1]?.change || "0.00"} isUp={livePrices[1]?.side === "buy"} />
        </div>

        {/* Price axis labels */}
        <div className="pointer-events-none absolute bottom-[15%] left-3 flex flex-col justify-between text-[10px] font-mono text-white/20"
          style={{ top: "8%" }}
        >
          {priceLabels.map((label, i) => (
            <span key={i}>{label}</span>
          ))}
        </div>

        {/* Scrolling Ticker Tape */}
        <div className="absolute bottom-0 inset-x-0 h-10 overflow-hidden border-t border-white/[0.06] bg-[#0a0e1a]/60 backdrop-blur-md">
          <div
            className="flex h-full w-max items-center"
            style={{ animation: "ticker-scroll 30s linear infinite" }}
          >
            <div className="flex items-center">{tickerTape}</div>
            <div className="flex items-center">{tickerTape}</div>
          </div>
        </div>
      </div>

      {/* Cursor-reactive Teleporting Badges */}
      {teleporters.map((t, i) => {
        const isUp = badgeLabels[i].includes("▲") || badgeLabels[i].includes("▸");
        return (
          <div
            key={i}
            className="pointer-events-none absolute z-[6] whitespace-nowrap rounded-full border-2 px-4 py-1.5 text-xs font-bold font-mono uppercase tracking-wider backdrop-blur-md"
            style={{
              left: t.x,
              top: t.y,
              borderColor: isUp ? "hsla(142, 71%, 45%, 0.35)" : "hsla(0, 72%, 51%, 0.35)",
              background: isUp
                ? "hsla(142, 71%, 45%, 0.08)"
                : "hsla(0, 72%, 51%, 0.08)",
              color: isUp
                ? "hsla(142, 71%, 60%, 0.85)"
                : "hsla(0, 72%, 60%, 0.85)",
            }}
          >
            {badgeLabels[i]}
          </div>
        );
      })}

      {/* Center Content — Welcome & Market Stats */}
      <div className="pointer-events-none absolute inset-y-0 z-[5] hidden items-center lg:flex" style={{ left: '12%' }}>
        <div className="text-left">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 drop-shadow-[0_0_40px_rgba(59,130,246,0.5)]"
          >
            Trade Smarter
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-3 text-lg font-medium text-white/50 drop-shadow-[0_0_20px_rgba(255,255,255,0.06)]"
          >
            AI-driven insights — real-time discipline — consistent returns
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-10 flex items-center gap-12"
          >
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white/70">$4.2</span>
                <span className="text-sm font-medium text-white/40">T</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">Volume 24h</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400/70">+12.4</span>
                <span className="text-sm font-medium text-emerald-400/40">%</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">Market Cap</div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="text-center">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold font-mono tracking-tight text-white/70">2,847</span>
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/30">Assets</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Auth Form Overlay — Right Side */}
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center px-4 py-10 sm:max-w-md lg:ml-auto lg:mr-10 lg:max-w-sm">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="w-full"
        >
          <div className="rounded-2xl border border-white/[0.08] bg-[#111827]/90 backdrop-blur-2xl p-8 shadow-2xl shadow-blue-500/5 lg:p-10">

            {/* Logo */}
            <div className="mb-8 flex flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500 text-xl font-black text-white shadow-[0_0_40px_rgba(37,99,235,0.3)]">
                <DollarSign size={24} />
              </div>
              <h1 className="mt-4 text-2xl font-black tracking-tight text-white">
                TradeOS
              </h1>
              <p className="mt-1.5 text-sm text-white/50">
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
