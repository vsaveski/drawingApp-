'use strict';

Template.save.helpers({
    imageToSave: function imageToSave() {
        return Session.get('image');
    }
});

Template.save.events({
    'click .export-btn': function closeModal() {
        $('#saveModal').modal('toggle');
    }
});
