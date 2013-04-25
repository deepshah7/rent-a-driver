Brands = new Meteor.Collection("brands");
Models = new Meteor.Collection("models");
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

Brands.allow({
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

Models.allow({
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
        if (! (typeof vehicle.brand_id === "string" && vehicle.brand_id.length &&
            typeof vehicle.model_id === "string" &&
            vehicle.model_id.length &&
            typeof vehicle.regNumber === "string" && vehicle.regNumber.length))
            return new Meteor.Error(400, "Required parameter missing");
        if (! Meteor.userId())
            return new Meteor.Error(403, "You must be logged in");
        return null;
    }
};

Meteor.methods({
  saveVehicle: function (vehicle) {
      var error = Validator.validateVehicle(vehicle);
      if(error) throw error;

      if(!vehicle._id) {
          return Vehicles.insert({
              owner: this.userId,
              co_owner: [this.userId],
              regNumber: vehicle.regNumber,
              brand_id: vehicle.brand_id,
              model_id: vehicle.model_id,
              comments: vehicle.comments
          });
          return;
      }
      return Vehicles.update(vehicle._id, {$set: {
          regNumber: vehicle.regNumber,
          brand_id: vehicle.brand_id,
          model_id: vehicle.model_id,
          comments: vehicle.comments
      }});
  }
});