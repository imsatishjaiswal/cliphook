# cliphook 🪝

A lightweight, developer-friendly React hook + component for easy clipboard management with built-in feedback states and no-conflict naming.

[![npm version](https://img.shields.io/npm/v/cliphook.svg?style=flat-square)](https://www.npmjs.com/package/cliphook)
[![npm downloads](https://img.shields.io/npm/dm/cliphook.svg?style=flat-square)](https://www.npmjs.com/package/cliphook)
[![license](https://img.shields.io/npm/l/cliphook.svg?style=flat-square)](https://www.npmjs.com/package/cliphook)

## ✨ Why cliphook?

- **Zero Dependencies**: Keeps your bundle size ultra-small.
- **Robust Fallback**: Uses `navigator.clipboard` with an automatic fallback to `document.execCommand('copy')` for older browsers.
- **No-Conflict Naming**: Exports as both `useClipboard` and its alias `useCliphook` to avoid naming collisions with other hooks.
- **Headless Component**: Provide ultimate UI flexibility with the `CopyToClipboard` component.
- **Bonus `useLocalStorage`**: Includes a type-safe, SSR-safe hook with cross-tab synchronization.

## 🚀 Installation

```bash
npm install cliphook
# or
yarn add cliphook
# or
pnpm add cliphook
```

## 📋 Quick Start

### 1. Hook Usage (`useCliphook`)

The easiest way to copy text inside your components.

```tsx
import { useCliphook } from 'cliphook';

function MyComponent() {
  const { copyText, isCopied } = useCliphook({ timeout: 2000 });

  return (
    <button onClick={() => copyText('Hello World!')}>
      {isCopied ? '✅ Copied' : '📋 Copy to Clipboard'}
    </button>
  );
}
```

### 2. Component Usage (`CopyToClipboard`)

A headless wrapper that makes it easy to add copy functionality to any custom UI.

```tsx
import { CopyToClipboard } from 'cliphook';

function MyButton() {
  return (
    <CopyToClipboard text="Some important text">
      {({ copy, isCopied }) => (
        <button onClick={copy}>
          {isCopied ? 'Done!' : 'Copy'}
        </button>
      )}
    </CopyToClipboard>
  );
}
```

### 3. Bonus Hook (`useLocalStorage`)

Persist state automatically with cross-tab sync and SSR safety.

```tsx
import { useLocalStorage } from 'cliphook';

function ThemeToggle() {
  const [theme, setTheme] = useLocalStorage('theme', 'light');

  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Mode: {theme}
    </button>
  );
}
```

## 📖 For More Detailed Examples
Check out the **[EXAMPLES.md](./EXAMPLES.md)** file for advanced usage, types, and troubleshooting.

## 📄 License
MIT © satishjaiswal
