# Welcome to F1 Mobile

Expo + React Native app for the Welcome to F1 guide.

## Data

The app shell is built into the native app: routes, tabs, components, theme tokens, and behavior.

Content is fetched from the static web contract:

- `https://welcometof1.com/data/v1/manifest.json`
- The resource URLs listed in that manifest.

The app caches content locally with TanStack Query and SQLite-backed `localStorage`. On launch it can render cached content, then refresh from the published JSON in the background.

Images are also sourced from the web contract. Driver screens use `drivers.json` image fields, while race surfaces use each race's `image`/`imageAlt` fields from `races.json` and resolve them against `manifest.baseUrl`.

## Run

```sh
npm install
npm start
```

Expo prints:

- an Expo Go QR code
- a Metro URL
- a local web URL

Core app screens run in Expo Go. Widgets and Live Activities require a native development or store build.

## Checks

```sh
npm run typecheck
npx expo-doctor
npx expo export --platform ios
```

## Implemented MVP

- Native tab shell: Home, Learn, Schedule, Grid, Search
- Settings and Favorites modals
- Static JSON content client with manifest/resource fetch
- Persisted cache
- Theme and unit preferences
- Driver/team/race/topic favorites
- Local session reminders with Expo Notifications
- iOS/Android widget config through `expo-widgets`
- Next race widget snapshot sync
- Race-week Live Activity start hook
- Liquid Glass wrapper with blur fallback
