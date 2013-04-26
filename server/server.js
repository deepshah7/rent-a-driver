// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
        return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("brands", function () {
  return Brands.find({});
});

Meteor.publish("models", function () {
  return Models.find({});
});

Meteor.publish("drivers", function () {
    return Drivers.find({});
});

Meteor.publish("vehicles", function () {
    var driver = Drivers.findOne({user_id: this.userId});
    var vehicle_id = driver? driver.vehicle_id : "";
    return Vehicles.find(
        {$or: [{_id: vehicle_id}, {owner: this.userId}]});
});

Meteor.publish("vehicleLogs", function () {
    return VehicleLogs.find({});
});

