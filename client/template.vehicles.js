Template.addEditVehicle.rendered = function() {
    Helpers.toDatePicker($(".policyFrom,.policyTo"));
};

Template.addEditVehicle.error = function() {
    return SessionHelper.getAddEditVehicleError();
};

Template.addEditVehicle.vehicle = function() {
    return SessionHelper.getEditVehicle();
};

Template.addEditVehicle.brands = function() {
    return Brands.find();
};

Template.addEditVehicle.models = function() {
    return Models.find({brand_id: SessionHelper.getSelectedBrand()});
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
        vehicle.policyNumber = template.find(".policyNumber").value;
        vehicle.policyFrom = template.find(".policyFrom").value;
        vehicle.policyTo = template.find(".policyTo").value;
        vehicle.comments = template.find(".comments").value;

        if(vehicle.brand_id.length
            && vehicle.model_id.length
            && vehicle.regNumber.length
            && vehicle.policyNumber.length
            && vehicle.policyFrom.length
            && vehicle.policyTo.length
            ) {
            Meteor.call('saveVehicle', vehicle, function(error, vehicle) {
                if(!error) {
                    app.navigateTo(allMenuItems.listVehicles);
                    return;
                }
                SessionHelper.setAddEditDriverError(error.message);
            });
            return;
        }
        SessionHelper.setAddEditVehicleError("Please fill in all the required (*) fields");
    },
    'change .input_field': function(event, template) {
        SessionHelper.setAddEditVehicleError(null);
    },
    'change .brand_id': function(event, template) {
        SessionHelper.setSelectedBrand(template.find(".brand_id").value);
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
        SessionHelper.setEditVehicle(this);
    },
    'click .logVehicle': function(event, template) {
        app.navigateTo(allMenuItems.logVehicle, this._id);
        SessionHelper.setEditVehicle(this);
    },
    'click .viewLogVehicle': function(event, template) {
        app.navigateTo(allMenuItems.viewLogVehicle, this._id);
        SessionHelper.setEditVehicle(this);
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
