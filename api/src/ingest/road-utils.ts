export function isUnpavedSurface(surface?: string, tags?: any): boolean {
  if (!surface && !tags) return false;
  const s = (surface || (tags && (tags.surface || tags.track))) + '';
  const normalized = s.toLowerCase();
  const unpavedKeywords = ['unpaved', 'gravel', 'dirt', 'ground', 'compacted', 'gravel_road', 'sand', 'mud'];
  if (unpavedKeywords.includes(normalized)) return true;

  // If track is present and not surfaced, consider unpaved
  if (tags && tags.track && tags.track !== 'grade1') {
    return true;
  }

  return false;
}
