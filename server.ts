// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Minimal static file server for the Next.js SSG output (`out/`).
// Used by the Playwright tests to serve the pre-built site with plain Node.js instead of running a Next.js server. It uses no packages, and Node runs it directly
// (`node server.ts`) because it only uses syntax that Node's TypeScript support can strip.

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer, type ServerResponse } from "node:http";
import { extname, join, sep } from "node:path";

const OUT_DIR = join(import.meta.dirname, "out");
const PORT = Number(process.env.PORT ?? 3000);

// Node sets no Content-Type for a file, so one is chosen from the extension. Anything not listed is sent as plain
// bytes, which a browser downloads rather than runs.
const CONTENT_TYPES: Record<string, string> = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".mjs": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".webmanifest": "application/manifest+json; charset=utf-8",
    ".txt": "text/plain; charset=utf-8",
    ".xml": "application/xml; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".ico": "image/x-icon",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".map": "application/json; charset=utf-8",
};

interface FoundFile {
    path: string;
    size: number;
}

async function fileAt(candidate: string): Promise<FoundFile | null> {
    try {
        const info = await stat(candidate);
        return info.isFile() ? { path: candidate, size: info.size } : null;
    } catch {
        return null;
    }
}

async function resolveFile(rawPathname: string): Promise<FoundFile | null> {
    // The URL path is still percent-encoded here (Next.js chunk names such as
    // app/[...slug]/page-*.js arrive as %5B...slug%5D), so decode it before
    // looking on disk. A malformed escape or a NUL byte is simply not found.
    let pathname: string;
    try {
        pathname = decodeURIComponent(rawPathname);
    } catch {
        return null;
    }
    if (pathname.includes("\0")) return null;

    const candidates = [
        join(OUT_DIR, pathname),
        join(OUT_DIR, pathname, "index.html"),
        join(OUT_DIR, `${pathname}.html`),
    ];

    for (const candidate of candidates) {
        // Decoding can produce ".." segments (from %2e%2e); never serve outside out/.
        if (candidate !== OUT_DIR && !candidate.startsWith(OUT_DIR + sep)) continue;
        const found = await fileAt(candidate);
        if (found) return found;
    }
    return null;
}

function send(response: ServerResponse, status: number, file: FoundFile, head: boolean): void {
    response.writeHead(status, {
        "Content-Type": CONTENT_TYPES[extname(file.path).toLowerCase()] ?? "application/octet-stream",
        "Content-Length": file.size,
    });
    if (head) {
        response.end();
        return;
    }
    // A file that cannot be read after it was found ends the response instead of crashing the server.
    createReadStream(file.path)
        .on("error", () => response.destroy())
        .pipe(response);
}

const server = createServer(async (request, response) => {
    const head = request.method === "HEAD";
    if (request.method !== "GET" && !head) {
        response.writeHead(405, { Allow: "GET, HEAD" }).end();
        return;
    }
    // `new URL` needs a base for a path-only request line, and the host is never used.
    const { pathname } = new URL(request.url ?? "/", "http://localhost");
    const file = await resolveFile(pathname === "/" ? "/index.html" : pathname);
    if (file) {
        send(response, 200, file, head);
        return;
    }
    const notFound = await fileAt(join(OUT_DIR, "404.html"));
    if (notFound) {
        send(response, 404, notFound, head);
        return;
    }
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end(head ? undefined : "Not found");
});

server.listen(PORT, "0.0.0.0", () => console.log(`Serving ${OUT_DIR} on :${PORT}`));

// Exit cleanly on ^C and when a test run stops the server: stop accepting connections, let in-flight requests
// finish, then exit. (These handlers were required while the server ran as PID 1 in a Docker container, where the
// kernel ignores SIGINT and SIGTERM unless the process handles them.)
let shuttingDown = false;
function shutdown(signal: string) {
    if (shuttingDown) return;
    shuttingDown = true;
    console.log(`Received ${signal}, shutting down`);
    // Safety net in case a connection refuses to close.
    setTimeout(() => process.exit(1), 5000).unref();
    server.close(() => process.exit(0));
    // Keep-alive connections with no request in progress would otherwise hold the server open.
    server.closeIdleConnections();
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
