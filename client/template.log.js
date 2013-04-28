/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 27/4/13
 * Time: 6:06 PM
 * To change this template use File | Settings | File Templates.
 */
Template.logVehicle.rendered = function() {
    Helpers.toDatePicker($(".when"));
};

Template.logVehicle.vehicle_id = function() {
    return SessionHelper.getEditVehicle()._id;
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
    return SessionHelper.getLogVehicleError();

};

Template.logVehicle.events({
    'click .save': function(event, template) {
        var vehicle_log = {};
        vehicle_log.vehicle_id = template.find(".vehicle_id").value;
        vehicle_log.entered_by_user_id = Meteor.userId();
        vehicle_log.user_id = template.find(".user_id").value;
        vehicle_log.when = template.find(".when").value;
        vehicle_log.reading = template.find(".reading").value;
        vehicle_log.comments = template.find(".comments").value;

        if(vehicle_log.user_id.length && vehicle_log.when && vehicle_log.reading.length) {
            Meteor.call('saveVehicleLog', vehicle_log, function(error, vehicle_log) {
                if(!error) {
                    Meteor.Router.to('listVehicles');
                    return;
                }
                SessionHelper.setLogVehicleError(error.message);
            });
            return;
        }
        SessionHelper.setLogVehicleError("Please fill in all the required (*) fields");
    }
});

Template.listLog.helpers({
    hasLogs: function() {
        return VehicleLogs.find({vehicle_id: SessionHelper.getEditVehicle()._id}).count() > 0;
    },

    logs: function() {
        return VehicleLogs.find({vehicle_id: SessionHelper.getEditVehicle()._id}, {sort: {when: -1}});
    }
});

Template.log.helpers({
    driver_name: function() {
        return Helpers.getUserEmail(Meteor.users.findOne({_id: this.user_id}));
    },
    when_date: function() {
        return Helpers.formatDateValue(this.when);
    }
});