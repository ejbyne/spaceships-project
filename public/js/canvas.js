// $(document).ready(function() {

var socket = io.connect('/');

var canvas = document.getElementById("canvas"),
  ctx = canvas.getContext("2d"),
  width = document.body.clientWidth;
  height = document.body.clientHeight;
  keys = [];

canvas.width = width;
canvas.height = height;

document.body.style.overflow = 'hidden';

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

var ship = new Ship('#f00');
var missile = new Missile('#f00');
var otherShips = {}; 

socket.emit('start', {x: ship.x, y: ship.y, px: ship.px, py: ship.py});

socket.on('new ship', function(shipData) {
  otherShips[shipData.id] = new Ship();
  // otherShips[shipData.id].id = shipData.id;
  otherShips[shipData.id].x = shipData.x;
  otherShips[shipData.id].y = shipData.y;
  otherShips[shipData.id].px = shipData.px;
  otherShips[shipData.id].py = shipData.py;
  //otherShips[shipData.id].pointerColor = '#000';
});

socket.on('existing ship', function(shipData) {
  otherShips[shipData.id] = new Ship();
  // otherShips[shipData.id].id = shipData.id;
  otherShips[shipData.id].x = shipData.x;
  otherShips[shipData.id].y = shipData.y;
  otherShips[shipData.id].px = shipData.px;
  otherShips[shipData.id].py = shipData.py;
});

socket.on('delete ship', function(shipData) {
  delete otherShips[shipData.id];
});

socket.on('move ship', function(shipData) {
  otherShips[shipData.id].x = shipData.x;
  otherShips[shipData.id].y = shipData.y;
  otherShips[shipData.id].px = shipData.px;
  otherShips[shipData.id].py = shipData.py;
});

function render() {
  // up arrow
  ship.isThrusting = (keys[38]);
  
  if (keys[39]) {
    // right arrow
    ship.turn(1);
  }
  if (keys[37]) {
    // left arrow
    ship.turn(-1);
  }
  //space
  if (keys[32]) {
    missile.setAttributes(ship.px, ship.py, ship.x, ship.y);
    missile.isFired = true;
  }

  ctx.clearRect(0, 0, width, height);
  ship.update();
  socket.emit('move ship', {x: ship.x, y: ship.y, px: ship.px, py: ship.py});
  ship.render();
  if (Object.keys(otherShips).length != 0) {
    for (var key in otherShips) {
      otherShips[key].update();
      otherShips[key].render();
    }
  }

  missile.update();

  requestAnimationFrame(render);
}

render();



// });