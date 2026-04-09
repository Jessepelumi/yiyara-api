"use client";

import { useGoals } from "@/hooks/useGoals";
import { GoalAccordion } from "@/components/custom/goalAccordion";
import { Skeleton } from "@/components/ui/skeleton";

export default function Goals() {
  const { data: goals, isLoading, isError } = useGoals();

  return (
    <div className="w-full space-y-5 overflow-y-scroll">
      <header>
        <h1 className="text-2xl">Your Goals</h1>
        <p className="text-gray-400 text-sm w-2/3 lg:w-full">
          These are your goals. Toggle the tile to view the associated tasks.
        </p>
      </header>

      <section>
        {isLoading ? (
          <div className="flex w-full flex-col gap-2">
            {Array.from({ length: 5 }).map((_, index) => (
              <div className="flex gap-4" key={index}>
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-20" />
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 text-red-500 text-center">
            Failed to load goals. Please check your connection.
          </div>
        ) : goals?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-xl">
            <p className="text-slate-400">
              No goals found. Start by creating one!
            </p>
          </div>
        ) : (
          goals?.map((goal) => (
            <GoalAccordion
              key={goal.id}
              id={goal.id}
              title={goal.title}
              tasks={goal.tasks}
            />
          ))
        )}
      </section>
    </div>
  );
}
