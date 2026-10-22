// The FjøsFinn mark: a small lantern with a warm glow.
export function Merke({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden className={className}>
      <path d="M7 4.5h6M10 2v2.5" stroke="var(--tekst-svak)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <rect x="5.5" y="4.5" width="9" height="12" rx="2.5" fill="none" stroke="var(--tekst-svak)" strokeWidth="1.4" />
      <circle cx="10" cy="10.5" r="5" fill="var(--lykt)" opacity="0.25" />
      <circle cx="10" cy="10.5" r="2.2" fill="var(--lykt)" />
      <path d="M7 18h6" stroke="var(--tekst-svak)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}
