import { api } from "./api";
import type { ScanResult } from "@/types";

export const attendanceService = {
  /**
   * POST /api/attendance/scan
   * Le chef peut scanner comme un étudiant pour enregistrer SA PROPRE
   * présence. Aucune validation locale : seule la réponse du backend fait foi.
   */
  async submitScan(qrToken: string): Promise<ScanResult> {
    try {
      const { data } = await api.post<ScanResult>("/api/attendance/scan", {
        token: qrToken,
      });
      return data;
    } catch (error: any) {
      const backendResult = error?.response?.data as ScanResult | undefined;
      if (backendResult?.status === "error") {
        return backendResult;
      }
      return {
        status: "error",
        code: "ERREUR_SERVEUR",
        message: "Impossible de contacter le serveur. Réessayez.",
      };
    }
  },
};
