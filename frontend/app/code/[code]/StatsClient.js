"use client";

import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import Link from "next/link";
import { ArrowLeft, BarChart3, Link2, ExternalLink, MousePointerClick, Copy, Check } from "lucide-react";

export default function StatsClient({ code }) {
  const [data, setData] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);
  const NEXT_PUBLIC_API_BASE  = process.env.NEXT_PUBLIC_API_BASE 

  useEffect(() => {
    if (!code) return;

    api(`/api/links/${code}`)
      .then(setData)
      .catch(() => setNotFound(true));
  }, [code]);

  function handleCopy() {
    navigator.clipboard.writeText(`${NEXT_PUBLIC_API_BASE}/${code}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">
      <div className="max-w-2xl mx-auto">

        {/* Back Link */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 
            transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        {/* Loading State */}
        {!data && !notFound && (
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
          </div>
        )}

        {/* Not Found State */}
        {notFound && (
          <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-12 text-center">
            <Link2 className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h1 className="text-xl font-medium text-zinc-300 mb-2">Link Not Found</h1>
            <p className="text-zinc-500">The link "{code}" doesn't exist or has been deleted.</p>
          </div>
        )}

        {/* Stats Content */}
        {data && (
          <>
            {/* Header Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-2 text-zinc-400 text-sm mb-3">
                <BarChart3 className="w-4 h-4" />
                Link Statistics
              </div>

              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-2xl font-semibold font-mono text-violet-400">
                  {data.code}
                </h1>
                <button
                  onClick={handleCopy}
                  className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
                <a
                  href={`${NEXT_PUBLIC_API_BASE}/${data.code}`}
                  target="_blank"
                  className="p-1.5 hover:bg-zinc-700 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-zinc-500" />
                </a>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 text-sm">
                <span>Redirects to:</span>
                <a 
                  href={data.url} 
                  target="_blank"
                  className="text-zinc-300 hover:text-violet-400 transition-colors truncate"
                >
                  {data.url}
                </a>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
              <div className="flex items-center gap-4">
                <div className="p-4 bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 
                  border border-violet-500/20 rounded-xl">
                  <MousePointerClick className="w-8 h-8 text-violet-400" />
                </div>
                <div>
                  <p className="text-zinc-500 text-sm mb-1">Total Clicks</p>
                  <p className="text-4xl font-semibold text-zinc-100">{data.clicks}</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}