var Operations = {
    Home: {name: "home", parent: "home" },
    Vehicle: {name: "vehicle", parent: "vehicle" },
    Driver: {name: "driver", parent: "driver" },

    AddVehicle: {name: "addVehicle", parent: "vehicle" },
    EditVehicle: {name: "editVehicle", parent: "vehicle" },
    ListVehicles: {name: "listVehicles", parent: "vehicle" },
    AddDriver: {name: "addDriver", parent: "driver" },
    EditDriver: {name: "editDriver", parent: "driver" },
    ListDrivers: {name: "listDrivers", parent: "driver" }
};

var Constants = {
    Operation: "operation",
    ParentOperation: "parentOperation",
    Error: {
        AddVehicleError: "addVehicleError",
        EditVehicleError: "editVehicleError"
    },
    EditVehicle: "editVehicle"
};

Meteor.subscribe("vehicles");
var allMenuItems = {};

var CreateMenuItem = function(url, text, cssClass, operation, subMenus) {
    return {
        url: url,
        text: text,
        cssClass: cssClass,
        operation: operation,
        subMenus: subMenus || [],
        hasSubMenus: subMenus && subMenus.length > 0
    }
};

var initializeAllMenuItems = function() {
    allMenuItems.home = CreateMenuItem("/", "Home", "home", Operations.Home);
    allMenuItems.addVehicle = CreateMenuItem("/vehicles/add", "Add Vehicle", "addVehicle", Operations.AddVehicle);
    allMenuItems.listVehicles = CreateMenuItem("/vehicles", "List Vehicles", "listVehicle", Operations.ListVehicles);
    allMenuItems.vehicles = CreateMenuItem("/vehicles", "Vehicle", "vehicle", Operations.Vehicle, [
        allMenuItems.addVehicle,
        allMenuItems.listVehicles
    ]);

    allMenuItems.addDriver = CreateMenuItem("/drivers/add", "Add Driver", "addDriver", Operations.AddDriver);
    allMenuItems.listDrivers = CreateMenuItem("/drivers", "List Drivers", "listDriver", Operations.ListDrivers);
    allMenuItems.drivers = CreateMenuItem("/drivers", "Driver", "driver", Operations.Driver, [
        allMenuItems.addDriver, allMenuItems.listDrivers
    ])
    allMenuItems.editVehicle = CreateMenuItem("/vehicles/edit/", "Edit Vehicle", "editVehicle", Operations.EditVehicle);
    allMenuItems.editDriver = CreateMenuItem("/drivers/edit/", "Edit Driver", "editDriver", Operations.EditDriver);
};

initializeAllMenuItems();

var isAdminUser = function() {
    var user = Meteor.user();
    return user && user.emails && user.emails.length > 0 && user.emails[0].address === "admin@rentadriver.com";
};

var initializeMenu = function() {
    setTimeout(function() {
        ddsmoothmenu.init({
        mainmenuid: "templatemo_menu", //menu DIV id
        orientation: 'h', //Horizontal or vertical menu: Set to "h" or "v"
        classname: 'ddsmoothmenu', //class added to menu's outer DIV
        //customtheme: ["#1c5a80", "#18374a"],
        contentsource: "markup" //"markup" or ["container_id", "path_to_menu_file"]
        })
    }, 1000);
};


var isOperationMatching = function(operation) {
    return Session.equals(Constants.Operation, operation.name);
};

var addAdminMenuItems = function(items) {
    items.push(allMenuItems.vehicles);
    items.push(allMenuItems.drivers);
};

var isSelectedItem = function(item) {
    return Session.equals(Constants.ParentOperation, item.operation.parent);
}

Template.content.isAdmin = function () {
    return isAdminUser();
};

Template.content.isAddVehicle = function() {
    return isOperationMatching(Operations.AddVehicle);
};

Template.content.isEditVehicle = function() {
    return isOperationMatching(Operations.EditVehicle);
};

Template.content.isListVehicles = function() {
    return isOperationMatching(Operations.ListVehicles);
};

Template.content.isAddDriver = function() {
    return isOperationMatching(Operations.AddDriver);
};

Template.content.isEditDriver = function() {
    return isOperationMatching(Operations.EditDriver);
};

Template.content.isListDrivers = function() {
    return isOperationMatching(Operations.ListDrivers);
};

Template.header.isAdmin = function () {
    return isAdminUser();
};

Template.header.menuItems = function() {
    var items = [];
    items.push(allMenuItems.home);
    if(isAdminUser()) {
        addAdminMenuItems(items);
    }

    _.each(items, function(item) {
       item.selected = isSelectedItem(item) ? "selected" : "";
    });

    return items;
};

Template.menu_item.events({
    'click a': function(event, template) {
        app.navigateTo(this);
        event.preventDefault();
    }
})

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
                    app.navigateTo(allMenuItems.home);
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
        vehicle.brand = template.find(".brand").value;
        vehicle.model = template.find(".model").value;
        vehicle.regNumber = template.find(".regNumber").value;
        vehicle.comments = template.find(".comments").value;

        if(vehicle.brand.length && vehicle.model.length && vehicle.regNumber.length) {
            Meteor.call('editVehicle', vehicle, function(error, vehicle) {
                if(!error) {
                    app.navigateTo(allMenuItems.editVehicles);
                    Session.set(Constants.Error.AddVehicleError, null);
                }
            });
        } else {
            Session.set(Constants.Error.AddVehicleError, "Please fill in all the required (*) fields");
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

var Router = Backbone.Router.extend({
    routes: {
        "":                                     "main",
        "vehicles/add":                          "addVehicle",
        "vehicles/edit/:vehicleId":              "editVehicle",
        "vehicles":                              "listVehicle",
        "drivers/add":                           "addDriver",
        "drivers/edit/:driverId":                "editDriver",
        "drivers":                               "listDriver"
    },

    main: function() {
        this.updateSessionVariables(Operations.Home);
    },

    addVehicle: function() {
        this.updateSessionVariables(Operations.AddVehicle);
    },

    editVehicle: function(vehicleId) {
        var vehicle = Vehicles.findOne({_id: vehicleId});
        if(!vehicle) {
            this.navigateTo(allMenuItems.listVehicles);
            return;
        }
        this.updateSessionVariables(Operations.EditVehicle);
        Session.set(Constants.EditVehicle, vehicle);
    },

    listVehicle: function() {
        this.updateSessionVariables(Operations.ListVehicles);
    },

    addDriver: function() {
        this.updateSessionVariables(Operations.AddDriver);
    },

    editDriver: function(driverId) {
        this.updateSessionVariables(Operations.EditDriver);
    },

    listDriver: function() {
        this.updateSessionVariables(Operations.ListDrivers);
    },

    navigateTo: function(menuItem, identifier) {
        if(!menuItem) {
            this.navigate("/", true);
            return;
        }
        var appendUrl = identifier? identifier : "";
        this.navigate(menuItem.url + appendUrl, true);
    },

    updateSessionVariables: function(operation) {
        Session.set(Constants.Operation, operation.name);
        Session.set(Constants.ParentOperation, operation.parent);
        initializeMenu();
    }
});

var app = new Router;
Meteor.startup(function () {
    Backbone.history.start({pushState: true});
});
