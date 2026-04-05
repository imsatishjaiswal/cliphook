import { useState, useCallback, useRef, useEffect } from 'react';

export interface ClipboardOptions {
  /**
   * Reset 'isCopied' state after this duration (ms).
   * @default 2000
   */
  timeout?: number;
}

export interface UseClipboardReturn {
  /**
   * Function to copy text to clipboard.
   * @param text The string to copy.
   */
  copyText: (text: string) => Promise<void>;
  /**
   * Whether the last copy operation was successful.
   */
  isCopied: boolean;
  /**
   * Error object if the last copy operation failed.
   */
  error: Error | null;
  /**
   * Number of successful copy operations in this session.
   */
  copyCount: number;
  /**
   * Resets the 'isCopied' and 'error' state manually.
   */
  reset: () => void;
}

/**
 * A robust fallback for older browsers that don't support navigator.clipboard.
 */
function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Ensure textarea is not visible
  textArea.style.position = 'fixed';
  textArea.style.left = '-9999px';
  textArea.style.top = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  try {
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    document.body.removeChild(textArea);
    return false;
  }
}

/**
 * useClipboard is a React hook that makes copying text to the clipboard effortless.
 * 
 * @alias useCliphook
 */
export function useClipboard(options: ClipboardOptions = {}): UseClipboardReturn {
  const { timeout = 2000 } = options;
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [copyCount, setCopyCount] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const reset = useCallback(() => {
    setIsCopied(false);
    setError(null);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  const copyText = useCallback(
    async (text: string) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const success = fallbackCopyTextToClipboard(text);
          if (!success) {
            throw new Error('Fallback clipboard copy failed');
          }
        }

        setIsCopied(true);
        setError(null);
        setCopyCount((count) => count + 1);

        if (timeout > 0) {
          timeoutRef.current = setTimeout(() => {
            setIsCopied(false);
          }, timeout);
        }
      } catch (err) {
        setIsCopied(false);
        setError(err instanceof Error ? err : new Error('Failed to copy to clipboard'));
      }
    },
    [timeout]
  );

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    copyText,
    isCopied,
    error,
    copyCount,
    reset,
  };
}

/**
 * Alias for useClipboard to avoid naming conflicts.
 */
export const useCliphook = useClipboard;
