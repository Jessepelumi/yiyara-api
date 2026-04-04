import { useQuery } from "@tanstack/react-query";
import { goalsApi } from "@/lib/api/goals";
import { Task } from "@/lib/api/types";

export interface Goal {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
}

export const useGoals = () => {
  return useQuery({
    queryKey: ["goals"],
    queryFn: goalsApi.list,
  });
};
