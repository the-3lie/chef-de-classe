"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { QrCode } from "lucide-react";
import { scheduleService } from "@/services/schedule.service";
import { sessionService } from "@/services/session.service";
import type { ScheduleEntry } from "@/types";
import { EmptyState, Spinner } from "@/components/ui/primitives";

const JOURS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export default function GenererQrPage() {
  const router = useRouter();
  const [entries, setEntries] = useState<ScheduleEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const aujourdHui = useMemo(() => JOURS[new Date().getDay()], []);

  useEffect(() => {
    scheduleService
      .getWeeklySchedule()
      .then(setEntries)
      .finally(() => setLoading(false));
  }, []);

  const creneauxDuJour = entries.filter((e) => e.jour === aujourdHui);
  const selected = creneauxDuJour.find((e) => e.id === selectedId) ?? null;

  async function handleGenerer() {
    if (!selected) return;
    setCreating(true);
    setError(null);
    try {
      const today = new Date().toISOString().slice(0, 10);
      const session = await sessionService.creer({
        subjectId: selected.subjectId,
        date: today,
        startTime: selected.heureDebut,
        endTime: selected.heureFin,
        teacherId: selected.teacherId,
        room: selected.salle,
      });
      const avecQr = await sessionService.genererQr(session.id);
      // Le secret QR n'est renvoyé qu'une seule fois par le backend : on le
      // fait transiter le temps de la navigation via sessionStorage (jamais
      // dans l'URL), pour que la page de la séance puisse l'afficher.
      window.sessionStorage.setItem(
        `qr:${session.id}`,
        avecQr.qrContent
      );
      router.push(`/chef-classe/sessions/${session.id}`);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          "Impossible de générer le QR Code pour cette séance."
      );
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-display text-lg text-ink">Générer un QR Code</p>
        <p className="text-sm text-ink-soft/60">
          Choisissez le cours du jour concerné.
        </p>
      </div>

      {creneauxDuJour.length === 0 ? (
        <EmptyState
          icon={QrCode}
          title="Aucun cours aujourd'hui"
          description="Votre classe n'a aucun créneau programmé aujourd'hui."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {creneauxDuJour.map((c) => (
            <li key={c.id}>
              <button
                onClick={() => setSelectedId(c.id)}
                className={`w-full rounded-card border px-4 py-3 text-left transition ${
                  selectedId === c.id
                    ? "border-ink bg-ink/5"
                    : "border-ink/10 bg-white"
                }`}
              >
                <p className="text-sm font-medium text-ink">{c.matiere}</p>
                <p className="text-xs text-ink-soft/60">
                  {c.enseignant} · {c.heureDebut}–{c.heureFin} · {c.salle}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p className="rounded-card bg-rust-soft px-3 py-2 text-xs text-rust">
          {error}
        </p>
      )}

      <button
        onClick={handleGenerer}
        disabled={!selected || creating}
        className="mt-2 flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper disabled:opacity-40"
      >
        {creating ? (
          <Spinner className="h-4 w-4 border-paper/30 border-t-paper" />
        ) : (
          <>
            <QrCode size={16} />
            GÉNÉRER LE QR CODE
          </>
        )}
      </button>
    </div>
  );
}
