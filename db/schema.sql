-- Run through the postgres MCP server, not psql.

CREATE TABLE IF NOT EXISTS annonser (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  tittel text NOT NULL CHECK (tittel <> ''),
  beskrivelse text NOT NULL CHECK (beskrivelse <> ''),
  byttes_mot text NOT NULL CHECK (byttes_mot <> ''),
  nisse text NOT NULL CHECK (nisse <> ''),
  gard text NOT NULL CHECK (gard <> ''),
  opprettet timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS annonser_opprettet_idx ON annonser (opprettet DESC);
