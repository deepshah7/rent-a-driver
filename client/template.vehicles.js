Template.addEditVehicle.error = function() {
    return Session.get(Constants.Error.AddEditVehicleError);
};

Template.addEditVehicle.vehicle = function() {
    return Session.get(Constants.EditVehicle);
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
    'click .entity': function(event, template) {
        app.navigateTo(allMenuItems.editVehicle, this._id);
        Session.set(Constants.EditVehicle, this);
    }
});

Template.vehicle.brand_name = function() {
    return Brands.findOne({_id: this.brand_id}).name;
};

Template.vehicle.model_name = function() {
    return Models.findOne({_id: this.model_id}).name;
};
