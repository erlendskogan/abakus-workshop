// Small decorative SVG figures for FjøsFinn. They scale to the box that
// `className` gives them. Hover comes from the nearest `.group` ancestor
// (see figurer.module.css). Pure SVG and CSS, so they render on the server.
import { useId, type ReactNode } from "react";
import s from "./figurer.module.css";

type Figur = { className?: string };

// Gradient ids must be unique on the page, and safe inside url(#...).
function useIder() {
  const rå = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (navn: string) => `f${rå}-${navn}`;
}

function Svg({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 120 120"
      width="100%"
      height="100%"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={className ? `${s.figur} ${className}` : s.figur}
    >
      {children}
    </svg>
  );
}

const LYKT = "#f5b84a";
const LAAVE = "#b3362b";
const LAAVE_MORK = "#7d2620";
const SNO = "#e8eef7";

export function LyktFigur({ className }: Figur) {
  const id = useIder();
  return (
    <Svg className={className}>
      <defs>
        <radialGradient id={id("glod")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={LYKT} stopOpacity="0.42" />
          <stop offset="0.55" stopColor={LYKT} stopOpacity="0.1" />
          <stop offset="1" stopColor={LYKT} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("rod")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d4493c" />
          <stop offset="0.55" stopColor={LAAVE} />
          <stop offset="1" stopColor={LAAVE_MORK} />
        </linearGradient>
        <radialGradient id={id("glass")} cx="0.5" cy="0.62" r="0.62">
          <stop offset="0" stopColor="#ffd98a" stopOpacity="0.75" />
          <stop offset="0.45" stopColor={LYKT} stopOpacity="0.28" />
          <stop offset="1" stopColor="#2a2f3d" stopOpacity="0.55" />
        </radialGradient>
        <radialGradient id={id("flamme")} cx="0.5" cy="0.72" r="0.7">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="0.45" stopColor="#ffd06a" />
          <stop offset="1" stopColor="#f08a2c" />
        </radialGradient>
        <linearGradient id={id("metall")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#8a93a6" />
          <stop offset="1" stopColor="#4a5162" />
        </linearGradient>
      </defs>

      {/* Glow */}
      <circle className={s.lyktGlod} cx="60" cy="66" r="46" fill={`url(#${id("glod")})`} />

      {/* Shadow */}
      <ellipse cx="60" cy="104" rx="25" ry="4" fill="#000" opacity="0.4" />

      {/* Handle */}
      <path d="M43 40 C40 14 80 14 77 40" stroke={`url(#${id("metall")})`} strokeWidth="3.2" strokeLinecap="round" />
      <circle cx="60" cy="19" r="3.4" stroke="#8a93a6" strokeWidth="2.4" />

      {/* Glass with the flame */}
      <rect x="45" y="40" width="30" height="46" rx="12" fill={`url(#${id("glass")})`} />
      <g className={s.flamme}>
        <path
          className={s.flammeKjerne}
          d="M60 52 C64.5 59 67.5 63.5 67.5 68.5 A7.5 7.5 0 0 1 52.5 68.5 C52.5 63.5 55.5 59 60 52 Z"
          fill={`url(#${id("flamme")})`}
        />
      </g>
      <rect x="58.6" y="75.5" width="2.8" height="4" rx="1" fill="#3a2a1e" />
      <rect x="45" y="40" width="30" height="46" rx="12" stroke="#fff" strokeOpacity="0.22" strokeWidth="1.4" />
      <path d="M50.5 47 C49 55 49 69 50.5 78" stroke="#fff" strokeOpacity="0.45" strokeWidth="2.6" strokeLinecap="round" />

      {/* Wire guards */}
      <path d="M48 41 C41 54 41 72 48 85" stroke="#2b303c" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M72 41 C79 54 79 72 72 85" stroke="#2b303c" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M43.5 63 H76.5" stroke="#2b303c" strokeWidth="2" strokeLinecap="round" opacity="0.8" />

      {/* Cap */}
      <path d="M53 26 H67 L68 31 H52 Z" fill={LAAVE_MORK} />
      <path d="M41 42 C41 35 47 30 54 30 H66 C73 30 79 35 79 42 Z" fill={`url(#${id("rod")})`} />
      <path d="M47 36 C50 33 54 32.5 58 32.5" stroke="#fff" strokeOpacity="0.4" strokeWidth="2" strokeLinecap="round" />

      {/* Base */}
      <rect x="39" y="84" width="42" height="12" rx="5" fill={`url(#${id("rod")})`} />
      <rect x="39" y="92" width="42" height="4" rx="2" fill={LAAVE_MORK} opacity="0.8" />
      <path d="M44 87.5 H60" stroke="#fff" strokeOpacity="0.35" strokeWidth="1.8" strokeLinecap="round" />
    </Svg>
  );
}

export function SekkFigur({ className }: Figur) {
  const id = useIder();
  return (
    <Svg className={className}>
      <defs>
        <linearGradient id={id("jute")} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0" stopColor="#d9b07a" />
          <stop offset="0.6" stopColor="#b88552" />
          <stop offset="1" stopColor="#8a5f37" />
        </linearGradient>
        <linearGradient id={id("jute-topp")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#c99a62" />
          <stop offset="1" stopColor="#8f6339" />
        </linearGradient>
        <radialGradient id={id("lys")} cx="0.32" cy="0.3" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={id("ull")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d7dbe3" />
          <stop offset="1" stopColor="#9aa1ae" />
        </linearGradient>
        <clipPath id={id("sokk-klipp")}>
          <rect x="30" y="0" width="60" height="42" />
        </clipPath>
      </defs>

      {/* Shadow */}
      <ellipse cx="60" cy="102" rx="33" ry="5" fill="#000" opacity="0.4" />

      <g className={s.sekk}>
        {/* Wool sock, behind the sack mouth */}
        <g clipPath={`url(#${id("sokk-klipp")})`}>
          <g transform="rotate(-10 64 46)">
          <g className={s.sokk}>
            <path
              d="M56 48 V27 C56 21 60 17 65 17 C70 17 73 21 73 27 V48 Z"
              fill={`url(#${id("ull")})`}
            />
            <path d="M56 27 C56 21 60 17 65 17 C70 17 73 21 73 27 C70 25.5 60 25.5 56 27 Z" fill={LAAVE} />
            <path d="M56 33 C61 32 68 32 73 33 M56 39 C61 38 68 38 73 39" stroke={LAAVE} strokeWidth="2.6" />
            <path d="M59.5 23 C60.5 20.5 62.5 19.5 64.5 19.3" stroke="#fff" strokeOpacity="0.45" strokeWidth="1.4" strokeLinecap="round" />
          </g>
          </g>
        </g>

        {/* Mouth of the sack */}
        <path
          d="M45 50 C41 42 37 35 40 30 C45 33 50 31 55 35 C59 31 64 31 68 35 C72 31 77 33 81 30 C83 36 79 43 75 50 Z"
          fill={`url(#${id("jute-topp")})`}
        />
        <path d="M44 34 C47 36 51 35 55 38 C60 35 64 35 68 38 C72 35 76 36 78 34" stroke="#5e3f22" strokeOpacity="0.5" strokeWidth="1.4" />

        {/* Body */}
        <path
          d="M44 49 C30 58 24 76 27 88 C30 99 42 101 60 101 C78 101 90 99 93 88 C96 76 90 58 76 49 Z"
          fill={`url(#${id("jute")})`}
        />
        <path
          d="M44 49 C30 58 24 76 27 88 C30 99 42 101 60 101 C78 101 90 99 93 88 C96 76 90 58 76 49 Z"
          fill={`url(#${id("lys")})`}
        />
        {/* Weave */}
        <g stroke="#6e4a29" strokeOpacity="0.22" strokeWidth="1" strokeLinecap="round">
          <path d="M34 70 C46 67 58 67 70 69" />
          <path d="M31 80 C45 77 56 77 66 79" />
          <path d="M33 90 C44 88 52 88 58 89" />
          <path d="M42 60 C40 72 40 84 42 96" />
        </g>
        {/* Fold at the bottom */}
        <path d="M36 96 C48 99 72 99 85 95" stroke="#5e3f22" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />

        {/* Patch */}
        <g transform="rotate(-8 74 76)">
          <rect x="64" y="66" width="20" height="19" rx="4" fill={LAAVE} />
          <rect x="64" y="66" width="20" height="9" rx="4" fill="#fff" opacity="0.1" />
          <rect x="66.5" y="68.5" width="15" height="14" rx="2.5" stroke={SNO} strokeOpacity="0.75" strokeWidth="1.2" strokeDasharray="2.2 2" />
        </g>

        {/* Rope */}
        <path d="M42 50 C52 54 68 54 78 50" stroke="#5e3f22" strokeWidth="7" strokeLinecap="round" />
        <path d="M42 49 C52 53 68 53 78 49" stroke="#ead2a0" strokeWidth="4.5" strokeLinecap="round" />
        <path d="M47 50 l2 2.4 M53 51.6 l2 2.4 M59 52 l2 2.4 M65 51.6 l2 2.4 M71 50.6 l2 2.4" stroke="#b8945a" strokeWidth="1" />
        <circle cx="62" cy="53" r="3.6" fill="#ead2a0" stroke="#b8945a" strokeWidth="1" />
        <path d="M61 56 C59 61 57 63 54 65 M63 56 C65 60 67 62 70 63" stroke="#ead2a0" strokeWidth="2.4" strokeLinecap="round" />
      </g>
    </Svg>
  );
}

function Lue({ x, className, id }: { x: number; className: string; id: (n: string) => string }) {
  return (
    <g className={className}>
      <path d={`M${x - 9} 30 C${x - 7} 20 ${x - 2} 12 ${x + 1} 8 C${x + 3} 14 ${x + 7} 22 ${x + 9} 30 Z`} fill={`url(#${id("lue")})`} />
      <path d={`M${x - 3} 24 C${x - 2} 18 ${x - 1} 14 ${x + 0.5} 11`} stroke="#fff" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      <rect x={x - 11} y="28" width="22" height="6" rx="3" fill={SNO} />
      <circle cx={x + 1} cy="7.5" r="3.4" fill={SNO} />
    </g>
  );
}

export function GjerdeFigur({ className }: Figur) {
  const id = useIder();
  const lekter = [0, 15, 30];
  return (
    <Svg className={className}>
      <defs>
        <linearGradient id={id("tre")} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#a87449" />
          <stop offset="1" stopColor="#6e4527" />
        </linearGradient>
        <linearGradient id={id("lekt")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b9875a" />
          <stop offset="1" stopColor="#7a4e2c" />
        </linearGradient>
        <linearGradient id={id("lue")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d4493c" />
          <stop offset="1" stopColor={LAAVE_MORK} />
        </linearGradient>
        <linearGradient id={id("sno")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#b9c6da" />
        </linearGradient>
      </defs>

      {/* Shadow */}
      <ellipse cx="60" cy="102" rx="44" ry="4.5" fill="#000" opacity="0.4" />

      {/* Back posts */}
      <rect x="38" y="34" width="6" height="66" rx="3" fill="#5a3920" />
      <rect x="72" y="34" width="6" height="66" rx="3" fill="#5a3920" />

      {/* Slanted laths (skigard) */}
      {lekter.map((k) => (
        <g key={k}>
          <path d={`M16 ${92 - k} L104 ${58 - k}`} stroke="#4a2f1a" strokeWidth="8" strokeLinecap="round" />
          <path d={`M16 ${91 - k} L104 ${57 - k}`} stroke={`url(#${id("lekt")})`} strokeWidth="6" strokeLinecap="round" />
          <path d={`M22 ${88 - k} L98 ${58.6 - k}`} stroke="#fff" strokeOpacity="0.22" strokeWidth="1.2" strokeLinecap="round" />
        </g>
      ))}
      {/* Snow on the top lath */}
      <path d="M20 58 C24 54 30 54 36 51 C50 45 70 37 96 27 C101 25 104 28 100 30.5 C84 38 62 46.5 40 54.5 C32 57.5 24 61 20 58 Z" fill={`url(#${id("sno")})`} />

      {/* Front posts */}
      <rect x="44" y="32" width="7" height="69" rx="3.5" fill={`url(#${id("tre")})`} />
      <rect x="78" y="32" width="7" height="69" rx="3.5" fill={`url(#${id("tre")})`} />
      {/* Willow bindings */}
      <g stroke="#3b2513" strokeWidth="3.4" strokeLinecap="round">
        <path d="M37 47 C42 49 47 49 52 46 M37 78 C42 80 47 80 52 77 M71 41 C76 43 81 43 86 40 M71 72 C76 74 81 74 86 71" />
      </g>

      {/* Snow caps on the posts */}
      <path d="M36 35 C36 29 53 29 53 35 C53 37 36 37 36 35 Z" fill={`url(#${id("sno")})`} />
      <path d="M70 35 C70 29 87 29 87 35 C87 37 70 37 70 35 Z" fill={`url(#${id("sno")})`} />

      {/* Ground snow */}
      <path d="M6 104 C14 92 30 90 46 95 C58 90 76 88 92 93 C102 92 110 96 114 104 C80 107 40 107 6 104 Z" fill={`url(#${id("sno")})`} />
      <path d="M20 96 C28 93 36 93 42 95" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />

      {/* Two hats meet at the fence */}
      <Lue x={44.5} className={s.lueVenstre} id={id} />
      <Lue x={78.5} className={s.lueHoyre} id={id} />

      {/* Small heart */}
      <g transform="translate(-2.5 2)">
      <path
        className={s.hjerte}
        d="M64 22 C64 22 56.5 17.4 56.5 12.6 C56.5 10.2 58.3 8.6 60.3 8.6 C61.9 8.6 63.2 9.6 64 11 C64.8 9.6 66.1 8.6 67.7 8.6 C69.7 8.6 71.5 10.2 71.5 12.6 C71.5 17.4 64 22 64 22 Z"
        fill={LYKT}
      />
      </g>
    </Svg>
  );
}

export function TomtSokFigur({ className }: Figur) {
  const id = useIder();
  return (
    <Svg className={className}>
      <defs>
        <linearGradient id={id("lue")} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d4493c" />
          <stop offset="0.6" stopColor={LAAVE} />
          <stop offset="1" stopColor={LAAVE_MORK} />
        </linearGradient>
        <radialGradient id={id("hud")} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#f6d2b8" />
          <stop offset="1" stopColor="#d79a7c" />
        </radialGradient>
        <linearGradient id={id("skjegg")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="1" stopColor="#c9d3e3" />
        </linearGradient>
        <linearGradient id={id("fonn")} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.6" stopColor={SNO} />
          <stop offset="1" stopColor="#a9b8cf" />
        </linearGradient>
        <radialGradient id={id("glod")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={LYKT} stopOpacity="0.5" />
          <stop offset="0.5" stopColor={LYKT} stopOpacity="0.14" />
          <stop offset="1" stopColor={LYKT} stopOpacity="0" />
        </radialGradient>
        <radialGradient id={id("smaaflamme")} cx="0.5" cy="0.65" r="0.6">
          <stop offset="0" stopColor="#fff6dc" />
          <stop offset="1" stopColor={LYKT} />
        </radialGradient>
      </defs>

      {/* Lantern glow on the snow */}
      <circle className={s.smaaGlod} cx="96" cy="68" r="30" fill={`url(#${id("glod")})`} />

      <g className={s.nisse}>
        {/* Arm that holds up the lantern */}
        <path d="M82 96 C83 80 88 66 94 55" stroke="#4f5768" strokeWidth="9" strokeLinecap="round" />
        <path d="M80.5 88 C81.5 78 85 68 90 60" stroke="#fff" strokeOpacity="0.16" strokeWidth="2" strokeLinecap="round" />

        <g className={s.hode}>
          {/* Beard */}
          <path
            d="M42 65 C40 84 49 96 58 96 C67 96 76 84 74 65 C70 72 64 74 58 74 C52 74 46 72 42 65 Z"
            fill={`url(#${id("skjegg")})`}
          />
          {/* Face */}
          <circle cx="58" cy="64" r="15" fill={`url(#${id("hud")})`} />
          {/* Cheeks */}
          <ellipse cx="48.5" cy="68" rx="3.4" ry="2.2" fill="#e8806f" opacity="0.45" />
          <ellipse cx="67.5" cy="68" rx="3.4" ry="2.2" fill="#e8806f" opacity="0.45" />
          {/* Beard edge and moustache */}
          <path
            d="M43.5 69 C47 76 52 78 58 78 C64 78 69 76 72.5 69 C73 82 66 90 58 90 C50 90 43 82 43.5 69 Z"
            fill={`url(#${id("skjegg")})`}
          />
          <path
            d="M58 72.5 C54.5 76.5 48 76.5 46 72 C50 73.5 54.5 71.5 58 69.5 C61.5 71.5 66 73.5 70 72 C68 76.5 61.5 76.5 58 72.5 Z"
            fill="#fff"
          />
          {/* Eyes */}
          <g className={s.oyne}>
            <ellipse cx="52.5" cy="63" rx="1.9" ry="2.3" fill="#1b1f2a" />
            <ellipse cx="63.5" cy="63" rx="1.9" ry="2.3" fill="#1b1f2a" />
            <circle cx="53.1" cy="62.2" r="0.6" fill="#fff" />
            <circle cx="64.1" cy="62.2" r="0.6" fill="#fff" />
          </g>
          {/* Nose */}
          <circle cx="58" cy="69" r="4.4" fill="#e48473" />
          <circle cx="56.8" cy="67.8" r="1.3" fill="#fff" opacity="0.55" />
          {/* Hat */}
          <path
            d="M40.5 57 C39 40 50 26 66 25 C76 24.5 82 29 84 36 C79 33.5 74 35 72.5 40 C75.5 46 76 52 76 57 Z"
            fill={`url(#${id("lue")})`}
          />
          <path d="M48 46 C51 37 58 31.5 66 30" stroke="#fff" strokeOpacity="0.3" strokeWidth="2" strokeLinecap="round" />
          <circle cx="84.5" cy="38" r="4.6" fill={SNO} />
          <rect x="38" y="53" width="40" height="8" rx="4" fill={SNO} />
        </g>

        {/* Small lantern, held up in a mitten */}
        <path d="M90 60 C90 51 102 51 102 60" stroke="#8a93a6" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M89 61 C89 58 92 57 96 57 C100 57 103 58 103 61 Z" fill={LAAVE} />
        <rect x="90" y="61" width="12" height="15" rx="4.5" fill="#ffd98a" fillOpacity="0.5" />
        <path
          d="M96 63.5 C98 66.5 99 68.2 99 70.2 A3 3 0 0 1 93 70.2 C93 68.2 94 66.5 96 63.5 Z"
          fill={`url(#${id("smaaflamme")})`}
        />
        <rect x="90" y="61" width="12" height="15" rx="4.5" stroke="#fff" strokeOpacity="0.3" strokeWidth="1" />
        <rect x="89" y="75" width="14" height="4.5" rx="2.2" fill={LAAVE_MORK} />
        <rect x="89" y="54.5" width="11" height="4" rx="2" transform="rotate(-28 94.5 56.5)" fill={SNO} />
        <ellipse cx="96" cy="52" rx="5.6" ry="4.8" fill="#b9bfcb" />
        <ellipse cx="91.8" cy="53.4" rx="2" ry="2.6" fill="#a3aab8" />
        <ellipse cx="94.6" cy="50.4" rx="2" ry="1.3" fill="#fff" opacity="0.28" />
      </g>

      {/* Snowdrift in front */}
      <path
        d="M4 106 C8 92 22 82 38 84 C46 85 50 88 56 90 C64 82 80 78 96 82 C106 85 114 94 116 106 C116 110 112 112 106 112 H14 C8 112 4 110 4 106 Z"
        fill={`url(#${id("fonn")})`}
      />
      <path d="M22 88 C28 85 34 84 40 85" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      <path d="M76 84 C84 82 92 82 98 84" stroke="#fff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
      {/* Sparkles */}
      <circle cx="30" cy="94" r="1" fill="#fff" />
      <circle cx="70" cy="95" r="0.9" fill="#fff" />
      <circle cx="98" cy="96" r="1" fill="#fff" />
    </Svg>
  );
}
