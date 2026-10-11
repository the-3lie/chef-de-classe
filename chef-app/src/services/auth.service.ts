import { api } from "./api";

export interface LoginResponse {
  accessToken: string;
  etudiant: { id: string; firstName: string; lastName: string; email: string };
}

export const authService = {
  /**
   * POST /api/etudiant/auth/login — EXACTEMENT le même endpoint que
   * student-app. Le chef de classe est un étudiant avec une permission
   * supplémentaire, pas un compte à part : aucune route de connexion
   * séparée n'est créée ici.
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>("/api/etudiant/auth/login", {
      email,
      password,
    });
    return data;
  },
};
