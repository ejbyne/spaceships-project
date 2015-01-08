// $(document).ready(function() {

var socket = io.connect('/');

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
width = document.body.clientWidth;
height = document.body.clientHeight;
var keys = [];

canvas.width = width;
canvas.height = height;

document.body.style.overflow = 'hidden';

document.body.addEventListener("keydown", function(e) {
    keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e) {
    keys[e.keyCode] = false;
});

var colours = [
  "#f6546a",
  "#1e90ff",
  "#f2d007",
  "#0000ff",
  "#00c7cc",
  "#4584d3",
  "#dd40a7",
  "#804a2d",
  "#48b427",
  "#7ab5ec",
  "#ff004c",
  "#8974bd",
  "#ff40a7",
  "#488627"];
var randomColour = colours[Math.floor(Math.random() * colours.length - 1)];
var ship = new Ship(randomColour);
var missile = new Missile();
var otherShips = {};
var otherMissiles = {};
var alive = true;
var missileVisible = true;
var playerId = false;

socket.emit('start', {x: ship.x, y: ship.y});

socket.on('socket id', function(id) {
  playerId = id;
})

socket.on('new ship', function(shipData) {
  otherShips[shipData.id] = new Ship();
  otherShips[shipData.id].x = shipData.x;
  otherShips[shipData.id].y = shipData.y;
  otherMissiles[shipData.id] = new Missile();
});

socket.on('existing ship', function(shipData) {
  otherShips[shipData.id] = new Ship();
  otherShips[shipData.id].x = shipData.x;
  otherShips[shipData.id].y = shipData.y;
  otherMissiles[shipData.id] = new Missile();
});

socket.on('delete ship', function(shipData) {
  if (otherShips[shipData.id]) {
    delete otherShips[shipData.id];
  }
  if (shipData.id === playerId) {
    alive = false;
  }
});

socket.on('delete missile', function(missileData) {
  if (otherMissiles[missileData.id]) {
    delete otherMissiles[missileData.id];
  }
  if (missileData.id === playerId) {
    missileVisible = false;
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
    missile.setAttributes(ship.missileLaunchX, ship.missileLaunchY, ship.x, ship.y);
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

  if (missileVisible) {
    missile.update();
    socket.emit('missile location', {x: missile.x, y: missile.y});
  }

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