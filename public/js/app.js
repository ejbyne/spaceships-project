$(document).ready(function() {

  var socket = io.connect('/');
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  var colours = ["#f6546a", "#1e90ff", "#f2d007", "#0000ff",
                 "#00c7cc", "#4584d3", "#dd40a7", "#804a2d",
                 "#48b427", "#7ab5ec", "#ff004c", "#8974bd",
                 "#ff40a7", "#488627"];
  var randomColour = colours[Math.floor(Math.random() * colours.length - 1)];
  var ship = new Ship(canvas, ctx, randomColour);
  var missile = new Missile(ctx, "#ff0000");
  var game = new Game(socket, ctx, ship, missile);
  
  var render = function() {
    game.movement();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    game.updatePlayerShipAndMissile();
    game.updateOtherShips();
    game.updateOtherMissiles();
    game.updateScore();
    requestAnimationFrame(render);
  }

  document.body.style.overflow = 'hidden';

  document.body.addEventListener("keydown", function(e) {
      game.keys[e.keyCode] = true;
  });

  document.body.addEventListener("keyup", function(e) {
      game.keys[e.keyCode] = false;
  });

  $('#waiting').fadeIn(3000);

  socket.emit('start', {x: ship.x, y: ship.y, radians: ship.radians, shipColour: ship.shipColour});

  socket.on('socket id', function(socketId) {
    game.playerId = socketId.id;
  })

  socket.on('add ship', function(shipData) {
    $('#waiting').hide();
    $('#logo').slideUp(2000).delay(1000, function(){
      render();
    }).fadeOut(3000);
    game.otherShips[shipData.id] = new Ship(canvas, ctx);
    game.otherShips[shipData.id].x = shipData.x;
    game.otherShips[shipData.id].y = shipData.y;
    game.otherShips[shipData.id].radians = shipData.radians;
    game.otherShips[shipData.id].shipColour = shipData.shipColour;
    game.otherMissiles[shipData.id] = new Missile(ctx);
  });

  socket.on('delete ship', function(shipData) {
    if (game.otherShips[shipData.id]) {
      delete game.otherShips[shipData.id];
    }
    if (shipData.id === game.playerId) {
      game.alive = false;
      $('#canvas').hide();
      $('#gameover').show();
    }
  });

  socket.on('delete missile', function(missileData) {
    if (game.otherMissiles[missileData.id]) {
      delete game.otherMissiles[missileData.id];
    }
  });

  socket.on('move ship', function(shipData) {
    if (game.otherShips[shipData.id]) {
      game.otherShips[shipData.id].x = shipData.x;
      game.otherShips[shipData.id].y = shipData.y;
      game.otherShips[shipData.id].radians = shipData.radians;
    }
  });

  socket.on('show missile', function(missileData) {
    if (game.otherMissiles[missileData.id]) {
      game.otherMissiles[missileData.id].x = missileData.x;
      game.otherMissiles[missileData.id].y = missileData.y;
    }
  });

});