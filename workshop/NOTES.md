Har vi definert riktig problem og tydelige akseptansekriterier?
Vi valgte produktet FjøsFinn: Finn.no for fjøsnisser. Nissene legger ut annonser og bytter ting. Det finnes ingen penger og ingen innlogging. Meldinger mellom nisser er utenfor scope.

Har vi dokumentert beslutninger og gitt agenten tilgang til relevant informasjon?
Begrepene står i `GLOSSARY.md` (Nisse, Gård, Annonse, Byttes mot, Bytte). Neste agent finner dem der, og spec og tickets bruker de samme ordene.

Hvilke tools, skills, rettigheter og verifikasjonsmekanismer trenger løsningen?
Docker feilet først fordi brukeren ikke var med i gruppen `docker`. Da kunne heller ikke MCP-serveren `postgres` starte.
Vi beholder MCP-serveren i modusen `unrestricted`, fordi agenten skal lage tabeller. Vi blokkerer `psql` i `.claude/settings.json`, slik at agenten må bruke MCP.

Hvordan evaluerer og korrigerer agenten sitt eget arbeid?
Agenten tar skjermbilder med Playwright og leser bildet selv. Den kjører også e2e-tester mot siden.

Hvilke tickets kan utføres parallelt, og hvordan organiserer vi avhengighetene?
_Fill in here_

Other relevant notes
Stack: Next.js med TypeScript og Tailwind, og pnpm. Vi implementerer én ticket om gangen med `/implement`.
