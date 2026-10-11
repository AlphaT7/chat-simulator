// import mkcert from "vite-plugin-mkcert";

// Cross-origin isolation enables SharedArrayBuffer, which wllama needs for multi-threading.
const isolationHeaders = {
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Embedder-Policy": "require-corp",
};

// vite.config.js
export default {
    // plugins: [mkcert()],
    root: "./src/",
    // root: "./src-1/",
    publicDir: "../public/",
    build: {
        outDir: "../dist/",
        emptyOutDir: true,
        reportCompressedSize: true,
    },
    server: {
        // https: true,
        port: 3000,
        host: true,
        open: false,
        headers: isolationHeaders,
    },
    preview: {
        headers: isolationHeaders,
    },
    worker: {
        format: 'es',
    },
};
