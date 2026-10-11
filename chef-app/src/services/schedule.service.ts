import { api } from "./api";
import type { ScheduleEntry } from "@/types";

export const scheduleService = {
  /** GET /api/leader/schedule */
  async getWeeklySchedule(): Promise<ScheduleEntry[]> {
    const { data } = await api.get<ScheduleEntry[]>("/api/leader/schedule");
    return data;
  },
};
