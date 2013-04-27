/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */
allMenuItems = {};

SessionHelper = {
    getEditVehicle: function() {
        return Session.get(Constants.Vehicle.Edit);
    },

    setEditVehicle: function(vehicle) {
        Session.set(Constants.Vehicle.Edit, vehicle);
    },

    getEditDriver: function() {
        return Session.get(Constants.Driver.Edit);
    },

    setEditDriver: function(vehicle) {
        Session.set(Constants.Driver.Edit, vehicle);
    },

    getSelectedBrand: function() {
        return Session.get(Constants.Vehicle.SelectedBrand);
    },

    setSelectedBrand: function(brand_id) {
        Session.set(Constants.Vehicle.SelectedBrand, brand_id);
    },

    getAddEditVehicleError: function() {
        return Session.get(Constants.Error.AddEditVehicleError);
    },

    setAddEditVehicleError: function(error) {
        Session.set(Constants.Error.AddEditVehicleError, error);
    },

    getAddEditDriverError: function() {
        return Session.get(Constants.Error.AddEditDriverError);
    },

    setAddEditDriverError: function(error) {
        Session.set(Constants.Error.AddEditDriverError, error);
    },

    getLogVehicleError: function() {
        return Session.get(Constants.Error.LogVehicleError);
    },

    setLogVehicleError: function(error) {
        Session.set(Constants.Error.LogVehicleError, error);
    },

    isOperationMatching: function(operation) {
        return Session.equals(Constants.Operation, operation.name);
    },

    isSelectedItem: function(item) {
        return Session.equals(Constants.ParentOperation, item.operation.parent);
    },

    setOperation: function(operation) {
        Session.set(Constants.Operation, operation.name);
        Session.set(Constants.ParentOperation, operation.parent);
    }
};

Helpers = {
    createMenuItem: function(url, text, cssClass, operation, subMenus) {
        return {
            url: url,
            text: text,
            cssClass: cssClass,
            operation: operation,
            subMenus: subMenus || [],
            hasSubMenus: subMenus && subMenus.length > 0
        }
    },
    initializeAllMenuItems: function() {
        allMenuItems.home = this.createMenuItem("/", "Home", "home", Operations.Home);
        allMenuItems.addVehicle = this.createMenuItem("/vehicles/add", "Add Vehicle", "addVehicle", Operations.AddVehicle);
        allMenuItems.listVehicles = this.createMenuItem("/vehicles", "List Vehicles", "listVehicle", Operations.ListVehicles);
        allMenuItems.vehicles = this.createMenuItem("/vehicles", "Vehicle", "vehicle", Operations.Vehicle, [
            allMenuItems.listVehicles,
            allMenuItems.addVehicle
        ]);

        allMenuItems.addDriver = this.createMenuItem("/drivers/add", "Add Driver", "addDriver", Operations.AddDriver);
        allMenuItems.listDrivers = this.createMenuItem("/drivers", "List Drivers", "listDriver", Operations.ListDrivers);
        allMenuItems.drivers = this.createMenuItem("/drivers", "Driver", "driver", Operations.Driver, [
            allMenuItems.listDrivers,
            allMenuItems.addDriver
        ])
        allMenuItems.editVehicle = this.createMenuItem("/vehicles/edit/", "Edit Vehicle", "editVehicle", Operations.EditVehicle);
        allMenuItems.logVehicle = this.createMenuItem("/vehicles/logs/add/", "Log Vehicle", "logVehicle", Operations.LogVehicle);
        allMenuItems.viewLogVehicle = this.createMenuItem("/vehicles/logs/", "View Log", "viewLogVehicle", Operations.ViewLogVehicle);
        allMenuItems.editDriver = this.createMenuItem("/drivers/edit/", "Edit Driver", "editDriver", Operations.EditDriver);
    },

    isUserLoggedIn: function() {
        return Meteor.user() != null;
    },

    isCurrentUserAdminUser: function() {
        return this.isAdminUser(Meteor.user());
    },

    isAdminUser: function(user) {
        return  this.getUserEmail(user) === Constants.AdminUserEmail;
    },

    getUserEmail: function(user) {
        return user && user.emails && user.emails.length > 0 ? user.emails[0].address : "";
    },

    initializeMenu: function() {
        setTimeout(function() {
            ddsmoothmenu.init({
                mainmenuid: "templatemo_menu", //menu DIV id
                orientation: 'h', //Horizontal or vertical menu: Set to "h" or "v"
                classname: 'ddsmoothmenu', //class added to menu's outer DIV
                //customtheme: ["#1c5a80", "#18374a"],
                contentsource: "markup" //"markup" or ["container_id", "path_to_menu_file"]
            })
        }, 1000);
    },

    isOperationMatching: function(operation) {
        return SessionHelper.isOperationMatching(operation);
    },

    addAdminMenuItems: function(items) {
        items.push(allMenuItems.vehicles);
        items.push(allMenuItems.drivers);
    },

    addOtherMenuItems: function(items) {
        var normalUserMenuItems = _.clone(allMenuItems.vehicles);
        normalUserMenuItems.subMenus.splice(0, 2);
        items.push(normalUserMenuItems)
    },

    isSelectedItem: function(item) {
        return SessionHelper.isSelectedItem(item);
    },

    toUsersMap: function() {
        var users = [];
        _.each(Meteor.users.find().fetch(), function(user) {
            if(!Helpers.isAdminUser(user))
                users.push({_id: user._id, email: Helpers.getUserEmail(user)});
        });
        return users;
    },

    toDatePicker: function(elements) {
        elements.datepicker({
            changeMonth: true,
            changeYear: true
        });
        var _this = this;
        _.each(elements, function(element) {
            _this.formatDate(element);
        });
    },

    formatDate: function(element) {
        var currentDate = $(element).val();
        if(!currentDate) return;

        $(element).val(this.formatDateValue(new Date(currentDate)));
    },

    formatDateValue: function(date) {
        return date.format(Constants.Application.DefaultDateFormat);
    }
};
