Vehicles = new Meteor.Collection("vehicles");

Vehicles.allow({
  insert: function (userId, party) {
    return false; // no cowboy inserts -- use createParty method
  },
  update: function (userId, party, fields, modifier) {
    return false; //TODO: will modify the code here to actually update the vehicle
  },
  remove: function (userId, vehicle) {
    return false; //Cannot remove a vehicle you can only modify it or depricate it.
  }
});
