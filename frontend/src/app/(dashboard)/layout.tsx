"use client";

import { Sidebar, MobileSidebar } from "@/components/custom/sidebar";
import { Button } from "@/components/ui/button";
import { ListIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useState } from "react";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const onClose = useCallback(() => setIsMobileSidebarOpen(false), []);

  return (
    <section className="flex h-dvh overflow-hidden">
      <Sidebar />
      <MobileSidebar isOpen={isMobileSidebarOpen} onClose={onClose} />
      <section className="flex flex-col flex-1 min-w-0 h-full">
        <header className="flex justify-between px-3 py-5 shrink-0">
          <div className="flex items-center">
            <Button
              variant="ghost"
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="block lg:hidden"
            >
              <ListIcon size={20} />
            </Button>
            <h1>Zimna</h1>
          </div>

          <div className="flex gap-2 items-center">
            Jesse
            <div className="border border-blue-400 p-0.5 rounded-full">
              <div className="bg-gray-300 w-7 h-7 rounded-full"></div>
            </div>
          </div>
        </header>
        <aside className="flex h-full overflow-hidden px-3 pt-3 min-w-0">
          {children}
        </aside>
      </section>
    </section>
  );
}
