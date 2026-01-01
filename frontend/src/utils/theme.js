/**
 * Theme utilities for accessing CSS variables
 * All colors are managed through CSS variables in index.css
 * No need to import - just use the variable names directly in style props
 */

export const themeColors = {
  // Backgrounds
  bg: {
    primary: 'var(--bg-primary)',
    secondary: 'var(--bg-secondary)',
    tertiary: 'var(--bg-tertiary)',
    quaternary: 'var(--bg-quaternary)',
    hover: 'var(--bg-hover)',
    overlay: 'var(--bg-overlay)',
  },
  
  // Text
  text: {
    primary: 'var(--text-primary)',
    secondary: 'var(--text-secondary)',
    tertiary: 'var(--text-tertiary)',
    inverse: 'var(--text-inverse)',
  },
  
  // Borders
  border: {
    color: 'var(--border-color)',
    light: 'var(--border-light)',
  },
  
  // Header
  header: {
    bg: 'var(--header-bg)',
    border: 'var(--header-border)',
  },
  
  // Inputs
  input: {
    bg: 'var(--input-bg)',
    border: 'var(--input-border)',
  },
  
  // Cards
  card: {
    bg: 'var(--card-bg)',
    border: 'var(--card-border)',
  },
  
  // Messages/Chat
  message: {
    selfBg: 'var(--message-self-bg)',
    otherBg: 'var(--message-other-bg)',
    selfText: 'var(--message-self-text)',
    otherText: 'var(--message-other-text)',
  },
  
  // Toast
  toast: {
    bg: 'var(--toast-bg)',
    border: 'var(--toast-border)',
    text: 'var(--toast-text)',
  },
  
  // Button
  button: {
    hover: 'var(--button-hover)',
  },
}

/**
 * Usage examples:
 * 
 * // In a component style prop:
 * <div style={{ backgroundColor: themeColors.bg.primary, color: themeColors.text.primary }}>
 * 
 * // Or directly with CSS variable:
 * <div style={{ backgroundColor: 'var(--bg-primary)' }}>
 */

export default themeColors
