"use client";

import { useEffect, useState } from "react";

function formatRestant(ms: number) {
  if (ms <= 0) return "00:00";
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

/**
 * Affichage indicatif uniquement — la validité réelle du QR Code est
 * toujours vérifiée côté backend au moment du scan, pas ici.
 */
export function QrCountdown({ validUntil }: { validUntil: string | null }) {
  const [restant, setRestant] = useState<number>(() =>
    validUntil ? new Date(validUntil).getTime() - Date.now() : 0
  );

  useEffect(() => {
    if (!validUntil) return;
    const cible = new Date(validUntil).getTime();
    const interval = setInterval(() => {
      setRestant(cible - Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, [validUntil]);

  if (!validUntil) return null;

  const expire = restant <= 0;

  return (
    <div className="text-center">
      <p className="text-xs uppercase tracking-wide text-ink-soft/50">
        QR valide encore
      </p>
      <p
        className={`font-display text-3xl ${expire ? "text-rust" : "text-ink"}`}
      >
        {expire ? "Expiré" : formatRestant(restant)}
      </p>
    </div>
  );
}
