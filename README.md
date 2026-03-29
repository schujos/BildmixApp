# Virtual Try-On

Web-App zum virtuellen Anprobieren von Kleidung. Zwei Bilder (Person + Kleidungsstück) werden hochgeladen und an einen KI-Webhook gesendet, der ein Ergebnisbild zurückliefert.

## Installation & Start

```bash
npm install
npm run dev
```

Öffne dann `http://localhost:5173` im Browser.

## Verwendung

1. **Image 1** — Foto der Person hochladen (Drag & Drop oder Klick)
2. **Image 2** — Foto des Kleidungsstücks hochladen
3. **Generate Try-On** klicken
4. Ergebnisbild wird nach der Verarbeitung angezeigt (kann bis zu 90 Sekunden dauern)

Unterstützte Formate: JPEG, PNG, WebP — max. 10 MB pro Bild.

## Weitere Befehle

```bash
npm run build    # Production-Build erstellen
npm run preview  # Production-Build lokal testen
```

## Projektstruktur

```
src/
├── App.tsx                      # Root-Komponente und Layout
├── hooks/
│   ├── useTryOn.ts              # Hauptlogik: State, Generate, Reset
│   └── useImageUpload.ts        # Upload-Slot mit Vorschau und Validierung
├── services/
│   └── webhookService.ts        # HTTP-Request an den Webhook
├── utils/
│   ├── responseParser.ts        # Antwortverarbeitung (Binary / JSON)
│   └── fileValidation.ts        # Dateiformat- und Größenprüfung
└── components/
    ├── UploadCard.tsx            # Drag-&-Drop-Uploadfeld mit Vorschau
    ├── GenerateButton.tsx        # Button mit Loading-State
    ├── ResultDisplay.tsx         # Ergebnisbild + Download
    ├── LoadingOverlay.tsx        # Vollbild-Ladeanzeige
    └── ErrorBanner.tsx           # Fehlermeldungen
```

## CORS

In der Entwicklung (`npm run dev`) leitet der Vite-Dev-Proxy alle Requests intern weiter — kein CORS-Problem.

Im Production-Deployment muss der n8n-Webhook den Header `Access-Control-Allow-Origin: *` senden, oder die App wird hinter einem Reverse-Proxy betrieben. Die Webhook-URL wird über die Umgebungsvariable `VITE_WEBHOOK_URL` konfiguriert (siehe `.env.production`).

## Tech Stack

- [React 18](https://react.dev/) + [Vite 5](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/) (strict mode)
- [Tailwind CSS v3](https://tailwindcss.com/)
