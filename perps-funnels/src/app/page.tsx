import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-0 flex items-center justify-center">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-text-primary">Concorde Funnels</h1>
        <div className="flex flex-col gap-4">
          <Link
            href="/aggressive"
            className="px-8 py-4 bg-neon-green text-black font-bold rounded-xl text-lg hover:opacity-90 transition"
          >
            Funnel A → Aggressive
          </Link>
          <Link
            href="/professional"
            className="px-8 py-4 bg-white text-black font-bold rounded-xl text-lg hover:opacity-90 transition"
          >
            Funnel B → Professional
          </Link>
        </div>
      </div>
    </div>
  );
}
