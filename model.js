Brands = new Meteor.Collection("brands");
Models = new Meteor.Collection("models");
Vehicles = new Meteor.Collection("vehicles");
VehicleLogs = new Meteor.Collection("vehicleLogs");
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
            typeof vehicle.model_id === "string" && vehicle.model_id.length &&
            typeof vehicle.regNumber === "string" && vehicle.regNumber.length &&
            typeof vehicle.policyNumber === "string" && vehicle.policyNumber.length &&
            typeof vehicle.policyFrom === "string" && vehicle.policyFrom.length &&
            typeof vehicle.policyTo === "string" && vehicle.policyTo.length
            ))
            return new Meteor.Error(400, "Required parameter missing");
        if (! Meteor.userId())
            return new Meteor.Error(403, "You must be logged in");
        vehicle.policyFrom = new Date(vehicle.policyFrom);
        vehicle.policyTo = new Date(vehicle.policyTo);
        return null;
    },
    validateVehicleLog: function(vehicle_log) {
        vehicle_log = vehicle_log || {};
        if (! (typeof vehicle_log.vehicle_id === "string" && vehicle_log.vehicle_id.length &&
            typeof vehicle_log.user_id === "string" && vehicle_log.user_id.length &&
            typeof vehicle_log.when === "string" && vehicle_log.when.length))
            return new Meteor.Error(400, "Required parameter missing");
        if (! Meteor.userId())
            return new Meteor.Error(403, "You must be logged in");
        vehicle_log.when = new Date(vehicle_log.when);
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

        driver.license.validTill = new Date(driver.license.validTill);
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
              regNumber: vehicle.regNumber.toUpperCase(),
              brand_id: vehicle.brand_id,
              model_id: vehicle.model_id,
              insurance: {
                  number: vehicle.policyNumber,
                  from: vehicle.policyFrom,
                  to: vehicle.policyTo
              },
              comments: vehicle.comments
          });
          return;
      }
      return Vehicles.update(vehicle._id, {$set: {
          regNumber: vehicle.regNumber.toUpperCase(),
          brand_id: vehicle.brand_id,
          model_id: vehicle.model_id,
          insurance: {
              number: vehicle.policyNumber,
              from: vehicle.policyFrom,
              to: vehicle.policyTo
          },
          comments: vehicle.comments
      }});
  },
  saveVehicleLog: function (vehicle_log) {
      var error = Validator.validateVehicleLog(vehicle_log);
      if(error) throw error;

      return VehicleLogs.insert({
          vehicle_id: vehicle_log.vehicle_id,
          user_id: vehicle_log.user_id,
          entered_by_user_id: vehicle_log.entered_by_user_id,
          when: vehicle_log.when,
          reading: vehicle_log.reading,
          comments: vehicle_log.comments
      });
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