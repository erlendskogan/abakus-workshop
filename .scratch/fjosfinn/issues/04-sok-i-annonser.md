# 04: Søk i annonser

**What to build:** A Nisse types a word on `/annonser` and sees only the Annonser whose title or description contains the word, ignoring upper and lower case. When nothing matches, the page says so.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] A search for "smør" shows the smørklatt Annonse and hides Annonser without the word.
- [ ] The search ignores upper and lower case.
- [ ] A search with no match shows a clear message.
- [ ] The search word is in the URL, so that a search can be shared.
- [ ] E2e tests cover a match and no match.
