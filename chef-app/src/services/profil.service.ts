import { api } from "./api";
import type { ChefProfil, DashboardData } from "@/types";

export const profilService = {
  /** GET /api/etudiant/profil (identité) */
  async getMe(): Promise<ChefProfil> {
    const { data } = await api.get<ChefProfil>("/api/etudiant/profil");
    return data;
  },

  /** GET /api/leader/dashboard */
  async getDashboard(): Promise<DashboardData> {
    const { data } = await api.get<DashboardData>("/api/leader/dashboard");
    return data;
  },
};
