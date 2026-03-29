import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { useGetLeaderboard } from "../hooks/useQueries";

const RANK_MEDALS = ["🥇", "🥈", "🥉"];

export default function Scoreboard() {
  const { data: leaderboard = [], isLoading } = useGetLeaderboard();
  const [currentUser, setCurrentUser] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("ecoUserName");
    if (saved) setCurrentUser(saved);
  }, []);

  if (isLoading) {
    return (
      <Card
        className="shadow-card border border-border rounded-xl"
        data-ocid="leaderboard.loading_state"
      >
        <CardHeader>
          <CardTitle className="text-xl text-eco-navy font-display">
            🏆 Green Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </CardContent>
      </Card>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card
        className="shadow-card border border-border rounded-xl"
        data-ocid="leaderboard.empty_state"
      >
        <CardHeader>
          <CardTitle className="text-xl text-eco-navy font-display">
            🏆 Green Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent className="py-10 text-center">
          <p className="text-4xl mb-3">🌍</p>
          <p className="text-sm text-muted-foreground">
            No entries yet. Log a trip to appear on the leaderboard!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="shadow-card border border-border rounded-xl"
      data-ocid="leaderboard.card"
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-xl text-eco-navy font-display">
          🏆 Green Leaderboard
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Ranked by lowest CO₂ — greenest travellers first.
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {leaderboard.map((entry, i) => {
            const isCurrentUser =
              currentUser &&
              entry.userName.toLowerCase() === currentUser.toLowerCase();
            const isTopThree = i < 3;
            return (
              <motion.div
                key={entry.userName}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: Math.min(i * 0.06, 0.4) }}
                data-ocid={`leaderboard.item.${i + 1}`}
                className={`
                  flex items-center gap-4 p-4 rounded-xl border-2 transition-all
                  ${
                    isCurrentUser
                      ? "border-primary bg-primary/5 shadow-sm"
                      : isTopThree
                        ? "border-green-200 bg-green-50/60"
                        : "border-border bg-slate-50/50"
                  }
                `}
              >
                {/* Rank */}
                <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                  {i < 3 ? (
                    <span className="text-2xl">{RANK_MEDALS[i]}</span>
                  ) : (
                    <span className="text-lg font-bold text-muted-foreground font-display">
                      {i + 1}
                    </span>
                  )}
                </div>

                {/* Avatar initial */}
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
                    ${isTopThree ? "bg-green-100 text-green-700" : "bg-slate-200 text-slate-600"}
                  `}
                >
                  {entry.userName.charAt(0).toUpperCase()}
                </div>

                {/* Name + trips */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`font-semibold truncate ${
                        isCurrentUser ? "text-primary" : "text-eco-navy"
                      } font-display`}
                    >
                      {entry.userName}
                    </span>
                    {isCurrentUser && (
                      <span className="text-xs bg-primary/15 text-primary px-2 py-0.5 rounded-full font-medium">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {Number(entry.tripCount)} trip
                    {Number(entry.tripCount) !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* CO2 */}
                <div className="text-right flex-shrink-0">
                  <span
                    className={`text-base font-bold font-display ${
                      isTopThree ? "text-green-700" : "text-eco-navy"
                    }`}
                  >
                    {(entry.totalCO2Grams / 1000).toFixed(2)}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    kg CO₂
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
