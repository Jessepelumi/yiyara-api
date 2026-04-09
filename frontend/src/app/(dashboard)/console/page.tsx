"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGoals } from "@/hooks/useGoals";
import { Button } from "@/components/ui/button";
import { TerminalWindowIcon } from "@phosphor-icons/react/dist/ssr";

export default function ConsoleRoot() {
  const router = useRouter();
  const { data: goals, isLoading } = useGoals();

  useEffect(() => {
    if (!isLoading && goals) {
      if (goals.length > 0) {
        router.replace(`/console/${goals[0].id}`);
      }
      // Note: If goals.length === 0, we stay on this page to show the empty state logic below
    }
  }, [goals, isLoading, router]);

  // 1. Show NOTHING or a clean spinner while determining where to go
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <TerminalWindowIcon size={32} className="text-blue-200" />
          <p className="text-xs text-slate-400">Booting Zimna Terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col items-center justify-center text-center p-10">
      <div className="bg-blue-50 p-6 rounded-full mb-4">
        <TerminalWindowIcon size={48} className="text-blue-600" />
      </div>
      <h2 className="text-xl font-bold">No Goal Selected</h2>
      <p className="text-slate-500 max-w-xs mx-auto mt-2">
        Select a goal from your list or start a new prompt to open the console.
      </p>
      <Button className="mt-6" onClick={() => router.push("/goals")}>
        View Goal List
      </Button>
    </div>
  );
}
