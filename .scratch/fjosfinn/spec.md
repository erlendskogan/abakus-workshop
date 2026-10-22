# Spec: FjøsFinn

**Status:** ready-for-agent

## Problem Statement

A Nisse lives on one Gård for a hundred years. Things pile up in the barn, while the Nisse on the next Gård lacks exactly that thing. Today the Nisser send word with crows, and the crows steal half of the goods. There is no place where a Nisse can see what other Nisser offer, or offer their own things.

## Solution

FjøsFinn is a website where Nisser trade things. The front page tells what FjøsFinn is and who it is for. A Nisse can see all Annonser, search them, and post their own Annonse with what they want in exchange (Byttes mot). There are no accounts and no money: the Nisse types their name and Gård on each Annonse. The Bytte itself happens outside FjøsFinn. The site has a dark night theme, because FjøsFinn is "open only at night" (a joke in the text only; the site never closes).

## User Stories

1. As a Nisse, I want the front page to show the name FjøsFinn, so that I know which site I am on.
2. As a Nisse, I want the front page to explain what FjøsFinn does, so that I understand that I can trade things here.
3. As a Nisse, I want the front page to say who FjøsFinn is for, so that I know it is meant for barn gnomes.
4. As a Nisse, I want a clear link from the front page to the Annonser, so that I can start looking at once.
5. As a Nisse, I want a clear link from the front page to post an Annonse, so that I can offer my own things.
6. As a Nisse, I want the front page to show the newest Annonser, so that I see what is on offer right now.
7. As a Nisse, I want the site to look like night, so that it feels like a place for Nisser.
8. As a Nisse, I want to see a list of all Annonser, newest first, so that I can find things I need.
9. As a Nisse, I want each Annonse in the list to show its title, Byttes mot, the Nisse's name and Gård, so that I can decide if the Bytte is worth it.
10. As a Nisse, I want to see the full description of an Annonse, so that I know the state of the thing.
11. As a Nisse, I want to search Annonser by a word, so that I find "smør" without reading every Annonse.
12. As a Nisse, I want the search to match both title and description, ignoring upper and lower case, so that I do not miss Annonser.
13. As a Nisse, I want a clear message when no Annonse matches my search, so that I know the search worked.
14. As a Nisse, I want to post an Annonse with title, description, Byttes mot, my name and my Gård, so that other Nisser can find my thing.
15. As a Nisse, I want the form to tell me which fields are missing, so that I can fix the Annonse before I post it.
16. As a Nisse, I want to see my Annonse in the list right after I post it, so that I know it was saved.
17. As a Nisse, I want the site to work on a phone, so that I can use it in the barn.
18. As a workshop team, we want example Annonser in the database, so that the site shows content from the start.

## Implementation Decisions

- Stack: Next.js (App Router) with TypeScript and Tailwind CSS, managed with pnpm. One app holds both the pages and the server code.
- The app reads the database URL from `DATABASE_URL` (in `.env.local`).
- The pages read and write data with server components and server actions; there is no separate REST API.
- One data module for Annonser hides the SQL. Its interface: list the newest Annonser (with an optional limit), search Annonser by a text, and create an Annonse. The pages call only this module.
- Schema: one table for Annonser, with an id, title, description, Byttes mot, the Nisse's name, the Gård, and the time it was created. All text fields are required. A Nisse and a Gård are plain text on the Annonse, not separate tables.
- Search is a case-insensitive substring match on title and description.
- The agent creates the table and the example data through the `postgres` MCP server, never with `psql`. The SQL is also kept in the repo (a schema file and a seed file) as the source of truth, so that a new machine can rebuild the database by running the files through the MCP server.
- Routes: the front page, the list of Annonser with search, and a page with the form to post an Annonse.
- All text on the site is in Norwegian bokmål and uses the terms from `GLOSSARY.md`.

## Testing Decisions

- One test seam: Playwright end-to-end tests against the running app and the real database. A good test drives the site like a Nisse would (open a page, type, click) and checks what the page shows. It never checks the SQL or the component structure.
- A test that creates an Annonse uses a unique title, and removes the Annonse afterwards, so that the tests do not fill the database.
- A screenshot script saves a PNG of a page, so that the agent can read the image and judge the look of the page itself.
- No prior art: this spec creates the first tests in the repo.

## Out of Scope

- Messages between Nisser.
- Accounts, login, or checking that a Nisse is who they say they are.
- Images on an Annonse.
- Editing or deleting an Annonse from the site.
- Prices or money.
- Closing the site during the day.

## Further Notes

- The product is described in `workshop/PRODUCT_BRIEF.md`, and the terms in `GLOSSARY.md`.
- Tickets are in `.scratch/fjosfinn/issues/`.
