export const SITE_URL = "https://moneymitra.thegoodproducts.in";
export const SITE_NAME = "MoneyMitra";

// Titles use the layout template: "%s — MoneyMitra"
// So page titles should NOT include "— MoneyMitra" — it's appended automatically.
export const pages = {
  home: {
    title: "Free Financial Calculators for India",
    description:
      "Free financial calculators for salaried Indians — EMI, SIP, home loan prepayment, and tax regime comparator. Instant results, no signup needed.",
    url: SITE_URL,
  },
  emi: {
    title: "EMI Calculator India",
    description:
      "Calculate your exact monthly EMI for home loan, car loan or personal loan. See total interest and full amortization schedule. Free, instant.",
    url: `${SITE_URL}/emi`,
  },
  prepay: {
    title: "Home Loan Prepayment Calculator",
    description:
      "Find out how much interest and time you save by making a lump-sum prepayment on your home loan. Compare reduce-tenure vs reduce-EMI options. Free.",
    url: `${SITE_URL}/prepay`,
  },
  sip: {
    title: "SIP Calculator with Step-Up SIP",
    description:
      "Calculate SIP returns and see the power of compounding. Includes step-up SIP simulation. Find out how to reach ₹1 crore with monthly SIP. Free.",
    url: `${SITE_URL}/sip`,
  },
  tax: {
    title: "New vs Old Tax Regime Calculator FY 2025-26",
    description:
      "Compare new and old income tax regimes for FY 2025-26. Enter your salary and deductions to instantly find which regime saves you more money.",
    url: `${SITE_URL}/tax`,
  },
  fd: {
    title: "FD & RD Calculator India",
    description:
      "Calculate fixed deposit maturity value and recurring deposit returns. Compare FD vs RD, find effective yield, quarterly vs monthly compounding. Free.",
    url: `${SITE_URL}/fd`,
  },
  ppf: {
    title: "PPF Calculator 2025-26",
    description:
      "Calculate PPF maturity value at 7.1% interest. Year-by-year breakdown, tax-free returns, 80C benefit. Free PPF calculator for India.",
    url: `${SITE_URL}/ppf`,
  },
  hra: {
    title: "HRA Exemption Calculator",
    description:
      "Calculate your HRA exemption with the 3-condition formula. Find out how much HRA is tax-free based on your salary, rent, and city type. Free.",
    url: `${SITE_URL}/hra`,
  },
  gratuity: {
    title: "Gratuity Calculator India",
    description:
      "Calculate gratuity amount as per Payment of Gratuity Act. Find your gratuity for any years of service. Tax-free up to ₹20 lakh. Free.",
    url: `${SITE_URL}/gratuity`,
  },
  loanVsCard: {
    title: "Personal Loan vs Credit Card EMI Calculator",
    description:
      "Compare personal loan vs credit card EMI total cost. Find which option saves you more money for your next big purchase. Free decision tool.",
    url: `${SITE_URL}/loan-vs-card`,
  },
  rates: {
    title: "Current Bank Interest Rates India 2026",
    description:
      "Compare latest home loan rates, FD rates and personal loan rates from SBI, HDFC, ICICI and all major Indian banks. Updated monthly.",
    url: `${SITE_URL}/rates`,
  },
} as const;
