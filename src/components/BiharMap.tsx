import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { geoMercator, geoPath, geoCentroid } from "d3-geo";
import type { FeatureCollection, Feature } from "geojson";
import { getDistrictName } from "@/utils/geo";

const BIHAR_GEOJSON_URL =
  "https://cdn.jsdelivr.net/gh/udit-001/india-maps-data/geojson/states/bihar.geojson";

interface BiharMapProps {
  onDistrictSelect: (districtName: string) => void;
}

const WIDTH = 600;
const HEIGHT = 720;

const BiharMap = ({ onDistrictSelect }: BiharMapProps) => {
  const [geoData, setGeoData] = useState<FeatureCollection | null>(null);
  const [loading, setLoading] = useState(true);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const gRef = useRef<SVGGElement>(null);
  const transformRef = useRef({ x: 0, y: 0, scale: 1 });
  const gestureRef = useRef({
    isPanning: false,
    startX: 0,
    startY: 0,
    startTx: 0,
    startTy: 0,
    lastPinchDist: 0,
  });
  const rafRef = useRef<number>(0);

  // Fetch Bihar GeoJSON
  useEffect(() => {
    fetch(BIHAR_GEOJSON_URL)
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load Bihar map data");
        return r.json();
      })
      .then((data: FeatureCollection) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const { projection, pathGenerator } = useMemo(() => {
    if (!geoData) {
      const p = geoMercator();
      return { projection: p, pathGenerator: geoPath().projection(p) };
    }
    const p = geoMercator().fitSize([WIDTH, HEIGHT - 40], geoData);
    return { projection: p, pathGenerator: geoPath().projection(p) };
  }, [geoData]);

  const pathData = useMemo(() => {
    if (!geoData) return [];
    return geoData.features.map((feature) => {
      const districtName = getDistrictName(feature);
      const pathD = pathGenerator(feature) || "";
      const centroid = geoCentroid(feature);
      const projected = projection(centroid);
      return { feature, districtName, pathD, projected };
    });
  }, [geoData, pathGenerator, projection]);

  /** Apply transform directly to DOM */
  const applyTransform = useCallback(() => {
    if (!gRef.current) return;
    const { x, y, scale } = transformRef.current;
    gRef.current.style.transform = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  }, []);

  const clampTranslate = useCallback((tx: number, ty: number, s: number) => {
    const maxT = (s - 1) * 300;
    return {
      x: Math.max(-maxT, Math.min(maxT, tx)),
      y: Math.max(-maxT, Math.min(maxT, ty)),
    };
  }, []);

  const scheduleUpdate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(applyTransform);
  }, [applyTransform]);

  // Mouse scroll zoom — zoom towards pointer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const rect = el.getBoundingClientRect();
      const pointerX = e.clientX - rect.left;
      const pointerY = e.clientY - rect.top;
      const delta = e.deltaY > 0 ? 0.92 : 1.08;
      const t = transformRef.current;
      const newScale = Math.max(1, Math.min(t.scale * delta, 6));
      if (newScale === 1) {
        transformRef.current = { x: 0, y: 0, scale: 1 };
      } else {
        const newX = pointerX - ((pointerX - t.x) * newScale) / t.scale;
        const newY = pointerY - ((pointerY - t.y) * newScale) / t.scale;
        const clamped = clampTranslate(newX, newY, newScale);
        transformRef.current = { x: clamped.x, y: clamped.y, scale: newScale };
      }
      scheduleUpdate();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scheduleUpdate, clampTranslate]);

  // Pointer pan
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (transformRef.current.scale <= 1) return;
    gestureRef.current.isPanning = true;
    gestureRef.current.startX = e.clientX;
    gestureRef.current.startY = e.clientY;
    gestureRef.current.startTx = transformRef.current.x;
    gestureRef.current.startTy = transformRef.current.y;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!gestureRef.current.isPanning) return;
      const dx = e.clientX - gestureRef.current.startX;
      const dy = e.clientY - gestureRef.current.startY;
      const clamped = clampTranslate(
        gestureRef.current.startTx + dx,
        gestureRef.current.startTy + dy,
        transformRef.current.scale
      );
      transformRef.current = { ...transformRef.current, x: clamped.x, y: clamped.y };
      scheduleUpdate();
    },
    [clampTranslate, scheduleUpdate]
  );

  const handlePointerUp = useCallback(() => {
    gestureRef.current.isPanning = false;
  }, []);

  // Touch pinch-to-zoom
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const getTouchDist = (touches: TouchList) => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        gestureRef.current.lastPinchDist = getTouchDist(e.touches);
      }
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const dist = getTouchDist(e.touches);
        const prev = gestureRef.current.lastPinchDist;
        if (prev > 0) {
          const rect = el.getBoundingClientRect();
          const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
          const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
          const ratio = dist / prev;
          const t = transformRef.current;
          const newScale = Math.max(1, Math.min(t.scale * ratio, 6));
          if (newScale === 1) {
            transformRef.current = { x: 0, y: 0, scale: 1 };
          } else {
            const newX = midX - ((midX - t.x) * newScale) / t.scale;
            const newY = midY - ((midY - t.y) * newScale) / t.scale;
            const clamped = clampTranslate(newX, newY, newScale);
            transformRef.current = { x: clamped.x, y: clamped.y, scale: newScale };
          }
          scheduleUpdate();
        }
        gestureRef.current.lastPinchDist = dist;
      }
    };
    const onTouchEnd = () => {
      gestureRef.current.lastPinchDist = 0;
    };
    el.addEventListener("touchstart", onTouchStart, { passive: false });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd);
    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
  }, [scheduleUpdate, clampTranslate]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-foreground border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading Bihar map...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-full w-full flex-col items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      <motion.h1
        className="mb-2 text-center text-2xl font-heading font-semibold tracking-wider text-foreground text-glow md:text-3xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Tour By BIHAR
      </motion.h1>

      <motion.p
        className="mb-4 text-center text-xs tracking-[0.2em] uppercase text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {pathData.length} Districts — Select a district to explore
      </motion.p>

      <div
        ref={containerRef}
        className="relative w-full max-w-2xl overflow-hidden px-4"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
      >
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="w-full"
          style={{
            maxHeight: "78vh",
            cursor: transformRef.current.scale > 1 ? "grab" : "default",
          }}
        >
          <g
            ref={gRef}
            style={{ transformOrigin: "0 0", willChange: "transform" }}
          >
            {pathData.map(({ districtName, pathD, projected, feature }, index) => {
              const isHovered = hoveredDistrict === districtName;
              const isCapital = districtName === "Patna";

              return (
                <g
                  key={districtName + index}
                  onPointerEnter={() => setHoveredDistrict(districtName)}
                  onPointerLeave={() => setHoveredDistrict(null)}
                  onClick={() => onDistrictSelect(districtName)}
                  className="cursor-pointer"
                  style={{
                    animation: `fadeIn 0.3s ease ${index * 0.02}s both`,
                  }}
                >
                  <path
                    d={pathD}
                    fill={
                      isCapital
                        ? isHovered
                          ? "hsl(0 0% 25%)"
                          : "hsl(0 0% 18%)"
                        : isHovered
                        ? "hsl(0 0% 15%)"
                        : "hsl(0 0% 5%)"
                    }
                    stroke="hsl(0 0% 100%)"
                    strokeWidth={isHovered || isCapital ? 1.2 : 0.5}
                    style={{
                      transition: "fill 0.2s ease, stroke-width 0.2s ease",
                      filter:
                        isHovered || isCapital
                          ? "drop-shadow(0 0 4px rgba(255,255,255,0.25))"
                          : "none",
                    }}
                  />
                  {projected && (
                    <text
                      x={projected[0]}
                      y={projected[1]}
                      textAnchor="middle"
                      className="pointer-events-none select-none fill-foreground font-body"
                      fontSize={isHovered || isCapital ? 7 : 5}
                      opacity={isHovered || isCapital ? 1 : 0.5}
                      fontWeight={isCapital ? 600 : 400}
                    >
                      {districtName}
                      {isCapital ? " ★" : ""}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>
    </motion.div>
  );
};

export default BiharMap;
