/**
 * Global Theme Configuration
 * 
 * Defines a standardized theme system using CSS Variables
 * and Tailwind CSS integration for consistent design across all apps.
 */

/**
 * Color palette definition
 */
export interface ColorPalette {
  primary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  secondary: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  neutral: {
    50: string;
    100: string;
    200: string;
    300: string;
    400: string;
    500: string;
    600: string;
    700: string;
    800: string;
    900: string;
  };
  success: string;
  warning: string;
  error: string;
  info: string;
}

/**
 * Typography configuration
 */
export interface Typography {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

/**
 * Spacing configuration
 */
export interface Spacing {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

/**
 * Border radius configuration
 */
export interface BorderRadius {
  none: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  full: string;
}

/**
 * Shadow configuration
 */
export interface Shadows {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Breakpoints configuration
 */
export interface Breakpoints {
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
}

/**
 * Main Theme interface
 */
export interface Theme {
  colors: ColorPalette;
  typography: Typography;
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  breakpoints: Breakpoints;
}

/**
 * Default theme configuration
 */
export const defaultTheme: Theme = {
  colors: {
    primary: {
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
    secondary: {
      50: '#f5f3ff',
      100: '#ede9fe',
      200: '#ddd6fe',
      300: '#c4b5fd',
      400: '#a78bfa',
      500: '#8b5cf6',
      600: '#7c3aed',
      700: '#6d28d9',
      800: '#5b21b6',
      900: '#4c1d95',
    },
    neutral: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
      900: '#111827',
    },
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },
  typography: {
    fontFamily: {
      sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
      mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
    '4xl': '6rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

/**
 * Generate CSS variables from theme
 */
export function generateCSSVariables(theme: Theme): string {
  const vars: string[] = [];
  
  // Colors
  Object.entries(theme.colors.primary).forEach(([key, value]) => {
    vars.push(`--color-primary-${key}: ${value};`);
  });
  
  Object.entries(theme.colors.secondary).forEach(([key, value]) => {
    vars.push(`--color-secondary-${key}: ${value};`);
  });
  
  Object.entries(theme.colors.neutral).forEach(([key, value]) => {
    vars.push(`--color-neutral-${key}: ${value};`);
  });
  
  vars.push(`--color-success: ${theme.colors.success};`);
  vars.push(`--color-warning: ${theme.colors.warning};`);
  vars.push(`--color-error: ${theme.colors.error};`);
  vars.push(`--color-info: ${theme.colors.info};`);
  
  // Typography
  vars.push(`--font-sans: ${theme.typography.fontFamily.sans};`);
  vars.push(`--font-serif: ${theme.typography.fontFamily.serif};`);
  vars.push(`--font-mono: ${theme.typography.fontFamily.mono};`);
  
  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    vars.push(`--spacing-${key}: ${value};`);
  });
  
  // Border radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    vars.push(`--radius-${key}: ${value};`);
  });
  
  return `:root {\n  ${vars.join('\n  ')}\n}`;
}

/**
 * Create a custom theme by merging with defaults
 */
export function createTheme(overrides: Partial<Theme>): Theme {
  return {
    colors: { ...defaultTheme.colors, ...overrides.colors },
    typography: { ...defaultTheme.typography, ...overrides.typography },
    spacing: { ...defaultTheme.spacing, ...overrides.spacing },
    borderRadius: { ...defaultTheme.borderRadius, ...overrides.borderRadius },
    shadows: { ...defaultTheme.shadows, ...overrides.shadows },
    breakpoints: { ...defaultTheme.breakpoints, ...overrides.breakpoints },
  };
}

/**
 * Tailwind config generator
 */
export function generateTailwindConfig(theme: Theme) {
  return {
    theme: {
      extend: {
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          neutral: theme.colors.neutral,
          success: theme.colors.success,
          warning: theme.colors.warning,
          error: theme.colors.error,
          info: theme.colors.info,
        },
        fontFamily: theme.typography.fontFamily,
        spacing: theme.spacing,
        borderRadius: theme.borderRadius,
        boxShadow: theme.shadows,
        screens: theme.breakpoints,
      },
    },
  };
}
