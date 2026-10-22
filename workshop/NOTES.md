Har vi definert riktig problem og tydelige akseptansekriterier?
Vi valgte produktet FjøsFinn: Finn.no for fjøsnisser. Nissene legger ut annonser og bytter ting. Det finnes ingen penger og ingen innlogging. Meldinger mellom nisser er utenfor scope.
Kodegjennomgangen fant ordene «Kjøp» og «konto» i teksten på siden, selv om `GLOSSARY.md` sier at vi skal unngå dem. Ingen akseptansekriterier nevnte ordlisten, så verken testene eller skjermbildene fanget det.
Vi gjorde ordlisten til en test. `e2e/ordliste.spec.ts` leser ordene som skal unngås fra `GLOSSARY.md`, besøker alle sidene som nettsiden lenker til, og feiler hvis et av ordene står der. Spec-en og `CLAUDE.md` sier at hver ticket må holde testen grønn. Vi sjekket at testen feiler når «Kjøp» står i teksten.

Har vi dokumentert beslutninger og gitt agenten tilgang til relevant informasjon?
Begrepene står i `GLOSSARY.md` (Nisse, Gård, Annonse, Byttes mot, Bytte). Neste agent finner dem der, og spec og tickets bruker de samme ordene.
Oppsettet i `README.md` og `.mcp.json` virket bare på Mac og Windows. På Linux fikk MCP-serveren tidsavbrudd, fordi adressen `host.docker.internal` ikke finnes der. Vi skrev løsningen inn i `README.md` under «På Linux», og `/setup` viser nå til den.
Vi skrev inn i `CLAUDE.md` at testene får slette annonsene de selv lager rett i databasen, men bare for å rydde opp.

Hvilke tools, skills, rettigheter og verifikasjonsmekanismer trenger løsningen?
Docker feilet først fordi brukeren ikke var med i gruppen `docker`. Da kunne heller ikke MCP-serveren `postgres` starte.
Vi beholder MCP-serveren i modusen `unrestricted`, fordi agenten skal lage tabeller. Vi blokkerer `psql` i `.claude/settings.json`, slik at agenten må bruke MCP.
Agenten jobbet i en egen git worktree (en egen arbeidskopi av repoet), slik at en annen chat kunne jobbe i hovedmappen samtidig. Da trengte vi `E2E_PORT`, slik at to kopier kan kjøre testene samtidig. ESLint leste også byggfilene i worktreen, så vi la `.claude/**` til i ignore-listen.
Agenten skrev ut hele `.env.local` i loggen, med en API-nøkkel. Nøkkelen må byttes, og agenten bør ikke lese filer med hemmeligheter. Nå blokkerer `.claude/settings.json` at agenten leser `.env.local`.

Hvordan evaluerer og korrigerer agenten sitt eget arbeid?
Agenten tar skjermbilder med Playwright og leser bildet selv. Den kjører også e2e-tester mot siden.
På forsiden var testene grønne, men skjermbildet viste tre feil: en hard kant i bakgrunnen, en rød trekant som ikke lignet en lue, og Next sin dev-knapp over teksten. Testene fanget ingen av dem, men skjermbildet fanget alle.
Etter at ticket 03 til 06 var ferdige, kjørte vi `/code-review` med to sub-agenter: én mot standardene og én mot spec-en. De fant feil ord i teksten, en header som var kopiert på tre sider, og en test med misvisende navn. Testene og skjermbildene fanget ingen av disse.
Etter ticket 05 la agenten ut en annonse gjennom skjemaet, og sjekket med en spørring gjennom MCP at den lå i databasen.

Hvilke tickets kan utføres parallelt, og hvordan organiserer vi avhengighetene?
Ticket 02 (forside) og 03 (annonseliste) kan gå parallelt. Det kan også 04 (søk) og 05 (legg ut annonse), men begge endrer databasemodulen for annonser. Ticket 03 venter også på at Docker-tilgangen er i orden.
I praksis gjorde én agent ticket 03 til 06 etter hverandre i samme worktree, og hovedmappen ble aldri brukt i mellomtiden. Derfor gikk merge inn i `workshop` uten konflikter. Ticket 05 og 06 endret begge annonsekortet, så de passet ikke til å gå parallelt.

Other relevant notes
Stack: Next.js med TypeScript og Tailwind, og pnpm. Vi implementerer én ticket om gangen med `/implement`.
