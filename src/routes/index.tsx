import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import protogenImg from "@/assets/protogen.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Protogen Cookie Clicker — Boop the Visor!" },
      { name: "description", content: "A protogen-themed cookie clicker. Boop the visor, collect cookies, and build a fluffy cyber-fursona empire." },
    ],
  }),
});

type Upgrade = {
  id: string;
  name: string;
  desc: string;
  baseCost: number;
  bps: number; // cookies per second
  emoji: string;
};

const BASE_UPGRADES: Upgrade[] = [
  { id: "tail",    name: "Servo Tail",        desc: "A wiggly tail that auto-boops.",            baseCost: 15,     bps: 0.2, emoji: "🦊" },
  { id: "paw",     name: "Cyber Paw",         desc: "Mechanical paw taps the visor for you.",    baseCost: 100,    bps: 1,   emoji: "🐾" },
  { id: "visor",   name: "Spare Visor",       desc: "Extra visors emit happy cookies.",          baseCost: 1100,   bps: 8,   emoji: "🕶️" },
  { id: "fan",     name: "Fursuit Fan",       desc: "Cooling fan keeps the protogens fast.",     baseCost: 12000,  bps: 47,  emoji: "🌀" },
  { id: "lab",     name: "Mod Lab",           desc: "A lab building new protogen friends.",      baseCost: 130000, bps: 260, emoji: "🧪" },
  { id: "server",  name: "Furry Server Rack", desc: "Hosts a whole protogen server farm.",       baseCost: 1.4e6,  bps: 1400, emoji: "🖥️" },
  { id: "portal",  name: "Cyber Portal",      desc: "Summons protogens from another dimension.", baseCost: 2e7,    bps: 7800, emoji: "🌌" },
];

// 100 additional protogen-themed upgrades, each ~3.2x stronger than the previous tier.
const EXTRA_NAMES: { name: string; desc: string; emoji: string }[] = [
  { name: "Cookie Cache",          desc: "Caches warm cookies in fast memory.",                 emoji: "🍪" },
  { name: "Visor Bakery",          desc: "Bakes cookies on a hot visor.",                       emoji: "👁️" },
  { name: "Fluff Reactor",         desc: "Compresses fluff into pure cookie energy.",           emoji: "☁️" },
  { name: "Protogen Café",         desc: "Serves cookies to thirsty protogens.",                emoji: "☕" },
  { name: "Boop Cannon",           desc: "Fires automated boops at the visor.",                 emoji: "💥" },
  { name: "Quantum Snout",         desc: "A snout that exists in many bakeries at once.",       emoji: "👃" },
  { name: "Holo Pawpad",           desc: "Holographic paw that mass-produces cookies.",         emoji: "🖐️" },
  { name: "Neon Den",              desc: "A glowing den full of busy protogens.",               emoji: "🏠" },
  { name: "Crystal Antenna",       desc: "Receives cookie recipes from deep space.",            emoji: "📡" },
  { name: "Plasma Whiskers",       desc: "Whiskers that whisk dough at lightspeed.",            emoji: "✨" },
  { name: "Cyber Oven",            desc: "Industrial oven for protogen cookies.",               emoji: "🔥" },
  { name: "Glitch Tail",           desc: "A tail that duplicates cookies on glitch.",           emoji: "⚡" },
  { name: "Modular Ear",           desc: "Detachable ears that listen for crumbs.",             emoji: "👂" },
  { name: "Fluff Forge",           desc: "Forges new fursuits out of cookie dough.",            emoji: "🛠️" },
  { name: "Visor Garden",          desc: "Grows visors that bloom into cookies.",               emoji: "🌸" },
  { name: "Servo Bakery",          desc: "Robotic bakery staffed by tiny protogens.",           emoji: "🤖" },
  { name: "Cookie Mainframe",      desc: "A mainframe that schedules cookie batches.",          emoji: "💾" },
  { name: "Hyperpaw Drive",        desc: "Faster-than-light paw movements.",                    emoji: "💫" },
  { name: "Aurora Visor",          desc: "Visor that paints aurora-flavored cookies.",          emoji: "🌈" },
  { name: "Cookie Foundry",        desc: "Smelts raw cookies from binary ore.",                 emoji: "🏭" },
  { name: "Fursona Cloner",        desc: "Clones helpful protogen bakers.",                     emoji: "🧬" },
  { name: "Synth Yip",             desc: "Synthesizers powered by happy yips.",                 emoji: "🎹" },
  { name: "Glow Mat",              desc: "A glowing mat where cookies cool perfectly.",         emoji: "🟦" },
  { name: "Protogen Convention",   desc: "An entire con dedicated to baking.",                  emoji: "🎪" },
  { name: "Cyber Moon Dough",      desc: "Lunar-grade dough mined by protogens.",               emoji: "🌙" },
  { name: "Solar Visor Array",     desc: "Visors that bake using pure sunlight.",               emoji: "☀️" },
  { name: "Drone Snoot Swarm",     desc: "Swarm of nose drones detecting cookies.",             emoji: "🛸" },
  { name: "Crystal Cookie Mine",   desc: "Mines cookie crystals from cyber caves.",             emoji: "💎" },
  { name: "Pawcoin Exchange",      desc: "Trades pawcoin for fresh cookies.",                   emoji: "🪙" },
  { name: "Floof Battery",         desc: "Stores boop energy in dense floof.",                  emoji: "🔋" },
  { name: "RGB Tail Array",        desc: "Color-cycling tails inspire faster baking.",          emoji: "🌀" },
  { name: "Visor Mainnet",         desc: "Decentralized visor cookie protocol.",                emoji: "🔗" },
  { name: "Snoot Booth",           desc: "A photo booth that pays out in cookies.",             emoji: "📸" },
  { name: "Plush Generator",       desc: "Generates plush protogens that bake while cuddling.", emoji: "🧸" },
  { name: "Vapor Visor",           desc: "Vaporwave visor with retro cookie output.",           emoji: "🌴" },
  { name: "Cookie Lattice",        desc: "Crystalline lattice of pure cookie matter.",          emoji: "🔷" },
  { name: "Mecha Protogen",        desc: "A giant mecha protogen baker.",                       emoji: "🤖" },
  { name: "Neural Snout Net",      desc: "Trains a model to predict cookie spots.",             emoji: "🧠" },
  { name: "Stardust Sprinkles",    desc: "Sprinkles harvested from stardust.",                  emoji: "✨" },
  { name: "Cyber Hearth",          desc: "An eternal hearth of protogen warmth.",               emoji: "🏮" },
  { name: "Auto-Yiff Dispenser",   desc: "Dispenses morale boosts to bakers.",                  emoji: "💖" },
  { name: "Quantum Bakery",        desc: "Bakery that exists in superposition.",                emoji: "⚛️" },
  { name: "Cookie Singularity",    desc: "A point of infinite cookie density.",                 emoji: "🕳️" },
  { name: "Visor Cathedral",       desc: "A vast cathedral of glowing visors.",                 emoji: "⛪" },
  { name: "Holographic Den",       desc: "Den projected in light, packed with protogens.",      emoji: "🪩" },
  { name: "Protogen Parliament",   desc: "Lawmakers passing pro-cookie legislation.",           emoji: "🏛️" },
  { name: "Furry Spaceport",       desc: "Spaceport launching cookie freighters.",              emoji: "🚀" },
  { name: "Asteroid Bakery",       desc: "Bakery hollowed inside a moving asteroid.",           emoji: "☄️" },
  { name: "Lunar Furcon",          desc: "Yearly convention on the moon.",                      emoji: "🌑" },
  { name: "Mars Floof Colony",     desc: "Mars colony of fluffy protogen bakers.",              emoji: "🪐" },
  { name: "Solar Sail Snoot",      desc: "Solar sails shaped like protogen snoots.",            emoji: "⛵" },
  { name: "Galactic Boop Net",     desc: "Galaxy-wide network of automated boops.",             emoji: "🌐" },
  { name: "Wormhole Whisker",      desc: "Whisker that pulls cookies from elsewhere.",          emoji: "🌀" },
  { name: "Dark Floof",            desc: "Mysterious matter that doubles cookie mass.",         emoji: "🌚" },
  { name: "Antimatter Crumbs",     desc: "Tiny crumbs of impossible energy.",                   emoji: "💠" },
  { name: "Cookie Nebula",         desc: "A nebula condensing into cookies.",                   emoji: "🌌" },
  { name: "Pulsar Paw",            desc: "Pulsar-driven paw, perfectly on beat.",               emoji: "🥁" },
  { name: "Quasar Visor",          desc: "Brightest visor in the universe.",                    emoji: "💡" },
  { name: "Galaxy Den",            desc: "An entire galaxy reorganized into a den.",            emoji: "🌠" },
  { name: "Cookie Dimension",      desc: "A dimension entirely made of cookies.",               emoji: "🪞" },
  { name: "Reality Visor",         desc: "Visor that overrides reality with cookies.",          emoji: "🕶️" },
  { name: "Time Loop Bakery",      desc: "Same cookie, baked infinite times.",                  emoji: "⏳" },
  { name: "Omega Protogen",        desc: "Final form of the cookie protogen.",                  emoji: "Ω" },
  { name: "Cookie God Mode",       desc: "Cheat code engaged. Cookies everywhere.",             emoji: "👑" },
  { name: "Floof Multiverse",      desc: "Every universe runs a small bakery.",                 emoji: "🪄" },
  { name: "Hex Visor",             desc: "Hexagonal visor lattice for tiling cookies.",         emoji: "⬡" },
  { name: "Snowfloof Engine",      desc: "Engine that crystallizes airborne floof.",            emoji: "❄️" },
  { name: "Booplight Beacon",      desc: "Lighthouse beacon that calls boopers.",               emoji: "🗼" },
  { name: "Cookie Aquarium",       desc: "Aquarium of cookie-fish.",                            emoji: "🐟" },
  { name: "Protogen Choir",        desc: "Singing morale boost for the bakery.",                emoji: "🎶" },
  { name: "Bit-Crusher Visor",     desc: "Lo-fi visor pumping out chunky cookies.",             emoji: "🎛️" },
  { name: "Pixel Floof",           desc: "Pixelated floof, retro-flavored.",                    emoji: "🟩" },
  { name: "Synthwave Den",         desc: "Den lit with neon synthwave grids.",                  emoji: "🛼" },
  { name: "Drift Tail",            desc: "Tail drifting around the visor track.",               emoji: "🏎️" },
  { name: "Magnet Snoot",          desc: "Magnetic snoot pulls cookies in.",                    emoji: "🧲" },
  { name: "Anti-Gravity Floof",    desc: "Floof that floats and bakes mid-air.",                emoji: "🎈" },
  { name: "Cyber Garden Visor",    desc: "Visor garden of fiber-optic flowers.",                emoji: "🌷" },
  { name: "Lava Bakery",           desc: "Volcano-powered cookie kiln.",                        emoji: "🌋" },
  { name: "Glacier Floof",         desc: "Glacial floof for crisp cool cookies.",               emoji: "🏔️" },
  { name: "Storm Boop",            desc: "Lightning-powered automatic boops.",                  emoji: "🌩️" },
  { name: "Tidal Visor",           desc: "Visor that bakes in tide cycles.",                    emoji: "🌊" },
  { name: "Mirror Maze Den",       desc: "Mirror maze that copies cookies endlessly.",          emoji: "🪞" },
  { name: "Origami Protogen",      desc: "Folded paper protogens, surprisingly productive.",    emoji: "📄" },
  { name: "Chrome Visor",          desc: "Polished chrome visor — looks great, bakes fast.",    emoji: "🪞" },
  { name: "Ramen Bakery",          desc: "Ramen shop that secretly bakes cookies.",             emoji: "🍜" },
  { name: "Donut Den",             desc: "Den shaped like a topological donut.",                emoji: "🍩" },
  { name: "Cake Visor",            desc: "Edible visor that respawns after eating.",            emoji: "🎂" },
  { name: "Tea Time Protogen",     desc: "Polite protogen with cookies on schedule.",           emoji: "🫖" },
  { name: "Sushi Conveyor Floof",  desc: "Conveyor belt of cookie-sushi.",                      emoji: "🍣" },
  { name: "Burrito Snoot",         desc: "Wraps cookies in warm tortillas.",                    emoji: "🌯" },
  { name: "Pretzel Tail",          desc: "Tail twisted into perfect pretzels of dough.",        emoji: "🥨" },
  { name: "Macaron Visor",         desc: "Tiny pastel visors, big cookie output.",              emoji: "🧁" },
  { name: "Dragon Floof",          desc: "Floofy dragon protogen breathes baked goods.",        emoji: "🐉" },
  { name: "Phoenix Visor",         desc: "Visor reborn from oven flames.",                      emoji: "🔥" },
  { name: "Kraken Paw",            desc: "Eight paws, eight bakeries.",                         emoji: "🐙" },
  { name: "Fox Spirit Den",        desc: "Nine-tailed mascot blessing the cookies.",            emoji: "🦊" },
  { name: "Wolf Pack Boopers",     desc: "Pack of boopers howling on schedule.",                emoji: "🐺" },
  { name: "Bear Hug Bakery",       desc: "Big warm hugs that proof the dough.",                 emoji: "🐻" },
  { name: "Cat Loaf Visor",        desc: "Loaf-shaped cats nap on the visor.",                  emoji: "🐱" },
  { name: "Bun Bun Battery",       desc: "Bunny protogens hopping up the cookie counter.",      emoji: "🐰" },
  { name: "Final Floof Form",      desc: "The ultimate, most floof-est cookie machine.",        emoji: "💫" },
];

const UPGRADES: Upgrade[] = [
  ...BASE_UPGRADES,
  ...EXTRA_NAMES.map((u, i) => {
    // Each tier ~3.2x cost & bps over the previous, starting after Cyber Portal.
    const tier = i + 1;
    return {
      id: `ext_${i}`,
      name: u.name,
      desc: u.desc,
      emoji: u.emoji,
      baseCost: Math.round(2e7 * Math.pow(3.2, tier)),
      bps: Math.round(7800 * Math.pow(3.2, tier) * 100) / 100,
    };
  }),
];

type SaveState = {
  bytes: number; // legacy field name; represents cookies
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
  const [code, setCode] = useState("");
  const [codeMsg, setCodeMsg] = useState<{ text: string; ok: boolean } | null>(null);
  const [usedCodes, setUsedCodes] = useState<string[]>([]);
  const popId = useRef(0);
  const loaded = useRef(false);

  // Load save
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState(), ...JSON.parse(raw) });
      const usedRaw = localStorage.getItem(STORAGE_KEY + "-codes");
      if (usedRaw) setUsedCodes(JSON.parse(usedRaw));
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
      setUsedCodes([]);
      try { localStorage.removeItem(STORAGE_KEY + "-codes"); } catch {}
    }
  }

  // Redeemable codes
  const CODES: Record<string, { reward: number; label: string; once?: boolean }> = {
    "PROTOGEN":      { reward: 1000,        label: "+1,000 cookies" },
    "BOOP":          { reward: 500,         label: "+500 cookies" },
    "FLOOF":         { reward: 10000,       label: "+10,000 cookies" },
    "VISORLOVE":     { reward: 100000,      label: "+100,000 cookies", once: true },
    "CYBERFOX":      { reward: 1000000,     label: "+1,000,000 cookies", once: true },
    "OMEGA":         { reward: 100000000,   label: "+100M cookies", once: true },
    "GODMODE":       { reward: 1e12,        label: "+1 trillion cookies", once: true },
  };

  function redeem(e: React.FormEvent) {
    e.preventDefault();
    const key = code.trim().toUpperCase().slice(0, 32);
    if (!key) return;
    const entry = CODES[key];
    if (!entry) {
      setCodeMsg({ text: "Invalid code.", ok: false });
      setCode("");
      return;
    }
    if (entry.once && usedCodes.includes(key)) {
      setCodeMsg({ text: "Code already redeemed.", ok: false });
      setCode("");
      return;
    }
    setState((s) => ({ ...s, bytes: s.bytes + entry.reward, totalBytes: s.totalBytes + entry.reward }));
    if (entry.once) {
      const next = [...usedCodes, key];
      setUsedCodes(next);
      try { localStorage.setItem(STORAGE_KEY + "-codes", JSON.stringify(next)); } catch {}
    }
    setCodeMsg({ text: `Redeemed: ${entry.label}!`, ok: true });
    setCode("");
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
            <div className="text-sm md:text-base opacity-80 mt-1">cookies • {fmt(bps)}/sec • +{fmt(state.perClick)}/boop</div>
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
            Upgrade Boop Power → +1 ({fmt(clickCost)} cookies)
          </button>

          <div className="mt-6 text-xs opacity-70 text-center max-w-md">
            Total cookies earned: {fmt(state.totalBytes)} • Boops: {state.clicks}
          </div>

          {/* Redeem code */}
          <form onSubmit={redeem} className="mt-6 w-full max-w-sm">
            <label className="block text-xs font-semibold mb-2 opacity-80" style={{ color: "oklch(0.85 0.18 200)" }}>
              Redeem a code
            </label>
            <div className="flex gap-2">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                maxLength={32}
                placeholder="ENTER CODE"
                spellCheck={false}
                autoCapitalize="characters"
                className="flex-1 px-3 py-2 rounded-md text-sm font-mono uppercase tracking-wider outline-none border focus:ring-2"
                style={{
                  background: "oklch(0.15 0.04 270 / 0.8)",
                  borderColor: "oklch(0.7 0.2 200 / 0.5)",
                  color: "oklch(0.95 0.05 200)",
                }}
              />
              <button type="submit"
                className="px-4 py-2 rounded-md text-sm font-semibold transition"
                style={{
                  background: "linear-gradient(135deg, oklch(0.55 0.2 200), oklch(0.45 0.2 280))",
                  color: "white",
                }}>
                Redeem
              </button>
            </div>
            {codeMsg && (
              <div className="text-xs mt-2" style={{ color: codeMsg.ok ? "oklch(0.85 0.2 150)" : "oklch(0.75 0.2 25)" }}>
                {codeMsg.text}
              </div>
            )}
            <div className="text-[10px] opacity-50 mt-2">Hint: try BOOP, PROTOGEN, FLOOF…</div>
          </form>
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
                      {fmt(cost)} cookies • +{u.bps}/sec
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
