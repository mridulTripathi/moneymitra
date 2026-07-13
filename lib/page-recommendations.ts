export interface PageRecommendation {
  path: string;
  i18nKey: string;
}

// Static, curated cross-links between calculators based on real financial
// decision flows — no AI, no scoring, just hand-picked pairings. Labels and
// reasons live in the i18n dictionary under `relatedTools.{i18nKey}` (see
// lib/i18n/translations/en.ts) — this file only defines which pairings exist.
export const pageRecommendations: Record<string, PageRecommendation[]> = {
  '/emi': [
    { path: '/prepay', i18nKey: 'emi.prepay' },
    { path: '/rates', i18nKey: 'emi.rates' },
    { path: '/loan-vs-card', i18nKey: 'emi.loanVsCard' },
  ],
  '/prepay': [
    { path: '/emi', i18nKey: 'prepay.emi' },
    { path: '/sip', i18nKey: 'prepay.sip' },
  ],
  '/sip': [
    { path: '/tax', i18nKey: 'sip.tax' },
    { path: '/ppf', i18nKey: 'sip.ppf' },
    { path: '/fd', i18nKey: 'sip.fd' },
  ],
  '/tax': [
    { path: '/hra', i18nKey: 'tax.hra' },
    { path: '/ppf', i18nKey: 'tax.ppf' },
    { path: '/gratuity', i18nKey: 'tax.gratuity' },
  ],
  '/fd': [
    { path: '/ppf', i18nKey: 'fd.ppf' },
    { path: '/sip', i18nKey: 'fd.sip' },
  ],
  '/ppf': [
    { path: '/fd', i18nKey: 'ppf.fd' },
    { path: '/tax', i18nKey: 'ppf.tax' },
  ],
  '/hra': [
    { path: '/tax', i18nKey: 'hra.tax' },
    { path: '/gratuity', i18nKey: 'hra.gratuity' },
  ],
  '/gratuity': [
    { path: '/tax', i18nKey: 'gratuity.tax' },
    { path: '/hra', i18nKey: 'gratuity.hra' },
  ],
  '/loan-vs-card': [
    { path: '/emi', i18nKey: 'loanVsCard.emi' },
    { path: '/prepay', i18nKey: 'loanVsCard.prepay' },
  ],
  '/rates': [
    { path: '/emi', i18nKey: 'ratesPage.emi' },
    { path: '/fd', i18nKey: 'ratesPage.fd' },
  ],
};
