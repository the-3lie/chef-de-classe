import Link from "next/link";
import { Users, MapPin, Clock } from "lucide-react";
import type { SessionResume } from "@/types";

const statutStyles: Record<string, string> = {
  SCHEDULED: "bg-ink/10 text-ink-soft",
  ACTIVE: "bg-sage-soft text-sage",
  CLOSED: "bg-ink/10 text-ink-soft",
  EXPIRED: "bg-rust-soft text-rust",
  CANCELLED: "bg-rust-soft text-rust",
};

const statutLabels: Record<string, string> = {
  SCHEDULED: "Programmée",
  ACTIVE: "En cours",
  CLOSED: "Clôturée",
  EXPIRED: "Expirée",
  CANCELLED: "Annulée",
};

export function SessionCard({ session }: { session: SessionResume }) {
  return (
    <Link
      href={`/chef-classe/sessions/${session.id}`}
      className="flex flex-col gap-2 rounded-card bg-white px-4 py-3"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-ink">{session.matiere}</p>
          <p className="text-xs text-ink-soft/60">{session.enseignant}</p>
        </div>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            statutStyles[session.statut] ?? "bg-ink/10 text-ink-soft"
          }`}
        >
          {statutLabels[session.statut] ?? session.statut}
        </span>
      </div>
      <div className="flex items-center gap-4 text-xs text-ink-soft/60">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {session.date} · {session.heureDebut}–{session.heureFin}
        </span>
        <span className="flex items-center gap-1">
          <MapPin size={12} />
          {session.salle}
        </span>
        <span className="flex items-center gap-1">
          <Users size={12} />
          {session.presentCount}/{session.effectifAttendu}
        </span>
      </div>
    </Link>
  );
}
