Template.addEditDriver.error = function() {
    return Session.get(Constants.Error.AddEditDriverError);
};

Template.addEditDriver.driver = function() {
    return Session.get(Constants.EditDriver);
};

Template.addEditDriver.vehicles = function() {
    return Vehicles.find();
};

Template.addEditDriver.users = function() {
    var users = [];
    _.each(Meteor.users.find().fetch(), function(user) {
        if(!Helpers.isAdminUser(user))
            users.push({_id: user._id, email: user.emails[0].address});
    });
    return users;
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
                    app.navigateTo(allMenuItems.listDrivers);
                    return;
                }
                Session.set(Constants.Error.AddEditDriverError, error.message);
            });
            return;
        }
        Session.set(Constants.Error.AddEditDriverError, "Please fill in all the required (*) fields");
    },
    'change .input_field': function(event, template) {
        Session.set(Constants.Error.AddEditDriverError, null);
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
        app.navigateTo(allMenuItems.editDriver, this._id);
        Session.set(Constants.EditDriver, this);
    }
});

Template.driver.vehicle_name = function() {
    return Vehicles.findOne({_id: this.vehicle_id}).regNumber;
};