/**
 * Shared architectural SVG language for the IMOVIX site.
 *
 * Everything here is vector: it stays razor sharp at any density, weighs
 * almost nothing and can be animated with pure CSS (line drawing via
 * `pathLength="1"` + `.draw`, cross-fades via `.fade-layer`). No canvas,
 * no rAF — the scrub engine owns the only animation frame loop in the app.
 *
 * The drawings are intentionally *technical*: real wall thickness with
 * poché hatching, door swings, window mullions, plumbing fixtures,
 * dimension chains and a north arrow on the plan; depth-sorted opaque
 * volumes with facade modulation, balcony slabs, podium and landscape on
 * the massing. No abstract boxes.
 */

type CSS = React.CSSProperties;
const d = (ms: number) => ({ "--draw-delay": `${ms}ms` }) as CSS;

/* ================================================================== */
/* Blueprint — a measured 2D floor plan                                */
/* ================================================================== */

type PlanProps = {
  className?: string;
  /** Hides dimensions, labels and furniture, keeping only structure. */
  bare?: boolean;
};

/* Wall segments: [x, y, w, h] in plan units. */
const EXT_WALLS: readonly [number, number, number, number][] = [
  // top wall, broken by three windows
  [40, 40, 50, 8],
  [170, 40, 90, 8],
  [330, 40, 70, 8],
  [480, 40, 40, 8],
  // bottom wall, broken by the living-room glazing and a service window
  [40, 332, 80, 8],
  [280, 332, 120, 8],
  [470, 332, 50, 8],
  // left wall, broken by one window
  [40, 40, 8, 160],
  [40, 280, 8, 60],
  // right wall, broken by one window
  [512, 40, 8, 210],
  [512, 320, 8, 20],
];

const INT_WALLS: readonly [number, number, number, number][] = [
  // spine between the bedroom wing and the kitchen / service wing
  [352, 48, 6, 48],
  [352, 136, 6, 94],
  [352, 268, 6, 64],
  // corridor wall between bedrooms and living
  [48, 186, 52, 6],
  [140, 186, 136, 6],
  [316, 186, 42, 6],
  // wall between the two bedrooms
  [232, 48, 6, 138],
  // kitchen / bathroom
  [358, 200, 154, 6],
  // bathroom / laundry
  [358, 268, 62, 6],
  [458, 268, 54, 6],
];

/** Three-line window symbol inside a wall gap. */
function Win({ x, y, w, h, delay }: { x: number; y: number; w: number; h: number; delay: number }) {
  const horizontal = w > h;
  const lines = horizontal
    ? [y + 1, y + h / 2, y + h - 1].map((ly) => `M${x} ${ly}H${x + w}`)
    : [x + 1, x + w / 2, x + w - 1].map((lx) => `M${lx} ${y}V${y + h}`);
  const caps = horizontal ? `M${x} ${y}v${h}M${x + w} ${y}v${h}` : `M${x} ${y}h${w}M${x} ${y + h}h${w}`;
  return (
    <g className="fade-layer" style={d(delay)}>
      <path d={lines.join("")} stroke="currentColor" strokeWidth="0.9" opacity="0.85" />
      <path d={caps} stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
    </g>
  );
}

export function BlueprintPlan({ className = "", bare = false }: PlanProps) {
  return (
    <svg
      viewBox="0 0 600 424"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <pattern id="imovi-poche" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="4" fill="currentColor" fillOpacity="0.12" />
          <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
        </pattern>
      </defs>

      {/* construction grid */}
      <g stroke="currentColor" strokeWidth="0.35" opacity="0.12">
        {Array.from({ length: 25 }, (_, i) => (
          <line key={`v${i}`} x1={i * 24} y1="16" x2={i * 24} y2="408" />
        ))}
        {Array.from({ length: 17 }, (_, i) => (
          <line key={`h${i}`} x1="16" y1={16 + i * 24} x2="584" y2={16 + i * 24} />
        ))}
      </g>

      {/* slab outline — drawn first, line by line */}
      <path
        className="draw"
        pathLength="1"
        d="M40 40h480v300H40z"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.45"
      />

      {/* structural columns at the grid intersections */}
      <g className="fade-layer" style={d(120)}>
        {[
          [40, 40],
          [232, 40],
          [352, 40],
          [520, 40],
          [40, 186],
          [352, 186],
          [40, 340],
          [232, 340],
          [352, 340],
          [520, 340],
        ].map(([cx, cy]) => (
          <rect
            key={`${cx}-${cy}`}
            x={(cx as number) - 7}
            y={(cy as number) - 7}
            width="14"
            height="14"
            fill="url(#imovi-poche)"
            stroke="currentColor"
            strokeWidth="0.9"
            opacity="0.95"
          />
        ))}
      </g>

      {/* exterior walls */}
      <g className="fade-layer" style={d(200)}>
        {EXT_WALLS.map(([x, y, w, h]) => (
          <rect
            key={`e${x}-${y}-${w}-${h}`}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="url(#imovi-poche)"
            stroke="currentColor"
            strokeWidth="0.9"
          />
        ))}
      </g>

      {/* interior partitions */}
      <g className="fade-layer" style={d(320)}>
        {INT_WALLS.map(([x, y, w, h]) => (
          <rect
            key={`i${x}-${y}-${w}-${h}`}
            x={x}
            y={y}
            width={w}
            height={h}
            fill="url(#imovi-poche)"
            stroke="currentColor"
            strokeWidth="0.7"
            opacity="0.9"
          />
        ))}
      </g>

      {/* windows and glazing */}
      <Win x={90} y={40} w={80} h={8} delay={420} />
      <Win x={260} y={40} w={70} h={8} delay={460} />
      <Win x={400} y={40} w={80} h={8} delay={500} />
      <Win x={40} y={200} w={8} h={80} delay={540} />
      <Win x={512} y={250} w={8} h={70} delay={580} />
      <Win x={400} y={332} w={70} h={8} delay={620} />

      {/* living-room sliding glass door — four leaves */}
      <g className="fade-layer" style={d(660)}>
        <path d="M120 332h160M120 340h160" stroke="currentColor" strokeWidth="0.8" opacity="0.5" />
        <path
          d="M120 334h78M122 338h78M162 334h78M164 338h78"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.8"
        />
        <path d="M120 330v12M280 330v12" stroke="currentColor" strokeWidth="1.4" opacity="0.6" />
      </g>

      {/* door swings */}
      <g stroke="currentColor" strokeWidth="0.9" opacity="0.7">
        {/* suite → corridor */}
        <path className="draw" pathLength="1" style={d(720)} d="M100 192v38" />
        <path className="draw" pathLength="1" style={d(760)} d="M140 192a38 38 0 0 1-38 38" />
        {/* bedroom 02 → corridor */}
        <path className="draw" pathLength="1" style={d(800)} d="M316 192v38" />
        <path className="draw" pathLength="1" style={d(840)} d="M276 192a40 40 0 0 0 38 38" />
        {/* kitchen */}
        <path className="draw" pathLength="1" style={d(880)} d="M352 96h-38" />
        <path className="draw" pathLength="1" style={d(920)} d="M352 136a40 40 0 0 0-38-40" />
        {/* bathroom */}
        <path className="draw" pathLength="1" style={d(960)} d="M358 230h34" />
        <path className="draw" pathLength="1" style={d(1000)} d="M358 264a34 34 0 0 1 34-34" />
        {/* laundry */}
        <path className="draw" pathLength="1" style={d(1040)} d="M420 268h38" />
        <path className="draw" pathLength="1" style={d(1080)} d="M458 268a38 38 0 0 0-38 38" />
      </g>

      {!bare && (
        <>
          {/* ---------------- furniture & fixtures ---------------- */}
          <g className="fade-layer" stroke="currentColor" strokeWidth="0.8" style={d(1120)}>
            {/* suíte master */}
            <g opacity="0.62">
              <rect x="100" y="52" width="76" height="92" fill="currentColor" fillOpacity="0.05" />
              <rect x="100" y="52" width="76" height="10" fill="currentColor" fillOpacity="0.18" />
              <rect x="104" y="64" width="33" height="16" rx="3" />
              <rect x="139" y="64" width="33" height="16" rx="3" />
              <rect x="80" y="52" width="18" height="20" />
              <rect x="178" y="52" width="18" height="20" />
              <rect x="54" y="70" width="20" height="104" />
              <path d="M54 70l20 104M74 70L54 174" strokeWidth="0.4" opacity="0.5" />
              <rect x="190" y="120" width="36" height="60" />
              <path d="M190 150h36" strokeWidth="0.4" opacity="0.5" />
            </g>

            {/* quarto 02 */}
            <g opacity="0.62">
              <rect x="266" y="52" width="60" height="84" fill="currentColor" fillOpacity="0.05" />
              <rect x="266" y="52" width="60" height="9" fill="currentColor" fillOpacity="0.18" />
              <rect x="272" y="63" width="48" height="15" rx="3" />
              <rect x="330" y="52" width="16" height="18" />
              <rect x="242" y="96" width="18" height="80" />
              <path d="M242 96l18 80M260 96l-18 80" strokeWidth="0.4" opacity="0.5" />
            </g>

            {/* estar / jantar */}
            <g opacity="0.62">
              {/* rug */}
              <rect
                x="86"
                y="248"
                width="150"
                height="76"
                strokeDasharray="4 4"
                opacity="0.5"
                fill="currentColor"
                fillOpacity="0.03"
              />
              {/* sofa */}
              <rect x="92" y="300" width="138" height="26" fill="currentColor" fillOpacity="0.06" />
              <rect x="92" y="300" width="138" height="8" fill="currentColor" fillOpacity="0.16" />
              <path d="M138 308v18M184 308v18" strokeWidth="0.5" />
              {/* coffee table */}
              <rect x="132" y="262" width="58" height="26" rx="2" />
              {/* tv panel */}
              <rect x="120" y="194" width="86" height="7" fill="currentColor" fillOpacity="0.2" />
              {/* armchair */}
              <rect x="248" y="290" width="26" height="26" rx="4" />
              {/* dining table + chairs */}
              <rect x="256" y="216" width="76" height="46" rx="4" fill="currentColor" fillOpacity="0.05" />
              <rect x="266" y="202" width="20" height="11" rx="2" />
              <rect x="300" y="202" width="20" height="11" rx="2" />
              <rect x="266" y="265" width="20" height="11" rx="2" />
              <rect x="300" y="265" width="20" height="11" rx="2" />
              <rect x="240" y="228" width="11" height="20" rx="2" />
              <rect x="337" y="228" width="11" height="20" rx="2" />
            </g>

            {/* cozinha */}
            <g opacity="0.62">
              {/* countertop along the right wall */}
              <rect x="486" y="52" width="24" height="140" fill="currentColor" fillOpacity="0.07" />
              <path d="M486 52v140" strokeWidth="0.5" />
              {/* sink */}
              <rect x="490" y="70" width="16" height="26" rx="2" />
              <circle cx="498" cy="66" r="2.2" />
              {/* cooktop */}
              <rect x="489" y="116" width="18" height="26" />
              <circle cx="494" cy="123" r="3" />
              <circle cx="502" cy="123" r="3" />
              <circle cx="494" cy="135" r="3" />
              <circle cx="502" cy="135" r="3" />
              {/* fridge */}
              <rect x="458" y="52" width="26" height="28" />
              <path d="M458 66h26" strokeWidth="0.5" />
              {/* island */}
              <rect x="388" y="96" width="46" height="70" rx="2" fill="currentColor" fillOpacity="0.05" />
              <path d="M388 118h46" strokeWidth="0.4" opacity="0.6" />
              <circle cx="374" cy="106" r="6" />
              <circle cx="374" cy="132" r="6" />
              <circle cx="374" cy="158" r="6" />
            </g>

            {/* banho */}
            <g opacity="0.62">
              <rect x="468" y="212" width="42" height="46" />
              <path d="M468 212l42 46M510 212l-42 46" strokeWidth="0.4" opacity="0.55" />
              <rect x="366" y="238" width="20" height="24" rx="6" />
              <ellipse cx="376" cy="248" rx="6" ry="8" strokeWidth="0.5" />
              <rect x="404" y="212" width="34" height="20" rx="3" />
              <circle cx="421" cy="222" r="5" strokeWidth="0.5" />
            </g>

            {/* lavanderia */}
            <g opacity="0.62">
              <rect x="366" y="296" width="28" height="28" />
              <circle cx="380" cy="310" r="8" strokeWidth="0.5" />
              <rect x="400" y="296" width="28" height="28" />
              <circle cx="414" cy="310" r="8" strokeWidth="0.5" />
              <rect x="470" y="292" width="38" height="32" rx="2" fill="currentColor" fillOpacity="0.05" />
              <path d="M470 306h38" strokeWidth="0.4" opacity="0.6" />
            </g>
          </g>

          {/* ---------------- varanda ---------------- */}
          <g className="fade-layer" style={d(1220)}>
            <rect
              x="96"
              y="340"
              width="304"
              height="52"
              stroke="currentColor"
              strokeWidth="0.9"
              opacity="0.5"
              fill="currentColor"
              fillOpacity="0.03"
            />
            <path
              d="M96 392h304"
              stroke="currentColor"
              strokeWidth="2.2"
              opacity="0.55"
            />
            <g stroke="currentColor" strokeWidth="0.4" opacity="0.3">
              {Array.from({ length: 19 }, (_, i) => (
                <line key={i} x1={104 + i * 16} y1="378" x2={104 + i * 16} y2="392" />
              ))}
            </g>
            <g stroke="currentColor" strokeWidth="0.7" opacity="0.5">
              <rect x="150" y="352" width="22" height="22" rx="4" />
              <rect x="182" y="352" width="22" height="22" rx="4" />
              <rect x="300" y="350" width="60" height="26" rx="3" />
            </g>
          </g>

          {/* ---------------- room labels ---------------- */}
          <g
            className="fade-layer"
            fill="currentColor"
            style={d(1320)}
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="1.4"
            textAnchor="middle"
          >
            {[
              { t: "SUÍTE MASTER", s: "18,60 m²", x: 138, y: 166 },
              { t: "QUARTO 02", s: "12,40 m²", x: 296, y: 166 },
              { t: "ESTAR / JANTAR", s: "31,80 m²", x: 200, y: 232 },
              { t: "COZINHA", s: "14,20 m²", x: 420, y: 186 },
              { t: "BANHO", s: "6,10 m²", x: 428, y: 254 },
              { t: "LAVANDERIA", s: "5,40 m²", x: 440, y: 288 },
              { t: "VARANDA", s: "12,90 m²", x: 248, y: 366 },
            ].map((r) => (
              <g key={r.t}>
                <text x={r.x} y={r.y} opacity="0.85">
                  {r.t}
                </text>
                <text x={r.x} y={r.y + 11} fontSize="7" fontWeight="500" letterSpacing="1" opacity="0.45">
                  {r.s}
                </text>
              </g>
            ))}
          </g>

          {/* ---------------- dimension chains ---------------- */}
          <g className="fade-layer" stroke="currentColor" style={d(1400)}>
            <g strokeWidth="0.7" opacity="0.4">
              <path d="M40 24h480" />
              <path d="M40 18v12M232 18v12M352 18v12M520 18v12" />
              <path d="M24 40v300" />
              <path d="M18 40h12M18 186h12M18 340h12" />
            </g>
            <g fill="currentColor" stroke="none" fontSize="7" fontWeight="500" letterSpacing="0.8" opacity="0.55">
              <text x="136" y="19" textAnchor="middle">
                4.80
              </text>
              <text x="292" y="19" textAnchor="middle">
                3.00
              </text>
              <text x="436" y="19" textAnchor="middle">
                4.20
              </text>
              <text x="14" y="118" textAnchor="middle" transform="rotate(-90 14 118)">
                3.65
              </text>
              <text x="14" y="266" textAnchor="middle" transform="rotate(-90 14 266)">
                3.85
              </text>
            </g>
          </g>

          {/* ---------------- north arrow + scale + title ---------------- */}
          <g className="fade-layer" style={d(1480)}>
            <g stroke="currentColor" strokeWidth="0.8" opacity="0.55">
              <circle cx="556" cy="52" r="15" />
              <path d="M556 40v24M550 48l6-8 6 8" />
            </g>
            <text
              x="556"
              y="80"
              fill="currentColor"
              fontSize="7.5"
              fontWeight="700"
              letterSpacing="1.6"
              textAnchor="middle"
              opacity="0.6"
            >
              N
            </text>

            <g opacity="0.5">
              <rect x="470" y="404" width="20" height="4" fill="currentColor" />
              <rect x="490" y="404" width="20" height="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <rect x="510" y="404" width="20" height="4" fill="currentColor" />
              <rect x="530" y="404" width="20" height="4" fill="none" stroke="currentColor" strokeWidth="0.6" />
              <text x="556" y="408" fill="currentColor" fontSize="6.5" fontWeight="500" letterSpacing="1">
                4m
              </text>
            </g>

            <text
              x="24"
              y="408"
              fill="currentColor"
              fontSize="7.5"
              fontWeight="700"
              letterSpacing="2.2"
              opacity="0.5"
            >
              PLANTA TIPO · 84 m² · ESC 1:75
            </text>
          </g>
        </>
      )}
    </svg>
  );
}

/* ================================================================== */
/* Massing — the same development extruded into an isometric model     */
/* ================================================================== */

const KX = Math.cos(Math.PI / 6);
const KY = 0.5;

function project(x: number, y: number, z: number) {
  return [(x - y) * KX, (x + y) * KY - z] as const;
}

function poly(points: readonly (readonly [number, number])[]) {
  return points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

type Block = {
  x: number;
  y: number;
  w: number;
  d: number;
  h: number;
  /** Number of floors — drives the facade modulation. */
  floors: number;
  /** Balcony slabs cantilevering out of the front-left facade. */
  balconies?: boolean;
  /** Rooftop equipment + parapet. */
  crown?: boolean;
};

/* Palette baked in so the volumes read as solid architecture. */
const FILL_TOP = "#16406F";
const FILL_LEFT = "#0E2A4E";
const FILL_RIGHT = "#081C34";
const EDGE = "#4DA3FF";
const GLASS = "#2C6FC9";

/** Front-left facade lives at y = block.y + block.d (varies in x and z). */
function quadXZ(b: Block, x1: number, x2: number, z1: number, z2: number) {
  const y = b.y + b.d;
  return poly([
    project(b.x + x1, y, z1),
    project(b.x + x2, y, z1),
    project(b.x + x2, y, z2),
    project(b.x + x1, y, z2),
  ]);
}

/** Right facade lives at x = block.x + block.w (varies in y and z). */
function quadYZ(b: Block, y1: number, y2: number, z1: number, z2: number) {
  const x = b.x + b.w;
  return poly([
    project(x, b.y + y1, z1),
    project(x, b.y + y2, z1),
    project(x, b.y + y2, z2),
    project(x, b.y + y1, z2),
  ]);
}

function Volume({ b, index, lit }: { b: Block; index: number; lit: boolean }) {
  const base = 160 + index * 120;
  const fh = b.h / b.floors;
  const top = poly([
    project(b.x, b.y, b.h),
    project(b.x + b.w, b.y, b.h),
    project(b.x + b.w, b.y + b.d, b.h),
    project(b.x, b.y + b.d, b.h),
  ]);
  const left = quadXZ(b, 0, b.w, 0, b.h);
  const right = quadYZ(b, 0, b.d, 0, b.h);

  /* Facade modulation: a glazing band per floor split into bays. */
  const bays = Math.max(2, Math.round(b.w / 7));
  const bayW = b.w / bays;
  const sideBays = Math.max(2, Math.round(b.d / 7));
  const sideW = b.d / sideBays;

  return (
    <g>
      {/* solid volume */}
      <g className="fade-layer" style={d(base)}>
        <polygon points={left} fill={FILL_LEFT} />
        <polygon points={right} fill={FILL_RIGHT} />
        <polygon points={top} fill={FILL_TOP} />
      </g>

      {/* glazing */}
      <g className="fade-layer" style={d(base + 140)}>
        {Array.from({ length: b.floors }, (_, f) => {
          const z0 = f * fh + fh * 0.22;
          const z1 = f * fh + fh * 0.82;
          return (
            <g key={f}>
              {Array.from({ length: bays }, (_, k) => (
                <polygon
                  key={`l${k}`}
                  points={quadXZ(b, k * bayW + bayW * 0.16, (k + 1) * bayW - bayW * 0.16, z0, z1)}
                  fill={lit && (f + k) % 3 !== 0 ? "#F2B45C" : GLASS}
                  fillOpacity={lit && (f + k) % 3 !== 0 ? 0.5 : 0.42}
                />
              ))}
              {Array.from({ length: sideBays }, (_, k) => (
                <polygon
                  key={`r${k}`}
                  points={quadYZ(b, k * sideW + sideW * 0.18, (k + 1) * sideW - sideW * 0.18, z0, z1)}
                  fill={lit && (f + k) % 4 === 1 ? "#F2B45C" : GLASS}
                  fillOpacity={lit && (f + k) % 4 === 1 ? 0.34 : 0.2}
                />
              ))}
            </g>
          );
        })}
      </g>

      {/* floor slabs — drawn line by line */}
      <g stroke={EDGE} strokeWidth="0.35" opacity="0.5">
        {Array.from({ length: b.floors - 1 }, (_, f) => {
          const z = (f + 1) * fh;
          return (
            <polyline
              key={f}
              className="draw"
              pathLength="1"
              points={poly([
                project(b.x, b.y + b.d, z),
                project(b.x + b.w, b.y + b.d, z),
                project(b.x + b.w, b.y, z),
              ])}
              style={d(base + 220 + f * 40)}
            />
          );
        })}
      </g>

      {/* cantilevered balcony slabs on the front-left facade */}
      {b.balconies && (
        <g className="fade-layer" style={d(base + 320)}>
          {Array.from({ length: b.floors }, (_, f) => {
            if (f === 0) return null;
            const z = f * fh;
            const y0 = b.y + b.d;
            const y1 = y0 + 3.4;
            const x0 = b.x + b.w * 0.12;
            const x1 = b.x + b.w * 0.88;
            const slab = poly([
              project(x0, y0, z),
              project(x1, y0, z),
              project(x1, y1, z),
              project(x0, y1, z),
            ]);
            const rail = poly([
              project(x0, y1, z),
              project(x1, y1, z),
              project(x1, y1, z + fh * 0.34),
              project(x0, y1, z + fh * 0.34),
            ]);
            return (
              <g key={f}>
                <polygon points={slab} fill="#1B4E86" fillOpacity="0.9" />
                <polygon points={rail} fill={EDGE} fillOpacity="0.16" stroke={EDGE} strokeWidth="0.25" strokeOpacity="0.5" />
              </g>
            );
          })}
        </g>
      )}

      {/* volume edges */}
      <g stroke={EDGE} strokeWidth="0.7" opacity="0.9">
        <polyline
          className="draw"
          pathLength="1"
          points={poly([
            project(b.x, b.y + b.d, 0),
            project(b.x, b.y + b.d, b.h),
            project(b.x + b.w, b.y + b.d, b.h),
            project(b.x + b.w, b.y + b.d, 0),
          ])}
          style={d(base + 40)}
        />
        <polyline
          className="draw"
          pathLength="1"
          points={poly([
            project(b.x + b.w, b.y, 0),
            project(b.x + b.w, b.y, b.h),
            project(b.x, b.y, b.h),
          ])}
          style={d(base + 80)}
        />
        <polyline
          className="draw"
          pathLength="1"
          points={poly([
            project(b.x + b.w, b.y + b.d, b.h),
            project(b.x + b.w, b.y, b.h),
          ])}
          style={d(base + 120)}
        />
      </g>

      {/* rooftop parapet + equipment */}
      {b.crown && (
        <g className="fade-layer" style={d(base + 420)}>
          <polygon
            points={poly([
              project(b.x + 1.5, b.y + 1.5, b.h),
              project(b.x + b.w - 1.5, b.y + 1.5, b.h),
              project(b.x + b.w - 1.5, b.y + b.d - 1.5, b.h),
              project(b.x + 1.5, b.y + b.d - 1.5, b.h),
            ])}
            fill="none"
            stroke={EDGE}
            strokeWidth="0.4"
            opacity="0.6"
          />
          {(() => {
            const box: Block = {
              x: b.x + b.w * 0.3,
              y: b.y + b.d * 0.3,
              w: b.w * 0.32,
              d: b.d * 0.34,
              h: 5,
              floors: 1,
            };
            const bt = poly([
              project(box.x, box.y, b.h + box.h),
              project(box.x + box.w, box.y, b.h + box.h),
              project(box.x + box.w, box.y + box.d, b.h + box.h),
              project(box.x, box.y + box.d, b.h + box.h),
            ]);
            const bl = poly([
              project(box.x, box.y + box.d, b.h),
              project(box.x + box.w, box.y + box.d, b.h),
              project(box.x + box.w, box.y + box.d, b.h + box.h),
              project(box.x, box.y + box.d, b.h + box.h),
            ]);
            return (
              <g>
                <polygon points={bl} fill={FILL_LEFT} stroke={EDGE} strokeWidth="0.3" strokeOpacity="0.6" />
                <polygon points={bt} fill={FILL_TOP} stroke={EDGE} strokeWidth="0.3" strokeOpacity="0.6" />
              </g>
            );
          })()}
        </g>
      )}
    </g>
  );
}

function Tree({ x, y, s = 1, delay }: { x: number; y: number; s?: number; delay: number }) {
  const [bx, by] = project(x, y, 0);
  return (
    <g className="fade-layer" style={d(delay)} transform={`translate(${bx.toFixed(2)} ${by.toFixed(2)})`}>
      <ellipse cx="0" cy="0" rx={4 * s} ry={2 * s} fill="#03080F" opacity="0.6" />
      <line x1="0" y1="0" x2="0" y2={-4.6 * s} stroke="#2A5C86" strokeWidth={0.6 * s} opacity="0.85" />
      <g fill="#12395C">
        <ellipse cx={-2 * s} cy={-6 * s} rx={3 * s} ry={2.6 * s} />
        <ellipse cx={2.2 * s} cy={-6.6 * s} rx={2.8 * s} ry={2.4 * s} />
        <ellipse cx={0} cy={-9 * s} rx={3.2 * s} ry={2.8 * s} />
      </g>
      <g fill="#255F8C" opacity="0.65">
        <ellipse cx={-1.6 * s} cy={-9.6 * s} rx={1.8 * s} ry={1.5 * s} />
        <ellipse cx={1.6 * s} cy={-7.4 * s} rx={1.4 * s} ry={1.2 * s} />
      </g>
    </g>
  );
}

const TOWER_A: Block = { x: 6, y: 10, w: 30, d: 26, h: 116, floors: 13, balconies: true, crown: true };
const TOWER_B: Block = { x: 46, y: 4, w: 26, d: 24, h: 88, floors: 10, balconies: true, crown: true };
const PODIUM: Block = { x: 2, y: 44, w: 42, d: 16, h: 16, floors: 2 };

type MassingProps = {
  className?: string;
  /** Adds warm interior lighting to the facades. */
  lit?: boolean;
};

export function Massing3D({ className = "", lit = false }: MassingProps) {
  const groundPoints = poly([
    project(-14, -10, 0),
    project(88, -10, 0),
    project(88, 92, 0),
    project(-14, 92, 0),
  ]);

  const pool = poly([
    project(56, 56, 0),
    project(76, 56, 0),
    project(76, 80, 0),
    project(56, 80, 0),
  ]);

  const deck = poly([
    project(48, 46, 0),
    project(82, 46, 0),
    project(82, 88, 0),
    project(48, 88, 0),
  ]);

  const drive = poly([
    project(-12, 30, 0),
    project(4, 30, 0),
    project(4, 88, 0),
    project(-12, 88, 0),
  ]);

  return (
    <svg
      viewBox="-96 -106 186 200"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* terrain */}
      <polygon className="fade-layer" points={groundPoints} fill="#061224" style={d(0)} />
      <polygon
        className="draw"
        pathLength="1"
        points={groundPoints}
        stroke={EDGE}
        strokeWidth="0.4"
        opacity="0.3"
        style={d(0)}
      />

      {/* landscape decals behind the buildings */}
      <g className="fade-layer" style={d(60)}>
        <polygon points={drive} fill="#0A1E38" />
      </g>

      {/* ground shadows, offset away from the light */}
      <g className="fade-layer" style={d(120)} opacity="0.55">
        {[TOWER_A, TOWER_B, PODIUM].map((b, i) => (
          <polygon
            key={i}
            points={poly([
              project(b.x, b.y + b.d, 0),
              project(b.x + b.w, b.y + b.d, 0),
              project(b.x + b.w + b.h * 0.16, b.y + b.d + b.h * 0.3, 0),
              project(b.x + b.h * 0.16, b.y + b.d + b.h * 0.3, 0),
            ])}
            fill="#03080F"
          />
        ))}
      </g>

      {/* back landscape */}
      <Tree x={80} y={16} s={0.9} delay={100} />
      <Tree x={80} y={38} s={1} delay={140} />
      <Tree x={-8} y={6} s={0.85} delay={180} />

      {/* volumes, painter-sorted back → front */}
      <Volume b={TOWER_A} index={0} lit={lit} />
      <Volume b={TOWER_B} index={1} lit={lit} />
      <Volume b={PODIUM} index={2} lit={lit} />

      {/* pool deck sits in front of the podium */}
      <g className="fade-layer" style={d(560)}>
        <polygon points={deck} fill="#0C2440" />
        <polygon points={deck} fill="none" stroke={EDGE} strokeWidth="0.3" opacity="0.35" />
        <polygon points={pool} fill="#1C5FA8" fillOpacity="0.75" />
        <polygon points={pool} fill="none" stroke="#7FC0FF" strokeWidth="0.4" opacity="0.6" />
        {[0, 1, 2].map((i) => (
          <line
            key={i}
            x1={project(56, 62 + i * 6, 0)[0]}
            y1={project(56, 62 + i * 6, 0)[1]}
            x2={project(76, 62 + i * 6, 0)[0]}
            y2={project(76, 62 + i * 6, 0)[1]}
            stroke="#9CD2FF"
            strokeWidth="0.25"
            opacity="0.4"
          />
        ))}
        {/* sun loungers along the deck */}
        {[0, 1, 2].map((i) => {
          const [lx, ly] = project(80, 58 + i * 8, 0);
          return (
            <g key={`l${i}`} transform={`translate(${lx.toFixed(2)} ${ly.toFixed(2)})`}>
              <polygon points="0,0 5,2.5 2,4 -3,1.5" fill="#123A63" stroke={EDGE} strokeWidth="0.2" strokeOpacity="0.5" />
            </g>
          );
        })}
      </g>

      {/* front landscape */}
      <Tree x={4} y={62} s={1.05} delay={880} />
      <Tree x={22} y={80} s={0.95} delay={920} />
      <Tree x={44} y={90} s={1.1} delay={960} />
      <Tree x={-8} y={84} s={1} delay={1000} />

      {/* site annotation — leader lines pointing at each volume */}
      <g
        className="fade-layer"
        style={d(1080)}
        fill="currentColor"
        fontSize="4"
        fontWeight="700"
        letterSpacing="1"
      >
        <g stroke={EDGE} strokeWidth="0.3" opacity="0.45">
          <path d="M-50-66h18M46-46h13M-70 27h18M36 62h-14" />
          <circle cx="-32" cy="-66" r="0.9" fill={EDGE} stroke="none" />
          <circle cx="59" cy="-46" r="0.9" fill={EDGE} stroke="none" />
          <circle cx="-52" cy="27" r="0.9" fill={EDGE} stroke="none" />
          <circle cx="22" cy="62" r="0.9" fill={EDGE} stroke="none" />
        </g>
        <g opacity="0.55">
          <text x="-53" y="-67" textAnchor="end">
            TORRE 01
          </text>
          <text x="-53" y="-61" textAnchor="end" fontSize="3.4" fontWeight="500" opacity="0.75">
            13 PAVIMENTOS
          </text>
          <text x="62" y="-47">
            TORRE 02
          </text>
          <text x="62" y="-41" fontSize="3.4" fontWeight="500" opacity="0.75">
            10 PAVIMENTOS
          </text>
          <text x="-73" y="26" textAnchor="end">
            CLUBE
          </text>
          <text x="-73" y="32" textAnchor="end" fontSize="3.4" fontWeight="500" opacity="0.75">
            SALÃO · ACADEMIA
          </text>
          <text x="39" y="61">
            LAZER
          </text>
          <text x="39" y="67" fontSize="3.4" fontWeight="500" opacity="0.75">
            PISCINA · DECK
          </text>
        </g>
      </g>
    </svg>
  );
}
