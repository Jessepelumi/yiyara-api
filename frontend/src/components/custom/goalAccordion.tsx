"use client";

import { useMemo, useState } from "react";

import { GoalTile } from "./goalTile";
import { DataTable } from "@/components/custom/datatable";
import { taskColumns } from "@/app/(dashboard)/goals/taskColumns";
import { Task } from "@/lib/api/types";
import { useDeleteGoal } from "@/hooks/useDeleteGoal";

interface GoalAccordionProps {
  id: string;
  title: string;
  tasks: Task[];
}

export const GoalAccordion = ({ id, title, tasks }: GoalAccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const { mutate: deleteGoal, isPending: isDeleting } = useDeleteGoal();

  // Memoize the data and columns to keep the Table performance high
  const memoizedData = useMemo(() => tasks, [tasks]);
  const memoizedColumns = useMemo(() => taskColumns, []);

  return (
    <div className="w-ful space-y-1.5 overflow-hidden transition-all mb-3">
      <GoalTile
        id={id}
        title={title}
        count={tasks.length}
        isOpen={isOpen}
        isDeleting={isDeleting}
        onToggle={() => setIsOpen(!isOpen)}
        onDelete={() => deleteGoal(id)}
      />

      {isOpen && (
        <div>
          <DataTable columns={memoizedColumns} data={memoizedData} />
        </div>
      )}
    </div>
  );
};
