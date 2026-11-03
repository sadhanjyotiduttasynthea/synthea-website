/**
 * Multilingual readiness.
 *
 * The site launches in English. All user-facing copy lives in `src/content/*`
 * (not inside components), so adding French means:
 *
 * 1. Add "fr" to `locales` below.
 * 2. Create French content modules (e.g. `src/content/fr/expertise.ts`) with
 *    the same exported shapes as the English ones.
 * 3. Move routes under `src/app/[lang]/…`, export `generateStaticParams`
 *    returning each locale, and load content by `lang`.
 * 4. Set `<html lang={lang}>` in the `[lang]` layout and add
 *    `alternates.languages` (hreflang) in `src/lib/seo.ts`.
 *
 * See README → "Adding French".
 */
export const locales = ["en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";
