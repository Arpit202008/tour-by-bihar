import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronDown,
  MapPin,
  Utensils,
  Calendar,
  Clock,
  BookOpen,
  Navigation,
  Circle,
} from "lucide-react";
import { biharTourismData } from "@/data/biharTourismDataExtensive";
import type { BiharTourismInfo, TouristPlace } from "@/data/biharTourismDataExtensive";
import { PATNA_COORDS, biharDistrictCoordinates } from "@/data/biharDistricts";
import { haversineDistance } from "@/utils/geo";

interface DistrictPanelProps {
  district: string;
  onClose: () => void;
}

/** Collapsible section for history periods */
const HistorySection = ({ title, content }: { title: string; content: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-left text-sm font-medium text-foreground transition-colors hover:text-muted-foreground"
      >
        {title}
        <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <p className="pb-4 text-xs leading-relaxed text-muted-foreground">{content}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/** Reusable section wrapper */
const Section = ({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <div className="mb-3 flex items-center gap-2">
      <span className="text-foreground">{icon}</span>
      <h4 className="font-heading text-xs font-semibold uppercase tracking-wider text-foreground">
        {title}
      </h4>
    </div>
    {children}
  </motion.div>
);

const DistrictPanel = ({ district, onClose }: DistrictPanelProps) => {
  const [selectedPlace, setSelectedPlace] = useState<{name: string, history: string} | null>(null);

  const [visitedPlaces, setVisitedPlaces] = useState<Record<string, boolean>>(() => {
    try {
      const item = localStorage.getItem('visitedPlaces');
      return item ? JSON.parse(item) : {};
    } catch {
      return {};
    }
  });

  const toggleVisited = (e: React.MouseEvent, placeName: string) => {
    e.stopPropagation();
    setVisitedPlaces(prev => {
      const next = { ...prev, [placeName]: !prev[placeName] };
      localStorage.setItem('visitedPlaces', JSON.stringify(next));
      return next;
    });
  };
  
  const info: BiharTourismInfo = useMemo(() => biharTourismData[district] || {
    categorizedPlaces: {},
    bestFood: [],
    bestTimeToVisit: "",
    openingClosingTimings: "",
    history: { ancient: "", medieval: "", colonial: "", modern: "" },
    nearbyCities: []
  }, [district]);

  // Track which category is currently expanded
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const distanceFromCapital = useMemo(() => {
    const coords = biharDistrictCoordinates[district];
    if (!coords) return null;
    if (district === "Patna") return 0;
    return haversineDistance(PATNA_COORDS.lat, PATNA_COORDS.lng, coords.lat, coords.lng);
  }, [district]);

  return (
    <motion.div
      className="fixed inset-y-0 right-0 z-40 w-full overflow-y-auto border-l border-border bg-background sm:w-96 md:w-[28rem]"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-heading text-xl font-semibold text-foreground text-glow">
              {district}
            </h3>
            <p className="text-xs text-muted-foreground">Bihar</p>
          </div>
          <motion.button
            onClick={onClose}
            className="rounded-md border border-border p-2 text-foreground transition-colors hover:bg-accent"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} />
          </motion.button>
        </div>

        {/* Distance from Patna */}
        {distanceFromCapital !== null && (
          <motion.div
            className="mb-5 flex items-center gap-2 rounded-md border border-border bg-card px-3 py-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Navigation size={14} className="text-foreground" />
            <span className="text-xs text-muted-foreground">
              Distance from Patna:{" "}
              <span className="font-semibold text-foreground">{distanceFromCapital} km</span>
            </span>
          </motion.div>
        )}

        <div className="space-y-6">
          <Section icon={<MapPin size={14} />} title="Categorized Places to Visit">
            <div className="space-y-2">
              {Object.entries(info.categorizedPlaces || {}).map(([category, places], catIdx) => {
                const isOpen = openCategory === category;
                return (
                  <div key={catIdx} className="rounded-md border border-border bg-card/50 overflow-hidden">
                    <button
                      onClick={() => setOpenCategory(isOpen ? null : category)}
                      className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold text-white hover:bg-accent transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        {category}
                        <span className="rounded-full bg-primary/20 text-primary px-2 py-0.5 text-[10px]">
                          {places.length}
                        </span>
                      </span>
                      <motion.span animate={{ rotate: isOpen ? 180 : 0 }}>
                        <ChevronDown size={14} />
                      </motion.span>
                    </button>
                    
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden bg-background/50"
                        >
                          <ul className="px-3 py-2 space-y-1">
                            {places.map((place: TouristPlace, pIdx: number) => (
                              <motion.li
                                key={pIdx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: pIdx * 0.03 }}
                              >
                                <div className="flex w-full items-center justify-between gap-2 rounded-md p-1.5 transition-colors hover:bg-primary/10 group/item">
                                  <button 
                                    onClick={() => setSelectedPlace({ name: place.name, history: place.detail || "A deeply historical spot serving devotees and culture enthusiasts." })}
                                    className="group flex-1 text-left focus:outline-none"
                                  >
                                    <span className={`text-xs transition-colors ${visitedPlaces[place.name] ? 'text-white font-bold opacity-100 drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]' : 'font-medium text-muted-foreground group-hover:text-primary'}`}>
                                      {place.name}
                                    </span>
                                  </button>
                                  <button
                                    onClick={(e) => toggleVisited(e, place.name)}
                                    className={`flex-shrink-0 transition-colors focus:outline-none ${visitedPlaces[place.name] ? 'text-primary' : 'text-muted-foreground hover:text-white group-hover/item:opacity-100 md:opacity-0 md:group-hover/item:opacity-100'}`}
                                    title={visitedPlaces[place.name] ? "Mark as unvisited" : "Mark as visited"}
                                  >
                                    {visitedPlaces[place.name] ? (
                                      <Circle size={14} fill="currentColor" className="text-primary brightness-125" />
                                    ) : (
                                      <Circle size={14} />
                                    )}
                                  </button>
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
              
              {Object.keys(info.categorizedPlaces || {}).length === 0 && (
                <p className="text-xs text-muted-foreground italic">No categorized places available.</p>
              )}
            </div>
          </Section>

          <Section icon={<Utensils size={14} />} title="Best Food">
            <ul className="space-y-2">
              {info.bestFood.map((food, i) => (
                <motion.li
                  key={i}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <span className="mt-0.5 h-1 w-1 flex-shrink-0 rounded-full bg-foreground" />
                  {food}
                </motion.li>
              ))}
            </ul>
          </Section>

          <Section icon={<Calendar size={14} />} title="Best Time to Visit">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {info.bestTimeToVisit}
            </p>
          </Section>

          <Section icon={<BookOpen size={14} />} title="Detailed History">
            <div>
              <HistorySection title="Ancient Period" content={info.history?.ancient || ""} />
              <HistorySection title="Medieval Period" content={info.history?.medieval || ""} />
              <HistorySection title="Colonial Period" content={info.history?.colonial || ""} />
              <HistorySection title="Modern Period" content={info.history?.modern || ""} />
            </div>
          </Section>

          {info.nearbyCities && info.nearbyCities.length > 0 && (
            <Section icon={<MapPin size={14} />} title="Nearby Cities & Checkpoints">
              <ul className="space-y-2 flex flex-wrap gap-2">
                {info.nearbyCities.map((city, i) => (
                  <motion.li
                    key={i}
                    className="flex items-center gap-1 rounded-sm border border-border bg-card px-2 py-1 text-xs text-muted-foreground"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <span>{city}</span>
                  </motion.li>
                ))}
              </ul>
            </Section>
          )}

          <Section icon={<Clock size={14} />} title="Opening & Closing Timings">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {info.openingClosingTimings}
            </p>
          </Section>
        </div>
      </div>

      {/* Selected Place Modal popup fixed to the screen so it's always visible */}
      <AnimatePresence>
        {selectedPlace && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] w-80 max-w-[90vw] rounded-lg border border-border bg-card p-4 shadow-2xl overflow-hidden"
          >
            <div className="flex items-start justify-between mb-3 border-b border-white/10 pb-2">
              <h4 className="font-heading text-base font-semibold text-white">{selectedPlace.name}</h4>
              <button 
                onClick={() => setSelectedPlace(null)}
                className="text-muted-foreground hover:text-white bg-white/5 rounded-full p-1"
              >
                <X size={14} />
              </button>
            </div>
            <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2 mb-3">
              <p className="text-sm text-gray-300 leading-relaxed">{selectedPlace.history}</p>
            </div>
            
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedPlace.name + ', ' + district + ', Bihar')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-md bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
            >
              <Navigation size={14} />
              Get Directions
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DistrictPanel;
