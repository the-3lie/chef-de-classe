"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShieldCheck } from "lucide-react";
import { useChefUser } from "@/providers/UserProvider";
import { Spinner } from "@/components/ui/primitives";
import type { ChefProfil } from "@/types";

type UserKey = keyof ChefProfil;

const fields: Array<{ label: string; key: UserKey }> = [
  { label: "Prénom", key: "prenom" },
  { label: "Nom", key: "nom" },
  { label: "Email", key: "email" },
  { label: "Matricule", key: "matricule" },
  { label: "Classe", key: "classe" },
  { label: "Filière", key: "filiere" },
  { label: "Niveau", key: "niveau" },
  { label: "Établissement", key: "etablissement" },
];

export default function ProfilPage() {
  const { user, loading, error, logout } = useChefUser();
  const router = useRouter();

  function handleLogout() {
    logout();
    router.replace("/connexion");
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  if (error || !user) {
    return (
      <p className="rounded-card bg-rust-soft px-4 py-3 text-sm text-rust">
        {error ?? "Identité indisponible."}
      </p>
    );
  }

  const initials = `${user.prenom[0] ?? ""}${user.nom[0] ?? ""}`;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col items-center gap-2 py-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-display text-xl text-paper">
          {initials}
        </div>
        <p className="font-display text-lg text-ink">
          {user.prenom} {user.nom}
        </p>
        <p className="flex items-center gap-1 text-xs text-gold">
          <ShieldCheck size={14} />
          Chef de classe — {user.classe}
        </p>
      </div>

      <dl className="divide-y divide-ink/5 rounded-card bg-white px-4">
        {fields.map(({ label, key }) => (
          <div key={key} className="flex justify-between py-3 text-sm">
            <dt className="text-ink-soft/50">{label}</dt>
            <dd className="text-ink">{user[key]}</dd>
          </div>
        ))}
      </dl>

      <p className="px-2 text-center text-xs text-ink-soft/40">
        Le statut de chef de classe est géré par l'administration de votre
        établissement.
      </p>

      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 rounded-full border border-ink/10 bg-white py-3 text-sm font-medium text-rust"
      >
        <LogOut size={16} />
        Se déconnecter
      </button>
    </div>
  );
}
