'use client';

import { useState } from 'react';

export default function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard API unavailable — fail silently, text is still selectable
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 rounded-lg bg-white/10 hover:bg-white/20 px-3 py-2 text-xs font-semibold transition-colors"
    >
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  );
}
