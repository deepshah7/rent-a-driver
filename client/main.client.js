Meteor.subscribe("vehicles");
Meteor.subscribe("brands");
Meteor.subscribe('models');
Meteor.subscribe('drivers');

Helpers.initializeAllMenuItems();

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
