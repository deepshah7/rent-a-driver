/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 2:55 PM
 * To change this template use File | Settings | File Templates.
 */
allMenuItems = {};
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
            allMenuItems.addVehicle,
            allMenuItems.listVehicles
        ]);

        allMenuItems.addDriver = this.createMenuItem("/drivers/add", "Add Driver", "addDriver", Operations.AddDriver);
        allMenuItems.listDrivers = this.createMenuItem("/drivers", "List Drivers", "listDriver", Operations.ListDrivers);
        allMenuItems.drivers = this.createMenuItem("/drivers", "Driver", "driver", Operations.Driver, [
            allMenuItems.addDriver, allMenuItems.listDrivers
        ])
        allMenuItems.editVehicle = this.createMenuItem("/vehicles/edit/", "Edit Vehicle", "editVehicle", Operations.EditVehicle);
        allMenuItems.editDriver = this.createMenuItem("/drivers/edit/", "Edit Driver", "editDriver", Operations.EditDriver);
    },

    isAdminUser: function() {
        var user = Meteor.user();
        return user && user.emails && user.emails.length > 0 && user.emails[0].address === "admin@rentadriver.com";
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
        return Session.equals(Constants.Operation, operation.name);
    },

    addAdminMenuItems: function(items) {
        items.push(allMenuItems.vehicles);
        items.push(allMenuItems.drivers);
    },

    isSelectedItem: function(item) {
        return Session.equals(Constants.ParentOperation, item.operation.parent);
    }
};
