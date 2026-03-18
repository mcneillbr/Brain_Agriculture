export const theme = {
  colors: {
    primary:        '#2D7D6F',
    primaryLight:   '#4AA99A',
    primaryXLight:  '#E8F5F3',
    primaryDark:    '#1A5C52',
    background:     '#F0F4F3',
    surface:        '#FFFFFF',
    textPrimary:    '#1A2B2A',
    textSecondary:  '#6B8A87',
    textMuted:      '#9DB5B2',
    border:         '#DDE8E6',
    success:        '#27AE60',
    warning:        '#E8A838',
    danger:         '#C8453A',
    chart: [
      '#2D7D6F',
      '#4AA99A',
      '#A8D5CF',
      '#C8453A',
      '#E8A838',
      '#7EC8BE',
      '#1A5C52',
    ],
  },
  radii: {
    sm:  '8px',
    md:  '12px',
    lg:  '16px',
    xl:  '20px',
    full: '9999px',
  },
  shadows: {
    card: '0 1px 3px rgba(0,0,0,0.06)',
    md:   '0 4px 12px rgba(0,0,0,0.10)',
  },
  fonts: {
    sans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  },
} as const

export type Theme = typeof theme
