# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Dev-Server starten (http://localhost:5173)
npm run build    # Production-Build (tsc + vite build)
npm run preview  # Production-Build lokal vorschauen
npx tsc --noEmit # TypeScript-Check ohne Build
```

## Architecture

**Stack:** React 18.3 + Vite 5.4 + TypeScript 5.6 (strict) + Tailwind CSS v3.4. Keine externen Runtime-Libraries — nur Browser-native APIs (`fetch`, `FormData`, `URL.createObjectURL`, `AbortController`).

**Verzeichnisstruktur:**
```
src/
  main.tsx              # Entry point — mountet App in StrictMode
  App.tsx               # Root-Komponente — Layout only, alle State aus useTryOn()
  index.css             # Tailwind-Direktiven + Body-Styles (slate-950 Hintergrund)
  types/
    index.ts            # Shared types: UploadSlot, AppStatus, UploadedImage
  hooks/
    useTryOn.ts         # Master-State-Hook — orchestriert Uploads + API-Aufruf
    useImageUpload.ts   # Einzelner Upload-Slot — Validierung, Preview-URL, Cleanup
  services/
    webhookService.ts   # submitTryOn() — FormData bauen, fetch, Response-URL zurückgeben
  utils/
    responseParser.ts   # parseWebhookResponse() — binary/JSON/Base64-Responses
    fileValidation.ts   # validateImageFile() + formatFileSize() — Typ/Größe-Prüfung
  components/
    UploadCard.tsx      # Drop-Zone mit Drag-and-Drop, Datei-Input, Fehleranzeige
    ImagePreview.tsx    # Vorschau-Bild mit Entfernen-Button (×)
    GenerateButton.tsx  # CTA-Button — idle/loading/disabled-Zustände
    LoadingOverlay.tsx  # Vollbild-Spinner mit backdrop-blur während der Generierung
    ResultDisplay.tsx   # Ergebnisbild + Download-Link
    ErrorBanner.tsx     # Rote, schließbare Fehlerleiste
```

**Datenfluss:** `App.tsx` → `useTryOn()` → `useImageUpload()` (×2) + `webhookService.ts`

- `useTryOn` ist die einzige State-Quelle. Alle Komponenten erhalten State und Callbacks als Props — kein globaler State.
- `useImageUpload` verwaltet einen einzelnen Upload-Slot: Datei-Validierung (via `fileValidation.ts`), Preview-URL (Object URL) und Cleanup via `URL.revokeObjectURL`.
- `webhookService.ts` baut `FormData` mit Feldern `image1`/`image2` und sendet `POST` an `VITE_WEBHOOK_URL`.
- `responseParser.ts` (in `src/utils/`) brancht nach `Content-Type`: `image/*` → Blob-URL, `application/json` → sucht `.url`/`.imageUrl` oder Base64-Felder.
- `fileValidation.ts` erlaubt JPEG/PNG/WebP, max. 10 MB.

## CORS

- **Entwicklung:** Vite-Proxy in `vite.config.ts` leitet `/api/...` server-seitig an n8n weiter — kein CORS-Problem.
- **Produktion:** n8n-Webhook muss `Access-Control-Allow-Origin: *` als Response-Header senden, oder ein Thin-Proxy (Cloudflare Worker, Vercel Edge) muss vorgeschaltet werden.
- `VITE_WEBHOOK_URL` in `.env.development` zeigt auf den Proxy-Pfad (`/api/webhook/...`), in `.env.production` direkt auf n8n.

## Wichtige Konventionen

- Object URLs (`blob:...`) müssen immer mit `URL.revokeObjectURL` freigegeben werden — sowohl beim Ersetzen als auch beim Unmount. Bestehende Cleanup-Logik in `useImageUpload` und `useTryOn` (`reset()`) nicht entfernen.
- `Content-Type` bei `FormData`-Requests **nicht** manuell setzen — der Browser setzt den `multipart/form-data; boundary=...` Header automatisch.
- Timeout: 90 Sekunden via `AbortController` + `setTimeout` (in `useTryOn`). Timeout-Ref bei Unmount/Reset immer clearen.
- TypeScript strict mode ist aktiv (`noUnusedLocals`, `noUnusedParameters`).
