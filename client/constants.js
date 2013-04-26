/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 1:30 PM
 * To change this template use File | Settings | File Templates.
 */
Operations = {
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


Constants = {
    AdminUserEmail: "admin@rentadriver.com",
    Operation: "operation",
    ParentOperation: "parentOperation",
    Error: {
        AddEditVehicleError: "addEditVehicleError",
        AddEditDriverError: "addEditDriverError"
    },
    EditVehicle: "editVehicle",
    Vehicle: {
        SelectedBrand: "selectedBrand"
    }
};

