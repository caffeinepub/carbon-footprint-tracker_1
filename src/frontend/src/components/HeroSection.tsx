import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf } from "lucide-react";
import { motion } from "motion/react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function HeroSection({ onGetStarted }: HeroProps) {
  return (
    <section className="hero-gradient relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 mb-6">
              <Leaf className="w-3.5 h-3.5 text-green-300" />
              <span className="text-xs font-medium text-green-200">
                Carbon Footprint Tracker
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold font-display leading-[1.1] mb-5">
              <span className="text-white">Track. Reduce.</span>
              <br />
              <span className="text-green-300">Go Green.</span>
            </h1>
            <p className="text-white/75 text-lg leading-relaxed mb-8 max-w-md">
              Log your daily commutes, discover your carbon footprint, and get
              personalized suggestions to travel greener — one trip at a time.
            </p>
            <Button
              onClick={onGetStarted}
              data-ocid="hero.get_started.primary_button"
              size="lg"
              className="bg-green-400 hover:bg-green-300 text-green-950 font-semibold text-base px-6 gap-2"
            >
              Get Started: Log Your First Trip
              <ArrowRight className="w-4 h-4" />
            </Button>
          </motion.div>

          {/* Right - Decorative blob + icons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut", delay: 0.15 }}
            className="hidden md:flex items-center justify-center relative"
          >
            {/* Blob */}
            <div className="eco-blob w-80 h-80 bg-green-400/20 absolute" />
            {/* Central icon arrangement */}
            <div className="relative z-10 flex flex-col items-center gap-5">
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">🚆</span>
                  <span className="text-[10px] text-white/70 font-medium">
                    Metro
                  </span>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">🚴</span>
                  <span className="text-[10px] text-white/70 font-medium">
                    Cycle
                  </span>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">🚌</span>
                  <span className="text-[10px] text-white/70 font-medium">
                    Bus
                  </span>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-green-400/30 backdrop-blur-sm border border-green-300/30 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">🌿</span>
                  <span className="text-[10px] text-green-200 font-medium">
                    Eco
                  </span>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">🚶</span>
                  <span className="text-[10px] text-white/70 font-medium">
                    Walk
                  </span>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">🌳</span>
                  <span className="text-[10px] text-white/70 font-medium">
                    Trees
                  </span>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center gap-1">
                  <span className="text-3xl">💨</span>
                  <span className="text-[10px] text-white/70 font-medium">
                    Clean Air
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0" aria-hidden="true">
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          role="presentation"
        >
          <title>Decorative wave</title>
          <path
            d="M0 60L1440 60L1440 20C1200 60 960 0 720 20C480 40 240 0 0 20L0 60Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
