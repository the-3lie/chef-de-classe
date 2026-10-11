import { api } from "./api";
import type { PresenceEtudiant, SessionAvecQr, SessionResume } from "@/types";

export const sessionService = {
  /** GET /api/leader/sessions */
  async lister(): Promise<SessionResume[]> {
    const { data } = await api.get<SessionResume[]>("/api/leader/sessions");
    return data;
  },

  /** GET /api/sessions/:id */
  async consulter(sessionId: string): Promise<SessionResume> {
    const { data } = await api.get<SessionResume>(`/api/sessions/${sessionId}`);
    return data;
  },

  /**
   * POST /api/sessions
   * Le backend déduit l'enseignant/la salle depuis l'emploi du temps quand
   * c'est possible ; sinon il faut les préciser.
   */
  async creer(payload: {
    subjectId: string;
    date: string;
    startTime: string;
    endTime: string;
    teacherId?: string;
    room?: string;
  }): Promise<SessionResume> {
    const { data } = await api.post<SessionResume>("/api/sessions", payload);
    return data;
  },

  /**
   * POST /api/sessions/:id/qr
   * Le token QR (qrContent) est fabriqué par le backend — jamais côté
   * frontend.
   */
  async genererQr(sessionId: string): Promise<SessionAvecQr> {
    const { data } = await api.post<SessionAvecQr>(
      `/api/sessions/${sessionId}/qr`
    );
    return data;
  },

  /** POST /api/sessions/:id/close */
  async cloturer(sessionId: string): Promise<SessionResume> {
    const { data } = await api.post<SessionResume>(
      `/api/sessions/${sessionId}/close`
    );
    return data;
  },

  /** GET /api/sessions/:id/attendances */
  async listerPresences(sessionId: string): Promise<PresenceEtudiant[]> {
    const { data } = await api.get<PresenceEtudiant[]>(
      `/api/sessions/${sessionId}/attendances`
    );
    return data;
  },
};
