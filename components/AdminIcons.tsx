// Plain geometry instead of a Unicode glyph (⟳, +, ×): symbol characters carry
// their own font-dependent optical offset, so flexbox centers the character's
// line box but not the mark inside it. An SVG path has no such offset.
//
// Default sizes are tuned for the 26px circular photo-overlay buttons this
// was built for (Services, then Customers): 14px, not 13 — (26-13)/2 = 6.5,
// a fractional margin the browser has to round to the device pixel grid,
// landing on 6px one side and 7px the other. That's a real, physically
// rendered 1px asymmetry, invisible to getBoundingClientRect() (ideal
// layout, not painted pixels) but visible to an eye looking at the icon.
// (26-14)/2 = 6 exactly, nothing left to round. CloseIcon's 12px was
// already even and never had this problem. A consumer using a differently
// sized container should pass `size` and re-check its own margin math
// rather than assume these defaults still divide evenly.

export function ReplaceIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13.5 8a5.5 5.5 0 1 1-1.6-3.89" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M13.5 3v3.2h-3.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2.5v11M2.5 8h11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function CloseIcon({ size = 12 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

// Same reasoning as the icons above: the "←" character sits at a
// font-dependent height on its own line box, which reliably looks
// misaligned next to a text label set in a different font/weight. An SVG
// path has no such offset, so it lines up regardless of the label's font.
export function ArrowLeftIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M13 8H3M3 8l4.5-4.5M3 8l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
