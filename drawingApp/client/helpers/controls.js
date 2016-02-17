'use strict';

Template.controls.helpers({
    getThickness: function getThickness() {
        var thickness = Session.get('currentWidth');
        if (thickness) return thickness;
    },

    getOpacity: function getOpacity() {
        return Session.get('currentOpacity');
    }
});
