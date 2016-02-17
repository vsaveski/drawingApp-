'use strict';

var drawItem = Meteor.shared.drawItem;

var points = [];
var drawContext;

Template.canvas.events({
    mousedown: function startDrawing(e) {
        e.preventDefault();

        startToDraw(e.pageX, e.pageY);
    },

    touchstart: function startDrawing(e) {
        e.preventDefault();

        var x = e.originalEvent.targetTouches[0].pageX;
        var y = e.originalEvent.targetTouches[0].pageY;
        startToDraw(x, y);
    },

    'mouseup, touchend': function stopDrawing(e) {
        e.preventDefault();

        Session.set('draw', false);
    },

    mousemove: function makeDrawing(e) {
        e.preventDefault();
        if (!Session.get('draw')) return;

        getAndDrawPoint(e.pageX, e.pageY);
    },

    touchmove: function makeDrawing(e) {
        e.preventDefault();
        if (!Session.get('draw')) return;

        var x = e.originalEvent.targetTouches[0].pageX;
        var y = e.originalEvent.targetTouches[0].pageY;
        getAndDrawPoint(x, y);
    }
});

Template.canvas.onRendered(function setInitialValues() {
    drawContext = document.querySelector('#canvas').getContext('2d');
});

function startToDraw(x, y) {
    // start drawing in real time
    Session.set('draw', true);
    Session.set('pristine', false);

    getAndDrawPoint(x, y);

    // send to the server
    startUpdatingServer();
}

function getAndDrawPoint(x, y) {
    var point = markPoint(x, y);
    points.push(point);

    // draw only the current point live
    var item = {
        type:    Session.get('currentBrush'),
        color:   Session.get('currentColor'),
        width:   Session.get('currentWidth'),
        opacity: Session.get('currentOpacity'),
        points:  [point]
    };
    drawItem(drawContext, item);
}

function markPoint(pageX, pageY) {
    var offset = $('#canvas').offset();

    var point = {
        x: pageX - offset.left,
        y: pageY - offset.top
    };
    return point;
}

function updateServer() {
    Meteor.call('updatePath', Session.get('pathId'), points);
}

function flushPoints() {
    if (Session.get('draw')) {
        setTimeout(flushPoints, 500);
        updateServer();
        return;
    }
    updateServer();
    Session.set('pathId', null);
    points.length = 0;
}

function startUpdatingServer() {
    var brush = Session.get('currentBrush');
    var color = Session.get('currentColor');
    var width = Session.get('currentWidth');
    var opacity = Session.get('currentOpacity');
    Meteor.call('makePath', brush, color, width, opacity, function response(err, id) {
        if (err) throw err;
        Session.set('pathId', id);
        setTimeout(flushPoints, 500);
    });
}
