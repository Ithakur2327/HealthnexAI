// Advanced Professional Theme System
export const themeColors = {
  light: {
    primary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    background: {
      primary: '#ffffff',
      secondary: '#f8fafc',
      tertiary: '#f1f5f9',
      accent: '#e0f2fe',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      tertiary: '#64748b',
      accent: '#0891b2',
    },
    border: {
      light: '#e2e8f0',
      medium: '#cbd5e1',
      dark: '#94a3b8',
    },
    surface: {
      elevated: '#ffffff',
      card: '#f8fafc',
      hover: '#f1f5f9',
    }
  },
  dark: {
    primary: {
      50: '#ecfeff',
      100: '#cffafe',
      200: '#a5f3fc',
      300: '#67e8f9',
      400: '#22d3ee',
      500: '#06b6d4',
      600: '#0891b2',
      700: '#0e7490',
      800: '#155e75',
      900: '#164e63',
    },
    secondary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
    background: {
      primary: '#0f172a',
      secondary: '#1e293b',
      tertiary: '#334155',
      accent: '#0c4a6e',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#cbd5e1',
      tertiary: '#94a3b8',
      accent: '#22d3ee',
    },
    border: {
      light: '#334155',
      medium: '#475569',
      dark: '#64748b',
    },
    surface: {
      elevated: '#1e293b',
      card: '#334155',
      hover: '#475569',
    }
  }
};

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
  easing: {
    standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
    accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
    decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
    smooth: 'cubic-bezier(0.45, 0, 0.15, 1)',
  }
};

export const spacing = {
  xs: '0.25rem',
  sm: '0.5rem',
  md: '1rem',
  lg: '1.5rem',
  xl: '2rem',
  '2xl': '3rem',
  '3xl': '4rem',
};

export const shadows = {
  light: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    glow: '0 0 20px rgba(6, 182, 212, 0.3)',
  },
  dark: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.3)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.4)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.5)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.6)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.3)',
    glow: '0 0 20px rgba(34, 211, 238, 0.4)',
  }
};