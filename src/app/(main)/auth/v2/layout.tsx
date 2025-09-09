"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

const videos = [
  "https://assets.mixkit.co/videos/45755/45755-720.mp4",
  "https://assets.mixkit.co/videos/36522/36522-720.mp4",
  "https://assets.mixkit.co/videos/47585/47585-720.mp4",
];

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
  const t = useTranslations("auth");
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleVideoEnd = () => {
      setCurrentVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
    };

    videoElement.addEventListener("ended", handleVideoEnd);

    return () => {
      videoElement.removeEventListener("ended", handleVideoEnd);
    };
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load(); // Load the new video source
    }
  }, [currentVideoIndex]);

  return (
    <main>
      <div className="grid h-dvh justify-center p-2 lg:grid-cols-2">
        <div className="bg-primary relative order-2 hidden h-full overflow-hidden rounded-3xl lg:flex">
          {/* Video background */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="bg-primary/90 absolute inset-0"></div>
            <video ref={videoRef} autoPlay muted playsInline className="h-full w-full object-cover opacity-30">
              <source src={videos[currentVideoIndex]} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          <div className="text-primary-foreground relative z-10 flex h-full flex-col justify-between">
            <div className="absolute top-10 space-y-1 px-10">
              <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
              <p className="text-sm">{t("premiumCarCareSolutions")}</p>
            </div>

            <div className="absolute bottom-10 flex w-full justify-between px-10">
              <div className="text-primary-foreground flex-1 space-y-1">
                <h2 className="font-medium">{t("professionalCarWashServices")}</h2>
                <p className="text-sm">{t("ecoFriendlySolutions")}</p>
              </div>
              <Separator orientation="vertical" className="mx-3 !h-auto" />
              <div className="text-primary-foreground flex-1 space-y-1">
                <h2 className="font-medium">{t("supportTitle")}</h2>
                <p className="text-sm">{t("supportDescription")}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
