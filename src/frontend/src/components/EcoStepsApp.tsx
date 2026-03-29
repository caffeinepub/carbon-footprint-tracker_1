import { useRef } from "react";
import type { Trip } from "../backend";
import { useGetAllTrips } from "../hooks/useQueries";
import Footer from "./Footer";
import Header from "./Header";
import HeroSection from "./HeroSection";
import ImpactDashboard from "./ImpactDashboard";
import Scoreboard from "./Scoreboard";
import TipsSection from "./TipsSection";
import TrackSection from "./TrackSection";
import TripHistory from "./TripHistory";

export default function EcoStepsApp() {
  const logTripRef = useRef<HTMLDivElement>(null);
  const { data: trips = [] } = useGetAllTrips();

  const scrollToLogTrip = () => {
    logTripRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onLogNewTrip={scrollToLogTrip} />
      <main className="flex-1">
        <HeroSection onGetStarted={scrollToLogTrip} />
        <section ref={logTripRef} id="log-trip" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-eco-navy mb-8 font-display">
              Track Your Emissions
            </h2>
            <TrackSection trips={trips as Trip[]} />
          </div>
        </section>
        <section id="impact" className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-eco-navy mb-8 font-display">
              My Impact Dashboard
            </h2>
            <ImpactDashboard trips={trips as Trip[]} />
          </div>
        </section>
        <section id="tips" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-eco-navy mb-2 font-display">
              Go Greener: Personalized Tips
            </h2>
            <p className="text-muted-foreground mb-8">
              Smart suggestions based on your travel patterns.
            </p>
            <TipsSection trips={trips as Trip[]} />
          </div>
        </section>
        <section id="history" className="py-16 bg-slate-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-eco-navy mb-8 font-display">
              Trip History
            </h2>
            <TripHistory trips={trips as Trip[]} />
          </div>
        </section>
        <section id="leaderboard" className="py-16 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-3xl font-bold text-eco-navy mb-2 font-display">
              Green Leaderboard
            </h2>
            <p className="text-muted-foreground mb-8">
              See who&apos;s leading the charge for a greener planet.
            </p>
            <Scoreboard />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
