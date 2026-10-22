import "server-only";
import { Pool } from "pg";

// One pool for the whole server, also across hot reloads in dev.
const globalForPool = globalThis as unknown as { pool?: Pool };
const pool = (globalForPool.pool ??= new Pool({ connectionString: process.env.DATABASE_URL }));

export type Annonse = {
  id: number;
  tittel: string;
  beskrivelse: string;
  byttesMot: string;
  nisse: string;
  gard: string;
  opprettet: Date;
};

const kolonner = `id::int, tittel, beskrivelse, byttes_mot AS "byttesMot", nisse, gard, opprettet`;
const nyesteForst = "ORDER BY opprettet DESC, id DESC";

export async function nyesteAnnonser(grense?: number): Promise<Annonse[]> {
  const { rows } = await pool.query<Annonse>(
    `SELECT ${kolonner} FROM annonser ${nyesteForst} LIMIT $1`,
    [grense ?? null],
  );
  return rows;
}

export async function sokAnnonser(tekst: string): Promise<Annonse[]> {
  // Escape LIKE wildcards, so that "%" and "_" match themselves.
  const monster = `%${tekst.replace(/[\\%_]/g, "\\$&")}%`;
  const { rows } = await pool.query<Annonse>(
    `SELECT ${kolonner} FROM annonser
     WHERE tittel ILIKE $1 OR beskrivelse ILIKE $1
     ${nyesteForst}`,
    [monster],
  );
  return rows;
}

export type NyAnnonse = Omit<Annonse, "id" | "opprettet">;

export async function opprettAnnonse(ny: NyAnnonse): Promise<Annonse> {
  const { rows } = await pool.query<Annonse>(
    `INSERT INTO annonser (tittel, beskrivelse, byttes_mot, nisse, gard)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING ${kolonner}`,
    [ny.tittel, ny.beskrivelse, ny.byttesMot, ny.nisse, ny.gard],
  );
  return rows[0];
}
