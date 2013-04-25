/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 2:58 PM
 * To change this template use File | Settings | File Templates.
 */
Template.addVehicle.error = function() {
    return Session.get(Constants.Error.AddVehicleError);
};

Template.addVehicle.events({
    'click .add': function(event, template) {
        var vehicle = {};
        vehicle.brand = template.find(".brand").value;
        vehicle.model = template.find(".model").value;
        vehicle.regNumber = template.find(".regNumber").value;
        vehicle.comments = template.find(".comments").value;

        if(vehicle.brand.length && vehicle.model.length && vehicle.regNumber.length) {
            Meteor.call('addVehicle', vehicle, function(error, vehicle) {
                if(!error) {
                    app.navigateTo(allMenuItems.listVehicles);
                    Session.set(Constants.Error.AddVehicleError, null);
                }
            });
        } else {
            Session.set(Constants.Error.AddVehicleError, "Please fill in all the required (*) fields");
        }
    },
    'change input': function(event, template) {
        Session.set(Constants.Error.AddVehicleError, null);
    }
});

Template.editVehicle.error = function() {
    return Session.get(Constants.Error.EditVehicleError);
};

Template.editVehicle.vehicle = function() {
    return Session.get(Constants.EditVehicle);
};

Template.editVehicle.events({
    'click .update': function(event, template) {
        var vehicle = {};
        vehicle._id = template.find("._id").value;
        vehicle.brand = template.find(".brand").value;
        vehicle.model = template.find(".model").value;
        vehicle.regNumber = template.find(".regNumber").value;
        vehicle.comments = template.find(".comments").value;

        if(vehicle.brand.length && vehicle.model.length && vehicle.regNumber.length) {
            Meteor.call('editVehicle', vehicle, function(error, vehicle) {
                if(!error) {
                    app.navigateTo(allMenuItems.listVehicles);
                    Session.set(Constants.Error.EditVehicleError, null);
                }
            });
        } else {
            Session.set(Constants.Error.EditVehicleError, "Please fill in all the required (*) fields");
        }
    },
    'change input': function(event, template) {
        Session.set(Constants.Error.EditVehicleError, null);
    }
});

Template.listVehicles.hasVehicles = function() {
    return Vehicles.find().count() > 0;
};

Template.listVehicles.vehicles = function() {
    return Vehicles.find().fetch();
};

Template.listVehicles.events({
    'click .vehicle-text': function(event, template) {
        app.navigateTo(allMenuItems.editVehicle, this._id);
        Session.set(Constants.EditVehicle, this);
    }
});

