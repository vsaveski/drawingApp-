/* global Points */
'use strict';

var getDrawingMachine = Meteor.shared.getDrawingMachine;

Template.wall.events({
    'click .sync-btn': function sync() {
        Session.set('pristine', true);
    },

    'change .opacity-btn': function changeOpacity(e) {
        var opacity = Number(e.currentTarget.value);
        Session.set('currentOpacity', opacity);
    },

    'click .clear': function clear() {
        var drawingMachine = Template.instance().drawingMachine;
        Meteor.call('clearCanvas', function clear() {
            drawingMachine.clear();
        });
    },

    'click .save-btn': function saveSvg() {
        var drawingMachine = Template.instance().drawingMachine;
        var imageData = drawingMachine.save();
        if (!imageData) return;

        Session.set('image', imageData);
        $('#saveModal').modal('toggle');
    },

    'click .thicker': function makeThicker() {
        var width = Session.get('currentWidth');
        Session.set('currentWidth', width + 1);
    },

    'click .thinner': function makeThinner() {
        var width = Session.get('currentWidth');
        if (width > 1) {
            Session.set('currentWidth', width - 1);
        }
    }
});

Template.wall.helpers({
    isPristine: function isPristine() {
        if (Session.get('pristine')) return 'disabled';
    },

    isSuccess: function isSuccess() {
        return Session.get('pristine');
    }
});


Template.wall.onRendered(function setInitialValues() {
    Session.setDefault('currentBrush', 'circle');
    Session.setDefault('currentColor', '#FF0000');
    Session.setDefault('currentWidth', 1);
    Session.setDefault('currentBg', '#FFFFFF');
    Session.setDefault('currentOpacity', 1);
    Session.setDefault('instructionsDone', false);
    Session.set('draw', false);
    Session.set('pathId', null);
    Session.set('pristine', true);

    var canvas = document.querySelector('#canvas');
    this.drawingMachine = getDrawingMachine(canvas);

    if (!Session.get('instructionsDone')) {
        $('#show-instructions').modal('toggle');
        Session.set('instructionsDone', true);
    }

    this.autorun(function runEveryTime() {
        var data = Points.find({}).fetch();
        Session.get('windowResized');

        if (this.drawingMachine && Session.get('pristine')) {
            this.drawingMachine.draw(data);
        }
    }.bind(this));
});

