"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import Link from "next/link";
import { sessionService } from "@/services/session.service";
import type { SessionResume } from "@/types";
import { EmptyState, Spinner } from "@/components/ui/primitives";
import { SessionCard } from "@/components/sessions/SessionCard";

export default function SessionsPage() {
  const [sessions, setSessions] = useState<SessionResume[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sessionService
      .lister()
      .then(setSessions)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="font-display text-lg text-ink">Séances</p>
        <Link
          href="/chef-classe/generer-qr"
          className="flex items-center gap-1 rounded-full bg-ink px-3 py-1.5 text-xs font-medium text-paper"
        >
          <Plus size={14} />
          Nouvelle
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : sessions.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Aucune séance"
          description="Commencez par générer un QR Code pour une nouvelle séance."
        />
      ) : (
        <ul className="flex flex-col gap-2">
          {sessions.map((s) => (
            <li key={s.id}>
              <SessionCard session={s} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
