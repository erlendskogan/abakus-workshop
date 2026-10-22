"use client";

import { useActionState } from "react";
import { leggUtAnnonse, type Skjemastatus } from "./actions";
import { felter } from "./felter";

const tomtSkjema: Skjemastatus = { verdier: {}, mangler: [] };

export function NyAnnonseSkjema() {
  const [status, handling, sender] = useActionState(leggUtAnnonse, tomtSkjema);
  const manglerEtiketter = felter.filter((f) => status.mangler.includes(f.navn)).map((f) => f.etikett);

  return (
    <form action={handling} noValidate className="mt-8 grid gap-6">
      {manglerEtiketter.length > 0 && (
        <div role="alert" className="rounded-2xl border border-lue/60 bg-lue/15 p-4 text-tekst">
          Annonsen ble ikke lagt ut. Du må fylle ut: {manglerEtiketter.join(", ")}.
        </div>
      )}
      {felter.map((f) => {
        const mangler = status.mangler.includes(f.navn);
        const klasse = `w-full rounded-xl border bg-natt-lys/70 px-4 py-3 text-tekst focus:border-lykt focus:outline-none ${
          mangler ? "border-lue" : "border-white/15"
        }`;
        const feltProps = {
          id: f.navn,
          name: f.navn,
          required: true,
          defaultValue: status.verdier[f.navn] ?? "",
          "aria-invalid": mangler || undefined,
          "aria-describedby": `${f.navn}-hjelp`,
          className: klasse,
        };
        return (
          <div key={f.navn}>
            <label htmlFor={f.navn} className="font-semibold text-mane">
              {f.etikett}
            </label>
            <p id={`${f.navn}-hjelp`} className={`mt-1 mb-2 text-sm ${mangler ? "text-[#ff8a80]" : "text-tekst-svak"}`}>
              {mangler ? `Du må fylle ut ${f.etikett.toLowerCase()}.` : f.hjelp}
            </p>
            {f.lang ? <textarea rows={4} {...feltProps} /> : <input type="text" {...feltProps} />}
          </div>
        );
      })}
      <button
        type="submit"
        disabled={sender}
        className="justify-self-start rounded-full bg-lykt px-6 py-3 font-semibold text-natt shadow-[0_0_30px_-5px] shadow-lykt/60 transition hover:bg-mane disabled:opacity-60"
      >
        {sender ? "Legger ut …" : "Legg ut annonse"}
      </button>
    </form>
  );
}
