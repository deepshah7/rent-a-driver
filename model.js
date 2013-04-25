Vehicles = new Meteor.Collection("vehicles");

Vehicles.allow({
  insert: function (userId, vehicle) {
    return false;
  },
  update: function (userId, vehicle, fields, modifier) {
    return false;
  },
  remove: function (userId, vehicle) {
    return false;
  }
});

Validator = {
    validateVehicle: function(vehicle) {
        vehicle = vehicle || {};
        if (! (typeof vehicle.brand === "string" && vehicle.brand.length &&
            typeof vehicle.model === "string" &&
            vehicle.model.length &&
            typeof vehicle.regNumber === "string" && vehicle.regNumber.length))
            return new Meteor.Error(400, "Required parameter missing");
        if (! Meteor.userId())
            return new Meteor.Error(403, "You must be logged in");
        return null;
    }
};

Meteor.methods({
  addVehicle: function (vehicle) {
      var error = Validator.validateVehicle(vehicle);
      if(error) throw error;

      return Vehicles.insert({
          owner: this.userId,
          co_owner: [this.userId],
          regNumber: vehicle.regNumber,
          brand: vehicle.brand,
          model: vehicle.model,
          comments: vehicle.comments
      });
  },

  editVehicle: function (vehicle) {
      var error = Validator.validateVehicle(vehicle);
      if(error) throw error;


      return Vehicles.update(vehicle._id, {$set: {
          regNumber: vehicle.regNumber,
          brand: vehicle.brand,
          model: vehicle.model,
          comments: vehicle.comments
      }});
  }
});