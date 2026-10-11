import { io, type Socket } from "socket.io-client";

let socket: Socket | null = null;

function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL, {
      autoConnect: true,
      transports: ["websocket"],
    });
  }
  return socket;
}

/**
 * Rejoint la "room" Socket.IO de la séance affichée, pour recevoir les
 * mises à jour du nombre de présents en temps réel, sans rechargement.
 */
export function joinSessionRoom(sessionId: string) {
  getSocket().emit("join-session", sessionId);
}

export function leaveSessionRoom(sessionId: string) {
  getSocket().emit("leave-session", sessionId);
}

export function onPresenceUpdate(
  callback: (payload: { presentCount: number }) => void
) {
  getSocket().on("presence-update", callback);
  return () => getSocket().off("presence-update", callback);
}

export function onSessionClosed(callback: () => void) {
  getSocket().on("session-closed", callback);
  return () => getSocket().off("session-closed", callback);
}
