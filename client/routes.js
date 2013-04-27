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
        "vehicles/logs/add/:vehicleId":              "logVehicle",
        "vehicles/logs/:vehicleId":              "viewLogVehicle",
        "vehicles":                              "listVehicle",
        "drivers/add":                           "addDriver",
        "drivers/edit/:driverId":                "editDriver",
        "drivers":                               "listDriver"
    },

    main: function() {
        this.updateSessionVariables(Operations.Home);
    },

    addVehicle: function() {
        if(!Helpers.isCurrentUserAdminUser()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
        SessionHelper.setEditVehicle(null);
        SessionHelper.setSelectedBrand(null);
        SessionHelper.setAddEditVehicleError(null);
        this.updateSessionVariables(Operations.AddVehicle);
    },

    editVehicle: function(vehicleId) {
        if(!Helpers.isCurrentUserAdminUser()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            this.navigateTo(allMenuItems.listVehicles);
            return;
        }
        this.updateSessionVariables(Operations.EditVehicle);
        SessionHelper.setEditVehicle(vehicle);
        SessionHelper.setSelectedBrand(vehicle.brand_id);
        SessionHelper.setAddEditVehicleError(null);
    },

    logVehicle: function(vehicleId) {
        if(!Helpers.isUserLoggedIn()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            this.navigateTo(allMenuItems.listVehicles);
            return;
        }
        this.updateSessionVariables(Operations.LogVehicle);
        SessionHelper.setLogVehicleError(null);
        SessionHelper.setEditVehicle(vehicle);
    },

    viewLogVehicle: function(vehicleId) {
        if(!Helpers.isCurrentUserAdminUser()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            this.navigateTo(allMenuItems.listVehicles);
            return;
        }
        this.updateSessionVariables(Operations.ViewLogVehicle);
        SessionHelper.setEditVehicle(vehicle);
    },

    listVehicle: function() {
        if(!Helpers.isUserLoggedIn()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
        this.updateSessionVariables(Operations.ListVehicles);
    },

    addDriver: function() {
        if(!Helpers.isCurrentUserAdminUser()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
        SessionHelper.setAddEditDriverError(null);
        this.updateSessionVariables(Operations.AddDriver);
    },

    editDriver: function(driverId) {
        if(!Helpers.isCurrentUserAdminUser()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
        SessionHelper.setAddEditDriverError(null);
        this.updateSessionVariables(Operations.EditDriver);
    },

    listDriver: function() {
        if(!Helpers.isCurrentUserAdminUser()) {
            this.navigateTo(allMenuItems.Home);
            return;
        }
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
        SessionHelper.setOperation(operation);
        Helpers.initializeMenu();
    }
});

app = new Router;
