# Loop Mobile

Agent app for the Loop customer-service platform (https://loop.axioagent.app).
White-label fork of [chatwoot/chatwoot-mobile-app](https://github.com/chatwoot/chatwoot-mobile-app) — React Native + Expo, TypeScript.

- **Supported server version:** 4.1.0+ (`EXPO_PUBLIC_MINIMUM_CHATWOOT_VERSION`)
- **Supported iOS versions:** 13.4+
- **Supported Android versions:** 7.0+ (minSdk 24)

## What differs from upstream

Everything deployment-specific is concentrated in a few places so upstream can still be merged:

| Area | Where |
|---|---|
| App name, bundle id (`loop.liencreate.com`), URL scheme (`loopapp`), deep-link host | `app.config.ts` |
| Icon / adaptive icon / splash / login logo | `assets/`, `src/assets/images/logo.png` — regenerate with `branding/render-assets.js` |
| Default server host, cloud-host list, help URL, client name | `src/constants/branding.ts` (overridable via `EXPO_PUBLIC_*`, see `.env.example`) |
| URL scheme constant used by SSO / deep links | `APP_SCHEME` in `src/constants/index.ts` |
| User-visible wording | `src/i18n/*.json` (5 keys per locale) |
| Boomerang icon component | `src/svg-icons/common/Loop.tsx` |

Internal identifiers (`selectChatwootVersion`, `X-Chatwoot-*` request headers, `chatwoot-dashboard-app:*` postMessage protocol, `@chatwoot/*` npm packages) are intentionally left untouched — they are the server protocol, not branding.

## Setup

```sh
pnpm install
cp .env.example .env        # fill in the values
pnpm test                   # jest
pnpm lint                   # eslint
npx tsc --noEmit            # type check
```

### Push notifications

The app uses Firebase Cloud Messaging on both platforms. Create a Firebase project, download
`google-services.json` (Android) and `GoogleService-Info.plist` (iOS) into the repo root
(both are git-ignored) and point `EXPO_PUBLIC_*_GOOGLE_SERVICES_FILE` at them.

On the Loop server:

1. Super admin → App Configs: set `FIREBASE_PROJECT_ID` and `FIREBASE_CREDENTIALS`
   (service-account JSON of the same Firebase project).
2. `.env`: `ENABLE_PUSH_RELAY_SERVER=false` — otherwise pushes are routed through Chatwoot's
   relay, which only knows the official app.

### Regenerating brand assets

```sh
cd branding
npm i --no-save @resvg/resvg-js   # one-off, not part of the app
node render-assets.js ..
```

### Building

EAS is configured in `eas.json`. `EXPO_PUBLIC_PROJECT_ID` is the EAS project id and
`EXPO_PUBLIC_EXPO_OWNER` the Expo account that owns it.

```sh
pnpm build:android       # eas build -p android --profile production
pnpm build:ios           # eas build -p ios --profile production
```

## Keeping up with upstream

```sh
git remote add upstream https://github.com/chatwoot/chatwoot-mobile-app.git
git fetch upstream
git merge upstream/develop
```

## License

MIT — see [LICENSE](LICENSE). Based on Chatwoot Mobile, © Chatwoot Inc.
