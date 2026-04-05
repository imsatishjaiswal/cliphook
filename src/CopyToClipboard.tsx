import React from 'react';
import { useClipboard, ClipboardOptions, UseClipboardReturn } from './useClipboard';

export interface CopyToClipboardProps extends ClipboardOptions {
  /**
   * The text to copy to the clipboard.
   */
  text: string;
  /**
   * A function that returns a React element.
   * Receives the clipboard state (copy, isCopied, error, etc.) as an argument.
   */
  children: (props: UseClipboardReturn & { copy: () => void }) => React.ReactNode;
  /**
   * Callback when copy is successful.
   */
  onCopy?: (text: string) => void;
  /**
   * Callback when copy fails.
   */
  onError?: (error: Error) => void;
}

/**
 * CopyToClipboard is a headless component that makes copying text to the clipboard effortless.
 * 
 * Example usage:
 * ```tsx
 * <CopyToClipboard text="Hello World">
 *  {({ copy, isCopied }) => (
 *   <button onClick={copy}>{isCopied ? 'Done!' : 'Copy'}</button>
 * )}
 * </CopyToClipboard>
 * ```
 */
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  text,
  children,
  onCopy,
  onError,
  ...options
}) => {
  const { copyText, ...clipboard } = useClipboard(options);

  const copy = React.useCallback(async () => {
    try {
      await copyText(text);
      if (onCopy) {
        onCopy(text);
      }
    } catch (err) {
      if (onError && err instanceof Error) {
        onError(err);
      }
    }
  }, [copyText, text, onCopy, onError]);

  return <>{children({ ...clipboard, copyText, copy })}</>;
};
