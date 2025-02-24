export const SUPPORTED_LANGUAGES = ['cs', 'sk', 'en', 'de', 'pl', 'es', 'fr', 'it'] as const

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  cs: 'Čeština',
  sk: 'Slovenština',
  en: 'Angličtina',
  de: 'Němčina',
  pl: 'Polština',
  es: 'Španělština',
  fr: 'Francouzština',
  it: 'Italština',
}
