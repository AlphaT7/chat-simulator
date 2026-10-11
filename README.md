# Pocket Chat (in-browser LLM on Wasmer Edge)

Static site. A 360M-parameter model (SmolLM2, Q4_K_M GGUF) runs in the visitor's
browser via wllama (llama.cpp compiled to WebAssembly). The model file is fetched
from Hugging Face by the visitor, so Wasmer only serves ~4 MB of static files.

## Deploy
From an empty folder:

    wasmer deploy --template=static-website

That generates app.yaml, wasmer.toml, config.toml and a public/ folder.
Replace the generated public/ with the public/ folder from this project, then:

    wasmer deploy

## Test locally
    cd public && python3 -m http.server 8080
Open http://localhost:8080 (localhost counts as a secure context).

## Notes
- Multi-threading needs cross-origin isolation (COOP/COEP headers). Without
  them the app automatically runs single-threaded. Add the headers in
  config.toml (static-web-server supports custom headers) if you want faster output.
- Libraries: @wllama/wllama 2.3.7 (MIT), see public/vendor/wllama-LICENCE.
- Model: mfuntowicz/SmolLM2-360M-Instruct-Q4_K_M-GGUF (Apache-2.0 per its HF page).
