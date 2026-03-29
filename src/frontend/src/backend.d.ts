import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface LeaderboardEntry {
    userName: string;
    totalCO2Grams: number;
    tripCount: bigint;
}
export interface TripSummary {
    totalCO2: number;
    entries: Array<Trip>;
    totalDistance: number;
}
export interface Trip {
    userName: string;
    co2Grams: number;
    distanceKm: number;
    timestamp: Time;
    transportMode: TransportMode;
}
export interface TripInput {
    userName: string;
    co2Grams: number;
    distanceKm: number;
    transportMode: TransportMode;
}
export type Time = bigint;
export enum TransportMode {
    bus = "bus",
    car = "car",
    train = "train",
    bicycle = "bicycle",
    walk = "walk",
    plane = "plane"
}
export interface backendInterface {
    addTrip(tripInput: TripInput): Promise<void>;
    calculateTotalDistance(): Promise<number>;
    deleteTrip(id: string): Promise<void>;
    getAllTrips(): Promise<Array<Trip>>;
    getLeaderboard(): Promise<Array<LeaderboardEntry>>;
    getTotalCO2Emitted(): Promise<number>;
    getTotalTrips(): Promise<bigint>;
    getTripById(id: string): Promise<Trip>;
    getTripSummaryByUserName(userName: string): Promise<TripSummary>;
    getTripsByUserName(userName: string): Promise<Array<Trip>>;
    updateTrip(id: string, tripInput: TripInput): Promise<void>;
}
