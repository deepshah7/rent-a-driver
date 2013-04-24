Vehicles = new Meteor.Collection("vehicles");

Vehicles.allow({
  insert: function (userId, vehicle) {
    return true; // no cowboy inserts -- use createParty method
  },
  update: function (userId, vehicle, fields, modifier) {
    return false; //TODO: will modify the code here to actually update the vehicle
  },
  remove: function (userId, vehicle) {
    return false; //Cannot remove a vehicle you can only modify it or depricate it.
  }
});


Meteor.methods({
  // vehicle should include: title, model, x, y, public
  addVehicle: function (vehicle) {
    vehicle = vehicle || {};
    if (! (typeof vehicle.brand === "string" && vehicle.brand.length &&
           typeof vehicle.model === "string" &&
           vehicle.model.length &&
           typeof vehicle.regNumber === "string" && vehicle.regNumber.length))
      throw new Meteor.Error(400, "Required parameter missing");
    if (! this.userId)
      throw new Meteor.Error(403, "You must be logged in");

    return Vehicles.insert({
      owner: this.userId,
      co_owner: [this.userId],
      regNumber: vehicle.regNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      comments: vehicle.comments
    });
  }
});