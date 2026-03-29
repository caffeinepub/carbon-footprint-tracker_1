import Float "mo:core/Float";
import Time "mo:core/Time";
import Iter "mo:core/Iter";
import Int "mo:core/Int";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";

import Text "mo:core/Text";
import Order "mo:core/Order";


actor {
  public type TransportMode = {
    #car;
    #bus;
    #bicycle;
    #walk;
    #train;
    #plane;
  };

  public type Trip = {
    userName : Text;
    transportMode : TransportMode;
    distanceKm : Float;
    co2Grams : Float;
    timestamp : Time.Time;
  };

  module Trip {
    public func compare(trip1 : Trip, trip2 : Trip) : Order.Order {
      Int.compare(trip1.timestamp, trip2.timestamp);
    };
  };

  public type TripInput = {
    userName : Text;
    transportMode : TransportMode;
    distanceKm : Float;
    co2Grams : Float;
  };

  public type LeaderboardEntry = {
    userName : Text;
    totalCO2Grams : Float;
    tripCount : Nat;
  };

  public type TripSummary = {
    entries : [Trip];
    totalDistance : Float;
    totalCO2 : Float;
  };

  let tripLogs = Map.empty<Text, Trip>();
  var nextId = 0;

  func generateUniqueId() : Text {
    let id = nextId;
    nextId += 1;
    id.toText();
  };

  func getTripInternal(id : Text) : Trip {
    switch (tripLogs.get(id)) {
      case (null) { Runtime.trap("Trip not found") };
      case (?trip) { trip };
    };
  };

  func getTripsByNameInternal(userName : Text) : [Trip] {
    tripLogs.values().toArray().filter(func(trip) { trip.userName == userName });
  };

  public shared ({ caller }) func addTrip(tripInput : TripInput) : async () {
    let trip : Trip = {
      tripInput with timestamp = Time.now();
    };
    let id = generateUniqueId();
    tripLogs.add(id, trip);
  };

  public query ({ caller }) func getAllTrips() : async [Trip] {
    tripLogs.values().toArray().sort();
  };

  public query ({ caller }) func getTripById(id : Text) : async Trip {
    getTripInternal(id);
  };

  public query ({ caller }) func getTotalCO2Emitted() : async Float {
    tripLogs.values().toArray().foldLeft(
      0.0,
      func(total, trip) { total + trip.co2Grams },
    );
  };

  public query ({ caller }) func getLeaderboard() : async [LeaderboardEntry] {
    let accMap = Map.empty<Text, (Float, Nat)>();
    for (trip in tripLogs.values()) {
      let name = trip.userName;
      let (prevCO2, prevCount) = switch (accMap.get(name)) {
        case (null) { (0.0, 0) };
        case (?v) { v };
      };
      accMap.add(name, (prevCO2 + trip.co2Grams, prevCount + 1));
    };
    let entries = accMap.entries().toArray().map(
      func((name, (co2, count)) : (Text, (Float, Nat))) : LeaderboardEntry {
        { userName = name; totalCO2Grams = co2; tripCount = count };
      },
    );
    entries.sort(
      func(a : LeaderboardEntry, b : LeaderboardEntry) : Order.Order {
        if (a.totalCO2Grams < b.totalCO2Grams) { #less } else if (a.totalCO2Grams > b.totalCO2Grams) {
          #greater;
        } else { #equal };
      },
    );
  };

  public shared ({ caller }) func deleteTrip(id : Text) : async () {
    ignore getTripInternal(id);
    tripLogs.remove(id);
  };

  public shared ({ caller }) func updateTrip(id : Text, tripInput : TripInput) : async () {
    let updatedTrip : Trip = {
      tripInput with timestamp = Time.now();
    };
    tripLogs.add(id, updatedTrip);
  };

  public query ({ caller }) func getTripsByUserName(userName : Text) : async [Trip] {
    getTripsByNameInternal(userName);
  };

  public query ({ caller }) func calculateTotalDistance() : async Float {
    tripLogs.values().toArray().foldLeft(
      0.0,
      func(total, trip) { total + trip.distanceKm },
    );
  };

  public query ({ caller }) func getTripSummaryByUserName(userName : Text) : async TripSummary {
    let userTrips = getTripsByNameInternal(userName);
    let (totalDistance, totalCO2) = userTrips.foldLeft(
      (0.0, 0.0),
      func((distance, co2), trip) {
        (distance + trip.distanceKm, co2 + trip.co2Grams);
      },
    );
    {
      entries = userTrips;
      totalDistance;
      totalCO2;
    };
  };

  public query ({ caller }) func getTotalTrips() : async Nat {
    tripLogs.size();
  };
};
