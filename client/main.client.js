Meteor.subscribe("vehicles");
Meteor.subscribe("brands");
Meteor.subscribe('models');
Meteor.subscribe('drivers');
Meteor.subscribe('directory');

Helpers.initializeAllMenuItems();

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
