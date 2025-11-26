export const mainStyles = `
#bookmarklet-root {
  all: initial;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 1rem;
  line-height: 1.5;
  color: #0f172a;
  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-primary-active: #4338ca;
  --color-danger: #ef4444;
  --color-danger-hover: #dc2626;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-surface-dark: #f1f5f9;
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-border: #e2e8f0;
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --radius-sm: 0.375rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 200ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

#bookmarklet-root * {
  box-sizing: border-box;
}

.bookmarklet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--space-5);
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%);
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  cursor: move;
  user-select: none;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
  position: relative;
}

.bookmarklet-header:active {
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
}

.bookmarklet-title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: white;
  letter-spacing: -0.5px;
}

.bookmarklet-closeButton {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  color: white;
  font-size: var(--font-size-lg);
  flex-shrink: 0;
  transition: background-color var(--transition-base), transform var(--transition-fast);
}

.bookmarklet-closeButton:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

.bookmarklet-closeButton:active {
  background-color: rgba(255, 255, 255, 0.3);
  transform: rotate(90deg) scale(0.95);
}

.bookmarklet-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
}

.bookmarklet-menuItem {
  border-bottom: 1px solid var(--color-border);
}

.bookmarklet-menuItem:last-child {
  border-bottom: none;
}

.bookmarklet-menuButton {
  background: none;
  border: none;
  padding: 0;
  margin: 0;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  width: 100%;
  padding: var(--space-4) var(--space-5);
  background-color: var(--color-background);
  text-align: left;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  transition: all var(--transition-base);
  position: relative;
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.bookmarklet-menuButton::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 3px;
  background-color: transparent;
  transition: background-color var(--transition-fast);
}

.bookmarklet-menuButton:hover {
  background-color: var(--color-surface);
}

.bookmarklet-menuButton:hover::before {
  background-color: var(--color-primary);
}

.bookmarklet-menuButton:active {
  background-color: var(--color-surface-dark);
  transform: scale(0.98);
}

.bookmarklet-menuButton:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: -2px;
}

.bookmarklet-menuIcon {
  font-size: var(--font-size-lg);
  flex-shrink: 0;
}

.bookmarklet-menuLabel {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.bookmarklet-wrapper {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  right: var(--space-5);
  width: 320px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg), 0 0 40px rgba(99, 102, 241, 0.15);
  z-index: 999999;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  overflow: hidden;
  animation: slideIn 200ms ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px) translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0) translateX(0);
  }
}

.bookmarklet-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.bookmarklet-content {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(99, 102, 241, 0.3) transparent;
}

.bookmarklet-content::-webkit-scrollbar {
  width: 6px;
}

.bookmarklet-content::-webkit-scrollbar-track {
  background: transparent;
}

.bookmarklet-content::-webkit-scrollbar-thumb {
  background-color: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

.bookmarklet-content::-webkit-scrollbar-thumb:hover {
  background-color: rgba(99, 102, 241, 0.5);
}

.bookmarklet-dragging {
  box-shadow: var(--shadow-lg), 0 0 50px rgba(99, 102, 241, 0.25);
  opacity: 0.95;
}

@media (prefers-reduced-motion: reduce) {
  .bookmarklet-wrapper {
    animation: none;
  }
}
`
