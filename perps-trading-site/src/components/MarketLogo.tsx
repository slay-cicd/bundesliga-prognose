"use client";

import type { Market } from "@/lib/markets";

// Simple-icons path data (hardcoded to avoid bundling the full package)
const BRAND_ICONS: Record<string, { path: string; hex: string }> = {
  NVDA: {
    hex: "76B900",
    path: "M8.948 8.798v-1.43a6.7 6.7 0 0 1 .424-.018c3.922-.124 6.493 3.374 6.493 3.374s-2.66 3.023-5.535 3.023c-.462 0-.907-.06-1.317-.166V9.854c.54.066 1.136.105 1.743.105 2.127 0 3.35-.984 3.35-2.437 0-1.414-1.192-2.267-2.96-2.267a8.5 8.5 0 0 0-2.198.299V9.24l-.005.005-.006-.005V8.806a9.28 9.28 0 0 0-2.04-.26C3.9 8.546 1.5 9.47.005 11.297L0 11.29v-2.47C1.316 7.226 3.213 6.5 5.38 6.5c1.303 0 2.495.262 3.568.298zm0 5.668v1.964c-1.026-.046-2.035-.26-2.94-.61-2.024-.784-3.543-2.34-3.543-4.32 0-1.153.47-2.153 1.232-2.92.76-.765 1.85-1.307 3.072-1.57v1.64c-.87.23-1.62.683-2.053 1.3-.375.533-.498 1.15-.308 1.77.4 1.303 1.94 2.384 4.54 2.746zm0-11.44V4.98c.16-.013.32-.02.483-.02 3.012 0 5.33 1.515 5.33 4.025 0 2.21-1.702 3.844-4.41 4.164v-1.737c1.476-.32 2.384-1.22 2.384-2.497 0-1.478-1.25-2.53-3.337-2.564a7.5 7.5 0 0 0-.45.024z",
  },
  TSLA: {
    hex: "CC0000",
    path: "M12 5.362l2.475-3.026s4.245.09 8.471 2.054c-1.082 1.636-3.231 2.438-3.231 2.438-1.698-1.009-4.917-1.32-7.715-1.466zM12 5.362l-2.475-3.026S5.28 2.426 1.054 4.39C2.136 6.026 4.285 6.828 4.285 6.828c1.698-1.009 4.917-1.32 7.715-1.466zM12 7.78c-2.056-.114-4.3.197-5.962.99L12 21.664l5.962-12.895C16.3 7.977 14.056 7.666 12 7.78z",
  },
  AAPL: {
    hex: "555555",
    path: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z",
  },
  META: {
    hex: "0467DF",
    path: "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973.419 1.828 1.521 3.009 2.875 3.009 1.019 0 1.973-.pretend-.948-3.508.948.535 1.947.535 2.482 0 .535 0 1.534 0 2.482 0l.948-3.508c.948 3.508 1.947 3.508 2.482 3.508 1.354 0 2.456-1.181 2.875-3.009.14-.604.21-1.267.21-1.973 0-2.566-.704-5.241-2.044-7.306C13.568 5.31 11.853 4.03 9.885 4.03c-.898 0-1.808.4-2.482 1.048-.674-.648-1.584-1.048-2.488-1.048zm3.396 5.7c-.3.48-.54 1.038-.72 1.648H6.41c-.18-.61-.42-1.168-.72-1.648a4.06 4.06 0 0 1 2.31-.72 4.06 4.06 0 0 1 2.31.72zm-4.62 2.508h4.618c.06.47.09.956.09 1.45 0 .494-.03.98-.09 1.45H5.69c-.06-.47-.09-.956-.09-1.45 0-.494.03-.98.09-1.45zm-.54 3.76c.18.61.42 1.168.72 1.648a4.06 4.06 0 0 1-2.31-.72c.3-.48.54-1.038.72-1.648h.87zm5.7 0h.87c.18.61.42 1.168.72 1.648a4.06 4.06 0 0 1-2.31.72c.3-.48.54-1.038.72-1.648z",
  },
  ANTH: {
    hex: "D4A27F",
    path: "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3745 3.5527h3.7442L10.5383 3.541Zm-.3696 10.3906 2.378-6.1164 2.3728 6.1164Z",
  },
  SPCX: {
    hex: "005288",
    path: "M24 7.417C8.882 8.287 1.89 14.75.321 16.28L0 16.583h2.797C10.356 9.005 21.222 7.612 24 7.417zM6.5 12.5c2.5-1 6-1.5 8-1.5-2 .5-5 1.5-6 3.5C7.5 15.5 5 16 3 15.5c1-1 2-2.5 3.5-3z",
  },
  STRP: {
    hex: "635BFF",
    path: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z",
  },
};

// Crypto symbol → filename mapping
const CRYPTO_SYMS: Record<string, boolean> = {
  BTC: true, ETH: true, SOL: true, XRP: true, ADA: true,
  DOT: true, LINK: true, AVAX: true, MATIC: true, DOGE: true,
  USDT: true, USDC: true,
};

// Forex pair → flag emojis
const FOREX_FLAGS: Record<string, string> = {
  "EUR/USD": "🇪🇺🇺🇸",
  "GBP/USD": "🇬🇧🇺🇸",
  "USD/JPY": "🇺🇸🇯🇵",
  "AUD/USD": "🇦🇺🇺🇸",
  "USD/CHF": "🇺🇸🇨🇭",
};

// Commodity inline SVG glyphs
function GoldIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="6" y="14" width="28" height="16" rx="3" fill="#FFD700" opacity="0.9" />
      <rect x="10" y="10" width="20" height="6" rx="2" fill="#FFC200" />
      <text x="20" y="26" textAnchor="middle" fill="#7A5800" fontSize="9" fontWeight="700" fontFamily="system-ui">AU</text>
    </svg>
  );
}

function SilverIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect x="6" y="14" width="28" height="16" rx="3" fill="#C0C0C0" opacity="0.9" />
      <rect x="10" y="10" width="20" height="6" rx="2" fill="#A0A0A0" />
      <text x="20" y="26" textAnchor="middle" fill="#505050" fontSize="9" fontWeight="700" fontFamily="system-ui">AG</text>
    </svg>
  );
}

function OilIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <ellipse cx="20" cy="26" rx="12" ry="8" fill="#2D2D2D" />
      <path d="M14 20 Q16 10 20 8 Q24 10 26 20" fill="#1A1A2E" stroke="#3D3D3D" strokeWidth="1" />
      <circle cx="20" cy="26" r="4" fill="#FF6B35" opacity="0.8" />
    </svg>
  );
}

function GasIcon({ size }: { size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <path d="M20 8 Q28 16 28 24 Q28 32 20 32 Q12 32 12 24 Q12 16 20 8Z" fill="#FF6B35" opacity="0.8" />
      <path d="M18 20 Q22 14 24 20 Q24 26 20 26 Q16 26 16 22 Q16 20 18 20Z" fill="#FFB347" opacity="0.9" />
    </svg>
  );
}

function IndexIcon({ abbr, color, size }: { abbr: string; color: string; size: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={color} opacity="0.15" />
      <polyline points="6,30 14,20 20,24 28,12 34,16" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <text x="20" y="38" textAnchor="middle" fill={color} fontSize="7" fontWeight="700" fontFamily="system-ui">{abbr}</text>
    </svg>
  );
}

interface MarketLogoProps {
  market: Market;
  size?: number;
}

export function MarketLogo({ market, size = 40 }: MarketLogoProps) {
  const { abbr, category, color, pair } = market;
  const borderRadius = size * 0.25;

  // ── Crypto ──────────────────────────────────────────────────────────────────
  if (category === "crypto" && CRYPTO_SYMS[abbr]) {
    return (
      <img
        src={`/logos/crypto/${abbr.toLowerCase()}.svg`}
        alt={abbr}
        width={size}
        height={size}
        style={{ borderRadius, objectFit: "contain", background: "transparent" }}
      />
    );
  }

  // ── Forex ────────────────────────────────────────────────────────────────────
  if (category === "forex") {
    const flags = FOREX_FLAGS[pair] ?? pair.slice(0, 2);
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius,
          background: `${color}22`,
          border: `1px solid ${color}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.32,
          letterSpacing: "-2px",
          lineHeight: 1,
        }}
      >
        {flags}
      </div>
    );
  }

  // ── Commodities ─────────────────────────────────────────────────────────────
  if (category === "commodities") {
    if (abbr === "XAU") return <GoldIcon size={size} />;
    if (abbr === "XAG") return <SilverIcon size={size} />;
    if (abbr === "OIL") return <OilIcon size={size} />;
    if (abbr === "NG")  return <GasIcon size={size} />;
  }

  // ── Indices ──────────────────────────────────────────────────────────────────
  if (category === "indices") {
    return <IndexIcon abbr={abbr} color={color} size={size} />;
  }

  // ── Stocks & Pre-IPO via simple-icons ────────────────────────────────────────
  const brandIcon = BRAND_ICONS[abbr];
  if (brandIcon) {
    const iconColor = "#e5e5e7";
    return (
      <div
        style={{
          width: size,
          height: size,
          borderRadius,
          background: `#${brandIcon.hex}22`,
          border: `1px solid #${brandIcon.hex}44`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: size * 0.18,
          flexShrink: 0,
        }}
      >
        <svg
          role="img"
          viewBox="0 0 24 24"
          style={{ width: "100%", height: "100%" }}
          fill={iconColor}
        >
          <path d={brandIcon.path} />
        </svg>
      </div>
    );
  }

  // ── Fallback: colored letter badge ───────────────────────────────────────────
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        backgroundColor: color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.28,
        fontWeight: 700,
        color: "#fff",
        flexShrink: 0,
        fontFamily: "system-ui",
      }}
    >
      {abbr.slice(0, 3)}
    </div>
  );
}
