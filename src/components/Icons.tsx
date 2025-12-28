export function CopiumTank({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Tank Body */}
      <rect x="6" y="8" width="12" height="14" rx="2" fill="#22c55e" fillOpacity="0.2" stroke="#22c55e" strokeWidth="2" />
      {/* Gas Level */}
      <rect x="8" y="14" width="8" height="6" rx="1" fill="#22c55e" />
      {/* Valve/Top */}
      <path d="M9 8V5H15V8" stroke="#22c55e" strokeWidth="2" />
      <path d="M12 5V3" stroke="#22c55e" strokeWidth="2" />
      <circle cx="12" cy="3" r="1.5" stroke="#22c55e" strokeWidth="2" />
      {/* Warning Symbol */}
      <path d="M12 16L12 14" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="18" r="0.5" fill="black" />
    </svg>
  );
}

export function ClownGavel({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Gavel Handle */}
      <path d="M13 3L19 9L15 13L9 7L13 3Z" fill="#ef4444" stroke="#b91c1c" strokeWidth="2" strokeLinejoin="round" />
      {/* Handle Stick */}
      <path d="M9 7L3 21" stroke="#b91c1c" strokeWidth="2" strokeLinecap="round" />
      {/* Clown Nose on Gavel */}
      <circle cx="14" cy="8" r="3" fill="#ef4444" stroke="#7f1d1d" strokeWidth="1" />
      {/* Motion lines */}
      <path d="M20 14L22 16" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 17L20 19" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

