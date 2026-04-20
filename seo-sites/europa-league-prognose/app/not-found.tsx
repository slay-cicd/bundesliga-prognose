import Link from "next/link";
import siteConfig from "@/site.config";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-8xl font-black text-[rgba(255,255,255,0.06)] block mb-4">
          404
        </span>
        <h1 className="text-2xl font-bold text-white mb-3 tracking-tight">
          Seite nicht gefunden
        </h1>
        <p className="text-[#64748b] mb-8 max-w-sm mx-auto">
          Die gesuchte Seite existiert nicht oder wurde verschoben.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/" className="btn-primary">
            Zur Startseite
          </Link>
          <a
            href={siteConfig.ctaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Atlas Markets
          </a>
        </div>
      </div>
    </div>
  );
}
