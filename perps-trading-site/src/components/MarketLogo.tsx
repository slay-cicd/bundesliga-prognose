"use client";

import type { Market } from "@/lib/markets";

// Simple-icons path data (hardcoded to avoid bundling the full package)
// Source: https://simpleicons.org — verify paths against upstream before edits
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
    path: "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z",
  },
  AMZN: {
    hex: "FF9900",
    path: "M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.525.13.12.174.09.336-.12.48-.256.19-.6.41-1.006.654-1.244.743-2.64 1.316-4.185 1.726a17.617 17.617 0 01-10.951-.577 17.88 17.88 0 01-5.43-3.35c-.1-.074-.151-.15-.151-.22 0-.047.021-.09.051-.13zm6.565-6.218c0-1.005.247-1.863.743-2.577.495-.71 1.17-1.25 2.04-1.615.796-.335 1.756-.575 2.912-.72.39-.046 1.033-.103 1.92-.174v-.37c0-.93-.105-1.558-.3-1.875-.302-.43-.78-.65-1.44-.65h-.182c-.48.046-.896.196-1.246.46-.35.27-.575.63-.675 1.096-.06.3-.206.465-.435.51l-2.52-.315c-.248-.06-.372-.18-.372-.39 0-.046.007-.09.022-.15.247-1.29.855-2.25 1.82-2.88.976-.616 2.1-.975 3.39-1.05h.54c1.65 0 2.957.434 3.888 1.29.135.15.27.3.405.48.12.165.224.314.283.45.075.134.15.33.195.57.06.254.105.42.135.51.03.104.062.3.076.615.01.313.02.493.02.553v5.28c0 .376.06.72.165 1.036.105.313.21.54.315.674l.51.674c.09.136.136.256.136.36 0 .12-.06.226-.18.314-1.2 1.05-1.86 1.62-1.963 1.71-.165.135-.375.15-.63.045a6.062 6.062 0 01-.526-.496l-.31-.347a9.391 9.391 0 01-.317-.42l-.3-.435c-.81.886-1.603 1.44-2.4 1.665-.494.15-1.093.227-1.83.227-1.11 0-2.04-.343-2.76-1.034-.72-.69-1.08-1.665-1.08-2.94l-.05-.076zm3.753-.438c0 .566.14 1.02.425 1.364.285.34.675.512 1.155.512.045 0 .106-.007.195-.02.09-.016.134-.023.166-.023.614-.16 1.08-.553 1.424-1.178.165-.28.285-.58.36-.91.09-.32.12-.59.135-.8.015-.195.015-.54.015-1.005v-.54c-.84 0-1.484.06-1.92.18-1.275.36-1.92 1.17-1.92 2.43l-.035-.02zm9.162 7.027c.03-.06.075-.11.132-.17.362-.243.714-.41 1.05-.5a8.094 8.094 0 011.612-.24c.14-.012.28 0 .41.03.65.06 1.05.168 1.172.33.063.09.099.228.099.39v.15c0 .51-.149 1.11-.424 1.8-.278.69-.664 1.248-1.156 1.68-.073.06-.14.09-.197.09-.03 0-.06 0-.09-.012-.09-.044-.107-.12-.064-.24.54-1.26.806-2.143.806-2.64 0-.15-.03-.27-.087-.344-.145-.166-.55-.257-1.224-.257-.243 0-.533.016-.87.046-.363.045-.7.09-1 .135-.09 0-.148-.014-.18-.044-.03-.03-.036-.047-.02-.077 0-.017.006-.03.02-.063v-.06z",
  },
  ANTH: {
    hex: "D4A27F",
    path: "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z",
  },
  SPCX: {
    hex: "005288",
    path: "M24 7.417C8.882 8.287 1.89 14.75.321 16.28L0 16.583h2.797C10.356 9.005 21.222 7.663 24 7.417zm-17.046 6.35c-.472.321-.945.68-1.398 1.02l2.457 1.796h2.778zM2.948 10.8H.189l3.25 2.381c.473-.321 1.02-.661 1.512-.945Z",
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

// Forex pair → { base, quote } currency codes (rendered as letter pills
// instead of emoji flags for cross-platform reliability — Windows/Linux
// often lack country-flag emoji fonts, which caused broken tofu boxes.)
const FOREX_CODES: Record<string, { base: string; quote: string; baseColor: string; quoteColor: string }> = {
  "EUR/USD": { base: "EUR", quote: "USD", baseColor: "#003399", quoteColor: "#3C3B6E" },
  "GBP/USD": { base: "GBP", quote: "USD", baseColor: "#CF142B", quoteColor: "#3C3B6E" },
  "USD/JPY": { base: "USD", quote: "JPY", baseColor: "#3C3B6E", quoteColor: "#BC002D" },
  "AUD/USD": { base: "AUD", quote: "USD", baseColor: "#00008B", quoteColor: "#3C3B6E" },
  "USD/CHF": { base: "USD", quote: "CHF", baseColor: "#3C3B6E", quoteColor: "#D52B1E" },
};

function ForexPairIcon({ base, quote, baseColor, quoteColor, size }: { base: string; quote: string; baseColor: string; quoteColor: string; size: number }) {
  // Two overlapping rounded pills showing the pair's currency codes.
  const borderRadius = size * 0.25;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius,
        position: "relative",
        overflow: "hidden",
        flexShrink: 0,
        background: "var(--color-surface-2, #141414)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(135deg, ${baseColor} 0%, ${baseColor} 50%, ${quoteColor} 50%, ${quoteColor} 100%)`,
          opacity: 0.85,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.22,
          fontWeight: 700,
          color: "#fff",
          letterSpacing: "-0.02em",
          textShadow: "0 1px 2px rgba(0,0,0,0.5)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          lineHeight: 1,
          textAlign: "center",
        }}
      >
        <span>
          {base}
          <span style={{ opacity: 0.7, margin: "0 0.1em" }}>/</span>
          {quote}
        </span>
      </div>
    </div>
  );
}

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
    const codes = FOREX_CODES[pair];
    if (codes) {
      return <ForexPairIcon {...codes} size={size} />;
    }
    // Fallback: show pair text on neutral pill
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
          fontSize: size * 0.22,
          fontWeight: 700,
          color: "#fff",
          fontFamily: "system-ui",
          letterSpacing: "-0.02em",
        }}
      >
        {pair.replace("/", " / ")}
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
