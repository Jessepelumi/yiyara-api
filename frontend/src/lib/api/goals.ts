// API endpoints to decompose goals and
// retrieve a list of stored goals with associated tasks

import { apiClient } from "./client";
import type { Goal } from "./types";

export const goalsApi = {
  // Decompose goal
  decompose: (text: string): Promise<Goal[]> =>
    apiClient("/decompose/", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  // Fetch goals with associated tasks
  list: (): Promise<Goal[]> =>
    apiClient("/list/", {
      method: "GET",
    }),

  // Delete a goal
  delete: async (id: string) => {
    return await apiClient(`/${id}/`, {
      method: "DELETE",
    });
  },
};
