"use client";

import { Bell } from "lucide-react";
import Link from "next/link";
import { useChefUser } from "@/providers/UserProvider";

export function Header() {
  const { user, loading } = useChefUser();

  const initials = user ? `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}` : "";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between bg-paper/90 px-5 pb-3 pt-5 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-wide text-ink-soft/60">
          {loading ? "Chargement…" : `Chef de classe · ${user?.classe ?? ""}`}
        </p>
        <p className="font-display text-lg text-ink">
          {loading ? "—" : user ? `${user.prenom} ${user.nom}` : "Chef de classe"}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/chef-classe/notifications"
          className="rounded-full bg-white p-2.5 shadow-sm"
          aria-label="Notifications"
        >
          <Bell size={18} className="text-ink" />
        </Link>
        <Link
          href="/chef-classe/profil"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink font-display text-sm text-paper"
        >
          {initials || "—"}
        </Link>
      </div>
    </header>
  );
}
