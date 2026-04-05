# Cliphook Examples

This document provides comprehensive examples for using the `cliphook` package in various scenarios.

## 📋 Clipboard Hook (`useCliphook`)

The `useCliphook` (or `useClipboard`) hook is the easiest way to add copy functionality to your components.

### Basic Usage

```tsx
import { useCliphook } from 'cliphook';

function BasicCopy() {
  const { copyText, isCopied } = useCliphook();

  return (
    <button onClick={() => copyText('Hello from Cliphook!')}>
      {isCopied ? '✅ Copied' : '📋 Click to Copy'}
    </button>
  );
}
```

### With Custom Timeout and Counter

```tsx
import { useClipboard } from 'cliphook';

function AdvancedCopy() {
  const { copyText, isCopied, copyCount, reset } = useClipboard({ timeout: 5000 });

  return (
    <div className="card">
      <input type="text" id="myInput" defaultValue="https://example.com" />
      <button onClick={() => {
        const input = document.getElementById('myInput') as HTMLInputElement;
        copyText(input.value);
      }}>
        {isCopied ? 'Saved for 5s!' : 'Copy Link'}
      </button>
      <p>Total copies this session: {copyCount}</p>
      <button onClick={reset}>Manually Reset State</button>
    </div>
  );
}
```

---

## 🏗 CopyToClipboard Component

A headless component that provides the clipboard state to its children via a render prop.

### Render Prop Pattern

```tsx
import { CopyToClipboard } from 'cliphook';

function HeadlessExample() {
  return (
    <CopyToClipboard text="Professional CLI Tool">
      {({ copy, isCopied, copyCount }) => (
        <div style={{ padding: '10px', border: '1px solid #ccc' }}>
          <code>npm install -g my-awesome-tool</code>
          <button onClick={copy}>
            {isCopied ? '✨ Done' : '📋 Copy Command'}
          </button>
          <span>Used {copyCount} times</span>
        </div>
      )}
    </CopyToClipboard>
  );
}
```

### With Callbacks

```tsx
import { CopyToClipboard } from 'cliphook';
import { toast } from 'react-hot-toast';

function ToastExample() {
  return (
    <CopyToClipboard 
      text="Special Promo Code"
      onCopy={(text) => toast.success(`"${text}" copied to clipboard!`)}
      onError={(err) => toast.error(`Failed: ${err.message}`)}
    >
      {({ copy }) => (
        <button onClick={copy}>Copy Promo Code</button>
      )}
    </CopyToClipboard>
  );
}
```

---

## 💾 LocalStorage Hook (`useLocalStorage`)

A type-safe hook for persisting state to `localStorage` with cross-tab synchronization.

### Persistent Dark Mode

```tsx
import { useLocalStorage } from 'cliphook';

type Theme = 'light' | 'dark' | 'system';

function ThemeSwitcher() {
  const [theme, setTheme] = useLocalStorage<Theme>('app-theme', 'system');

  return (
    <select value={theme} onChange={(e) => setTheme(e.target.value as Theme)}>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
      <option value="system">Follow System</option>
    </select>
  );
}
```

### Complex State (Objects/Arrays)

```tsx
import { useLocalStorage } from 'cliphook';

interface UserPreferences {
  fontSize: number;
  showSidebar: boolean;
}

function SettingsPanel() {
  const [prefs, setPrefs] = useLocalStorage<UserPreferences>('user-prefs', {
    fontSize: 16,
    showSidebar: true,
  });

  const toggleSidebar = () => {
    setPrefs(prev => ({ ...prev, showSidebar: !prev.showSidebar }));
  };

  return (
    <div>
      <p>Current Font Size: {prefs.fontSize}px</p>
      <button onClick={toggleSidebar}>
        {prefs.showSidebar ? 'Hide Sidebar' : 'Show Sidebar'}
      </button>
      <p>Tip: Open this page in another tab to see changes sync instantly!</p>
    </div>
  );
}
```

---

## 🛠 Troubleshooting & Tips

### Avoiding Lifecycle Issues
The hooks are designed to be clean. `useClipboard` automatically cleans up its internal timers on unmount, preventing memory leaks or state updates on unmounted components.

### Server Side Rendering (SSR)
`useLocalStorage` is SSR-safe. It detects the `window` object and will skip execution during server rendering, preventing hydration mismatch errors in frameworks like Next.js.
