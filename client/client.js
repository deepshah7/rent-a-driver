var Operations = {
    None: "none",
    AddVehicle: "addVehicle",
    ListVehicles: "listVehicles"
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
    items.push({url: "#", text: "Home", cssClass: "home", operation: Operations.None });
    if(isAdminUser()) {
        items.push({url: "#vehicles_add.html", text: "Add Vehicle", cssClass: "addVehicle", operation: Operations.AddVehicle });
        items.push({url: "#vehicles_list.html", text: "List Vehicles", cssClass: "listVehicles", operation: Operations.ListVehicles });
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
    Session.setDefault(Constants.Operation, Operations.None);
});

