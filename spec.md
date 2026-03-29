# EcoSteps Carbon Tracker

## Current State
- Users can log trips (transport mode + distance) and see their own CO2 stats
- Trip data is stored in the canister without any user name
- No leaderboard or multi-user view exists

## Requested Changes (Diff)

### Add
- `userName` field to Trip and TripInput types
- `getLeaderboard` backend query: returns array of {userName, totalCO2Grams, tripCount} sorted by totalCO2Grams ascending (greenest first)
- Name input field in the trip log form (persisted in localStorage)
- Scoreboard section showing ranked users by total CO2 emitted

### Modify
- `addTrip` to accept and store `userName`
- `getAllTrips` to include `userName` in returned trips
- TrackSection: add name input before the trip form, remember it across sessions
- EcoStepsApp: add a Scoreboard section after Trip History

### Remove
- Nothing removed

## Implementation Plan
1. Backend: add `userName: Text` to Trip and TripInput, update addTrip and getAllTrips, add getLeaderboard returning [{userName, totalCO2Grams, tripCount}]
2. Frontend hooks: add useGetLeaderboard query
3. TrackSection: add name text input (localStorage cached), pass userName to addTrip
4. New Scoreboard component: ranked table/cards sorted by total CO2 (lowest = best rank)
5. EcoStepsApp: add Scoreboard section
