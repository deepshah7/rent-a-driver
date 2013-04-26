/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
Template.content.isAdmin = function () {
    return Helpers.isCurrentUserAdminUser();
};

Template.content.isAddVehicle = function() {
    return Helpers.isOperationMatching(Operations.AddVehicle);
};

Template.content.isEditVehicle = function() {
    return Helpers.isOperationMatching(Operations.EditVehicle);
};

Template.content.isListVehicles = function() {
    return Helpers.isOperationMatching(Operations.ListVehicles);
};

Template.content.isAddDriver = function() {
    return Helpers.isOperationMatching(Operations.AddDriver);
};

Template.content.isEditDriver = function() {
    return Helpers.isOperationMatching(Operations.EditDriver);
};

Template.content.isListDrivers = function() {
    return Helpers.isOperationMatching(Operations.ListDrivers);
};

