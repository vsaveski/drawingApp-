'use strict';

Meteor.shared = {
    drawItem:          drawItem,
    getDrawingMachine: getDrawingMachine
};

function getDrawingMachine(canvas) {
    var context = canvas.getContext('2d');
    resizeCanvas(canvas);

    window.addEventListener('resize', function monitorResizing() {
        resizeCanvas(canvas);
        Session.set('windowResized', new Date());

        if (!Session.get('pristine')) {
            Session.set('pristine', true);
        }
    }, false);

    function clear() {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBackground(context, canvas.width, canvas.height);
    }

    function draw(data) {
        drawBackground(context, canvas.width, canvas.height);
        data.forEach(function loop(item) {
            drawItem(context, item);
        });
    }

    function setBg() {
        drawBackground(context, canvas.width, canvas.height);
    }

    function save() {
        return canvas.toDataURL();
    }

    return {
        clear: clear,
        draw:  draw,
        setBg: setBg,
        save:  save
    };
}

function resizeCanvas(canvas) {
    var gutters = 45;
    var panel = document.querySelector('#wrapper-panel');
    var controlPanel = document.querySelector('#control-panel');
    var w = panel.clientWidth - controlPanel.clientWidth - gutters;
    if (document.body.clientWidth < 768) w = panel.clientWidth - gutters;
    var h = controlPanel.clientHeight + 20;

    canvas.width = w;
    canvas.height = h;
}

function drawBackground(context, width, height) {
    context.save();

    context.fillStyle = Session.get('currentBg');
    context.fillRect(0, 0, width, height);

    context.restore();
}

// function drawPath(context, points, color, width) {
//     context.beginPath();
//     context.strokeStyle = color;
//     context.lineWidth = width;

//     var startX = points[0].x;
//     var startY = points[0].y;
//     context.moveTo(startX, startY);
//     points.forEach(function loop(point) {
//         var x = point.x;
//         var y = point.y;
//         context.lineTo(x, y);
//         context.stroke();
//     });
// }

function drawSquare(context, points, color, width) {
    var w = width * 10;
    var h = width * 10;

    points.forEach(function loopPoints(point) {
        var x = point.x - w / 2;
        var y = point.y - h / 2;
        context.fillStyle = color;
        context.fillRect(x, y, w, h);
    });
}

function drawCircle(context, points, color, width) {
    context.fillStyle = color;
    var radius = width * 5;

    points.forEach(function loopPoints(point) {
        var x = point.x;
        var y = point.y;

        context.beginPath();
        context.arc(x, y, radius, 0, 2 * Math.PI, false);
        context.fill();
    });
}

function drawTriangle(context, points, color, width) {
    context.fillStyle = color;
    var radius = width * 5;

    points.forEach(function loopPoints(point) {
        var x = point.x;
        var y = point.y;

        context.beginPath();
        context.moveTo(x, y + radius);
        context.lineTo(x - radius, y - radius);
        context.lineTo(x + radius, y - radius);
        context.fill();
    });
}

function drawItem(context, item) {
    if (item.points.length === 0) return;
    context.save();
    context.globalAlpha = item.opacity;

    switch (item.type) {
        // case 'path':
        //     drawPath(context, item.points, item.color, item.width);
        // break;
        case 'circle':
            drawCircle(context, item.points, item.color, item.width);
        break;
        case 'square':
            drawSquare(context, item.points, item.color, item.width);
        break;
        case 'triangle':
            drawTriangle(context, item.points, item.color, item.width);
        break;
        default:
    }
    context.restore();
}
