"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Maximize2,
  Minimize2,
  RefreshCw,
  Users,
  X,
  MapPin,
  Clock,
} from "lucide-react";
import { sessionService } from "@/services/session.service";
import type { SessionAvecQr, SessionResume } from "@/types";
import { Spinner } from "@/components/ui/primitives";
import { QRCodeDisplay } from "@/components/qr/QRCodeDisplay";
import { QrCountdown } from "@/components/qr/QrCountdown";
import {
  joinSessionRoom,
  leaveSessionRoom,
  onPresenceUpdate,
  onSessionClosed,
} from "@/lib/socket";

export default function SessionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [session, setSession] = useState<SessionResume | null>(null);
  const [qrContent, setQrContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [closing, setClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const charger = useCallback(async () => {
    const data = await sessionService.consulter(id);
    setSession(data);
    return data;
  }, [id]);

  useEffect(() => {
    charger().finally(() => setLoading(false));
    const stored = window.sessionStorage.getItem(`qr:${id}`);
    if (stored) {
      setQrContent(stored);
      window.sessionStorage.removeItem(`qr:${id}`);
    }
  }, [charger, id]);

  // Temps réel : rejoint la room de la séance, écoute les mises à jour.
  useEffect(() => {
    joinSessionRoom(id);
    const offUpdate = onPresenceUpdate(({ presentCount }) => {
      setSession((s) => (s ? { ...s, presentCount } : s));
    });
    const offClosed = onSessionClosed(() => {
      setSession((s) => (s ? { ...s, statut: "CLOSED" } : s));
    });
    return () => {
      leaveSessionRoom(id);
      offUpdate();
      offClosed();
    };
  }, [id]);

  async function handleGenererQr() {
    setLoading(true);
    try {
      const data: SessionAvecQr = await sessionService.genererQr(id);
      setSession(data);
      setQrContent(data.qrContent);
    } finally {
      setLoading(false);
    }
  }

  async function handleCloturer() {
    setClosing(true);
    try {
      const data = await sessionService.cloturer(id);
      setSession(data);
    } finally {
      setClosing(false);
    }
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.();
      setFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setFullscreen(false);
    }
  }

  if (loading || !session) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  const estFermee = session.statut === "CLOSED" || session.statut === "CANCELLED";

  return (
    <div
      ref={containerRef}
      className="flex flex-col items-center gap-5 rounded-card bg-paper py-4"
    >
      <button
        onClick={() => router.push("/chef-classe/sessions")}
        className="self-start text-xs text-ink-soft/50"
      >
        ← Retour
      </button>

      <div className="text-center">
        <p className="font-display text-xl text-ink">{session.matiere}</p>
        <p className="text-sm text-ink-soft/60">{session.enseignant}</p>
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
      </div>

      {qrContent ? (
        <QRCodeDisplay value={qrContent} size={fullscreen ? 320 : 220} />
      ) : session.statut === "ACTIVE" ? (
        <p className="rounded-card bg-gold-soft px-4 py-3 text-center text-xs text-ink-soft/70">
          QR déjà généré sur cet appareil précédemment — régénérez-en un
          nouveau si besoin.
        </p>
      ) : null}

      <QrCountdown validUntil={session.qrValidUntil} />

      <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm text-ink">
        <Users size={16} />
        {session.presentCount} présent{session.presentCount > 1 ? "s" : ""} /{" "}
        {session.effectifAttendu}
      </div>

      {!estFermee && (
        <div className="flex w-full max-w-xs flex-col gap-2">
          <button
            onClick={handleGenererQr}
            className="flex items-center justify-center gap-2 rounded-full bg-ink py-3 text-sm font-medium text-paper"
          >
            <RefreshCw size={16} />
            {session.qrValidUntil ? "Régénérer le QR" : "Générer le QR"}
          </button>
          <div className="flex gap-2">
            <button
              onClick={toggleFullscreen}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-ink/10 bg-white py-2.5 text-sm text-ink"
            >
              {fullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              {fullscreen ? "Réduire" : "Plein écran"}
            </button>
            <button
              onClick={handleCloturer}
              disabled={closing || session.statut !== "ACTIVE"}
              className="flex flex-1 items-center justify-center gap-2 rounded-full border border-rust/20 bg-rust-soft py-2.5 text-sm text-rust disabled:opacity-40"
            >
              {closing ? (
                <Spinner className="h-4 w-4 border-rust/30 border-t-rust" />
              ) : (
                <>
                  <X size={16} />
                  Fermer
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {estFermee && (
        <p className="rounded-card bg-ink/5 px-4 py-2 text-sm text-ink-soft/70">
          Séance clôturée.
        </p>
      )}
    </div>
  );
}
