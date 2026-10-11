import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: { Accept: "application/json" },
});

/**
 * Attache le jeton JWT (même compte étudiant que student-app — le chef de
 * classe n'a pas de système de comptes séparé) à tous les appels suivants.
 */
export function setBackendAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
