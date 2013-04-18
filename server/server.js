// All Tomorrow's Parties -- server

Meteor.publish("directory", function () {
  return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
});

Meteor.publish("vehicles", function () {
  return Vehicles.find(
    {$or: [{co_owner: this.userId}, {owner: this.userId}]});
});
