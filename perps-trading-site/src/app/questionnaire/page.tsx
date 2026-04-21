"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { mpTrack, mpIdentify, mpSetProfile, mpSetFunnelVariant } from "@/lib/mixpanel";
import { Events } from "@/components/MetaPixel";

const ease = [0.22, 1, 0.36, 1] as const;

/* ─── Question model ─── */
type QuestionType = "single" | "multi" | "top3" | "text" | "multi_with_other";

interface Question {
  id: string;
  question: string;
  type: QuestionType;
  options?: string[];
  showIf?: (answers: Record<string, string | string[]>) => boolean;
  hint?: string;
}

/* ─── 15 Concorde questions — perpetuals & derivatives focus ─── */
const QUESTIONS: Question[] = [
  {
    id: "q1",
    question: "Wie oft tradest du?",
    type: "single",
    options: [
      "Mehrmals täglich",
      "Täglich",
      "Mehrmals pro Woche",
      "1–2× pro Woche",
      "Nur sporadisch",
      "Noch nie — will anfangen",
    ],
  },
  {
    id: "q2",
    question: "Welche Plattformen nutzt du aktuell?",
    type: "multi",
    options: [
      "Trade Republic",
      "Scalable Capital",
      "eToro",
      "Bitpanda",
      "Bitvavo",
      "Binance",
      "Bybit",
      "OKX",
      "Hyperliquid",
      "dYdX",
      "IG / CMC / Plus500 (CFD-Broker)",
      "Andere",
      "Keine",
    ],
  },
  {
    id: "q3",
    question: "Wie erfahren bist du mit Derivaten (Futures, Optionen, CFDs)?",
    type: "single",
    options: [
      "Sehr erfahren — trade täglich mit Hebel",
      "Erfahren — habe schon oft gehandelt",
      "Wenig Erfahrung — 1–2× ausprobiert",
      "Noch gar keine",
    ],
  },
  {
    id: "q4",
    question: "Hast du schon Perpetual Futures (Perps) gehandelt?",
    type: "single",
    options: [
      "Ja, regelmäßig",
      "Ja, ein paar Mal",
      "Nein, aber kenne sie",
      "Nein, nie davon gehört",
    ],
  },
  {
    id: "q5",
    question: "Warum Perps? Was zieht dich daran?",
    type: "multi",
    options: [
      "Hoher Hebel (bis 100×)",
      "Kein Ablaufdatum / kein Rollen",
      "24/7 handeln — auch am Wochenende",
      "Funding Rate für Short-/Long-Bias",
      "Auf fallende Märkte setzen (Short)",
      "Liquidität & enge Spreads",
      "Niedrigere Gebühren vs CFD-Broker",
    ],
    showIf: (a) => a.q4 === "Ja, regelmäßig" || a.q4 === "Ja, ein paar Mal",
  },
  {
    id: "q6",
    question: "Was hält dich bisher von Perps ab?",
    type: "multi",
    options: [
      "Zu komplex / nicht verstanden",
      "Angst vor Liquidation",
      "Steuer / rechtliche Unsicherheit in DE",
      "Nur in Englisch verfügbar",
      "Keine deutsche Anlaufstelle / Support",
      "Kein Vertrauen in Offshore-Plattformen",
      "Noch keine passende Plattform gefunden",
    ],
    showIf: (a) => a.q4 === "Nein, aber kenne sie" || a.q4 === "Nein, nie davon gehört",
  },
  {
    id: "q7",
    question: "Welche Asset-Klassen interessieren dich am meisten?",
    type: "top3",
    options: [
      "Krypto (BTC, ETH, SOL, …)",
      "Aktien (Tesla, Nvidia, Apple, …)",
      "Pre-IPO (SpaceX, Stripe, Anthropic, …)",
      "Indizes (S&P 500, DAX, Nasdaq)",
      "Rohstoffe (Gold, Silber, Öl)",
      "Forex (EUR/USD, GBP/USD, …)",
    ],
  },
  {
    id: "q8",
    question: "Wie viel bewegst du monatlich im Trading?",
    type: "single",
    options: [
      "Unter €500",
      "€500 – €2.000",
      "€2.000 – €10.000",
      "€10.000 – €50.000",
      "Über €50.000",
    ],
  },
  {
    id: "q9",
    question: "Welchen Hebel nutzt du typischerweise?",
    type: "single",
    options: [
      "Kein Hebel (Spot)",
      "2–5×",
      "5–10×",
      "10–25×",
      "25–50×",
      "50×+",
    ],
  },
  {
    id: "q10",
    question: "Was nervt dich am meisten an deiner aktuellen Plattform?",
    type: "multi",
    options: [
      "Schlechte App / Interface",
      "Zu hohe Gebühren / Spreads",
      "Kein Zugang zu Krypto-Perps",
      "Langsame Einzahlungen / Auszahlungen",
      "Schlechte Ausführung / Slippage",
      "Kein deutschsprachiger Support",
      "Kein Zugang zu Pre-IPO / Aktien-Perps",
      "Keine Probleme",
    ],
  },
  {
    id: "q11",
    question: "Was ist dir bei einer Trading-Plattform am wichtigsten?",
    type: "top3",
    options: [
      "Niedrige Gebühren",
      "Hoher Hebel verfügbar",
      "Breites Asset-Angebot",
      "Schnelle Ausführung",
      "Deutscher Support",
      "Einfache Bedienung",
      "Fortgeschrittene Charts / Tools",
      "Schnelle Einzahlungen (SEPA, Krypto)",
    ],
  },
  {
    id: "q12",
    question: "Wie willst du am liebsten einzahlen?",
    type: "single",
    options: [
      "SEPA / Banküberweisung",
      "Kreditkarte",
      "PayPal",
      "Krypto (USDT, USDC, BTC)",
      "Apple Pay / Google Pay",
    ],
  },
  {
    // Replaced "Info-Quellen" with a derivatives-pain question. Signals feature
    // priorities directly instead of marketing channels we already have via UTMs.
    id: "q13",
    question: "Was fehlt dir an deiner aktuellen Plattform am meisten für Derivate-Trading?",
    type: "multi",
    options: [
      "Niedrigere Handelsgebühren / enge Spreads",
      "Höherer Hebel",
      "Cross-Margin / Portfolio-Margin",
      "Isolated Margin Kontrolle pro Position",
      "Stop-Loss / Take-Profit / OCO-Orders",
      "Trailing-Stop",
      "Funding-Rate-Historie & Analyse-Tools",
      "Depth-of-Book / echter Orderbook-View",
      "API / Trading-Bots",
      "TradingView-Integration",
      "Partial Fills / Post-Only / Reduce-Only",
      "Liquidation-Preview vor Position-Open",
      "Mobile App auf Desktop-Niveau",
      "Klare deutsche Steuer-Reports",
    ],
  },
  {
    id: "q14",
    question: "Was beschreibt dich am besten?",
    type: "single",
    options: [
      "Hobby-Trader — aus Spaß",
      "Versuche langfristig Profit zu machen",
      "Semi-professionell — teils davon lebend",
      "Profi — hauptberuflich",
      "Anfänger — lerne gerade",
    ],
  },
  {
    id: "q15",
    question: "Tradest du schon auf Offshore-Plattformen (Binance, Bybit, Hyperliquid, …)?",
    type: "multi_with_other",
    options: [
      "Ja, Binance",
      "Ja, Bybit",
      "Ja, Hyperliquid",
      "Ja, dYdX",
      "Ja, OKX",
      "Nein, nur DE-regulierte Anbieter",
    ],
  },
  {
    // New q16 — concrete Liquidation / Risk-Management behaviour signal.
    // Tells us how mature the trader is and whether they need education
    // (= better onboarding) or advanced risk tools (= better platform).
    id: "q16",
    question: "Wurdest du schon mal liquidiert — und was war der Hauptgrund?",
    type: "single",
    options: [
      "Nein, noch nie",
      "Ja — zu viel Hebel auf eine Position",
      "Ja — Markt hat sich über Nacht gedreht",
      "Ja — Stop-Loss hat nicht ausgelöst / Slippage",
      "Ja — Funding Rate hat mich ausgeblutet",
      "Ja — Plattform-Ausfall in wichtigem Moment",
      "Trade keine gehebelten Produkte",
    ],
  },
  {
    // New q17 — open-text field for the #1 feature request / pain. Purely
    // qualitative and optional, but this is gold for roadmap prioritisation.
    id: "q17",
    question: "Stell dir vor, Concorde startet morgen. Welches eine Feature würde dich sofort wechseln lassen?",
    type: "text",
    hint: "Optional — überspring es einfach",
  },
];

/* ─── Main component ─── */
function QuestionnaireContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const source = searchParams.get("source") || "direct";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [otherText, setOtherText] = useState<Record<string, string>>({});
  const [direction, setDirection] = useState(1);
  const [completed, setCompleted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // On first mount: identify the user by email, tag the funnel variant, and
  // fire Questionnaire Started so we can build a real funnel in Mixpanel.
  useEffect(() => {
    if (email) {
      mpIdentify(email);
      mpSetProfile({ $email: email, questionnaire_source: source });
    }
    if (source === "funnel" || source === "funnel1") {
      mpSetFunnelVariant(source);
    }
    mpTrack("Questionnaire Started", { email, source });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleQuestions = QUESTIONS.filter((q) => !q.showIf || q.showIf(answers));
  const current = visibleQuestions[currentIndex] || visibleQuestions[visibleQuestions.length - 1];
  const progress = (currentIndex / visibleQuestions.length) * 100;
  const currentAnswer = answers[current.id];

  const handleSingle = (option: string) => {
    const newAnswers = { ...answers, [current.id]: option };
    setAnswers(newAnswers);
    mpTrack("Question Answered", {
      question_id: current.id,
      question_number: currentIndex + 1,
      question_text: current.question,
      question_type: current.type,
      answer: option,
    });
    const nextVisible = QUESTIONS.filter((q) => !q.showIf || q.showIf(newAnswers));
    setTimeout(() => {
      if (currentIndex < nextVisible.length - 1) {
        setDirection(1);
        setCurrentIndex((i) => i + 1);
      }
    }, 450);
  };

  const handleMultiToggle = (option: string) => {
    const arr = (currentAnswer as string[]) || [];
    const newArr = arr.includes(option) ? arr.filter((o) => o !== option) : [...arr, option];
    setAnswers({ ...answers, [current.id]: newArr });
  };

  const handleTop3Toggle = (option: string) => {
    const arr = (currentAnswer as string[]) || [];
    if (arr.includes(option)) {
      setAnswers({ ...answers, [current.id]: arr.filter((o) => o !== option) });
    } else if (arr.length < 3) {
      setAnswers({ ...answers, [current.id]: [...arr, option] });
    }
  };

  const handleNext = () => {
    // Track the answer for multi/top3/text types (single is tracked on click).
    if (current.type !== "single") {
      let answerValue: string | string[] | undefined;
      if (current.type === "text") {
        answerValue = textValues[current.id] || "";
      } else {
        answerValue = (currentAnswer as string[]) || [];
        const other = otherText[current.id]?.trim();
        if (other && Array.isArray(answerValue)) {
          answerValue = [...answerValue, `Andere: ${other}`];
        }
      }
      mpTrack("Question Answered", {
        question_id: current.id,
        question_number: currentIndex + 1,
        question_text: current.question,
        question_type: current.type,
        answer: answerValue,
        answer_count: Array.isArray(answerValue) ? answerValue.length : undefined,
      });
    }
    if (currentIndex < visibleQuestions.length - 1) {
      setDirection(1);
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const merged = { ...answers };
    for (const q of QUESTIONS) {
      if (q.type === "multi_with_other" && otherText[q.id]?.trim()) {
        const arr = (merged[q.id] as string[]) || [];
        merged[q.id] = [...arr, `Andere: ${otherText[q.id].trim()}`];
      }
    }
    const finalAnswers = { ...merged, ...textValues };
    setSubmitting(true);
    // Mixpanel: fire completion event + persist full answer set on the profile
    mpTrack("Questionnaire Completed", {
      email,
      source,
      answer_count: Object.keys(finalAnswers).length,
    });
    mpSetProfile({
      $email: email,
      questionnaire_completed: true,
      questionnaire_completed_at: new Date().toISOString(),
      // Flatten primitive answers onto the profile so they can be used for
      // cohorts without querying the sheet (Array-values stringified).
      ...Object.fromEntries(
        Object.entries(finalAnswers).map(([k, v]) => [
          `q_${k}`,
          Array.isArray(v) ? v.join(", ") : v,
        ])
      ),
    });
    try {
      await fetch("/api/questionnaire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, answers: finalAnswers }),
      });
      // Fire Meta Pixel CompleteRegistration (stronger signal than Lead).
      // Queued helper handles late-loading fbq.
      Events.completeRegistration({
        content_name: "questionnaire_completed",
        status: "completed",
      });
    } catch (e) {
      console.error("Questionnaire submit error:", e);
    }
    setCompleted(true);
    setSubmitting(false);
  };

  /* ─── Success screen ─── */
  if (completed) {
    return (
      <main className="min-h-[100dvh] bg-bg flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 mx-auto mb-8 rounded-full flex items-center justify-center"
            style={{ background: "rgba(196,98,45,0.12)", border: "1px solid rgba(196,98,45,0.3)" }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#C4622D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6L9 17l-5-5" />
            </svg>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="text-[32px] font-normal tracking-[-0.02em] text-text-primary mb-3 leading-tight"
            style={{ fontFamily: "var(--font-cormorant, Georgia, serif)" }}
          >
            Danke. <span className="italic" style={{ color: "#C4622D" }}>Du bist vorne dabei.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.4 }}
            className="text-[15px] text-text-secondary mb-8 leading-relaxed"
          >
            Deine Antworten helfen uns, Concorde genau für dich zu bauen. Du bist jetzt unter den <strong className="text-text-primary">Top 500</strong> für Early Access — wir melden uns, sobald dein Bonus freigeschaltet ist.
          </motion.p>
          <motion.a
            href="/"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
            className="inline-block w-full py-4 rounded-xl text-[15px] font-semibold text-center transition-colors"
            style={{ background: "#C4622D", color: "#fff" }}
          >
            Zurück zur Übersicht →
          </motion.a>
        </motion.div>
      </main>
    );
  }

  const canProceed = () => {
    if (current.type === "single") return !!currentAnswer;
    if (current.type === "multi" || current.type === "multi_with_other") {
      const arr = (currentAnswer as string[]) || [];
      const other = otherText[current.id]?.trim() || "";
      return arr.length > 0 || other.length > 0;
    }
    if (current.type === "top3") return ((currentAnswer as string[]) || []).length > 0;
    if (current.type === "text") return true;
    return false;
  };

  return (
    <main
      className="min-h-[100dvh] flex flex-col bg-bg text-text-primary"
      style={{ fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif" }}
    >
      {/* Progress bar */}
      <div className="px-5 pt-6 pb-4 flex-shrink-0 border-b border-border">
        <div className="flex items-center gap-3 max-w-lg mx-auto w-full">
          <div className="flex-1 h-[3px] bg-surface-2 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "#C4622D" }}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease }}
            />
          </div>
          <span className="text-[11px] font-medium text-text-muted flex-shrink-0 tabular-nums tracking-wide">
            {currentIndex + 1} / {visibleQuestions.length}
          </span>
        </div>
      </div>

      {/* Question area */}
      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={current.id}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease }}
            className="absolute inset-0 flex flex-col px-5 pt-8"
            style={{ margin: "0 auto", maxWidth: "560px" }}
          >
            <h2
              className="text-[26px] md:text-[30px] tracking-[-0.01em] text-text-primary mb-7 leading-tight"
              style={{ fontFamily: "var(--font-cormorant, Georgia, serif)", fontWeight: 500 }}
            >
              {current.question}
              {current.type === "top3" && (
                <span
                  className="block text-[13px] font-normal text-text-muted mt-2 tracking-wide uppercase"
                  style={{ fontFamily: "system-ui, sans-serif", letterSpacing: "0.08em" }}
                >
                  Wähle bis zu 3
                </span>
              )}
              {current.type === "multi" && (
                <span
                  className="block text-[13px] font-normal text-text-muted mt-2 tracking-wide uppercase"
                  style={{ fontFamily: "system-ui, sans-serif", letterSpacing: "0.08em" }}
                >
                  Mehrfachauswahl
                </span>
              )}
              {current.type === "text" && (
                <span
                  className="block text-[13px] font-normal text-text-muted mt-2 tracking-wide uppercase"
                  style={{ fontFamily: "system-ui, sans-serif", letterSpacing: "0.08em" }}
                >
                  {current.hint || "Optional"}
                </span>
              )}
            </h2>

            <div className="flex-1 overflow-y-auto pb-6 space-y-2">
              {/* Single choice */}
              {current.type === "single" &&
                current.options?.map((option) => (
                  <motion.button
                    key={option}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSingle(option)}
                    className="w-full px-4 py-4 rounded-xl border text-left text-[15px] font-medium transition-all"
                    style={
                      currentAnswer === option
                        ? { borderColor: "#C4622D", background: "rgba(196,98,45,0.08)", color: "var(--color-text-primary, #e5e5e7)" }
                        : { borderColor: "var(--color-border)", background: "var(--color-surface-1)", color: "var(--color-text-primary, #e5e5e7)" }
                    }
                  >
                    {option}
                  </motion.button>
                ))}

              {/* Multi choice */}
              {current.type === "multi" &&
                current.options?.map((option) => {
                  const selected = ((currentAnswer as string[]) || []).includes(option);
                  return (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleMultiToggle(option)}
                      className="w-full px-4 py-4 rounded-xl border text-left text-[15px] font-medium transition-all flex items-center gap-3"
                      style={
                        selected
                          ? { borderColor: "#C4622D", background: "rgba(196,98,45,0.08)" }
                          : { borderColor: "var(--color-border)", background: "var(--color-surface-1)" }
                      }
                    >
                      <div
                        className="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0"
                        style={
                          selected
                            ? { borderColor: "#C4622D", background: "#C4622D" }
                            : { borderColor: "var(--color-border)" }
                        }
                      >
                        {selected && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                            <path d="M10 3L5 8.5L2 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <span className="text-text-primary">{option}</span>
                    </motion.button>
                  );
                })}

              {/* Top 3 ranking */}
              {current.type === "top3" &&
                current.options?.map((option) => {
                  const arr = (currentAnswer as string[]) || [];
                  const rank = arr.indexOf(option) + 1;
                  const isSelected = rank > 0;
                  return (
                    <motion.button
                      key={option}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleTop3Toggle(option)}
                      className="w-full px-4 py-4 rounded-xl border text-left text-[15px] font-medium transition-all flex items-center gap-3"
                      style={
                        isSelected
                          ? { borderColor: "#C4622D", background: "rgba(196,98,45,0.08)" }
                          : arr.length >= 3
                          ? { borderColor: "var(--color-border)", background: "var(--color-surface-1)", opacity: 0.5 }
                          : { borderColor: "var(--color-border)", background: "var(--color-surface-1)" }
                      }
                    >
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 tabular-nums"
                        style={
                          isSelected
                            ? { background: "#C4622D", color: "#fff" }
                            : { background: "var(--color-surface-2)", color: "var(--color-text-muted)" }
                        }
                      >
                        {isSelected ? rank : ""}
                      </div>
                      <span className="text-text-primary">{option}</span>
                    </motion.button>
                  );
                })}

              {/* Multi choice with "Andere" free text */}
              {current.type === "multi_with_other" && (
                <>
                  {current.options?.map((option) => {
                    const selected = ((currentAnswer as string[]) || []).includes(option);
                    return (
                      <motion.button
                        key={option}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleMultiToggle(option)}
                        className="w-full px-4 py-4 rounded-xl border text-left text-[15px] font-medium transition-all flex items-center gap-3"
                        style={
                          selected
                            ? { borderColor: "#C4622D", background: "rgba(196,98,45,0.08)" }
                            : { borderColor: "var(--color-border)", background: "var(--color-surface-1)" }
                        }
                      >
                        <div
                          className="w-5 h-5 rounded-md border flex items-center justify-center flex-shrink-0"
                          style={
                            selected
                              ? { borderColor: "#C4622D", background: "#C4622D" }
                              : { borderColor: "var(--color-border)" }
                          }
                        >
                          {selected && (
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                              <path d="M10 3L5 8.5L2 5.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </div>
                        <span className="text-text-primary">{option}</span>
                      </motion.button>
                    );
                  })}
                  <div
                    className="w-full px-4 py-4 rounded-xl border"
                    style={{
                      borderColor: otherText[current.id]?.trim() ? "#C4622D" : "var(--color-border)",
                      background: "var(--color-surface-1)",
                    }}
                  >
                    <label className="block text-[13px] text-text-muted mb-2 font-medium uppercase tracking-wide" style={{ letterSpacing: "0.06em" }}>
                      Andere Plattform:
                    </label>
                    <input
                      type="text"
                      value={otherText[current.id] || ""}
                      onChange={(e) => setOtherText({ ...otherText, [current.id]: e.target.value })}
                      placeholder="z.B. Kraken, Deribit, GMX …"
                      className="w-full bg-transparent text-[15px] text-text-primary outline-none placeholder:text-text-muted"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                </>
              )}

              {/* Free text */}
              {current.type === "text" && (
                <textarea
                  value={textValues[current.id] || ""}
                  onChange={(e) => setTextValues({ ...textValues, [current.id]: e.target.value })}
                  placeholder="Deine Antwort…"
                  rows={5}
                  className="w-full px-4 py-4 rounded-xl border text-[15px] outline-none transition-all resize-none text-text-primary"
                  style={{
                    background: "var(--color-surface-1)",
                    borderColor: "var(--color-border)",
                    colorScheme: "dark",
                  }}
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      {(current.type === "multi" ||
        current.type === "multi_with_other" ||
        current.type === "top3" ||
        current.type === "text") && (
        <div className="flex-shrink-0 px-5 pb-8 pt-4 bg-bg border-t border-border">
          <div className="max-w-lg mx-auto w-full">
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleNext}
              disabled={!canProceed() || submitting}
              className="w-full py-4 rounded-xl text-[15px] font-semibold transition-all"
              style={
                canProceed() && !submitting
                  ? { background: "#C4622D", color: "#fff" }
                  : { background: "var(--color-surface-2)", color: "var(--color-text-muted)", cursor: "not-allowed" }
              }
            >
              {submitting
                ? "Wird gespeichert…"
                : currentIndex === visibleQuestions.length - 1
                ? "Absenden & Bonus sichern"
                : "Weiter"}
            </motion.button>
          </div>
        </div>
      )}
    </main>
  );
}

/* ─── Page wrapper with Suspense (required for useSearchParams) ─── */
export default function QuestionnairePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-[100dvh] bg-bg flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-border border-t-[#C4622D] rounded-full animate-spin" />
        </main>
      }
    >
      <QuestionnaireContent />
    </Suspense>
  );
}
