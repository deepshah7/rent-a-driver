Meteor.subscribe("vehicles");

Helpers.initializeAllMenuItems();

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
