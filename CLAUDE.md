# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is a workshop repo where the team uses Claude Code to build FjøsFinn, a marketplace for barn gnomes (see `workshop/PRODUCT_BRIEF.md`). Use the terms in `GLOSSARY.md` in code, tickets and page text. The spec and the tickets are in `.scratch/fjosfinn/`.

## Stack and commands

Next.js (App Router) with TypeScript and Tailwind CSS, managed with pnpm. The app code is in `src/`, and the Playwright end-to-end tests are in `e2e/`.

- `pnpm dev`: start the app on http://localhost:3000.
- `pnpm typecheck` and `pnpm lint`: run both before you say that work is done.
- `pnpm test:e2e`: run the end-to-end tests. Playwright starts the app on port 3100 by itself. End-to-end tests are the only test seam: test what a Nisse sees and does on the page, not the code.
- `pnpm screenshot <url> <file> [--mobile]`: save a PNG of a page under `screenshots/`. After a change to a page, take a screenshot at desktop and phone width, read the image, and fix what looks wrong before you say that the page is done.

## Database

Do all database work (create tables, insert data, check data) through the `postgres` MCP server. Never use `psql`; `.claude/settings.json` blocks it. Keep the SQL that you run in `db/schema.sql` and `db/seed.sql`, so that a new machine can rebuild the database. The app connects with `DATABASE_URL` from `.env.local`.

- `README.md`: the workshop plan for the students, with the setup steps for the database and the MCP server in its last section, `## Teknisk oppsett`.
- `workshop/PRODUCT_BRIEF.md`: the product the team builds, written by `/generate-product`.
- `workshop/NOTES.md`: the team's reflection sheet, written by `/note`.
- `.claude/commands/`: the workshop commands `/setup`, `/generate-product`, `/talk-with-customer` and `/note`.
- `.agents/skills/`: the skills, installed from mattpocock/skills and pinned in `skills-lock.json`. `.claude/skills/` holds symlinks to them.

PostgreSQL runs in Docker. `README.md` has the setup steps under `## Teknisk oppsett`, and `.env.template` has the connection URL (`DATABASE_URL`). The `postgres` MCP server in `.mcp.json` connects to the same database.

Text for the students (the README, the product brief and the notes) is in Norwegian bokmål. Instructions for agents (commands, skills and this file) are in English.

## Issue tracker

The issue tracker is local Markdown files under `.scratch/<feature-slug>/`:

- `/to-spec` writes the spec to `.scratch/<feature-slug>/spec.md`.
- `/to-tickets` writes one file per ticket to `.scratch/<feature-slug>/issues/<NN>-<slug>.md`, with its local ticket template.
- A triage label is the `**Status:**` line of the file. A ticket is ready when the line is `ready-for-agent`. To close a ticket, set the line to `done`.
- To refer to a spec or a ticket, for example in a commit message, use its file path.
