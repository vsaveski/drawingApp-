'use strict';

Template.colors.helpers({
    isActive: function isActive(color) {
        if (Session.get('currentColor') === color) {
            return 'active';
        }
    },

    getBg: function getBg() {
        return Session.get('currentBg');
    }
});

Template.colors.events({
    'click .color-btn': function pickColor(e) {
        var color = e.currentTarget.getAttribute('data-color');
        Session.set('currentColor', color);
    },

    'change .bg-button': function pickBackground(e) {
        var msg = 'Changes have to be synced before background is changed!';

        // warning if not synced
        if (!Session.get('pristine')) {
            window.alert(msg);
            Session.set('pristine', true);
        }

        Session.set('currentBg', e.target.value);
    }
});
