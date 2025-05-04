
import { motion } from "framer-motion";
import { WorldMap } from "@/components/ui/world-map";

export function GlobalPresence() {
  return (
    <section className="py-16 w-full bg-white">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-brand-blue mb-4">
          Global{" "}
          <span className="text-brand-teal">
            {"Partnerships".split("").map((letter, idx) => (
              <motion.span
                key={idx}
                className="inline-block"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: idx * 0.04 }}
              >
                {letter}
              </motion.span>
            ))}
          </span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-10">
          Connecting manufacturers and buyers across borders. Our global network ensures
          that high-quality Indian products reach international markets efficiently.
        </p>
        <WorldMap
          lineColor="#2C7A7B"
          dots={[
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 40.7128, lng: -74.006 }, // New York
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 51.5074, lng: -0.1278 }, // London
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 35.6762, lng: 139.6503 }, // Tokyo
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -33.8688, lng: 151.2093 }, // Sydney
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: -1.2921, lng: 36.8219 }, // Nairobi
            },
            {
              start: { lat: 28.6139, lng: 77.209 }, // New Delhi
              end: { lat: 55.7558, lng: 37.6173 }, // Moscow
            },
          ]}
        />
      </div>
    </section>
  );
}
