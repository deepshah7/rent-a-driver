/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */
var Router = Backbone.Router.extend({
    routes: {
        "":                                     "main",
        "vehicles/add":                          "addVehicle",
        "vehicles/edit/:vehicleId":              "editVehicle",
        "vehicles":                              "listVehicle",
        "drivers/add":                           "addDriver",
        "drivers/edit/:driverId":                "editDriver",
        "drivers":                               "listDriver"
    },

    main: function() {
        this.updateSessionVariables(Operations.Home);
    },

    addVehicle: function() {
        Session.set(Constants.EditVehicle, null);
        Session.set(Constants.Vehicle.SelectedBrand, null);
        this.updateSessionVariables(Operations.AddVehicle);
    },

    editVehicle: function(vehicleId) {
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            this.navigateTo(allMenuItems.listVehicles);
            return;
        }
        this.updateSessionVariables(Operations.EditVehicle);
        Session.set(Constants.EditVehicle, vehicle);
        Session.set(Constants.Vehicle.SelectedBrand, vehicle.brand_id);
    },

    listVehicle: function() {
        this.updateSessionVariables(Operations.ListVehicles);
    },

    addDriver: function() {
        this.updateSessionVariables(Operations.AddDriver);
    },

    editDriver: function(driverId) {
        this.updateSessionVariables(Operations.EditDriver);
    },

    listDriver: function() {
        this.updateSessionVariables(Operations.ListDrivers);
    },

    navigateTo: function(menuItem, identifier) {
        if(!menuItem) {
            this.navigate("/", true);
            return;
        }
        var appendUrl = identifier? identifier : "";
        this.navigate(menuItem.url + appendUrl, true);
    },

    updateSessionVariables: function(operation) {
        Session.set(Constants.Operation, operation.name);
        Session.set(Constants.ParentOperation, operation.parent);
        Helpers.initializeMenu();
    }
});

app = new Router;
