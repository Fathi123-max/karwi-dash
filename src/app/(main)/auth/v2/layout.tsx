"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

import { Command } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import { APP_CONFIG } from "@/config/app-config";

const videos = [
  "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/HjH5lgeHeix7kfhup/videoblocks-67_car-fam_4k_1_b_enwex6f__56a73b4856adf5b1a9cbe8a83adad2ae__P360.mp4",
  "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/HjH5lgeHeix7kfhup/videoblocks-66_car-fam_4k_1_bqmqbeq6y__485a9566890d406f6517a62c196d0ead__P360.mp4",
  "https://dm0qx8t0i9gc9.cloudfront.net/watermarks/video/HjH5lgeHeix7kfhup/videoblocks-62_car-fam_4k_1_stqir1qtt__4d7289ce43c862bc08fb600446c3e758__P360.mp4",
];

export default function Layout({ children }: Readonly<{ children: ReactNode }>) {
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
              <Command className="size-10" />
              <h1 className="text-2xl font-medium">{APP_CONFIG.name}</h1>
              <p className="text-sm">Premium Car Care Solutions</p>
            </div>

            <div className="absolute bottom-10 flex w-full justify-between px-10">
              <div className="text-primary-foreground flex-1 space-y-1">
                <h2 className="font-medium">Professional Car Wash Services</h2>
                <p className="text-sm">Experience the finest car care with our eco-friendly cleaning solutions.</p>
              </div>
              <Separator orientation="vertical" className="mx-3 !h-auto" />
              <div className="text-primary-foreground flex-1 space-y-1">
                <h2 className="font-medium">24/7 Support</h2>
                <p className="text-sm">Our team is always ready to help you with any car care needs.</p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative order-1 flex h-full">{children}</div>
      </div>
    </main>
  );
}
