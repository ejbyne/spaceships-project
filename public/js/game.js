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
var otherMissiles = {};
var alive = true;
var playerId = false;

socket.emit('start', {x: ship.x, y: ship.y});

socket.on('socket id', function(socketId) {
  playerId = socketId.id;
})

socket.on('add ship', function(shipData) {
  otherShips[shipData.id] = new Ship();
  otherShips[shipData.id].x = shipData.x;
  otherShips[shipData.id].y = shipData.y;
  otherMissiles[shipData.id] = new Missile();
});

socket.on('delete ship', function(shipData) {
  if (otherShips[shipData.id]) {
    delete otherShips[shipData.id];
  }
  if (shipData.id == playerId) {
    alive = false;
  }
});

socket.on('delete missile', function(missileData) {
  if (otherMissiles[missileData.id]) {
    delete otherMissiles[missileData.id];
  }
});

socket.on('move ship', function(shipData) {
  if (otherShips[shipData.id]) {
    otherShips[shipData.id].x = shipData.x;
    otherShips[shipData.id].y = shipData.y;
  }
});

socket.on('show missile', function(missileData) {
  otherMissiles[missileData.id].x = missileData.x;
  otherMissiles[missileData.id].y = missileData.y;
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

  if (alive) {
    ship.update();
    socket.emit('move ship', {x: ship.x, y: ship.y});
    ship.render();
  }

  if (Object.keys(otherShips).length != 0) {
    for (var key in otherShips) {
      otherShips[key].update();
      otherShips[key].render();

      if (collision(ship, otherShips[key])) {
        socket.emit('ship hit ship', {otherShip: key});
        alive = false;
      }
    }
  }

  missile.update();
  socket.emit('missile location', {x: missile.x, y: missile.y});

  if (Object.keys(otherMissiles).length != 0) {
    for (var key in otherMissiles) {
      otherMissiles[key].render();

      if (collision(ship, otherMissiles[key])) {
        socket.emit('missile hit ship', {winner: key});
        alive = false;
      }
    }
  }

  requestAnimationFrame(render);
}

function collision(entity1, entity2) {
    var distanceX = Math.abs(entity1.x - entity2.x);
    var distanceY = Math.abs(entity1.y - entity2.y);

    if (distanceX > entity1.radius + entity2.radius && distanceY > entity1.radius + entity2.radius) {
        return false;
    }
    if (distanceX <= entity1.radius + entity2.radius && distanceY <= entity1.radius + entity2.radius) {
        return true;
    }
};

render();



// });