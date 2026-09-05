/**
 * Device mockups and digital-interface vectors. Same rules as `arch.tsx`:
 * pure SVG, CSS-only motion, no frame loop.
 */

/* ------------------------------------------------------------------ */
/* Device stack — laptop + phone running an immersive 3D property site */
/* ------------------------------------------------------------------ */

export function DeviceStack({ className = "" }: { className?: string }) {
  const delay = (ms: number) => ({ "--draw-delay": `${ms}ms` }) as React.CSSProperties;

  return (
    <svg
      viewBox="0 0 480 320"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* laptop shell */}
      <g stroke="currentColor" strokeWidth="1.6">
        <path className="draw" pathLength="1" style={delay(0)} d="M36 34h332v206H36z" />
        <path className="draw" pathLength="1" style={delay(140)} d="M18 252h368l-14 20H32z" />
      </g>
      <rect x="36" y="34" width="332" height="206" className="fade-layer" fill="#0A263A" style={delay(120)} />
      <rect x="18" y="252" width="368" height="2" className="fade-layer" fill="currentColor" opacity="0.18" style={delay(160)} />

      {/* browser chrome + site nav */}
      <g className="fade-layer" style={delay(300)}>
        <rect x="36" y="34" width="332" height="12" fill="currentColor" opacity="0.06" />
        <circle cx="45" cy="40" r="1.6" fill="currentColor" opacity="0.3" />
        <circle cx="51" cy="40" r="1.6" fill="currentColor" opacity="0.3" />
        <circle cx="57" cy="40" r="1.6" fill="currentColor" opacity="0.3" />
        <rect x="66" y="37" width="120" height="6" rx="3" fill="currentColor" opacity="0.1" />
        <text x="70" y="42" fill="currentColor" fontSize="4" fontWeight="500" letterSpacing="0.6" opacity="0.5">
          residencial-aurora.com.br
        </text>
        {/* site header */}
        <text x="46" y="60" fill="currentColor" fontSize="6.5" fontWeight="800" letterSpacing="1.4" opacity="0.85">
          AURORA
        </text>
        <g fill="currentColor" fontSize="4.2" fontWeight="600" letterSpacing="1" opacity="0.45">
          <text x="196" y="60">TOUR 3D</text>
          <text x="232" y="60">PLANTAS</text>
          <text x="272" y="60">LOCALIZAÇÃO</text>
        </g>
        <rect x="318" y="52" width="38" height="12" rx="1" fill="var(--color-accent)" opacity="0.9" />
        <text x="337" y="60" textAnchor="middle" fill="var(--color-paper)" fontSize="4.2" fontWeight="700" letterSpacing="0.8">
          AGENDAR
        </text>
        <line x1="36" y1="68" x2="368" y2="68" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
      </g>

      {/* 3D viewport with a real building render */}
      <g className="fade-layer" style={delay(440)}>
        <rect x="36" y="68" width="332" height="118" fill="#0C2C43" />
        {/* sky gradient + horizon */}
        <rect x="36" y="68" width="332" height="118" fill="url(#imovi-sky-grad)" />
        {/* skyline behind */}
        <g fill="#10374E" opacity="0.9">
          <rect x="46" y="128" width="26" height="58" />
          <rect x="76" y="140" width="18" height="46" />
          <rect x="300" y="134" width="22" height="52" />
          <rect x="326" y="146" width="28" height="40" />
        </g>
        {/* hero tower — modulated facade */}
        <g>
          <polygon points="150,186 150,96 196,86 196,186" fill="#15537B" />
          <polygon points="196,186 196,86 236,100 236,186" fill="#0F3E5D" />
          <polygon points="150,96 196,86 236,100 196,110" fill="#1C6390" />
          <g fill="var(--color-accent-soft)" opacity="0.5">
            {Array.from({ length: 10 }, (_, f) =>
              Array.from({ length: 4 }, (_, k) => (
                <rect key={`${f}-${k}`} x={155 + k * 10} y={104 + f * 8} width="6" height="4.4" opacity={(f + k) % 3 === 0 ? 0.35 : 0.8} />
              )),
            )}
          </g>
          <g fill="#2C89C9" opacity="0.35">
            {Array.from({ length: 9 }, (_, f) =>
              Array.from({ length: 3 }, (_, k) => (
                <rect key={`r${f}-${k}`} x={201 + k * 11} y={110 + f * 8} width="7" height="4" />
              )),
            )}
          </g>
          {/* balcony slabs */}
          <g fill="var(--color-accent-soft)" opacity="0.22">
            {Array.from({ length: 9 }, (_, f) => (
              <rect key={f} x="150" y={110 + f * 8} width="46" height="1.4" />
            ))}
          </g>
          {/* podium + landscaping */}
          <rect x="128" y="170" width="130" height="16" fill="#124465" />
          <rect x="128" y="170" width="130" height="1.2" fill="var(--color-accent-soft)" opacity="0.4" />
          <g fill="#15557A">
            <ellipse cx="122" cy="180" rx="9" ry="6" />
            <ellipse cx="266" cy="181" rx="8" ry="5.5" />
            <ellipse cx="284" cy="183" rx="6" ry="4" />
          </g>
        </g>
        {/* viewport HUD */}
        <g fill="var(--color-accent-soft)" opacity="0.7">
          <rect x="46" y="76" width="30" height="9" rx="1" fillOpacity="0.18" />
          <text x="61" y="82.5" textAnchor="middle" fill="#A3DAF8" fontSize="4" fontWeight="700" letterSpacing="0.8">
            360°
          </text>
        </g>
        <g stroke="var(--color-paper)" strokeWidth="0.5" opacity="0.35">
          <path d="M344 76v10M339 81h10" />
        </g>
        {/* orbit control pill */}
        <g className="fade-layer" style={delay(680)}>
          <rect x="160" y="168" width="84" height="12" rx="6" fill="#0A263A" fillOpacity="0.85" stroke="var(--color-accent-soft)" strokeOpacity="0.4" strokeWidth="0.5" />
          <circle cx="170" cy="174" r="3" fill="none" stroke="#A3DAF8" strokeWidth="0.6" />
          <path d="M167 174h6M170 171v6" stroke="#A3DAF8" strokeWidth="0.5" />
          <text x="182" y="176" fill="#A3DAF8" fontSize="4" fontWeight="600" letterSpacing="0.8">
            ARRASTE PARA GIRAR
          </text>
        </g>
      </g>

      {/* screen scan sweep */}
      <g clipPath="url(#imovi-screen-clip)">
        <rect className="sweep" x="36" y="68" width="332" height="30" fill="url(#imovi-sweep-grad)" opacity="0.45" />
      </g>

      {/* unit picker row — floor plan thumbnails with real plan lines */}
      <g className="fade-layer" style={delay(600)}>
        <text x="46" y="196" fill="currentColor" fontSize="4.4" fontWeight="700" letterSpacing="1.4" opacity="0.5">
          PLANTAS DISPONÍVEIS
        </text>
        {[
          { t: "TIPO A", s: "84 m² · 2 SUÍTES" },
          { t: "TIPO B", s: "112 m² · 3 SUÍTES" },
          { t: "COBERTURA", s: "186 m² · DUPLEX" },
        ].map((u, i) => (
          <g key={u.t} transform={`translate(${46 + i * 104} 202)`}>
            <rect width="96" height="32" fill="currentColor" fillOpacity={i === 0 ? 0.1 : 0.05} />
            <rect
              width="96"
              height="32"
              fill="none"
              stroke={i === 0 ? "var(--color-accent-soft)" : "currentColor"}
              strokeWidth="0.5"
              strokeOpacity={i === 0 ? 0.8 : 0.2}
            />
            {/* mini plan */}
            <g stroke="currentColor" strokeWidth="0.5" opacity="0.55" fill="none">
              <rect x="6" y="6" width="26" height="20" />
              <path d="M6 17h26M20 6v11" />
              <path d="M14 26v-4" strokeWidth="0.4" />
            </g>
            <text x="40" y="14" fill="currentColor" fontSize="4.6" fontWeight="700" letterSpacing="0.8" opacity="0.85">
              {u.t}
            </text>
            <text x="40" y="23" fill={i === 0 ? "var(--color-accent-soft)" : "currentColor"} fontSize="3.8" fontWeight="500" letterSpacing="0.6" opacity="0.7">
              {u.s}
            </text>
          </g>
        ))}
      </g>

      {/* phone */}
      <g>
        <rect
          x="352"
          y="112"
          width="104"
          height="184"
          rx="12"
          className="fade-layer"
          fill="var(--color-ink)"
          style={delay(760)}
        />
        <rect
          x="352"
          y="112"
          width="104"
          height="184"
          rx="12"
          className="draw"
          pathLength="1"
          stroke="currentColor"
          strokeWidth="1.4"
          style={delay(760)}
        />
        <g className="fade-layer" style={delay(900)}>
          <rect x="390" y="120" width="28" height="4" rx="2" fill="currentColor" opacity="0.35" />
          {/* phone viewport: same tower, portrait framing */}
          <rect x="360" y="132" width="88" height="72" fill="#0C2C43" />
          <rect x="360" y="132" width="88" height="72" fill="url(#imovi-sky-grad)" />
          <polygon points="392,204 392,146 412,141 412,204" fill="#15537B" />
          <polygon points="412,204 412,141 430,148 430,204" fill="#0F3E5D" />
          <polygon points="392,146 412,141 430,148 412,153" fill="#1C6390" />
          <g fill="var(--color-accent-soft)" opacity="0.55">
            {Array.from({ length: 8 }, (_, f) =>
              Array.from({ length: 2 }, (_, k) => (
                <rect key={`${f}-${k}`} x={395 + k * 8} y={150 + f * 6.4} width="5" height="3.4" opacity={(f + k) % 3 === 0 ? 0.4 : 0.85} />
              )),
            )}
          </g>
          <rect x="378" y="194" width="60" height="10" fill="#124465" />
          <g fill="#15557A">
            <ellipse cx="374" cy="199" rx="6" ry="4" />
            <ellipse cx="442" cy="200" rx="5" ry="3.4" />
          </g>
          {/* app UI */}
          <text x="362" y="216" fill="currentColor" fontSize="5" fontWeight="800" letterSpacing="0.8" opacity="0.9">
            AURORA · TORRE 01
          </text>
          <text x="362" y="226" fill="currentColor" fontSize="4" fontWeight="500" letterSpacing="0.5" opacity="0.5">
            Tour 3D · 12 ambientes
          </text>
          <g fill="none" stroke="currentColor" strokeOpacity="0.25" strokeWidth="0.5">
            <rect x="362" y="232" width="26" height="10" rx="1" />
            <rect x="391" y="232" width="26" height="10" rx="1" />
            <rect x="420" y="232" width="26" height="10" rx="1" />
          </g>
          <g fill="currentColor" fontSize="3.6" fontWeight="600" letterSpacing="0.4" opacity="0.6">
            <text x="375" y="239" textAnchor="middle">
              PLANTAS
            </text>
            <text x="404" y="239" textAnchor="middle">
              LAZER
            </text>
            <text x="433" y="239" textAnchor="middle">
              MAPA
            </text>
          </g>
          <rect x="362" y="250" width="84" height="16" rx="1" fill="var(--color-accent)" opacity="0.95" />
          <text x="404" y="260.5" textAnchor="middle" fill="var(--color-paper)" fontSize="4.4" fontWeight="700" letterSpacing="1">
            INICIAR TOUR 3D
          </text>
          <rect x="382" y="278" width="44" height="2" rx="1" fill="currentColor" opacity="0.3" />
        </g>
      </g>

      <defs>
        <clipPath id="imovi-screen-clip">
          <rect x="36" y="68" width="332" height="118" />
        </clipPath>
        <linearGradient id="imovi-sky-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0D4468" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#0B2F47" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#0A263A" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="imovi-sweep-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-accent-soft)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Platform UI — sales board + service pipeline in one system          */
/* ------------------------------------------------------------------ */

const NAV = ["PAINEL", "UNIDADES", "PLANTAS", "ATENDIMENTOS", "MÍDIA 3D"] as const;
const STATUS = { free: "#19577D", hold: "#C8922F", sold: "var(--color-accent)" } as const;

/** Deterministic, so the drawing never flickers between renders. */
function unitStatus(col: number, row: number): keyof typeof STATUS {
  const n = (col * 7 + row * 5) % 9;
  if (n < 4) return "sold";
  if (n < 6) return "hold";
  return "free";
}

const PIPELINE = [
  { name: "Ana C.", detail: "Unid. 704 · Tipo A · 84 m²", stage: "TOUR 3D", tone: "var(--color-accent-soft)" },
  { name: "Rafael M.", detail: "Unid. 302 · Tipo B · 96 m²", stage: "VISITA", tone: "#C8922F" },
  { name: "Studio Vale", detail: "Cobertura · 148 m²", stage: "PROPOSTA", tone: "var(--color-accent-soft)" },
  { name: "Helena P.", detail: "Unid. 508 · Tipo A · 84 m²", stage: "TOUR 3D", tone: "var(--color-accent-soft)" },
] as const;

export function SystemGraph({ className = "" }: { className?: string }) {
  const delay = (ms: number) => ({ "--draw-delay": `${ms}ms` }) as React.CSSProperties;

  return (
    <svg
      viewBox="0 0 480 320"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* app frame */}
      <rect x="16" y="16" width="448" height="288" className="fade-layer" fill="#0B283E" style={delay(0)} />
      <rect
        x="16"
        y="16"
        width="448"
        height="288"
        className="draw"
        pathLength="1"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.35"
        style={delay(0)}
      />

      {/* sidebar */}
      <g className="fade-layer" style={delay(120)}>
        <rect x="16" y="16" width="76" height="288" fill="currentColor" opacity="0.04" />
        <line x1="92" y1="16" x2="92" y2="304" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <rect x="28" y="30" width="10" height="12" fill="var(--color-accent)" />
        <rect x="40" y="34" width="4" height="8" fill="var(--color-accent-soft)" opacity="0.8" />
        <text x="50" y="40" fill="currentColor" fontSize="6" fontWeight="800" letterSpacing="1.4" opacity="0.85">
          IMOVIX
        </text>
        {NAV.map((n, i) => (
          <g key={n}>
            {i === 1 && <rect x="16" y={56 + i * 22} width="76" height="18" fill="var(--color-accent)" opacity="0.14" />}
            {i === 1 && <rect x="16" y={56 + i * 22} width="1.6" height="18" fill="var(--color-accent-soft)" />}
            <rect
              x="28"
              y={62 + i * 22}
              width="7"
              height="7"
              fill="none"
              stroke={i === 1 ? "var(--color-accent-soft)" : "currentColor"}
              strokeWidth="0.6"
              opacity={i === 1 ? 0.9 : 0.4}
            />
            <text
              x="40"
              y={68 + i * 22}
              fill={i === 1 ? "var(--color-accent-soft)" : "currentColor"}
              fontSize="4.2"
              fontWeight="600"
              letterSpacing="0.8"
              opacity={i === 1 ? 0.95 : 0.5}
            >
              {n}
            </text>
          </g>
        ))}
        <line x1="28" y1="252" x2="80" y2="252" stroke="currentColor" strokeWidth="0.4" opacity="0.2" />
        <circle cx="33" cy="268" r="5" fill="currentColor" opacity="0.14" />
        <text x="42" y="270" fill="currentColor" fontSize="4" fontWeight="500" letterSpacing="0.6" opacity="0.45">
          EQUIPE
        </text>
      </g>

      {/* top bar */}
      <g className="fade-layer" style={delay(220)}>
        <line x1="92" y1="44" x2="464" y2="44" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
        <text x="104" y="34" fill="currentColor" fontSize="6" fontWeight="800" letterSpacing="1" opacity="0.9">
          RESIDENCIAL AURORA
        </text>
        <text x="104" y="40" fill="currentColor" fontSize="3.6" fontWeight="500" letterSpacing="0.8" opacity="0.4">
          ESPELHO DE UNIDADES · TORRE 01
        </text>
        <rect x="356" y="24" width="46" height="13" rx="1" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
        <text x="362" y="33" fill="currentColor" fontSize="4" fontWeight="600" letterSpacing="0.6" opacity="0.5">
          EXPORTAR
        </text>
        <rect x="408" y="24" width="44" height="13" rx="1" fill="var(--color-accent)" opacity="0.9" />
        <text x="430" y="33" textAnchor="middle" fill="var(--color-paper)" fontSize="4" fontWeight="700" letterSpacing="0.6">
          + MÍDIA 3D
        </text>
      </g>

      {/* sales board */}
      <g className="fade-layer" style={delay(340)}>
        <text x="104" y="60" fill="currentColor" fontSize="4" fontWeight="700" letterSpacing="1.4" opacity="0.45">
          ESPELHO DE VENDAS
        </text>
        {Array.from({ length: 8 }, (_, c) => (
          <text
            key={`c${c}`}
            x={110 + c * 24}
            y="72"
            fill="currentColor"
            fontSize="3.4"
            fontWeight="600"
            letterSpacing="0.4"
            opacity="0.35"
          >
            {`0${c + 1}`}
          </text>
        ))}
        {Array.from({ length: 8 }, (_, c) =>
          Array.from({ length: 7 }, (_, r) => {
            const st = unitStatus(c, r);
            return (
              <g key={`${c}-${r}`}>
                <rect
                  x={104 + c * 24}
                  y={78 + r * 22}
                  width="20"
                  height="18"
                  fill={STATUS[st]}
                  fillOpacity={st === "free" ? 0.3 : st === "hold" ? 0.4 : 0.55}
                />
                <rect
                  x={104 + c * 24}
                  y={78 + r * 22}
                  width="20"
                  height="18"
                  fill="none"
                  stroke={st === "sold" ? "var(--color-accent-soft)" : "currentColor"}
                  strokeWidth="0.4"
                  opacity={st === "sold" ? 0.5 : 0.18}
                />
                <text
                  x={107 + c * 24}
                  y={87 + r * 22}
                  fill="currentColor"
                  fontSize="3.2"
                  fontWeight="600"
                  letterSpacing="0.2"
                  opacity="0.6"
                >
                  {`${7 - r}0${c + 1}`}
                </text>
                <rect x={107 + c * 24} y={89 + r * 22} width="8" height="1.6" fill="currentColor" opacity="0.25" />
              </g>
            );
          }),
        )}
        {/* row labels */}
        {Array.from({ length: 7 }, (_, r) => (
          <text
            key={`r${r}`}
            x="100"
            y={89 + r * 22}
            textAnchor="end"
            fill="currentColor"
            fontSize="3.2"
            fontWeight="600"
            opacity="0.3"
          >
            {`${7 - r}º`}
          </text>
        ))}
      </g>

      {/* legend */}
      <g className="fade-layer" style={delay(620)}>
        {[
          { l: "DISPONÍVEL", c: STATUS.free, o: 0.3 },
          { l: "RESERVADA", c: STATUS.hold, o: 0.4 },
          { l: "VENDIDA", c: STATUS.sold, o: 0.55 },
        ].map((it, i) => (
          <g key={it.l} transform={`translate(${104 + i * 66} 244)`}>
            <rect width="7" height="7" fill={it.c} fillOpacity={it.o} />
            <text x="11" y="6" fill="currentColor" fontSize="3.6" fontWeight="600" letterSpacing="0.6" opacity="0.45">
              {it.l}
            </text>
          </g>
        ))}
      </g>

      {/* right rail: atendimentos */}
      <g className="fade-layer" style={delay(500)}>
        <line x1="300" y1="52" x2="300" y2="296" stroke="currentColor" strokeWidth="0.5" opacity="0.18" />
        <text x="312" y="60" fill="currentColor" fontSize="4" fontWeight="700" letterSpacing="1.4" opacity="0.45">
          ATENDIMENTOS
        </text>
        {PIPELINE.map((p, i) => (
          <g key={p.name} transform={`translate(312 ${70 + i * 34})`}>
            <rect width="140" height="28" fill="currentColor" opacity="0.05" />
            <circle cx="14" cy="14" r="7" fill="currentColor" opacity="0.14" />
            <circle cx="14" cy="11.5" r="2.6" fill="currentColor" opacity="0.3" />
            <path d="M8.5 19a6 6 0 0 1 11 0" fill="currentColor" opacity="0.3" />
            <text x="28" y="12" fill="currentColor" fontSize="4.4" fontWeight="700" letterSpacing="0.4" opacity="0.85">
              {p.name}
            </text>
            <text x="28" y="21" fill="currentColor" fontSize="3.4" fontWeight="500" letterSpacing="0.4" opacity="0.4">
              {p.detail}
            </text>
            <rect x="96" y="9" width="36" height="10" rx="1" fill={p.tone} fillOpacity="0.16" />
            <text x="114" y="16" textAnchor="middle" fill={p.tone} fontSize="3.4" fontWeight="700" letterSpacing="0.5">
              {p.stage}
            </text>
          </g>
        ))}

        {/* live 3D asset attached to the pipeline */}
        <g transform="translate(312 212)">
          <rect width="140" height="52" fill="currentColor" opacity="0.05" />
          <text x="8" y="12" fill="currentColor" fontSize="3.6" fontWeight="700" letterSpacing="1.2" opacity="0.45">
            MÍDIA VINCULADA
          </text>
          <rect x="8" y="18" width="52" height="26" fill="#103752" />
          <polygon points="24,44 24,26 34,23 34,44" fill="#19577D" />
          <polygon points="34,44 34,23 44,26 44,44" fill="#0F3E5D" />
          <polygon points="24,26 34,23 44,26 34,29" fill="#1C6390" />
          <g fill="var(--color-accent-soft)" opacity="0.5">
            {Array.from({ length: 5 }, (_, f) => (
              <rect key={f} x="26" y={29 + f * 3} width="6" height="1.6" />
            ))}
          </g>
          <text x="66" y="26" fill="currentColor" fontSize="3.6" fontWeight="600" letterSpacing="0.4" opacity="0.6">
            TOUR 360 · TIPO A
          </text>
          <text x="66" y="34" fill="currentColor" fontSize="3.4" fontWeight="500" letterSpacing="0.4" opacity="0.35">
            Vídeo 3D · Planta interativa
          </text>
          <rect x="66" y="38" width="64" height="7" rx="1" fill="var(--color-accent)" opacity="0.85" />
          <text x="98" y="43" textAnchor="middle" fill="var(--color-paper)" fontSize="3.4" fontWeight="700" letterSpacing="0.5">
            ENVIAR AO CLIENTE
          </text>
        </g>

        {/* integrations */}
        <g transform="translate(312 274)">
          <text x="0" y="4" fill="currentColor" fontSize="3.4" fontWeight="700" letterSpacing="1.2" opacity="0.4">
            INTEGRAÇÕES
          </text>
          {["CRM", "WHATSAPP", "PORTAIS"].map((t, i) => (
            <g key={t} transform={`translate(${i * 48} 8)`}>
              <rect width="44" height="10" rx="1" fill="none" stroke="currentColor" strokeWidth="0.4" opacity="0.25" />
              <circle cx="7" cy="5" r="1.6" fill="var(--color-accent-soft)" opacity="0.8" />
              <text x="13" y="7" fill="currentColor" fontSize="3.2" fontWeight="600" letterSpacing="0.4" opacity="0.5">
                {t}
              </text>
            </g>
          ))}
        </g>
      </g>

      {/* subtle activity sweep across the board */}
      <g clipPath="url(#imovi-board-clip)">
        <rect className="sweep" x="104" y="78" width="188" height="24" fill="url(#imovi-board-sweep)" opacity="0.25" />
      </g>

      <defs>
        <linearGradient id="imovi-board-sweep" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
          <stop offset="50%" stopColor="var(--color-accent-soft)" stopOpacity="0.85" />
          <stop offset="100%" stopColor="var(--color-accent-soft)" stopOpacity="0" />
        </linearGradient>
        <clipPath id="imovi-board-clip">
          <rect x="104" y="78" width="188" height="154" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Cinematic film frame — image wrapped in a camera HUD                */
/* ------------------------------------------------------------------ */

type FilmFrameProps = {
  src: string;
  alt: string;
  timecode?: string;
  className?: string;
  /** Enables the slow drift; keep off while the frame is inactive. */
  live?: boolean;
  /** Camera readouts. Turn off when the parent stage already draws chrome. */
  hud?: boolean;
};

export function FilmFrame({
  src,
  alt,
  timecode = "00:00:04:12",
  className = "",
  live = false,
  hud = true,
}: FilmFrameProps) {
  return (
    <figure className={`relative overflow-hidden bg-ink ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        className={`h-full w-full object-cover opacity-90 ${live ? "drift" : ""}`}
      />

      {/* letterbox */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[8%] bg-ink" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[8%] bg-ink" />

      {/* HUD */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-40"
      >
        <svg viewBox="0 0 100 100" className="h-9 w-9" fill="none" stroke="var(--color-paper)" strokeWidth="1.4">
          <path d="M50 34v32M34 50h32" />
        </svg>
      </span>

      {hud && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-[8%] flex items-center justify-between px-4 pt-3 text-[0.5625rem] font-bold tracking-[0.22em] text-paper/70 sm:px-6"
          >
            <span className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 rounded-full bg-accent ${live ? "animate-pulse" : ""}`} />
              REC
            </span>
            <span>{timecode}</span>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-[8%] flex items-center justify-between px-4 pb-3 text-[0.5625rem] font-bold tracking-[0.22em] text-paper/50 sm:px-6"
          >
            <span>3D / CINEMA</span>
            <span>24 FPS</span>
          </div>
        </>
      )}

      {/* frame corners */}
      <svg
        aria-hidden="true"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="pointer-events-none absolute inset-0 h-full w-full text-paper/25"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.35"
        vectorEffect="non-scaling-stroke"
      >
        <path d="M4 14V4h10M96 14V4H86M4 86v10h10M96 86v10H86" />
      </svg>
    </figure>
  );
}
