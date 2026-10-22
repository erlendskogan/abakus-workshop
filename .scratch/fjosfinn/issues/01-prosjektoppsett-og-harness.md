# 01: Prosjektoppsett og harness

**What to build:** An empty Next.js app (TypeScript, Tailwind, pnpm) that runs locally, with the tools the agent needs to check its own work: Playwright end-to-end tests, a screenshot script, and a rule that blocks `psql` so that database work goes through the `postgres` MCP server.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] `pnpm dev` starts the app, and the front page answers on localhost.
- [ ] `pnpm test:e2e` runs Playwright, starts the app by itself, and one smoke test passes.
- [ ] `pnpm screenshot <url> <file>` saves a PNG of the page, and the agent can read it.
- [ ] `pnpm typecheck` and `pnpm lint` pass.
- [ ] `.claude/settings.json` denies `psql`, also through `docker exec`.
- [ ] `CLAUDE.md` names the stack, the commands, and the rule that database work goes through the `postgres` MCP server.
