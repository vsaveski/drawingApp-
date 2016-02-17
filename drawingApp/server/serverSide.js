/* global Points */
'use strict';

Meteor.methods({
    clearCanvas: clearCanvas,
    makePath:    makePath,
    updatePath:  updatePath
});

function clearCanvas() {
    return Points.remove({});
}

function makePath(brush, color, width, opacity) {
    var data = {
        type:    brush,
        color:   color,
        width:   width,
        opacity: opacity,
        points:  []
    };
    return Points.insert(data);
}

function updatePath(id, points) {
    return Points.update({_id: id}, {$set: {points: points}});
}
