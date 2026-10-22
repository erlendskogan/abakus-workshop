# 03: Annonseliste fra databasen

**What to build:** A Nisse opens `/annonser` and sees the Annonser from the database, newest first, each with title, description, Byttes mot, the Nisse's name and Gård. The agent creates the table and the example Annonser through the `postgres` MCP server, and keeps the SQL in the repo as a schema file and a seed file.

**Blocked by:** 01. The machine must also give the user Docker access, so that the database and the MCP server run.

**Status:** ready-for-agent

- [ ] The table for Annonser exists, created through the `postgres` MCP server, not `psql`.
- [ ] At least five example Annonser exist, among them the smørklatt from Tulla on Øvre Li.
- [ ] The agent has checked the example data with a query through the MCP server.
- [ ] The schema file and the seed file in the repo match the database.
- [ ] `/annonser` shows the Annonser from the database, newest first.
- [ ] An e2e test checks that a seeded Annonse shows on `/annonser`.
