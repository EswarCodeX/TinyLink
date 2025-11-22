const BASE = process.env.NEXT_PUBLIC_API_BASE;

export async function api(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options
  });

  const text = await res.text();

  try {
    const json = JSON.parse(text);
    if (!res.ok) throw { status: res.status, body: json };
    return json;
  } catch {
    if (!res.ok) throw { status: res.status, body: text };
    throw text;
  }
}
