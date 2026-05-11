import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import protogenImg from "@/assets/protogen.png";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Protogen Clicker — Boop the Visor!" },
      { name: "description", content: "A protogen-themed cookie clicker. Boop the visor, collect bytes, and build a fluffy cyber-fursona empire." },
    ],
  }),
});

type Upgrade = {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  bps: number; // bytes per second
  emoji: string;
};

const UPGRADES: Upgrade[] = [
  { id: "tail",    name: "Servo Tail",        desc: "A wiggly tail that auto-boops.",          baseCost: 15,     bps: 0.2, emoji: "🦊" },
  { id: "paw",     name: "Cyber Paw",         desc: "Mechanical paw taps the visor for you.",  baseCost: 100,    bps: 1,   emoji: "🐾" },
  { id: "visor",   name: "Spare Visor",       desc: "Extra visors emit happy bytes.",          baseCost: 1100,   bps: 8,   emoji: "🕶️" },
  { id: "fan",     name: "Fursuit Fan",       desc: "Cooling fan keeps the protogens fast.",   baseCost: 12000,  bps: 47,  emoji: "🌀" },
  { id: "lab",     name: "Mod Lab",           desc: "A lab building new protogen friends.",    baseCost: 130000, bps: 260, emoji: "🧪" },
  { id: "server",  name: "Furry Server Rack", desc: "Hosts a whole protogen server farm.",     baseCost: 1.4e6,  bps: 1400, emoji: "🖥️" },
  { id: "portal",  name: "Cyber Portal",      desc: "Summons protogens from another dimension.", baseCost: 2e7, bps: 7800, emoji: "🌀" },
];

type SaveState = {
  bytes: number;
  totalBytes: number;
  clicks: number;
  perClick: number;
  owned: Record<string, number>;
};

const STORAGE_KEY = "protogen-clicker-save-v1";

function defaultState(): SaveState {
  return { bytes: 0, totalBytes: 0, clicks: 0, perClick: 1, owned: {} };
}

function costOf(u: Upgrade, owned: number) {
  return Math.ceil(u.baseCost * Math.pow(1.15, owned));
}

function fmt(n: number) {
  if (n < 1000) return n.toFixed(n < 10 ? 1 : 0).replace(/\.0$/, "");
  const units = ["k", "M", "B", "T", "Qa", "Qi"];
  let i = -1;
  while (n >= 1000 && i < units.length - 1) { n /= 1000; i++; }
  return n.toFixed(2) + units[i];
}

function Index() {
  const [state, setState] = useState<SaveState>(defaultState);
  const [pops, setPops] = useState<{ id: number; x: number; y: number; v: number }[]>([]);
  const [bouncing, setBouncing] = useState(false);
  const popId = useRef(0);
  const loaded = useRef(false);

  // Load save
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState(), ...JSON.parse(raw) });
    } catch {}
    loaded.current = true;
  }, []);

  // Save
  useEffect(() => {
    if (!loaded.current) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const bps = UPGRADES.reduce((sum, u) => sum + (state.owned[u.id] ?? 0) * u.bps, 0);

  // Tick
  useEffect(() => {
    if (bps === 0) return;
    const interval = setInterval(() => {
      setState((s) => {
        const add = bps / 10;
        return { ...s, bytes: s.bytes + add, totalBytes: s.totalBytes + add };
      });
    }, 100);
    return () => clearInterval(interval);
  }, [bps]);

  function handleClick(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = ++popId.current;
    setPops((p) => [...p, { id, x, y, v: state.perClick }]);
    setTimeout(() => setPops((p) => p.filter((pp) => pp.id !== id)), 900);
    setBouncing(true);
    setTimeout(() => setBouncing(false), 120);
    setState((s) => ({ ...s, bytes: s.bytes + s.perClick, totalBytes: s.totalBytes + s.perClick, clicks: s.clicks + 1 }));
  }

  function buy(u: Upgrade) {
    setState((s) => {
      const owned = s.owned[u.id] ?? 0;
      const cost = costOf(u, owned);
      if (s.bytes < cost) return s;
      return { ...s, bytes: s.bytes - cost, owned: { ...s.owned, [u.id]: owned + 1 } };
    });
  }

  function buyClickUpgrade() {
    const cost = Math.ceil(50 * Math.pow(2, state.perClick - 1));
    setState((s) => {
      if (s.bytes < cost) return s;
      return { ...s, bytes: s.bytes - cost, perClick: s.perClick + 1 };
    });
  }

  function reset() {
    if (confirm("Reset your protogen empire? All progress will be lost.")) {
      setState(defaultState());
    }
  }

  const clickCost = Math.ceil(50 * Math.pow(2, state.perClick - 1));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "radial-gradient(ellipse at top, oklch(0.28 0.12 280) 0%, oklch(0.13 0.05 270) 60%, oklch(0.08 0.03 260) 100%)",
      color: "var(--color-foreground)",
    }}>
      {/* grid bg */}
      <div className="pointer-events-none absolute inset-0 opacity-20" style={{
        backgroundImage: "linear-gradient(oklch(0.7 0.2 200 / 0.3) 1px, transparent 1px), linear-gradient(90deg, oklch(0.7 0.2 200 / 0.3) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
        maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
      }} />

      <header className="relative z-10 px-6 py-5 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ textShadow: "0 0 24px oklch(0.8 0.2 200 / 0.6)" }}>
          <span style={{ color: "oklch(0.85 0.18 200)" }}>Protogen</span> Clicker
        </h1>
        <button onClick={reset}
          className="text-xs px-3 py-1.5 rounded-md border transition hover:bg-white/10"
          style={{ borderColor: "oklch(0.8 0.18 200 / 0.5)", color: "oklch(0.85 0.18 200)" }}>
          Reset
        </button>
      </header>

      <main className="relative z-10 grid lg:grid-cols-[1fr_400px] gap-8 px-6 pb-12 max-w-7xl mx-auto">
        {/* Clicker */}
        <section className="flex flex-col items-center">
          <div className="text-center mb-4">
            <div className="text-5xl md:text-6xl font-extrabold" style={{ color: "oklch(0.92 0.15 200)", textShadow: "0 0 30px oklch(0.7 0.25 200 / 0.7)" }}>
              {fmt(state.bytes)}
            </div>
            <div className="text-sm md:text-base opacity-80 mt-1">bytes • {fmt(bps)}/sec • +{fmt(state.perClick)}/boop</div>
          </div>

          <button
            onClick={handleClick}
            aria-label="Boop the protogen"
            className="relative select-none active:scale-95 transition-transform"
            style={{ filter: "drop-shadow(0 0 40px oklch(0.7 0.25 200 / 0.55))" }}
          >
            <img
              src={protogenImg}
              alt="Protogen mascot — click to boop"
              width={384}
              height={384}
              draggable={false}
              className={"w-72 h-72 md:w-96 md:h-96 transition-transform " + (bouncing ? "scale-95" : "scale-100")}
              style={{ animation: "protoFloat 4s ease-in-out infinite" }}
            />
            {pops.map((p) => (
              <span key={p.id}
                className="pointer-events-none absolute font-bold text-xl"
                style={{
                  left: p.x, top: p.y,
                  color: "oklch(0.95 0.2 200)",
                  textShadow: "0 0 10px oklch(0.7 0.25 200)",
                  animation: "popUp 900ms ease-out forwards",
                }}>
                +{fmt(p.v)}
              </span>
            ))}
          </button>

          <button
            onClick={buyClickUpgrade}
            disabled={state.bytes < clickCost}
            className="mt-8 px-5 py-3 rounded-lg font-semibold transition disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, oklch(0.55 0.2 200), oklch(0.45 0.2 280))",
              color: "white",
              boxShadow: "0 4px 24px oklch(0.5 0.2 240 / 0.5)",
            }}>
            Upgrade Boop Power → +1 ({fmt(clickCost)} bytes)
          </button>

          <div className="mt-6 text-xs opacity-70 text-center max-w-md">
            Total bytes earned: {fmt(state.totalBytes)} • Boops: {state.clicks}
          </div>
        </section>

        {/* Shop */}
        <aside>
          <h2 className="text-xl font-bold mb-3" style={{ color: "oklch(0.85 0.18 200)" }}>Protogen Shop</h2>
          <div className="space-y-2">
            {UPGRADES.map((u) => {
              const owned = state.owned[u.id] ?? 0;
              const cost = costOf(u, owned);
              const can = state.bytes >= cost;
              return (
                <button
                  key={u.id}
                  onClick={() => buy(u)}
                  disabled={!can}
                  className="w-full text-left rounded-xl p-3 flex items-center gap-3 transition border disabled:opacity-50 disabled:cursor-not-allowed hover:enabled:translate-x-0.5"
                  style={{
                    background: can
                      ? "linear-gradient(135deg, oklch(0.25 0.08 280 / 0.8), oklch(0.2 0.06 260 / 0.8))"
                      : "oklch(0.18 0.04 270 / 0.6)",
                    borderColor: can ? "oklch(0.7 0.2 200 / 0.6)" : "oklch(0.4 0.05 260 / 0.5)",
                    boxShadow: can ? "0 0 16px oklch(0.6 0.2 200 / 0.25)" : "none",
                  }}>
                  <div className="text-3xl w-12 text-center">{u.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="font-semibold truncate">{u.name}</div>
                      <div className="text-xs opacity-70 shrink-0">x{owned}</div>
                    </div>
                    <div className="text-xs opacity-70 truncate">{u.desc}</div>
                    <div className="text-xs mt-1" style={{ color: "oklch(0.85 0.18 200)" }}>
                      {fmt(cost)} bytes • +{u.bps}/sec
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          <p className="mt-4 text-xs opacity-60">
            Tip: Your progress saves automatically — works great on Chromebooks too. ✨
          </p>
        </aside>
      </main>

      <style>{`
        @keyframes popUp {
          0% { transform: translate(-50%, 0) scale(1); opacity: 1; }
          100% { transform: translate(-50%, -80px) scale(1.4); opacity: 0; }
        }
        @keyframes protoFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
