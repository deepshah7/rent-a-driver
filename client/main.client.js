Meteor.subscribe("vehicles");
Meteor.subscribe("brands");

Deps.autorun(function() {
    Meteor.subscribe('models', Session.get(Constants.Vehicle.SelectedBrand));
});

Helpers.initializeAllMenuItems();

Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
