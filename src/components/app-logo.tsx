import Image from "next/image";

import { APP_CONFIG } from "@/config/app-config";

interface AppLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  showLetterOnly?: boolean;
  className?: string;
}

export function AppLogo({ size = "md", showText = false, showLetterOnly = false, className = "" }: AppLogoProps) {
  const sizeClasses = {
    sm: "w-20 h-20",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const letterSizeClasses = {
    sm: "text-3xl",
    md: "text-4xl",
    lg: "text-5xl",
  };

  // Extract first letter of app name for collapsed view
  const firstLetter = APP_CONFIG.name.charAt(0);

  if (showLetterOnly) {
    return (
      <div
        className={`bg-primary text-primary-foreground flex items-center justify-center rounded-md ${sizeClasses[size]} ${className}`}
      >
        <span className={`font-bold ${letterSizeClasses[size]}`}>{firstLetter}</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className={`relative ${sizeClasses[size]}`}>
        <Image
          src="/logos/app_logo_light.png"
          alt={`${APP_CONFIG.name} Logo`}
          fill
          className="object-contain transition-opacity duration-300 dark:hidden"
        />
        <Image
          src="/logos/app_logo_dark.png"
          alt={`${APP_CONFIG.name} Logo`}
          fill
          className="hidden object-contain transition-opacity duration-300 dark:block"
        />
      </div>
    </div>
  );
}
