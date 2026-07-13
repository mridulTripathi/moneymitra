// Splits a translated template string around a {param} that needs to render
// as a live React component (e.g. AnimatedNumber) rather than plain text —
// call t() with PLACEHOLDER_MARKER as the param value, then split the
// resulting string on it to get the "before"/"after" text pieces.
export const PLACEHOLDER_MARKER = "\u0000";

export function splitAroundPlaceholder(template: string): [string, string] {
  const idx = template.indexOf(PLACEHOLDER_MARKER);
  if (idx === -1) return [template, ""];
  return [template.slice(0, idx), template.slice(idx + PLACEHOLDER_MARKER.length)];
}
