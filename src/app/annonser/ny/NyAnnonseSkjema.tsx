"use client";

import { useActionState } from "react";
import { leggUtAnnonse, type Skjemastatus } from "./actions";
import { felter } from "./felter";

const tomtSkjema: Skjemastatus = { verdier: {}, mangler: [] };

export function NyAnnonseSkjema() {
  const [status, handling, sender] = useActionState(leggUtAnnonse, tomtSkjema);
  const manglerEtiketter = felter.filter((f) => status.mangler.includes(f.navn)).map((f) => f.etikett);

  return (
    <form
      action={handling}
      noValidate
      className="grid gap-6 rounded-xl border border-kant bg-flate/80 p-5 shadow-[0_1px_0_0_rgb(255_255_255/0.04)_inset] sm:p-8"
    >
      {manglerEtiketter.length > 0 && (
        <div
          role="alert"
          className="flex gap-3 rounded-lg border border-red-400/25 bg-red-400/[0.07] px-4 py-3 text-sm leading-relaxed text-red-100"
        >
          <svg aria-hidden viewBox="0 0 20 20" className="mt-0.5 h-4 w-4 shrink-0 text-red-300" fill="none" stroke="currentColor" strokeWidth="1.6">
            <circle cx="10" cy="10" r="7.5" />
            <path d="M10 6v4.5M10 13.5v.01" strokeLinecap="round" />
          </svg>
          <span>Annonsen ble ikke lagt ut. Du må fylle ut: {manglerEtiketter.join(", ")}.</span>
        </div>
      )}
      {felter.map((f) => {
        const mangler = status.mangler.includes(f.navn);
        const klasse = `block w-full rounded-[10px] border bg-bakgrunn/60 px-3.5 text-[15px] text-tekst placeholder:text-tekst-svakest transition focus:outline-none focus-visible:outline-none ${
          f.lang ? "py-3 leading-relaxed resize-y min-h-28" : "h-11"
        } ${
          mangler
            ? "border-red-400/50 bg-red-400/[0.04] focus:border-red-300/70 focus:shadow-[0_0_0_4px_rgb(248_113_113/0.15)]"
            : "border-kant-sterk hover:border-white/20 focus:border-lykt/60 focus:shadow-[0_0_0_4px_var(--lykt-glod)]"
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
          <div key={f.navn} className={f.navn === "nisse" ? "border-t border-kant pt-6" : undefined}>
            <label htmlFor={f.navn} className="block text-sm font-medium text-tekst">
              {f.etikett}
            </label>
            <p id={`${f.navn}-hjelp`} className={`mt-1 mb-2.5 text-[13px] ${mangler ? "text-red-300" : "text-tekst-svak"}`}>
              {mangler ? `Du må fylle ut ${f.etikett.toLowerCase()}.` : f.hjelp}
            </p>
            {f.lang ? <textarea rows={4} {...feltProps} /> : <input type="text" {...feltProps} />}
          </div>
        );
      })}
      <div className="flex flex-col-reverse items-stretch gap-4 border-t border-kant pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[13px] text-tekst-svakest">Alle feltene må fylles ut.</p>
        <button
          type="submit"
          disabled={sender}
          className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-lykt px-6 text-sm font-medium text-bakgrunn shadow-[0_0_0_1px_rgb(245_184_74/0.4),0_8px_30px_-10px_var(--lykt)] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
        >
          {sender && (
            <span
              aria-hidden
              className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-bakgrunn/30 border-t-bakgrunn motion-reduce:animate-none"
            />
          )}
          {sender ? "Legger ut …" : "Legg ut annonse"}
        </button>
      </div>
    </form>
  );
}
