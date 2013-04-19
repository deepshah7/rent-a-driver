var Operations = {
    Home: "home",
    Vehicle: "vehicle",
    Driver: "driver",

    AddVehicle: "addVehicle",
    ListVehicles: "listVehicles",
    AddDriver: "addDriver",
    ListDrivers: "listDrivers"
};

var Constants = {
    Operation: "operation",
    Error: {
        AddVehicleError: "addVehicleError"
    }
};

Meteor.subscribe("vehicles");

var isAdminUser = function() {
    var user = Meteor.user();
    return user && user.emails && user.emails.length > 0 && user.emails[0].address === "admin@rentadriver.com";
}

var CreateMenuItem = function(url, text, cssClass, operation, subMenus) {
    return {
        url: url,
        text: text,
        cssClass: cssClass,
        operation: operation,
        subMenus: subMenus || [],
        hasSubMenus: subMenus && subMenus.length > 0
    }
}

var addAdminMenuItems = function(items) {
    items.push(CreateMenuItem("#", "Vehicle", "vehicle", Operations.Vehicle, [
        CreateMenuItem("#vehicles_add.html", "Add Vehicle", "addVehicle", Operations.AddVehicle),
        CreateMenuItem("#vehicles_list.html", "List Vehicles", "listVehicle", Operations.ListVehicles)
    ]));
    items.push(CreateMenuItem("#", "Driver", "driver", Operations.Driver, [
        CreateMenuItem("#drivers_add.html", "Add Driver", "addDriver", Operations.AddDriver),
        CreateMenuItem("#drivers_list.html", "List Drivers", "listDriver", Operations.ListDriver)
    ]));
}

Template.content.isAdmin = function () {
    return isAdminUser();
};

Template.content.isAddVehicle = function() {
    return Session.equals(Constants.Operation, Operations.AddVehicle);
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
       item.selected = Session.equals(Constants.Operation, item.operation)? "selected" : "";
    });

    return items;
};

Template.menu_item.events({
    'click a': function(event, template) {
        Session.set(Constants.Operation, this.operation);
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

Meteor.startup(function () {
    Session.setDefault(Constants.Operation, Operations.Home);
});

