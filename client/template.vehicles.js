Template.addEditVehicle.error = function() {
    return Session.get(Constants.Error.AddEditVehicleError);
};

Template.addEditVehicle.vehicle = function() {
    return Session.get(Constants.Vehicle.Edit);
};

Template.addEditVehicle.brands = function() {
    return Brands.find();
};

Template.addEditVehicle.models = function() {
    return Models.find({brand_id: Session.get(Constants.Vehicle.SelectedBrand)});
};

Template.addEditVehicle.isBrandSelected = function() {
    var editVehicle = Template.addEditVehicle.vehicle();
    return  editVehicle && this._id === editVehicle.brand_id? "selected='selected'" : "";
};

Template.addEditVehicle.isModelSelected = function() {
    var editVehicle = Template.addEditVehicle.vehicle();
    return  editVehicle && this._id === editVehicle.model_id? "selected='selected'" : "";
};

Template.addEditVehicle.events({
    'click .save': function(event, template) {
        var vehicle = {};
        vehicle._id = template.find("._id").value;
        vehicle.brand_id = template.find(".brand_id").value;
        vehicle.model_id = template.find(".model_id").value;
        vehicle.regNumber = template.find(".regNumber").value;
        vehicle.comments = template.find(".comments").value;

        if(vehicle.brand_id.length && vehicle.model_id.length && vehicle.regNumber.length) {
            Meteor.call('saveVehicle', vehicle, function(error, vehicle) {
                if(!error) {
                    app.navigateTo(allMenuItems.listVehicles);
                    return;
                }
                Session.set(Constants.Error.AddEditVehicleError, error.message);
            });
            return;
        }
        Session.set(Constants.Error.AddEditVehicleError, "Please fill in all the required (*) fields");
    },
    'change .input_field': function(event, template) {
        Session.set(Constants.Error.AddEditVehicleError, null);
    },
    'change .brand_id': function(event, template) {
        Session.set(Constants.Vehicle.SelectedBrand, template.find(".brand_id").value);
    }
});

Template.listVehicles.hasVehicles = function() {
    return Vehicles.find().count() > 0;
};

Template.listVehicles.vehicles = function() {
    return Vehicles.find().fetch();
};

Template.listVehicles.events({
    'click .editVehicle': function(event, template) {
        app.navigateTo(allMenuItems.editVehicle, this._id);
        Session.set(Constants.Vehicle.Edit, this);
    },
    'click .logVehicle': function(event, template) {
        app.navigateTo(allMenuItems.logVehicle, this._id);
        Session.set(Constants.Vehicle.Edit, this);
    }
});

Template.vehicle.brand_name = function() {
    return Brands.findOne({_id: this.brand_id}).name;
};

Template.vehicle.model_name = function() {
    return Models.findOne({_id: this.model_id}).name;
};

Template.vehicle.actionClassName = function() {
    if(Helpers.isCurrentUserAdminUser()) {
        return Constants.Vehicle.Edit;
    }
    return Constants.Vehicle.Log;
};

Template.vehicle.isAdmin = function() {
    return Helpers.isCurrentUserAdminUser();
};

Template.logVehicle.vehicle_id = function() {
  return Session.get(Constants.Vehicle.Edit)._id;
};

Template.logVehicle.user_id = function() {
  return Meteor.userId();
};

Template.logVehicle.user_email = function() {
  return Meteor.user()? Meteor.user().emails[0].address : "";
};

Template.logVehicle.isAdmin = function() {
    return Helpers.isCurrentUserAdminUser();
};

Template.logVehicle.users = function() {
    return Helpers.toUsersMap();
};

Template.logVehicle.error = function() {
    return Session.get(Constants.Error.LogVehicleError);

};

Template.logVehicle.events({
    'click .save': function(event, template) {
        var vehicle_log = {};
        vehicle_log.vehicle_id = template.find(".vehicle_id").value;
        vehicle_log.entered_by_user_id = Meteor.userId();
        vehicle_log.user_id = template.find(".user_id").value;
        vehicle_log.when = new Date(template.find(".when").value);
        vehicle_log.reading = template.find(".reading").value;
        vehicle_log.comments = template.find(".comments").value;

        if(vehicle_log.user_id.length && vehicle_log.when && vehicle_log.reading.length) {
            Meteor.call('saveVehicleLog', vehicle_log, function(error, vehicle_log) {
                if(!error) {
                    app.navigateTo(allMenuItems.listVehicles);
                    return;
                }
                Session.set(Constants.Error.LogVehicleError, error.message);
            });
            return;
        }
        Session.set(Constants.Error.LogVehicleError, "Please fill in all the required (*) fields");
    }
});