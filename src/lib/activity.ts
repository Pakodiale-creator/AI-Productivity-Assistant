export type Activity = {
  id: string;
  tool: string;
  title: string;
  at: string;
};

const KEY = "awpa.activity";

export function getActivity(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Activity[]) : [];
  } catch {
    return [];
  }
}

export function logActivity(tool: string, title: string) {
  if (typeof window === "undefined") return;
  const entry: Activity = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    tool,
    title: title.slice(0, 120),
    at: new Date().toISOString(),
  };
  const next = [entry, ...getActivity()].slice(0, 8);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("awpa:activity"));
  } catch {
    /* storage unavailable */
  }
}
