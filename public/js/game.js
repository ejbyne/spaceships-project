// $(document).ready(function() {
$('#gameover').hide();

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
var missile = new Missile("#ff0000");
var otherShips = {};
var otherMissiles = {};
var alive = true;
var playerId = false;
var score = 0;

socket.emit('start', {x: ship.x, y: ship.y, radians: ship.radians, shipColour: ship.shipColour});

socket.on('socket id', function(socketId) {
  playerId = socketId.id;
})

socket.on('add ship', function(shipData) {
  $('#logo').slideUp(2000).delay(1000, function(){
    render();
  }).fadeOut(3000);

  otherShips[shipData.id] = new Ship();
  otherShips[shipData.id].x = shipData.x;
  otherShips[shipData.id].y = shipData.y;
  otherShips[shipData.id].radians = shipData.radians;
  otherShips[shipData.id].shipColour = shipData.shipColour;
  otherMissiles[shipData.id] = new Missile();
});

socket.on('delete ship', function(shipData) {
  if (otherShips[shipData.id]) {
    delete otherShips[shipData.id];
  }
  if (shipData.id === playerId) {
    alive = false;
    // socket.disconnect();
    $('#canvas').hide();
    $('#gameover').show();
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
    otherShips[shipData.id].radians = shipData.radians;
  }
});

socket.on('show missile', function(missileData) {
  if (otherMissiles[missileData.id]) {
    otherMissiles[missileData.id].x = missileData.x;
    otherMissiles[missileData.id].y = missileData.y;
  }
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
    socket.emit('move ship', {x: ship.x, y: ship.y, radians: ship.radians});
    ship.render();
    missile.update();
    socket.emit('missile location', {x: missile.x, y: missile.y});
  }

  if (Object.keys(otherShips).length != 0) {
    for (var key in otherShips) {
      otherShips[key].update();
      otherShips[key].render();

      if (collision(missile, otherShips[key])) {
        score += 1;
      }

      if (collision(ship, otherShips[key])) {
        alive = false;
        socket.emit('ship hit ship', {otherShip: key});
        delete otherShips[key];
      }
    }
  }

  if (Object.keys(otherMissiles).length != 0) {
    for (var key in otherMissiles) {
      otherMissiles[key].render();

      if (collision(ship, otherMissiles[key])) {
        alive = false;
        socket.emit('missile hit ship', {otherShip: key});
      }
    }
  }

  ctx.fillStyle = "#fff";
  ctx.font = "16px Helvetica";
  ctx.textAlign = "left";
  ctx.textBaseline = "top";
  ctx.fillText("Score: " + score, 32, 32);

  requestAnimationFrame(render);
}

function collision(entity1, entity2) {

    // var distanceX = Math.abs(entity1.x - entity2.x);
    // var distanceY = Math.abs(entity1.y - entity2.y);
    //
    // if (distanceX > entity1.radius + entity2.radius && distanceY > entity1.radius + entity2.radius) {
    //     return false;
    // }
    //
    // if (distanceX <= entity1.radius + entity2.radius && distanceY <= entity1.radius + entity2.radius) {
    //     return true;
    // }
    var dx = (entity1.x + entity1.radius) - (entity2.x + entity2.radius);
    var dy = (entity1.y + entity1.radius) - (entity2.y + entity2.radius);
    var distance = Math.sqrt(dx * dx + dy * dy);

    return distance < entity1.radius + entity2.radius ? true : false
};

  //render();

// });
