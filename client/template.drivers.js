Template.addEditDriver.rendered = function() {
    Helpers.toDatePicker($(".licenseValidTill"));
};

Template.addEditDriver.error = function() {
    return SessionHelper.getAddEditDriverError();
};

Template.addEditDriver.driver = function() {
    return SessionHelper.getEditDriver();
};

Template.addEditDriver.vehicles = function() {
    return Vehicles.find();
};

Template.addEditDriver.users = function() {
    return Helpers.toUsersMap();
};

Template.addEditDriver.isVehicleSelected = function() {
    var editDriver = Template.addEditDriver.driver();
    return  editDriver && this._id === editDriver.vehicle_id? "selected='selected'" : "";
};

Template.addEditDriver.isUserSelected = function() {
    var editDriver = Template.addEditDriver.driver();
    return  editDriver && this._id === editDriver.user_id? "selected='selected'" : "";
};

Template.addEditDriver.events({
    'click .save': function(event, template) {
        var driver = {};
        driver._id = template.find("._id").value;
        driver.name = template.find(".name").value;
        driver.panNumber = template.find(".panNumber").value;
        driver.license = {
            number:  template.find(".licenseNumber").value,
            validTill:  template.find(".licenseValidTill").value
        };
        driver.user_id = template.find(".user_id").value;
        driver.vehicle_id = template.find(".vehicle_id").value;
        driver.comments = template.find(".comments").value;

        if(driver.name.length
            && driver.user_id.length
            && driver.panNumber.length
            && driver.license.number.length
            && driver.license.validTill.length
            && driver.vehicle_id.length) {
            Meteor.call('saveDriver', driver, function(error, driver) {
                if(!error) {
                    Meteor.Router.to("listDrivers");
                    return;
                }
                SessionHelper.setAddEditDriverError(error.message);
            });
            return;
        }
        SessionHelper.setAddEditDriverError("Please fill in all the required (*) fields");
    },
    'change .input_field': function(event, template) {
        SessionHelper.setAddEditDriverError(null);
    }
});

Template.listDrivers.hasDrivers = function() {
    return Drivers.find().count() > 0;
};

Template.listDrivers.drivers = function() {
    return Drivers.find().fetch();
};

Template.listDrivers.events({
    'click .entity': function(event, template) {
        Meteor.Router.to("editDriver", this._id);
    }
});

Template.driver.user_name = function() {
    return Helpers.getUserEmail(Meteor.users.findOne({_id: this.user_id}));
};

Template.driver.vehicle_name = function() {
    return Vehicles.findOne({_id: this.vehicle_id}).regNumber;
};