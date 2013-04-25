// All Tomorrow's Parties -- server

Meteor.publish("brands", function () {
  return Brands.find({});
});

Meteor.publish("models", function (brand_id) {
  return Models.find({brand_id: brand_id});
});

Meteor.publish("vehicles", function () {
  return Vehicles.find(
    {$or: [{co_owner: this.userId}, {owner: this.userId}]});
});
