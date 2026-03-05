# Language Integration Guide (English + Bangla)

This document explains the language system that was added to this project, how it works in checkout, and how to apply the same pattern to any other page.

---

## 1) What was implemented

A simple frontend i18n system was added with these parts:

- Language provider (global state)
  - app/context/LanguageContext.tsx
- Translation message files
  - app/i18n/messages/en.json
  - app/i18n/messages/bn.json
- App-level wiring
  - app/layout.tsx (LanguageProvider wraps the app)
- Language switch in navbar
  - components/layout/Navbar.tsx
- Checkout page migrated to translation keys
  - app/checkout/CheckoutContent.tsx

---

## 2) Core idea (how it works)

The flow is:

1. User selects language in navbar.
2. LanguageContext stores selected locale (en or bn).
3. Locale is persisted in localStorage.
4. Every component that needs translated text calls useLanguage().
5. It uses t("some.key") to get a translated value from JSON.
6. If a key is missing in Bangla, it falls back to English.

So your UI no longer hardcodes strings. It uses keys.

---

## 3) LanguageContext explained

File: app/context/LanguageContext.tsx

This file provides:

- locale
  - current language value ("en" or "bn")
- setLocale(nextLocale)
  - updates language globally and saves it to localStorage
- t(key, params?)
  - returns translated string for a key
  - supports interpolation using placeholders like {{amount}}

Example interpolation:

- Message in JSON: "Inside Dhaka - 2/4 Days {{currencySymbol}} {{amount}}"
- Usage: t("checkout.insideDhaka", { currencySymbol: "৳", amount: "60" })

Fallback behavior:

- Try selected locale first.
- If key not found, use English.
- If still missing, return the key itself (easy to detect missing entries).

---

## 4) Message JSON structure explained

Files:

- app/i18n/messages/en.json
- app/i18n/messages/bn.json

Messages are grouped by namespace:

- navbar.language.*
- checkout.*

This structure is important for future scaling. Keep same key in both files.

Good key style:

- checkout.title
- checkout.validation.nameRequired
- checkout.toast.orderPlaced

Avoid changing key names frequently. Keep keys stable and update only message values.

---

## 5) How checkout uses translations

File: app/checkout/CheckoutContent.tsx

What was done:

1. Added useLanguage() and extracted t.
2. Replaced hardcoded text with t("...") keys.
3. Converted validation schema to a function so translated messages can be used.
4. Updated toast/error/success messages to use t("...").

Important detail:

The validation schema was changed from a static constant to a factory function:

- before: const schema = yup.object(...)
- now: const createCheckoutSchema = (t) => yup.object(...)

Then inside component:

- const schema = useMemo(() => createCheckoutSchema(t), [t])

This keeps validation text in sync with active language.

---

## 6) How navbar switch works

File: components/layout/Navbar.tsx

The dropdown now:

- shows active language label
- calls setLocale("en") or setLocale("bn")
- closes dropdown after selection

This triggers re-render across components using useLanguage().

---

## 7) How to add language to another page (repeatable steps)

Use this checklist for any page:

1. Add new keys in en.json under a clear namespace.
2. Add same keys in bn.json.
3. In that page/component:
   - import useLanguage
   - call const { t } = useLanguage()
4. Replace hardcoded strings with t("namespace.key")
5. For dynamic values use placeholders:
   - JSON: "Total: {{amount}}"
   - code: t("page.total", { amount: total })
6. If page has yup validation:
   - make schema as function createSchema(t)
   - memoize schema with useMemo
7. Test both English and Bangla from navbar.

---

## 8) Recommended key strategy for scaling whole site

Create namespaces per area:

- common.*
- navbar.*
- footer.*
- home.*
- product.*
- checkout.*
- profile.*
- orders.*

Benefits:

- easy to find keys
- low risk of collisions
- easier API migration later

---

## 9) Future API migration plan (when backend is ready)

You can keep all UI code almost unchanged if keys stay same.

Suggested migration path:

1. Keep t("key") calls exactly as they are.
2. Replace local JSON source in LanguageContext with API response.
3. Cache messages per locale (memory/localStorage).
4. Keep English fallback in case API misses a key.

Only data source changes. Component usage pattern remains same.

---

## 10) Current limitation (important)

Current setup is state-based locale (context + localStorage), not route-based locale.

That means:

- URL does not become /en/... or /bn/...

If later you want locale in URL, move to route-based i18n with middleware and locale segment.
The translation keys and page-level t("...") usage can still remain the same.

---

## 11) Quick do and do not list

Do:

- keep keys stable
- add both en and bn keys together
- use namespaces
- use placeholders for dynamic text

Do not:

- hardcode user-facing strings in page components
- rename keys unnecessarily
- keep validation strings outside t()

---

## 12) Mini example for a new page

Suppose you want to translate app/contact/page.tsx.

Step A: add keys

- contact.title
- contact.subtitle
- contact.submit

Step B: use in component

- const { t } = useLanguage()
- h1 => t("contact.title")
- p => t("contact.subtitle")
- button => t("contact.submit")

Done.

---

If you want next, we can create a shared translation helper module for typed keys (TypeScript-safe keys) so missing keys are caught earlier during development.
