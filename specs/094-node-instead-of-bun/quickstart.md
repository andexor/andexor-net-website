# Quickstart: Node.js and npm Instead of Bun

Earlier specs (001 to 093) and their quickstarts use the Bun commands in the left column. Run the right column.

| Was                                   | Now                                                  |
| ------------------------------------- | ---------------------------------------------------- |
| `bun install`                         | `npm ci` (or `npm install` to change the lockfile)   |
| `bun install --frozen-lockfile`       | `npm ci`                                             |
| `bun add <package>`                   | `npm install <package>`                              |
| `bun add -d <package>`                | `npm install --save-dev <package>`                   |
| `bun update`                          | `npm update`                                         |
| `bun run build`                       | `npm run build`                                      |
| `bun run test`, `bun test`            | `npm test`                                           |
| `bun run test:e2e`                    | `npm run test:e2e`                                   |
| `bun run format`, `format:check`      | `npm run format`, `npm run format:check`             |
| `bun run preview`, `deploy`           | `npm run preview`, `npm run deploy`                  |
| `bun scripts/<name>.ts`               | `npx tsx --tsconfig tsconfig.scripts.json scripts/<name>.ts` |
| `bun run server.ts`                   | `node server.ts`                                     |
| `bunx <tool>`                         | `npx <tool>`                                         |
| `bun.lock`                            | `package-lock.json`                                  |

Checks for this feature:

```bash
npm ci
npm run lint && npm test && npm run build
npx playwright test --project=chromium      # port 3000 must be free

# The Docker image (the same command build.sh runs after it refreshes the sitemap):
docker build --secret id=npmrc,src=.npmrc --tag andexor/andexor-net-website:1 .
docker run --rm --name check -p 3000:3000 andexor/andexor-net-website:1 &
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/
docker kill --signal=SIGINT check            # log: "Received SIGINT, shutting down", exit 0
docker ps -a --filter name=check             # nothing listed
```
