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

export async function nyesteAnnonser(grense?: number): Promise<Annonse[]> {
  const { rows } = await pool.query<Annonse>(
    `SELECT ${kolonner} FROM annonser ORDER BY opprettet DESC, id DESC LIMIT $1`,
    [grense ?? null],
  );
  return rows;
}
