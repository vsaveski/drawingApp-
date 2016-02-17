'use strict';

Template.brushes.helpers({
    isActive: function isActive(brush) {
        if (Session.get('currentBrush') === brush) return 'active';
        return false;
    }
});

Template.brushes.events({
    'click .brush-picker': function pickBrush(e) {
        var brush = e.target.querySelector('input').value;
        Session.set('currentBrush', brush);
    }
});
