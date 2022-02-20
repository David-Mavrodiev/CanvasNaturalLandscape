var requestAnimationFrame = window.requestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) { setTimeout (callback, 1000 / 30); };

var canvas = document.getElementById("canvas-id");
const size = screen.width > screen.height 
    ? screen.height
    : screen.width;

canvas.width = canvas.height = size;
var context = canvas.getContext("2d");

function getHillPoints(startX, i, initial = {hillSize: 450, baseHeight: 400, topHeight: 150}) {
    let hillSize = initial.hillSize / i;
    const left = {
        x: startX,
        y: initial.baseHeight,
    };

    const top = {
        x: left.x + (hillSize / 2),
        y: initial.topHeight + (i * 50),
    };

    const right = {
        x: top.x + (hillSize / 2),
        y: left.y,
    }

    return {
        left,
        top,
        right,
    }
}

function drawHill(context, startX = 0, initial = {hillSize: 450, baseHeight: 400, topHeight: 150}) {
    for (let i = 0; i < 5; i++) {
        let hillPoints = getHillPoints(startX, i, initial);
        while (hillPoints.left.x < size) {
            const left = hillPoints.left, right = hillPoints.right, top = hillPoints.top;

            context.beginPath();
            context.moveTo(left.x, left.y);
            context.lineTo(top.x, top.y);
            context.lineTo(right.x, right.y);
            context.fillStyle = `rgb(15, ${36 + (i * 20)}, 77)`;
            context.fill();

            context.beginPath();
            context.moveTo(top.x, top.y);
            context.lineTo(top.x - 25, top.y + 30);
            context.lineTo(top.x - 15, top.y + 60);
            
            context.lineTo(top.x + 15, top.y + 30);

            context.lineTo(top.x + 55, top.y + 55);
            
            context.lineTo(top.x, top.y);
            context.fillStyle = `rgba(288, 288, 288, 0.5)`;
            context.fill();

            hillPoints = getHillPoints(right.x, i, initial)
        }
    }
}

function drawTree(context, startX, startY, len, angle, branchWidth, color1, color2, glow) {
    context.beginPath();
    context.save();

    // Colors
    context.strokeStyle = color1;
    context.fillStyle = color2;
    context.shadowColor = "white";
    context.shadowBlur = glow;

    // Line width
    context.lineWidth = branchWidth;

    context.translate(startX, startY);
    context.rotate(angle * Math.PI / 180);
    context.moveTo(0, 0);
    context.lineTo(0, -len);
    context.stroke();

    if (len < 10) {
        context.beginPath();
        context.arc(0, -len, 10, 0, Math.PI / 2);
        context.fill();
        context.restore();
        return;
    }

    drawTree(context, 0, -len, len * 0.8, angle + 7, branchWidth * 0.7);
    drawTree(context, 0, -len, len * 0.8, angle - 7, branchWidth * 0.7);
    context.restore();
}

function drawPlanet(x, y, diameter, color) {
    if (diameter < 1) {
        return;
    }
 
    context.beginPath();
    context.arc(x, y, diameter, 0, 2 * Math.PI);
    context.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
    context.strokeStyle = `rgba(${color.r / 2}, ${color.g / 2}, ${color.b / 2}, 1)`;
    context.lineWidth = 10;

    context.stroke();
    context.fill();
}

function draw(context) {
    context.clearRect(0, 0, canvas.width, canvas.height);      
    context.globalAlpha = 1;
    context.fillStyle = "skyblue";
    context.fillRect(0, 0, size, 500);

    drawPlanet(size / 2, 400, 150, {r: 255, g: 204, b: 0});

    drawHill(context, 0, {hillSize: 450, baseHeight: 500, topHeight: 250})

    context.fillStyle = "#12488a";
    context.fillRect(0, 500, size, size - 500);

    context.save();
    context.globalAlpha = 0.2;
    context.translate(size / 2 + 500, size / 2 + 570);
    context.rotate(180 * Math.PI / 180);
    drawHill(context, 0, {hillSize: 450, baseHeight: 500, topHeight: 250})
    context.restore();

    context.fillStyle = "green";
    context.fillRect(0, 730, size, size - 730);

    drawTree(context, size / 1.5, size - 65, 40, 0, 15,`rgb(38, 32, 0)`, `red`, 5);
    drawTree(context, 800, size - 70, 80, 0, 15,`rgb(38, 32, 0)`, `white`, 5);

    drawTree(context, 250, size - 35, 45, 0, 15, `rgb(38, 32, 0)`, `yellow`, 5);
    drawTree(context, 90, size - 45, 90, 0, 15, `rgb(38, 32, 0)`, `purple`, 5);
    
    drawTree(context, size / 2, size, 100, 0, 15, `rgb(38, 32, 0)`, `orange`, 5);
}

draw(context);