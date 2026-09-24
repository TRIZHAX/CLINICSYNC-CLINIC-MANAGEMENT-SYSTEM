export function Logo({ compact=false }: { compact?: boolean }) {
  return <div className="brand" aria-label="ClinicSync">
    <svg className="brand-mark" viewBox="0 0 48 48" role="img" aria-label="ClinicSync CS logo">
      <path d="M38 12.5A17 17 0 1 0 38 35.5" className="logo-c" />
      <path d="M34.5 14.5c-2.5-2.2-6.4-2.8-9.2-1.1-3.8 2.3-2.6 7.2 1.2 8.6l4.8 1.8c4.4 1.7 4.1 7.5.2 9.6-3.5 1.9-8.1.7-10.3-2" className="logo-s" />
      <path d="M14 24h6l2-4.2 4 8.3 2-4.1h6" className="logo-pulse" />
      <path d="M39 7v7M35.5 10.5h7" className="logo-cross" />
    </svg>
    {!compact && <span className="brand-words"><strong>ClinicSync</strong><small>Connected care operations</small></span>}
  </div>;
}

