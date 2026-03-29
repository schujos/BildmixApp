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

**Stack:** React 18 + Vite 5 + TypeScript (strict) + Tailwind CSS v3. Keine externen Runtime-Libraries — nur Browser-native APIs (`fetch`, `FormData`, `URL.createObjectURL`, `AbortController`).

**Datenfluss:** `App.tsx` → `useTryOn()` → `useImageUpload()` (×2) + `webhookService.ts`

- `useTryOn` ist die einzige State-Quelle. Alle Komponenten erhalten State und Callbacks als Props — kein globaler State.
- `useImageUpload` verwaltet einen einzelnen Upload-Slot: Datei-Validierung, Preview-URL (Object URL) und Cleanup via `URL.revokeObjectURL`.
- `webhookService.ts` baut `FormData` mit Feldern `image1`/`image2` und sendet `POST` an `VITE_WEBHOOK_URL`.
- `responseParser.ts` brancht nach `Content-Type`: `image/*` → Blob-URL, `application/json` → sucht `.url`/`.imageUrl` oder Base64-Felder.

## CORS

- **Entwicklung:** Vite-Proxy in `vite.config.ts` leitet `/api/...` server-seitig an n8n weiter — kein CORS-Problem.
- **Produktion:** n8n-Webhook muss `Access-Control-Allow-Origin: *` als Response-Header senden, oder ein Thin-Proxy (Cloudflare Worker, Vercel Edge) muss vorgeschaltet werden.
- `VITE_WEBHOOK_URL` in `.env.development` zeigt auf den Proxy-Pfad (`/api/webhook/...`), in `.env.production` direkt auf n8n.

## Wichtige Konventionen

- Object URLs (`blob:...`) müssen immer mit `URL.revokeObjectURL` freigegeben werden — sowohl beim Ersetzen als auch beim Unmount. Bestehende Cleanup-Logik in `useImageUpload` und `useTryOn` (`reset()`) nicht entfernen.
- `Content-Type` bei `FormData`-Requests **nicht** manuell setzen — der Browser setzt den `multipart/form-data; boundary=...` Header automatisch.
- Timeout: 90 Sekunden via `AbortController` + `setTimeout` (in `useTryOn`). Timeout-Ref bei Unmount/Reset immer clearen.
- TypeScript strict mode ist aktiv (`noUnusedLocals`, `noUnusedParameters`).
