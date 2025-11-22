"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "./lib/api";
import { Link2, Plus, ExternalLink, BarChart3, Trash2, Copy, Check, Zap } from "lucide-react";

export default function Dashboard() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
const NEXT_PUBLIC_API_BASE  = process.env.NEXT_PUBLIC_API_BASE 
  const [url, setUrl] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(null);

  async function fetchLinks() {
    setLoading(true);
    try {
      const data = await api("/api/links");
      setLinks(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchLinks();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const payload = { url };
    if (code) payload.code = code;

    try {
      await api("/api/links", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setUrl("");
      setCode("");
      fetchLinks();
    } catch (err) {
      if (err?.body?.error) setError(err.body.error);
      else setError("Failed to create link");
    }

    setSubmitting(false);
  }

  async function handleDelete(codeToDelete) {
    if (!confirm("Delete " + codeToDelete + "?")) return;

    try {
      await api(`/api/links/${codeToDelete}`, { method: "DELETE" });
      fetchLinks();
    } catch (err) {
      console.error(err);
    }
  }

  function handleCopy(code) {
    navigator.clipboard.writeText(`${NEXT_PUBLIC_API_BASE}/${code}`);
    setCopied(code);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">TinyLink Control Center</h1>
        </div>

        {/* Create Card */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <Plus className="w-5 h-5 text-zinc-400" />
            <h2 className="text-lg font-medium">Create New Link</h2>
          </div>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  placeholder="https://example.com"
                  value={url}
                  required
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 
                    rounded-xl text-zinc-100 placeholder-zinc-500 
                    focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 
                    transition-all"
                />
              </div>

              <input
                placeholder="custom code (optional)"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="md:w-48 px-4 py-3.5 bg-zinc-800/50 border border-zinc-700/50 
                  rounded-xl text-zinc-100 placeholder-zinc-500 
                  focus:outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 
                  transition-all"
              />

              <button
                disabled={submitting}
                className="px-6 py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 
                  hover:from-violet-500 hover:to-fuchsia-500 
                  text-white font-medium rounded-xl transition-all 
                  active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed 
                  flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create
                  </>
                )}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Links Section */}
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-zinc-400" />
              <h2 className="text-lg font-medium">Your Links</h2>
            </div>
            <span className="text-sm text-zinc-500">{links.length} total</span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-zinc-700 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : links.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-zinc-500">
              <Link2 className="w-12 h-12 mb-4 opacity-30" />
              <p>No links created yet.</p>
              <p className="text-sm text-zinc-600">Create your first short link above</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/50">
              {links.map((item) => (
                <div
                  key={item.code}
                  className="px-6 py-4 hover:bg-zinc-800/30 transition-colors group"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    {/* Link Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-violet-400 font-medium">
                          {item.code}
                        </span>
                        <button
                          onClick={() => handleCopy(item.code)}
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                        >
                          {copied === item.code ? (
                            <Check className="w-3.5 h-3.5 text-green-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5 text-zinc-500" />
                          )}
                        </button>
                        <a
                          href={`${NEXT_PUBLIC_API_BASE}/${item.code}`}
                          target="_blank"
                          className="p-1 hover:bg-zinc-700 rounded transition-colors"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                        </a>
                      </div>
                      <a
                        href={`${NEXT_PUBLIC_API_BASE}/${item.code}`}
                        target="_blank"
                        className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                                    {item.url}
                      </a>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                        <span className="text-zinc-300 font-medium">{item.clicks}</span>
                        <span className="text-zinc-500">clicks</span>
                      </div>

                      <div className="text-zinc-500 hidden sm:block min-w-32">
                        {item.lastClicked
                          ? new Date(item.lastClicked).toLocaleString()
                          : "Never clicked"}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/code/${item.code}`}
                        className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-100 
                          hover:bg-zinc-700 rounded-lg transition-colors"
                      >
                        Stats
                      </Link>

                      <button
                        onClick={() => handleDelete(item.code)}
                        className="p-1.5 text-zinc-500 hover:text-red-400 
                          hover:bg-red-500/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <p className="text-center text-zinc-600 text-sm mt-8">
          TinyLink Control Center • Fast, reliable URL shortening
        </p>
      </div>
    </main>
  );
}