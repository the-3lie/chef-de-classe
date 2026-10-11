"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { sessionService } from "@/services/session.service";
import type { PresenceEtudiant, SessionResume } from "@/types";
import { EmptyState, Spinner, StatusBadge } from "@/components/ui/primitives";

const STATUT_BACKEND_VERS_AFFICHAGE: Record<string, string> = {
  present: "present",
  late: "retard",
  absent: "absent",
  rejected: "justifie",
};

export default function PresencesPage() {
  const [sessions, setSessions] = useState<SessionResume[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [presences, setPresences] = useState<PresenceEtudiant[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [loadingPresences, setLoadingPresences] = useState(false);

  useEffect(() => {
    sessionService
      .lister()
      .then((data) => {
        setSessions(data);
        if (data.length > 0) setSelectedId(data[0].id);
      })
      .finally(() => setLoadingSessions(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setLoadingPresences(true);
    sessionService
      .listerPresences(selectedId)
      .then(setPresences)
      .finally(() => setLoadingPresences(false));
  }, [selectedId]);

  if (loadingSessions) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <EmptyState
        icon={Users}
        title="Aucune séance"
        description="Générez d'abord un QR Code pour une séance."
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="font-display text-lg text-ink">Présences de la classe</p>

      <select
        value={selectedId ?? ""}
        onChange={(e) => setSelectedId(e.target.value)}
        className="rounded-card border border-ink/10 bg-white px-4 py-2.5 text-sm"
      >
        {sessions.map((s) => (
          <option key={s.id} value={s.id}>
            {s.matiere} · {s.date} {s.heureDebut}
          </option>
        ))}
      </select>

      {loadingPresences ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {presences.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between rounded-card bg-white px-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-ink">
                  {p.prenom} {p.nom}
                </p>
                <p className="text-xs text-ink-soft/60">{p.matricule}</p>
              </div>
              <StatusBadge
                status={STATUT_BACKEND_VERS_AFFICHAGE[p.statut] ?? p.statut}
              />
            </li>
          ))}
        </ul>
      )}

      <p className="px-2 text-center text-xs text-ink-soft/40">
        Ces présences sont enregistrées automatiquement par les scans — vous
        ne pouvez pas les modifier manuellement ici.
      </p>
    </div>
  );
}
