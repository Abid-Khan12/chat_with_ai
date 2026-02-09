"use client";

import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState<boolean | null>(null);

  const toggleVisible = () => {
    setIsVisible(false);
    sessionStorage.setItem("banner-visibility", "false");
  };

  useEffect(() => {
    const value = sessionStorage.getItem("banner-visibility");
    setIsVisible(value === "false" ? false : true);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="w-full border-b bg-background">
      <div className="max-w-5xl mx-auto p-2 flex items-center justify-between gap-4">
        <p className="md:text-sm text-xs font-medium text-foreground">
          🎉 Congratulations! The 15 like target is completed and the
          personalization feature is now available
        </p>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 hover:bg-accent"
          onClick={toggleVisible}
          aria-label="Close announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
