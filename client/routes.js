/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 3:05 PM
 * To change this template use File | Settings | File Templates.
 */

Meteor.Router.add({
    '/': 'main',
    '/vehicles/add': {as: 'addVehicle', to:'addEditVehicle', and: function() {
        SessionHelper.setEditVehicle(null);
        SessionHelper.setSelectedBrand(null);
        SessionHelper.setAddEditVehicleError(null);
        SessionHelper.setOperation(Operations.AddVehicle);
        Helpers.initializeMenu();
    }},
    '/vehicles/edit/:vehicleId': {as: 'editVehicle', to: function(vehicleId) {
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            return 'main';
        }
        SessionHelper.setEditVehicle(vehicle);
        SessionHelper.setSelectedBrand(vehicle.brand_id);
        SessionHelper.setAddEditVehicleError(null);
        SessionHelper.setOperation(Operations.EditVehicle);
        Helpers.initializeMenu();
        return 'addEditVehicle';
    }},
    '/vehicles/logs/add/:vehicleId': {as: 'logVehicle', to: function(vehicleId) {
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            return 'main';
        }
        SessionHelper.setLogVehicleError(null);
        SessionHelper.setEditVehicle(vehicle);
        SessionHelper.setOperation(Operations.LogVehicle);
        Helpers.initializeMenu();
        return 'logVehicle'
    }},
    '/vehicles/logs/:vehicleId': {as: 'listLogs', to: function(vehicleId) {
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            return 'main';
        }
        SessionHelper.setEditVehicle(vehicle);
        SessionHelper.setOperation(Operations.listLog);
        Helpers.initializeMenu();
        return 'listLog';
    }},
    '/vehicles': {as: 'listVehicles', to: 'listVehicles', and: function() {
        SessionHelper.setOperation(Operations.ListVehicles);
    }},
    '/drivers/add': {as: 'addDriver', to: 'addEditDriver', and: function() {
        SessionHelper.setEditDriver(null);
        SessionHelper.setAddEditDriverError(null);
        SessionHelper.setOperation(Operations.AddDriver);
        Helpers.initializeMenu();
    }},
    '/drivers/edit/:driverId': {as: 'editDriver', to: function(driverId){
        var driver = Drivers.findOne({_id: driverId});
        if(!driver) {
            return 'main';
        }
        SessionHelper.setEditDriver(driver);
        SessionHelper.setAddEditDriverError(null);
        SessionHelper.setOperation(Operations.EditDriver);
        Helpers.initializeMenu();
        return 'addEditDriver';
    }},
    '/drivers': {as: 'listDrivers', to: 'listDrivers', and: function() {
        SessionHelper.setOperation(Operations.ListDrivers);
        Helpers.initializeMenu();
    } }
});


Meteor.Router.filters({
    requireLogin: function(page) {
        return Meteor.userId() ? page: 'main';
    },
    requireAdmin: function(page) {
        return Helpers.isCurrentUserAdminUser()? page : "main";
    }
});

Meteor.Router.filter('requireLogin', {except: 'main'});
Meteor.Router.filter('requireAdmin', {only: ['addEditVehicle', 'listLogs', 'addEditDriver', 'listDrivers']});