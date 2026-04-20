"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

const SERIF = "var(--font-cormorant, Georgia, serif)";
const BURNT = "#C4622D";

const PRIZES = [
  { v: 20, label: "€20", weight: 40, color: "#3a3a3d" },
  { v: 30, label: "€30", weight: 25, color: "#4a3a2d" },
  { v: 50, label: "€50", weight: 18, color: BURNT },
  { v: 75, label: "€75", weight: 10, color: "#d08040" },
  { v: 100, label: "€100", weight: 5, color: "#eab308" },
  { v: 250, label: "€250", weight: 2, color: "#22c55e" },
];

export function FunnelBonusWheel() {
  const prefersReduced = useReducedMotion();
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<typeof PRIZES[number] | null>(null);
  const [rotation, setRotation] = useState(0);

  const segCount = PRIZES.length;
  const segAngle = 360 / segCount;

  const spin = () => {
    if (spinning) return;
    // Weighted random
    const totalWeight = PRIZES.reduce((s, p) => s + p.weight, 0);
    let rand = Math.random() * totalWeight;
    let idx = 0;
    for (let i = 0; i < PRIZES.length; i++) {
      rand -= PRIZES[i].weight;
      if (rand <= 0) { idx = i; break; }
    }
    // Bias demo result: favor €50 so user feels they "won big"
    if (Math.random() > 0.35) idx = 2; // €50
    else if (Math.random() > 0.5) idx = 3; // €75

    const targetAngle = 360 * 6 + (360 - (idx * segAngle + segAngle / 2));
    setSpinning(true);
    setResult(null);
    setRotation(targetAngle);
    setTimeout(() => {
      setResult(PRIZES[idx]);
      setSpinning(false);
    }, 3600);
  };

  // Auto-spin on mount for demo effect after a delay
  useEffect(() => {
    if (prefersReduced) {
      setResult(PRIZES[2]);
      return;
    }
    const t = setTimeout(() => spin(), 1200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  return (
    <div
      className="rounded-2xl border p-6 sm:p-8 text-center"
      style={{
        background: "radial-gradient(ellipse at 50% 30%, rgba(196,98,45,0.14) 0%, #0e0e10 60%)",
        borderColor: `${BURNT}33`,
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <p className="text-[10px] uppercase tracking-[0.2em] font-semibold mb-1" style={{ color: BURNT }}>
        Mystery Bonus
      </p>
      <p
        className="mb-6"
        style={{
          fontFamily: SERIF,
          fontSize: "1rem",
          fontStyle: "italic",
          color: "var(--color-text-muted)",
          fontWeight: 300,
        }}
      >
        Jeder gewinnt. Die Frage ist nur: wie viel.
      </p>

      {/* Wheel */}
      <div className="relative mx-auto mb-6" style={{ width: 240, height: 240 }}>
        {/* Pointer */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-20"
          style={{
            top: -8,
            width: 0,
            height: 0,
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `16px solid ${BURNT}`,
            filter: `drop-shadow(0 0 6px ${BURNT})`,
          }}
        />

        <motion.svg
          viewBox="0 0 100 100"
          width="240"
          height="240"
          animate={{ rotate: rotation }}
          transition={{
            duration: spinning ? 3.4 : 0,
            ease: [0.12, 0.8, 0.25, 1],
          }}
          style={{ filter: `drop-shadow(0 0 24px ${BURNT}55)` }}
        >
          {PRIZES.map((p, i) => {
            const start = i * segAngle;
            const end = start + segAngle;
            const largeArc = segAngle > 180 ? 1 : 0;
            const x1 = 50 + 50 * Math.cos((start - 90) * Math.PI / 180);
            const y1 = 50 + 50 * Math.sin((start - 90) * Math.PI / 180);
            const x2 = 50 + 50 * Math.cos((end - 90) * Math.PI / 180);
            const y2 = 50 + 50 * Math.sin((end - 90) * Math.PI / 180);
            const midAngle = start + segAngle / 2;
            const tx = 50 + 30 * Math.cos((midAngle - 90) * Math.PI / 180);
            const ty = 50 + 30 * Math.sin((midAngle - 90) * Math.PI / 180);
            return (
              <g key={i}>
                <path
                  d={`M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`}
                  fill={p.color}
                  stroke="#0a0a0b"
                  strokeWidth="0.6"
                />
                <text
                  x={tx}
                  y={ty}
                  fontSize="8"
                  fontWeight="700"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#fff"
                  transform={`rotate(${midAngle} ${tx} ${ty})`}
                  style={{ fontFamily: "system-ui, sans-serif" }}
                >
                  {p.label}
                </text>
              </g>
            );
          })}
          {/* Center hub */}
          <circle cx="50" cy="50" r="7" fill="#0a0a0b" stroke={BURNT} strokeWidth="0.8" />
          <circle cx="50" cy="50" r="2.5" fill={BURNT} />
        </motion.svg>
      </div>

      <AnimatePresence mode="wait">
        {result && !spinning ? (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.2em] mb-1 font-semibold" style={{ color: "var(--color-text-muted)" }}>
              Dein Startkapital
            </p>
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "clamp(52px, 10vw, 80px)",
                fontWeight: 400,
                fontStyle: "italic",
                color: "#22c55e",
                lineHeight: 1,
                letterSpacing: "-0.02em",
                textShadow: "0 0 40px rgba(34,197,94,0.4)",
              }}
            >
              {result.label}
            </p>
            <p
              className="mt-2"
              style={{
                fontFamily: SERIF,
                fontSize: "1.05rem",
                fontStyle: "italic",
                color: "#22c55e",
                fontWeight: 300,
              }}
            >
              Reserviert.
            </p>
            <p className="text-[11px] mt-1" style={{ color: "var(--color-text-muted)" }}>
              Wird nach Kontoeröffnung aktiviert
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="spinning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p
              style={{
                fontFamily: SERIF,
                fontSize: "1.8rem",
                fontStyle: "italic",
                color: BURNT,
                fontWeight: 300,
              }}
            >
              Dreht sich…
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
