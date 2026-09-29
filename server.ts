// SPDX-License-Identifier: Apache-2.0
// Copyright 2026 Andexor Network, Inc.
// Author: Ed Jenkins <ed@andexor.net>

// Minimal static file server for the Next.js SSG output (`out/`).
// Used only by the Docker runtime stage (see Dockerfile) to serve the
// pre-built site with Bun instead of running a Next.js/Node server.

import { join } from "node:path";

const OUT_DIR = join(import.meta.dir, "out");
const PORT = Number(process.env.PORT ?? 3000);

async function resolveFile(pathname: string) {
  const candidates = [
    join(OUT_DIR, pathname),
    join(OUT_DIR, pathname, "index.html"),
    join(OUT_DIR, `${pathname}.html`),
  ];

  for (const candidate of candidates) {
    const file = Bun.file(candidate);
    if (await file.exists()) return file;
  }
  return null;
}

const server = Bun.serve({
  port: PORT,
  hostname: "0.0.0.0",
  async fetch(req) {
    const { pathname } = new URL(req.url);
    const file = await resolveFile(pathname === "/" ? "/index.html" : pathname);
    if (file) return new Response(file);

    const notFound = Bun.file(join(OUT_DIR, "404.html"));
    if (await notFound.exists()) return new Response(notFound, { status: 404 });
    return new Response("Not found", { status: 404 });
  },
});

console.log(`Serving ${OUT_DIR} on :${PORT}`);

// In Docker this process is PID 1, and the kernel ignores SIGINT/SIGTERM for
// PID 1 unless it installs handlers. Without these, ^C and `docker stop` do
// nothing until Docker escalates to SIGKILL. Stop accepting connections, let
// in-flight requests finish, then exit so `--rm` removes the container.
let shuttingDown = false;
function shutdown(signal: string) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`Received ${signal}, shutting down`);
  // Safety net in case a connection refuses to close.
  setTimeout(() => process.exit(1), 5000).unref();
  server.stop().then(() => process.exit(0));
}
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
