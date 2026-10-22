# Abakus-workshop

Dere skal bygge en nettside for et oppdiktet produkt med Claude Code. Repoet har ingen startkode, så dere velger språk, rammeverk og struktur selv. Hopp over innlogging (autentisering): siden trenger ingen brukerkontoer eller passord. Repoet har en PostgreSQL-database og en MCP-server for den. MCP (Model Context Protocol) gir agenten verktøy, her tilgang til databasen.

## Fem perspektiver

Hovedmålet med workshopen er å designe systemet rundt agenten, slik at agenten gjør godt arbeid. Nettsiden er det dere øver på. Tenk gjennom disse fem perspektivene i hver fase:

| Engineering | Hva teamet må tenke gjennom |
| --- | --- |
| Prompt | Hvordan beskriver vi oppgaven og ferdigkriteriene? |
| Context | Hvordan sørger vi for at agenten har relevant informasjon? |
| Harness | Hvilke skills, verktøy og automatiske kontroller trenger den? |
| Loop | Hvordan kan agenten teste og rette egen kode? |
| Graph | Hva bør gjøres i sekvens, og hva kan eventuelt delegeres parallelt? |

Hvert hint i planen sier hvilket perspektiv det hører til.

Bruk `/note` gjennom hele arbeidet. Hver gang dere tar en beslutning, ser agenten gjøre en feil, eller endrer oppsettet, skriv det ned. Kommandoen skriver til `workshop/NOTES.md` og stiller dere et oppfølgingsspørsmål. Hvis dere vet hvilket perspektiv notatet hører til, skriv det først: `prompt`, `context`, `harness`, `loop` eller `graph`.

## 1. Oppsett

Kjør `/setup`. Agenten starter databasen og hjelper dere med å koble til MCP-serveren `postgres`. Stegene står også under [Teknisk oppsett](#teknisk-oppsett) nederst i denne filen.

Dere er ferdige når `pg_isready` svarer `accepting connections`, og `/mcp` i Claude Code viser at `postgres` er koblet til.

## 2. Velg produkt

Kjør `/generate-product`. Hvis dere vil ha et annet produkt, skriv `regenerate`. Hvis dere har to egne ord, gi dem til kommandoen: `/generate-product Viking Tinder`.

Dere er ferdige når `workshop/PRODUCT_BRIEF.md` beskriver et produkt som hele teamet vil bygge.

## 3. Planlegg

Dere kan snakke med en kunde for å finne ut hva brukerne trenger. Kjør `/talk-with-customer`. Agenten spiller personen fra brukerreisen i briefen. Still spørsmål om hva kunden trenger, og hva som er viktigst. Skriv `ferdig` når dere vil avslutte samtalen. Da får dere en oppsummering av behovene. Hvis dere blir usikre på et behov senere, kan dere snakke med kunden igjen.

1. Kjør `/grill-with-docs`. Agenten stiller dere spørsmål helt til dere er enige om hva dere skal bygge. Underveis skriver den beslutninger og begreper til filer.
2. Kjør `/to-spec`. Agenten lager en spesifikasjon (spec) fra samtalen.
3. Kjør `/to-tickets`. Agenten deler spesifikasjonen i oppgaver (tickets). Hver ticket sier hvilke andre tickets den venter på.
4. Velg `/implement` eller `/implement-spec` for å implementere ticketene. Med `/implement` implementerer agenten i økten deres én ticket eller noen få om gangen. `/implement-spec` implementerer hele spesifikasjonen. Den starter flere agenter som jobber på hver sin ticket samtidig, og samler arbeidet på én branch.

Dere er ferdige når dere har tickets for hjemmesiden og for databasen, og vet hvilke tickets som kan gjøres parallelt.

Hint (Prompt): Hvordan vet agenten at en ticket er ferdig? Kan den sjekke ferdigkriteriene selv, eller må den spørre dere?

Hint (Context): En ny økt med Claude Code husker ikke denne samtalen. Hvor finner neste agent beslutningene dere tok, og hvordan vet den at de finnes?

## 4. Del 1: Hjemmeside for produktet

Bygg en hjemmeside som presenterer produktet: navnet, hva produktet gjør, og hvem det er for. Kjør `/implement` med ticketene for hjemmesiden. Agenten må sjekke sitt eget arbeid før den sier at den er ferdig.

Dere er ferdige når siden kjører lokalt, og agenten selv har sett at siden viser produktet slik briefen beskriver det.

Hint (Loop): Hvordan kan Claude Code se om siden ser bra ut, uten å gjette ut fra koden og uten å be dere om skjermbilder? Claude Code kan lese bildefiler, og noen verktøy lar agenten styre en nettleser.

Hint (Graph): Hvordan kan to agenter jobbe på hver sin ticket samtidig, uten å endre de samme filene?

## 5. Del 2: Agenten og databasen

Gi produktet en funksjon som lagrer data i databasen, for eksempel meldinger, bestillinger eller anmeldelser. Agenten må bruke MCP-serveren `postgres` for å jobbe med databasen, ikke `psql` fra terminalen. Gjennom MCP-serveren lager agenten tabellene, legger inn testdata og sjekker resultatet.

Dere er ferdige når data som agenten skrev til databasen, vises på siden. Agenten må også ha sjekket dataene med en spørring gjennom MCP-serveren, ikke bare ved å lese sin egen kode.

Hint (Harness): Agenten leser ikke denne planen. Hvordan sørger dere for at den bruker MCP-serveren og ikke `psql`? MCP-serveren har full tilgang til databasen. Hvilke rettigheter trenger agenten egentlig?

## 6. Avslutning

Kjør `/note` uten tekst. Agenten henter notater fra økten og skriver dem under spørsmålene.

Dere er ferdige når alle spørsmålene i `workshop/NOTES.md` har et svar.

## Teknisk oppsett

I Claude Code gjør `/setup` disse stegene for dere.

### Database (PostgreSQL)

Kjør kommandoene fra mappen som har filen `Dockerfile`.
Docker må være installert og kjøre.
Hvis dere bruker Docker Desktop, start Docker Desktop.
Hvis dere bruker Colima, kjør `colima start`.

Et Docker-image inneholder filene som trengs for å kjøre PostgreSQL.
En container kjører et image.

Bygg imaget for databasen:

```sh
docker build -t abakus-postgres .
```

Et Docker-volum lagrer data utenfor containeren.
Flagget `-v` under lagrer dataene i volumet `abakus-postgres-data`.
Passordet under er bare for lokal utvikling.
Flagget `-p` gjør databasen tilgjengelig på port 55432 på maskinen deres.
PostgreSQL bruker vanligvis port 5432, men en annen database på maskinen kan allerede bruke den porten.

Start PostgreSQL:

```sh
docker run -d \
  --name abakus-postgres \
  -p 127.0.0.1:55432:5432 \
  -e POSTGRES_PASSWORD=local-dev-password \
  -v abakus-postgres-data:/var/lib/postgresql \
  abakus-postgres
```

Sjekk at databasen er klar:

```sh
docker exec abakus-postgres pg_isready -U abakus -d abakus_workshop
```

Vent til svaret er `accepting connections` før dere kobler til.
Hvis databasen ikke starter, les feilmeldingen med `docker logs abakus-postgres`.

Bruk denne tilkoblings-URL-en (adressen og innloggingen til databasen).
Den står også i `.env.template`.

```text
postgresql://abakus:local-dev-password@localhost:55432/abakus_workshop
```

I et SQL-skall kan dere skrive kommandoer til databasen.
For å åpne et SQL-skall i containeren, kjør:

```sh
docker exec -it abakus-postgres psql -U abakus -d abakus_workshop
```

For å stoppe containeren, kjør `docker stop abakus-postgres`.
For å starte den igjen, kjør `docker start abakus-postgres`.
Volumet beholder dataene, også hvis dere sletter containeren.

For en ny database kan dere endre `POSTGRES_DB`, `POSTGRES_USER` eller `POSTGRES_PASSWORD` med flagget `-e`.
Verdiene gjelder bare når volumet er tomt.
De endrer ikke en database som finnes fra før.

### MCP-serveren `postgres`

MCP-serveren `postgres` gir Claude Code tilgang til databasen.
Serveren kjører i Docker, fra imaget `crystaldba/postgres-mcp`.
Vi bruker Docker-imaget fordi pakken `postgres-mcp` på PyPI ikke lenger kan installeres med `uvx`: PyPI har fjernet en versjon av en pakke som den trenger.

Slik kobler dere til:

1. Start databasen med kommandoene over.
2. Åpne denne mappen i Claude Code.
3. Kjør `/mcp`, velg `postgres`, og slå den på eller koble til på nytt.

Claude Code starter imaget med tilkoblings-URL-en fra `.mcp.json`.
Inne i MCP-containeren betyr `localhost` containeren selv.
Derfor bytter imaget ut `localhost` i URL-en med `host.docker.internal`, som er adressen til maskinen deres.
Hvis dere endrer `.mcp.json`, må dere koble til MCP-serveren på nytt med `/mcp`.

#### På Linux

Docker på Linux har ikke adressen `host.docker.internal`.
Derfor får `/mcp` tidsavbrudd (timeout) når MCP-serveren prøver å nå databasen.
Løsningen er å la MCP-containeren bruke nettverket til maskinen deres (`--network host`).
Da betyr `localhost` maskinen deres, også inne i containeren.

Kjør denne kommandoen fra denne mappen.
Den lager en lokal versjon av `postgres` som bare gjelder for dere, og som Claude Code bruker i stedet for den i `.mcp.json`:

```sh
claude mcp add-json postgres --scope local '{"command":"docker","args":["run","-i","--rm","--network","host","--add-host=host.docker.internal:127.0.0.1","-e","DATABASE_URI","crystaldba/postgres-mcp","--access-mode=unrestricted"],"env":{"DATABASE_URI":"postgresql://abakus:local-dev-password@localhost:55432/abakus_workshop"}}'
```

Kjør så `/mcp` i Claude Code, velg `postgres`, og koble til på nytt.

Brukeren deres må også være med i gruppen `docker`.
Hvis `docker ps` gir `permission denied`, kjør `sudo usermod -aG docker $USER` i en vanlig terminal.
Logg så ut og inn igjen, fordi Linux leser gruppene deres bare når dere logger inn.

For å kjøre MCP-serveren selv i en terminal:

```sh
DATABASE_URI='postgresql://abakus:local-dev-password@localhost:55432/abakus_workshop' \
  docker run -i --rm -e DATABASE_URI crystaldba/postgres-mcp --access-mode=unrestricted
```

Serveren snakker med Claude Code gjennom stdio (standard input og output).
Den åpner ingen nettside.
Vanligvis lar dere Claude Code starte serveren.

Se [dokumentasjonen for Postgres MCP](https://github.com/crystaldba/postgres-mcp) for flere detaljer.
