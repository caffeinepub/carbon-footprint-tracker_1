import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Float "mo:core/Float";

module {
  type TransportMode = {
    #car;
    #bus;
    #bicycle;
    #walk;
    #train;
    #plane;
  };

  type OldTrip = {
    transportMode : TransportMode;
    distanceKm : Float;
    co2Grams : Float;
    timestamp : Int;
  };

  type NewTrip = {
    userName : Text;
    transportMode : TransportMode;
    distanceKm : Float;
    co2Grams : Float;
    timestamp : Int;
  };

  type OldActor = {
    tripLogs : Map.Map<Text, OldTrip>;
    nextId : Nat;
  };

  type NewActor = {
    tripLogs : Map.Map<Text, NewTrip>;
    nextId : Nat;
  };

  public func run(old : OldActor) : NewActor {
    let newLogs = old.tripLogs.map<Text, OldTrip, NewTrip>(
      func(_id, oldTrip) {
        {
          oldTrip with
          userName = "Unknown";
        };
      }
    );
    {
      tripLogs = newLogs;
      nextId = old.nextId;
    };
  };
};
