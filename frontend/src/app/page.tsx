"use client";

import { ArrowRightIcon } from "@phosphor-icons/react/dist/ssr";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AppHome() {
  const { status } = useSession();
  const router = useRouter();

  const handleStartNow = () => {
    if (status === "authenticated") {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="h-dvh w-full flex flex-col justify-center items-center bg-linear-to-r from-blue-100 via-white via-30% to-purple-100 space-y-4">
      <div className="bg-linear-to-r from-blue-200 via-blue-200 via-20% to-purple-300 p-3 rounded-2xl">
        <Image src="/no-text-logo.png" alt="logo" width={50} height={50} />
      </div>

      <div className="flex flex-col items-center space-y-2 mb-8">
        <h2 className="text-2xl text-center md:text-3xl lg:text-4xl px-7 md:p-0">
          Ready to Take Control of Your Life?
        </h2>
        <p className="w-full md:w-3/5 lg:w-2/5 text-center px-5 md:p-0">
          Zimna doesn&apos;t abstract the process, it joins you in it. As your
          expert companion, it brings clarity to your goals, keeps you on track,
          and ensures your days are filled with what truly matters.
        </p>
      </div>

      <button
        onClick={handleStartNow}
        disabled={status === "loading"}
        className="group py-2 px-3 rounded-lg flex items-center gap-1.5 text-white bg-blue-600 hover:bg-blue-700 transition"
      >
        {status === "loading" ? "Getting You Started..." : "Start Now"}
        <span className="transition-transform duration-200 group-hover:translate-x-1">
          <ArrowRightIcon />
        </span>
      </button>
    </div>
  );
}
