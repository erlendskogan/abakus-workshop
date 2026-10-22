# 05: Legg ut annonse

**What to build:** A Nisse fills in a form on `/annonser/ny` with title, description, Byttes mot, name and Gård, and posts it. The Annonse is saved in the database, and the Nisse sees it in the list. Missing fields give a clear message.

**Blocked by:** 03. Can run in parallel with 04, but both change the data module for Annonser.

**Status:** done

- [x] A filled-in form saves the Annonse and shows it on `/annonser`.
- [x] A form with a missing field is not saved, and the page says which field is missing.
- [x] The agent has checked through the `postgres` MCP server that the Annonse is in the database.
- [x] An e2e test posts an Annonse with a unique title, sees it in the list, and removes it afterwards.
