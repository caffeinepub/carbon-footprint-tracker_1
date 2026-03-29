import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { TripInput } from "../backend";
import { useActor } from "./useActor";

export function useGetAllTrips() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["trips"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTrips();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetTotalCO2() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["totalCO2"],
    queryFn: async () => {
      if (!actor) return 0;
      return actor.getTotalCO2Emitted();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetLeaderboard() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeaderboard();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10000,
  });
}

export function useAddTrip() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (tripInput: TripInput) => {
      if (!actor) throw new Error("No actor");
      return actor.addTrip(tripInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["trips"] });
      queryClient.invalidateQueries({ queryKey: ["totalCO2"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
    },
  });
}
