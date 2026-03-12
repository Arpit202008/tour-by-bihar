import { useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import SplashScreen from "@/components/SplashScreen";
import BiharMap from "@/components/BiharMap";
import DistrictPanel from "@/components/DistrictPanel";

/**
 * Main Index page — Bihar tourism explorer
 * 1. Splash screen (auto-transitions after 2s)
 * 2. Bihar district map (click district for details)
 */
const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState<string | null>(null);

  const handleSplashComplete = useCallback(() => setShowSplash(false), []);
  const handleDistrictSelect = useCallback(
    (district: string) => setSelectedDistrict(district),
    []
  );
  const handleClosePanel = useCallback(() => setSelectedDistrict(null), []);

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {showSplash && (
          <SplashScreen key="splash" onComplete={handleSplashComplete} />
        )}
      </AnimatePresence>

      {!showSplash && (
        <div className="relative min-h-screen">
          <BiharMap onDistrictSelect={handleDistrictSelect} />

          <AnimatePresence>
            {selectedDistrict && (
              <DistrictPanel
                key={selectedDistrict}
                district={selectedDistrict}
                onClose={handleClosePanel}
              />
            )}
          </AnimatePresence>

          <div className="pointer-events-none absolute bottom-4 right-6 z-10 flex flex-col items-end opacity-70 transition-opacity hover:opacity-100">
            <p className="text-xs tracking-widest text-muted-foreground uppercase font-heading">
              Created by <span className="text-primary/80 font-bold">Arpit Chourasia</span> &amp; <span className="text-primary/80 font-bold">Guguloth Akhil</span>
            </p>
            <p className="text-[10px] mt-1 tracking-wider text-muted-foreground/60 uppercase font-heading">
              Applied for copyright in March 2026
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
