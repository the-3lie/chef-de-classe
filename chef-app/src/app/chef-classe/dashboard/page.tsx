"use client";

import { useEffect, useState } from "react";
import { profilService } from "@/services/profil.service";
import type { DashboardData } from "@/types";
import { Spinner } from "@/components/ui/primitives";
import {
  NextCourseCard,
  StatsCard,
  TodayCoursesList,
} from "@/components/dashboard/DashboardCards";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    profilService
      .getDashboard()
      .then(setData)
      .catch(() => setError("Impossible de charger le tableau de bord."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <p className="rounded-card bg-rust-soft px-4 py-3 text-sm text-rust">
        {error ?? "Une erreur est survenue."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <StatsCard stats={data.stats} />
      <NextCourseCard course={data.prochainCours} />
      <div>
        <p className="mb-2 font-display text-base text-ink">
          Cours d&apos;aujourd&apos;hui
        </p>
        <TodayCoursesList courses={data.coursDuJour} />
      </div>
    </div>
  );
}
