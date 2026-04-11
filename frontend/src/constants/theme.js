/**
 * Application Theme Constants
 * Maintains consistent branding across the app
 */

export const COLORS = {
    primary: '#ff6b35', // Orange
    secondary: '#f7931e', // Gold
    accent: '#004e89', // Blue
    success: '#4caf50',
    error: '#f44336',
    warning: '#ff9800',
    info: '#2196f3',
    lightBg: '#f5f5f5',
    darkBg: '#1a1a1a',
    borderColor: '#ddd',
    textPrimary: '#333',
    textSecondary: '#666',
    white: '#fff',
    black: '#000',
};

export const SPACING = {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    xxl: '48px',
};

export const BORDER_RADIUS = {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '50%',
};

export const SHADOWS = {
    light: '0 2px 4px rgba(0, 0, 0, 0.1)',
    medium: '0 4px 8px rgba(0, 0, 0, 0.15)',
    dark: '0 8px 16px rgba(0, 0, 0, 0.2)',
    xl: '0 12px 24px rgba(0, 0, 0, 0.25)',
};

export const TRANSITIONS = {
    fast: '150ms ease-in-out',
    normal: '300ms ease-in-out',
    slow: '500ms ease-in-out',
};

export const BREAKPOINTS = {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px',
    ultrawide: '1920px',
};

export default COLORS;
