export interface PageRecommendation {
  path: string;
  label: string;
  reason: string;
}

// Static, curated cross-links between calculators based on real financial
// decision flows — no AI, no scoring, just hand-picked pairings.
export const pageRecommendations: Record<string, PageRecommendation[]> = {
  '/emi': [
    { path: '/prepay', label: 'Prepayment Simulator', reason: 'See how much you save by paying extra' },
    { path: '/rates', label: 'Live Interest Rates', reason: 'Check if your rate is actually competitive' },
    { path: '/loan-vs-card', label: 'Loan vs Credit Card', reason: 'Compare if this is even the cheapest option' },
  ],
  '/prepay': [
    { path: '/emi', label: 'EMI Calculator', reason: 'See your original EMI breakdown' },
    { path: '/sip', label: 'SIP Calculator', reason: 'Or should this money go into investments instead?' },
  ],
  '/sip': [
    { path: '/tax', label: 'Tax Regime Comparator', reason: 'See if ELSS investments can also save you tax' },
    { path: '/ppf', label: 'PPF Calculator', reason: 'Compare with a zero-risk alternative' },
    { path: '/fd', label: 'FD Calculator', reason: 'What if you wanted guaranteed returns instead?' },
  ],
  '/tax': [
    { path: '/hra', label: 'HRA Exemption Calculator', reason: 'Calculate your exact HRA deduction for this' },
    { path: '/ppf', label: 'PPF Calculator', reason: 'Plan your 80C investments to save more' },
    { path: '/gratuity', label: 'Gratuity Calculator', reason: 'Check how gratuity affects your total tax picture' },
  ],
  '/fd': [
    { path: '/ppf', label: 'PPF Calculator', reason: 'See the tax-free alternative' },
    { path: '/sip', label: 'SIP Calculator', reason: 'What if you took some market risk instead?' },
  ],
  '/ppf': [
    { path: '/fd', label: 'FD & RD Calculator', reason: 'Compare with a taxable alternative' },
    { path: '/tax', label: 'Tax Regime Comparator', reason: 'See how this 80C investment affects your tax' },
  ],
  '/hra': [
    { path: '/tax', label: 'Tax Regime Comparator', reason: 'See your full tax picture with this exemption' },
    { path: '/gratuity', label: 'Gratuity Calculator', reason: 'Check another salary-linked benefit' },
  ],
  '/gratuity': [
    { path: '/tax', label: 'Tax Regime Comparator', reason: 'See how this fits your overall tax liability' },
    { path: '/hra', label: 'HRA Exemption Calculator', reason: 'Calculate another salary component' },
  ],
  '/loan-vs-card': [
    { path: '/emi', label: 'EMI Calculator', reason: 'Get the detailed breakdown for your chosen option' },
    { path: '/prepay', label: 'Prepayment Simulator', reason: 'Plan how to close it faster once you take the loan' },
  ],
  '/rates': [
    { path: '/emi', label: 'EMI Calculator', reason: 'See what these rates mean for your monthly payment' },
    { path: '/fd', label: 'FD & RD Calculator', reason: 'Calculate returns at these deposit rates' },
  ],
};
