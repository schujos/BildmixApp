# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository

- **Remote:** `https://github.com/schujos/BildmixApp.git`
- **Hauptbranch:** `main`
- **Produktion:** `https://bildapp-8s33.vercel.app/`

## Commands

```bash
npm run dev      # Dev-Server starten (http://localhost:5173)
npm run build    # Production-Build (tsc + vite build)
npm run preview  # Production-Build lokal vorschauen
npx tsc --noEmit # TypeScript-Check ohne Build
```

## Architecture

**Stack:** React 18.3 + Vite 5.4 + TypeScript 5.6 (strict) + Tailwind CSS v3.4 + Supabase JS SDK.

**Verzeichnisstruktur:**
```
src/
  main.tsx              # Entry point — mountet App in StrictMode
  App.tsx               # Root-Komponente — Auth-Gate: loading/unauthenticated/authenticated
  index.css             # Tailwind-Direktiven + Body-Styles (slate-950 Hintergrund)
  lib/
    supabase.ts         # Supabase-Client (createClient mit VITE_SUPABASE_URL/ANON_KEY)
  types/
    index.ts            # Shared types: UploadSlot, AppStatus, UploadedImage
  hooks/
    useAuth.ts          # Auth-State (loading/authenticated/unauthenticated) + signUp/signIn/signOut
    useTryOn.ts         # Master-State-Hook — orchestriert Uploads + API-Aufruf
    useImageUpload.ts   # Einzelner Upload-Slot — Validierung, Preview-URL, Cleanup
  services/
    webhookService.ts   # submitTryOn() — FormData bauen, fetch, Response-URL zurückgeben
  utils/
    responseParser.ts   # parseWebhookResponse() — binary/JSON/Base64-Responses
    fileValidation.ts   # validateImageFile() + formatFileSize() — Typ/Größe-Prüfung
  components/
    AuthPage.tsx        # Login/Registrierungs-Formular (mode: login | register)
    TryOnApp.tsx        # Haupt-App — alle Upload/Generate-UI, Props: userEmail + onSignOut
    UploadCard.tsx      # Drop-Zone mit Drag-and-Drop, Datei-Input, Fehleranzeige
    ImagePreview.tsx    # Vorschau-Bild mit Entfernen-Button (×)
    GenerateButton.tsx  # CTA-Button — idle/loading/disabled-Zustände
    LoadingOverlay.tsx  # Vollbild-Spinner mit backdrop-blur während der Generierung
    ResultDisplay.tsx   # Ergebnisbild + Download-Link
    ErrorBanner.tsx     # Rote, schließbare Fehlerleiste
```

**Datenfluss:** `App.tsx` → Auth-Gate → `TryOnApp.tsx` → `useTryOn()` → `useImageUpload()` (×2) + `webhookService.ts`

- `App.tsx` prüft Auth-State via `useAuth()` und rendert entweder Ladeanimation, `AuthPage` oder `TryOnApp`.
- `TryOnApp` enthält `useTryOn()` — ausgelagert um React Rules of Hooks zu erfüllen (kein Hook nach Early Return).
- `useAuth` abonniert `supabase.auth.onAuthStateChange` und exponiert `signUp/signIn/signOut`.
- `signUp` übergibt `{ name }` als `options.data` — ein Datenbank-Trigger (`on_auth_user_created`) schreibt daraus automatisch einen Eintrag in `public.profiles`.
- `useTryOn` ist die einzige State-Quelle für Upload/Generate. Alle Komponenten erhalten State und Callbacks als Props — kein globaler State.
- `useImageUpload` verwaltet einen einzelnen Upload-Slot: Datei-Validierung (via `fileValidation.ts`), Preview-URL (Object URL) und Cleanup via `URL.revokeObjectURL`.
- `webhookService.ts` baut `FormData` mit Feldern `image1`/`image2` und sendet `POST` an `VITE_WEBHOOK_URL`.
- `responseParser.ts` brancht nach `Content-Type`: `image/*` → Blob-URL, `application/json` → sucht `.url`/`.imageUrl` oder Base64-Felder.
- `fileValidation.ts` erlaubt JPEG/PNG/WebP, max. 10 MB.

## Supabase

- **Projekt-URL:** `https://ugtnzxfllfhvicxdodmp.supabase.co`
- **Tabellen:**
  - `public.profiles` — `id` (UUID, FK → auth.users), `name`, `email`, `created_at`. RLS aktiv: Nutzer sieht/erstellt nur eigenes Profil.
- **Trigger:** `on_auth_user_created` auf `auth.users` → ruft `handle_new_user()` auf → INSERT in `profiles` mit Name aus `raw_user_meta_data`.
- **Auth:** E-Mail + Passwort. Redirect-URL für Produktion im Supabase-Dashboard unter Authentication → URL Configuration eintragen.

## CORS

- **Entwicklung:** Vite-Proxy in `vite.config.ts` leitet `/api/...` server-seitig an n8n weiter — kein CORS-Problem.
- **Produktion:** n8n-Webhook muss `Access-Control-Allow-Origin: *` als Response-Header senden, oder ein Thin-Proxy (Cloudflare Worker, Vercel Edge) muss vorgeschaltet werden.
- `VITE_WEBHOOK_URL` in `.env.development` zeigt auf den Proxy-Pfad (`/api/webhook/...`), in `.env.production` direkt auf n8n.

## Wichtige Konventionen

- Object URLs (`blob:...`) müssen immer mit `URL.revokeObjectURL` freigegeben werden — sowohl beim Ersetzen als auch beim Unmount. Bestehende Cleanup-Logik in `useImageUpload` und `useTryOn` (`reset()`) nicht entfernen.
- `Content-Type` bei `FormData`-Requests **nicht** manuell setzen — der Browser setzt den `multipart/form-data; boundary=...` Header automatisch.
- Timeout: 90 Sekunden via `AbortController` + `setTimeout` (in `useTryOn`). Timeout-Ref bei Unmount/Reset immer clearen.
- TypeScript strict mode ist aktiv (`noUnusedLocals`, `noUnusedParameters`).
- React Rules of Hooks: Hooks nie nach Early Returns aufrufen. Auth-Gate-Logik gehört in `App.tsx`, App-Logik in separate Kind-Komponenten.
