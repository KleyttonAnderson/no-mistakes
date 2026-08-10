export function ChevronRight({ color = "#f3f2f2", opacity = 0.5 }: { color?: string; opacity?: number }) {
  return (
    <svg width="7" height="12" viewBox="0 0 7 12" style={{ flexShrink: 0, opacity }}>
      <path d="M1 1l5 5-5 5" stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronLeftSmall({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14">
      <path d="M7 1L1 7l6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ChevronRightSmall({ color = "currentColor" }: { color?: string }) {
  return (
    <svg width="8" height="14" viewBox="0 0 8 14">
      <path d="M1 1l6 6-6 6" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function BackIcon() {
  return (
    <svg width="9" height="16" viewBox="0 0 9 16">
      <path d="M8 1L1 8l7 7" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PlusIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16">
      <path d="M8 1v14M1 8h14" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function DashboardIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <rect x="1" y="1" width="7" height="7" rx="2" fill="none" stroke={color} strokeWidth="1.6" />
      <rect x="10" y="1" width="7" height="7" rx="2" fill="none" stroke={color} strokeWidth="1.6" />
      <rect x="1" y="10" width="7" height="7" rx="2" fill="none" stroke={color} strokeWidth="1.6" />
      <rect x="10" y="10" width="7" height="7" rx="2" fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function AlunosIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <circle cx="9" cy="5.5" r="3.5" fill="none" stroke={color} strokeWidth="1.6" />
      <path d="M2 17c0-4 3-6.5 7-6.5s7 2.5 7 6.5" fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function FinanceiroIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <line x1="2" y1="16" x2="16" y2="16" stroke={color} strokeWidth="1.6" />
      <line x1="5" y1="12" x2="5" y2="16" stroke={color} strokeWidth="1.6" />
      <line x1="9" y1="6" x2="9" y2="16" stroke={color} strokeWidth="1.6" />
      <line x1="13" y1="9" x2="13" y2="16" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

export function ConfigIcon({ color }: { color: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <line x1="2" y1="4" x2="16" y2="4" stroke={color} strokeWidth="1.6" />
      <line x1="2" y1="9" x2="16" y2="9" stroke={color} strokeWidth="1.6" />
      <line x1="2" y1="14" x2="16" y2="14" stroke={color} strokeWidth="1.6" />
      <circle cx="6" cy="4" r="1.8" fill={color} />
      <circle cx="12" cy="9" r="1.8" fill={color} />
      <circle cx="8" cy="14" r="1.8" fill={color} />
    </svg>
  );
}
