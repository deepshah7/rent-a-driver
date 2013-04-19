var Operations = {
    Home: "home",
    Vehicle: "vehicle",
    Driver: "driver",

    AddVehicle: "addVehicle",
    EditVehicle: "editVehicle",
    ListVehicles: "listVehicles",
    AddDriver: "addDriver",
    ListDrivers: "listDrivers"
};

var Constants = {
    Operation: "operation",
    ParentOperation: "ParentOperation",
    Error: {
        AddVehicleError: "addVehicleError",
        EditVehicleError: "editVehicleError"
    },
    EditVehicle: "editVehicle"
};

Meteor.subscribe("vehicles");

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

var CreateMenuItem = function(url, text, cssClass, operation, parentOperation, subMenus) {
    return {
        url: url,
        text: text,
        cssClass: cssClass,
        operation: operation,
        parentOperation: parentOperation,
        subMenus: subMenus || [],
        hasSubMenus: subMenus && subMenus.length > 0
    }
};

var addAdminMenuItems = function(items) {
    items.push(CreateMenuItem("#", "Vehicle", "vehicle", Operations.Vehicle, null, [
        CreateMenuItem("#vehicles_add.html", "Add Vehicle", "addVehicle", Operations.AddVehicle, Operations.Vehicle),
        CreateMenuItem("#vehicles_list.html", "List Vehicles", "listVehicle", Operations.ListVehicles, Operations.Vehicle)
    ]));
    items.push(CreateMenuItem("#", "Driver", "driver", Operations.Driver, null, [
        CreateMenuItem("#drivers_add.html", "Add Driver", "addDriver", Operations.AddDriver, Operations.Driver),
        CreateMenuItem("#drivers_list.html", "List Drivers", "listDriver", Operations.ListDriver, Operations.Driver)
    ]));
};

var isSelectedItem = function(item) {
    return Session.equals(Constants.Operation, item.operation) || Session.equals(Constants.ParentOperation, item.operation);
}

Template.content.isAdmin = function () {
    return isAdminUser();
};

Template.content.isAddVehicle = function() {
    return Session.equals(Constants.Operation, Operations.AddVehicle);
};

Template.content.isEditVehicle = function() {
    return Session.equals(Constants.Operation, Operations.EditVehicle);
};

Template.content.isListVehicles = function() {
    return Session.equals(Constants.Operation, Operations.ListVehicles);
};

Template.header.isAdmin = function () {
    return isAdminUser();
};

Template.header.menuItems = function() {
    var items = [];
    items.push({url: "#", text: "Home", cssClass: "home", operation: Operations.Home });
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
        Session.set(Constants.Operation, this.operation);
        Session.set(Constants.ParentOperation, this.parentOperation);
        initializeMenu();
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
                    Session.set(Constants.Operation, Operations.ListVehicles);
                    Session.set(Constants.ParentOperation, Operations.Vehicles);
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
                    Session.set(Constants.Operation, Operations.ListVehicles);
                    Session.set(Constants.ParentOperation, Operations.Vehicles);
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
        Session.set(Constants.Operation, Operations.EditVehicle);
        Session.set(Constants.ParentOperation, Operations.Vehicles);
        Session.set(Constants.EditVehicle, this);

   }
});

Meteor.startup(function () {
    Session.setDefault(Constants.Operation, Operations.Home);
    initializeMenu();
});
