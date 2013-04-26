/**
 * Created with IntelliJ IDEA.
 * User: batman
 * Date: 25/4/13
 * Time: 2:57 PM
 * To change this template use File | Settings | File Templates.
 */
Template.header.isAdmin = function () {
    return isAdminUser();
};

Template.header.menuItems = function() {
    var items = [];
    items.push(allMenuItems.home);
    if(Helpers.isCurrentUserAdminUser()) {
        Helpers.addAdminMenuItems(items);
    }
    else if(Helpers.isUserLoggedIn()) {
        Helpers.addOtherMenuItems(items);
    }

    _.each(items, function(item) {
        item.selected = Helpers.isSelectedItem(item) ? "selected" : "";
    });

    return items;
};

Template.menu_item.events({
    'click a': function(event, template) {
        app.navigateTo(this);
        event.preventDefault();
    }
})

