export interface ChefProfil {
  externalUserId: string;
  nom: string;
  prenom: string;
  email: string;
  matricule: string;
  classe: string;
  filiere: string;
  niveau: string;
  etablissement: string;
}

export interface CourseSummary {
  id: string;
  matiere: string;
  enseignant: string;
  salle: string;
  date: string;
  heureDebut: string;
  heureFin: string;
}

export interface ScheduleEntry {
  id: string;
  jour: string;
  dayOfWeek: number;
  heureDebut: string;
  heureFin: string;
  matiere: string;
  subjectId: string;
  enseignant: string;
  teacherId: string;
  salle: string;
}

export type SessionStatut =
  | "SCHEDULED"
  | "ACTIVE"
  | "CLOSED"
  | "EXPIRED"
  | "CANCELLED";

export interface SessionResume {
  id: string;
  matiere: string;
  enseignant: string;
  classe: string;
  salle: string;
  date: string;
  heureDebut: string;
  heureFin: string;
  statut: SessionStatut;
  qrValidUntil: string | null;
  presentCount: number;
  effectifAttendu: number;
}

export interface SessionAvecQr extends SessionResume {
  qrContent: string;
}

export interface PresenceEtudiant {
  id: string;
  studentId: string;
  matricule: string;
  nom: string;
  prenom: string;
  statut: "present" | "late" | "absent" | "rejected";
  scannedAt: string | null;
}

export type ScanErrorCode =
  | "QR_INVALIDE"
  | "QR_EXPIRE"
  | "SESSION_FERMEE"
  | "MAUVAISE_CLASSE"
  | "ETUDIANT_NON_AUTORISE"
  | "DEJA_PRESENT"
  | "ERREUR_SERVEUR";

export interface ScanSuccessResult {
  status: "success";
  matiere: string;
  enseignant: string;
  date: string;
  heure: string;
  salle: string;
}

export interface ScanErrorResult {
  status: "error";
  code: ScanErrorCode;
  message: string;
}

export type ScanResult = ScanSuccessResult | ScanErrorResult;

export interface NotificationItem {
  id: string;
  titre: string;
  message: string;
  date: string;
  lu: boolean;
}

export interface AttendanceStats {
  totalSeances: number;
  presences: number;
  absences: number;
  retards: number;
  tauxPresence: number;
}

export interface DashboardData {
  user: ChefProfil;
  prochainCours: CourseSummary | null;
  coursDuJour: CourseSummary[];
  stats: AttendanceStats;
}
