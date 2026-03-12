import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { geoMercator, geoPath } from "d3-geo";
import type { FeatureCollection } from "geojson";

const BIHAR_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data/geojson/states/bihar.geojson";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);

  useEffect(() => {
    fetch(BIHAR_GEOJSON_URL)
      .then((r) => r.json())
      .then((data) => setGeoData(data))
      .catch(() => {});
  }, []);

  const pathD = useMemo(() => {
    if (!geoData) return "";
    const p = geoMercator().fitSize([300, 300], geoData);
    const generator = geoPath().projection(p);
    return geoData.features.map((f) => generator(f)).join(" ");
  }, [geoData]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2500); // Wait a little longer for drawing
      }}
    >
      <div className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 relative flex items-center justify-center mb-4">
        {geoData ? (
          <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <motion.path
              d={pathD}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.6)"
              strokeWidth="1"
              strokeLinejoin="round"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </svg>
        ) : (
          <div className="w-12 h-12 border-4 border-foreground border-t-transparent rounded-full animate-spin"></div>
        )}
      </div>

      <motion.p
        className="mt-4 text-sm tracking-[0.3em] uppercase text-muted-foreground"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
      >
        Explore the beauty of Bihar
      </motion.p>

      <motion.div
        className="mt-8 h-px bg-foreground"
        initial={{ width: 0 }}
        animate={{ width: 120 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeInOut" }}
      />
    </motion.div>
  );
};

export default SplashScreen;
