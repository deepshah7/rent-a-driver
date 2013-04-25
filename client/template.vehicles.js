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


Template.addEditVehicle.events({
    'click .save': function(event, template) {
        var vehicle = {};
        vehicle._id = template.find("._id").value;
        vehicle.brand = template.find(".brand").value;
        vehicle.model = template.find(".model").value;
        vehicle.regNumber = template.find(".regNumber").value;
        vehicle.comments = template.find(".comments").value;

        if(vehicle.brand.length && vehicle.model.length && vehicle.regNumber.length) {
            Meteor.call('saveVehicle', vehicle, function(error, vehicle) {
                if(!error) {
                    app.navigateTo(allMenuItems.listVehicles);
                    Session.set(Constants.Error.AddEditVehicleError, null);
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
    'change .brand': function(event, template) {
        Session.set(Constants.Vehicle.SelectedBrand, template.find(".brand").value);
        Deps.flush();
    }
});

Template.listVehicles.hasVehicles = function() {
    return Vehicles.find().count() > 0;
};

Template.listVehicles.vehicles = function() {
    return Vehicles.find().fetch();
};

Template.listVehicles.events({
    'click .vehicle': function(event, template) {
        app.navigateTo(allMenuItems.editVehicle, this._id);
        Session.set(Constants.EditVehicle, this);
    }
});

