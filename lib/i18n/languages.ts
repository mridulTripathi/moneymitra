export interface LanguageDef {
  code: string;
  englishName: string;
  nativeName: string;
  isRTL: boolean;
}

export const LANGUAGES: LanguageDef[] = [
  { code: "en", englishName: "English", nativeName: "English", isRTL: false },
  { code: "hi", englishName: "Hindi", nativeName: "हिन्दी", isRTL: false },
  { code: "bn", englishName: "Bengali", nativeName: "বাংলা", isRTL: false },
  { code: "mr", englishName: "Marathi", nativeName: "मराठी", isRTL: false },
  { code: "te", englishName: "Telugu", nativeName: "తెలుగు", isRTL: false },
  { code: "ta", englishName: "Tamil", nativeName: "தமிழ்", isRTL: false },
  { code: "gu", englishName: "Gujarati", nativeName: "ગુજરાતી", isRTL: false },
  { code: "kn", englishName: "Kannada", nativeName: "ಕನ್ನಡ", isRTL: false },
  { code: "ml", englishName: "Malayalam", nativeName: "മലയാളം", isRTL: false },
  { code: "pa", englishName: "Punjabi", nativeName: "ਪੰਜਾਬੀ", isRTL: false },
  { code: "or", englishName: "Odia", nativeName: "ଓଡ଼ିଆ", isRTL: false },
  { code: "as", englishName: "Assamese", nativeName: "অসমীয়া", isRTL: false },
  { code: "ur", englishName: "Urdu", nativeName: "اردو", isRTL: true },
];

// Maps Indian state/region names (as returned by Vercel geolocation) to a
// language code, for geo-suggestion. Fallback for anything unmapped -> 'en'.
export const STATE_TO_LANGUAGE: Record<string, string> = {
  "Uttar Pradesh": "hi",
  "Bihar": "hi",
  "Madhya Pradesh": "hi",
  "Rajasthan": "hi",
  "Delhi": "hi",
  "NCT of Delhi": "hi",
  "Haryana": "hi",
  "Jharkhand": "hi",
  "Uttarakhand": "hi",
  "Chhattisgarh": "hi",
  "Himachal Pradesh": "hi",
  "West Bengal": "bn",
  "Maharashtra": "mr",
  "Andhra Pradesh": "te",
  "Telangana": "te",
  "Tamil Nadu": "ta",
  "Gujarat": "gu",
  "Karnataka": "kn",
  "Kerala": "ml",
  "Punjab": "pa",
  "Odisha": "or",
  "Assam": "as",
  "Jammu and Kashmir": "ur",
};

export function getLanguageForState(state: string | undefined | null): string {
  if (!state) return "en";
  return STATE_TO_LANGUAGE[state] ?? "en";
}
