// localStorage-based favorites and recent tools

const FAVORITES_KEY = "th:favorites";
const RECENT_KEY    = "th:recent";
const MAX_RECENT    = 10;

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(toolId: string): boolean {
  const favs = getFavorites();
  const idx  = favs.indexOf(toolId);
  if (idx >= 0) {
    favs.splice(idx, 1);
  } else {
    favs.push(toolId);
  }
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs));
  return idx < 0; // true = now favorited
}

export function isFavorite(toolId: string): boolean {
  return getFavorites().includes(toolId);
}

export function getRecentTools(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function recordToolVisit(toolId: string): void {
  if (typeof window === "undefined") return;
  const recent = getRecentTools().filter((id) => id !== toolId);
  recent.unshift(toolId);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}
