"use client";

import {
  CheckSquareOffsetIcon,
  GearIcon,
  MagnifyingGlassIcon,
  NetworkIcon,
  QuestionIcon,
  SidebarSimpleIcon,
  SparkleIcon,
  TargetIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LogOut, SidebarItem, SidebarItemVariant } from "./sidebarItem";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export const Sidebar = () => {
  return (
    <section className="hidden h-dvh w-1/5 border-r px-3.5 py-5 lg:flex flex-col justify-between">
      <div className="flex flex-col gap-7">
        <div className="flex justify-between items-center">
          <SidebarSimpleIcon size={20} />

          <MagnifyingGlassIcon size={18} />
        </div>

        <nav className="flex flex-col gap-3">
          <SidebarItem icon={SparkleIcon} text="New Prompt" href="/home" />
          <SidebarItem icon={CheckSquareOffsetIcon} text="Goals & Tasks" href="/goals" />
          <SidebarItem icon={TargetIcon} text="Objectives" href="/objectives" />
          <SidebarItem icon={NetworkIcon} text="Goal Connections" href="" />
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <nav className="flex flex-col gap-3">
          <SidebarItemVariant
            icon={GearIcon}
            text="Settings"
            href="/settings"
          />
          <SidebarItemVariant
            icon={QuestionIcon}
            text="Help & Support"
            href="/help"
          />
        </nav>

        <LogOut />
      </div>
    </section>
  );
};

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileSidebar = ({ isOpen, onClose }: MobileSidebarProps) => {
  const sidebarRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  return (
    <section
      ref={sidebarRef}
      className={`block z-10 fixed bg-white border-r px-3.5 py-5 h-dvh w-3/5 max-w-xs lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transform transition-transform duration-300`}
    >
      <div className="flex flex-col justify-between h-full w-full">
        <div className="flex flex-col gap-7">
          <button>
            <div className="flex gap-2 items-center text-sm text-gray-500 px-2 py-1.5">
              <MagnifyingGlassIcon size={18} />
              <span>Search goals & tasks</span>
            </div>
          </button>

          <nav className="flex flex-col gap-3">
            <SidebarItem icon={SparkleIcon} text="New Prompt" href="/home" />
            <SidebarItem
              icon={SparkleIcon}
              text="Goals & Tasks"
              href="/goals"
            />
            <SidebarItem
              icon={TargetIcon}
              text="Objectives"
              href="/objectives"
            />
            <SidebarItem icon={NetworkIcon} text="Goal Connections" href="" />
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <nav className="flex flex-col gap-3">
            <SidebarItemVariant
              icon={GearIcon}
              text="Settings"
              href="/settings"
            />
            <SidebarItemVariant
              icon={QuestionIcon}
              text="Help & Support"
              href="/help"
            />
          </nav>

          <LogOut />
        </div>
      </div>
    </section>
  );
};
