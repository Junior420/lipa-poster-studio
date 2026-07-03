// Single source of truth for the poster's visual design tokens.
// Both the on-screen poster (React/Tailwind), the PDF renderer (@react-pdf/renderer)
// and the PNG renderer (@vercel/og) read from this so all three outputs stay in sync.

export type PosterData = {
  businessName: string;
  tagline?: string | null;
  lipaNumber: string;
  lipaLabel: string;
  repairNumber?: string | null;
  agentCode?: string | null;
  accentColor: string;
};

export const posterTheme = {
  width: 1080,
  height: 1350, // 4:5 — reads well on WhatsApp, Instagram, and as a printable A4-ish poster
  ink: '#0a0a0c',
  panel: '#141418',
  white: '#f6f6f7',
  muted: '#9a9aa2',
} as const;
