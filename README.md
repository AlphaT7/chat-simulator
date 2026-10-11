# Chat Simulator

A small browser-based voice chat demo built with Vite. The app uses the browser's Web Speech APIs for speech recognition and text-to-speech, displays the conversation in a transcript view, and includes a simple settings panel for toggling spoken responses.

## Current state

This project is a front-end prototype rather than a production LLM app. The current implementation is focused on:

- capturing microphone input in the browser
- converting speech to text via `SpeechRecognition`
- showing user and AI transcript bubbles in the UI
- optionally speaking the AI response with `SpeechSynthesis`
- canceling an active speech or processing state from the main button

The AI layer in `src/js/ai.js` is currently a placeholder: `AI.Query()` returns a static string and does not connect to a real local model, external API, or backend service yet.

## Tech stack

- Vite for local development and bundling
- vanilla HTML/CSS/JS
- browser speech recognition and synthesis APIs
- no backend server required

## Run locally

Install dependencies:

```bash
npm install
```

Start the app:

```bash
npx vite --host 0.0.0.0 --port 3000
```

Then open the local URL shown in the terminal, typically:

```text
http://localhost:3000
```

Note: microphone access requires a secure context or a browser that allows local localhost access. `localhost` is generally accepted as secure.

## Project structure

```text
src/
  index.html
  css/
  fonts/
  js/
    ai.js
    appState.js
    audioInput.js
    audioOutput.js
    main.js
    ui.js
```

## Important implementation notes

- `src/js/main.js` initializes the app after the page loads and waits for `speechSynthesis` to be available.
- `src/js/audioInput.js` handles speech recognition and user interaction flow.
- `src/js/audioOutput.js` manages TTS playback and cancellation.
- `vite.config.js` includes COOP/COEP headers to support browser-based WASM/worker scenarios and to prepare the project for future browser-side model work.

## Roadmap / next steps

This repo is currently best understood as a UI prototype for a voice assistant. The next meaningful improvements would be wiring in a real model or API layer, adding a real AI backend, and replacing the placeholder response in `src/js/ai.js`.
