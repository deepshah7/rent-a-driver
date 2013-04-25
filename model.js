Brands = new Meteor.Collection("brands");
Models = new Meteor.Collection("models");
Vehicles = new Meteor.Collection("vehicles");
Drivers = new Meteor.Collection("drivers");

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
    },
    validateDriver: function(driver) {
        driver = driver || {};
        if (! (typeof driver.vehicle_id === "string" && driver.vehicle_id.length &&
            typeof driver.user_id === "string" && driver.user_id.length &&
            typeof driver.name === "string" && driver.name.length &&
            typeof driver.panNumber === "string" && driver.panNumber.length &&
            typeof driver.license.number === "string" && driver.license.number.length &&
            typeof driver.license.validTill === "string" && driver.license.validTill.length))
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
  },
  saveDriver: function (driver) {
      var error = Validator.validateDriver(driver);
      if(error) throw error;

      if(!driver._id) {
          return Drivers.insert({
              user_id: driver.user_id,
              name: driver.name,
              panNumber: driver.panNumber,
              license: driver.license,
              vehicle_id: driver.vehicle_id,
              comments: driver.comments
          });
          return;
      }
      return Drivers.update(driver._id, {$set: {
          user_id: driver.user_id,
          name: driver.name,
          panNumber: driver.panNumber,
          license: driver.license,
          vehicle_id: driver.vehicle_id,
          comments: driver.comments
      }});
  }
});