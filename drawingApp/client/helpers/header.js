'use strict';

Template.header.helpers({
    isActive: function isActive(template) {
        var currentRoute = Router.current();
        if (!currentRoute) return false;
        return template === currentRoute.route.getName() ? 'active' : '';
    }
});
