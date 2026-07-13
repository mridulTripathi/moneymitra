'use client';
import { useState } from 'react';
import { useTranslation } from '@/components/i18n/LanguageProvider';

interface Props {
  sourcePage: string;
  onSuccess?: () => void;
}

export function SuggestToolForm({ sourcePage, onSuccess }: Props) {
  const { t } = useTranslation();
  const [suggestion, setSuggestion] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (suggestion.trim().length < 10) return;
    setLoading(true);
    try {
      await fetch('/api/suggest-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suggestion, email, sourcePage }),
      });
      setSubmitted(true);
      onSuccess?.();
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-4">
        <span className="text-2xl">🙏</span>
        <p className="font-medium text-teal-700 dark:text-teal-400 mt-2">{t('suggestTool.successTitle')}</p>
        <p className="text-sm text-[var(--text-secondary)] mt-1">{t('suggestTool.successSubtitle')}</p>
      </div>
    );
  }

  return (
    <div>
      <textarea
        placeholder={t('suggestTool.textareaPlaceholder')}
        rows={3}
        maxLength={500}
        value={suggestion}
        onChange={e => setSuggestion(e.target.value)}
        className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] text-[var(--text-primary)] p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <div className="text-xs text-[var(--text-tertiary)] text-right mt-1">{suggestion.length}/500</div>
      <input
        type="email"
        placeholder={t('suggestTool.emailPlaceholder')}
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full rounded-xl border border-[var(--border-default)] bg-[var(--bg-base)] text-[var(--text-primary)] px-4 py-3 text-sm mt-3 focus:outline-none focus:ring-2 focus:ring-teal-500"
      />
      <button
        onClick={handleSubmit}
        disabled={loading || suggestion.trim().length < 10}
        className="mt-4 w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl py-3 text-sm font-semibold transition-colors"
      >
        {loading ? t('suggestTool.submitting') : t('suggestTool.submitButton')}
      </button>
    </div>
  );
}
