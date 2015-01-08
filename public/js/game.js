$(document).ready(function() {

  var socket = io.connect('/');
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var width = document.body.clientWidth;
  var height = document.body.clientHeight;
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
  // var canvas = createCanvas.canvas;
  // var ctx = createCanvas.ctx;
  var ship = new Ship(width/2, height/2, 20, canvas, ctx, socket);
  var missile = new Missile(canvas, ctx, socket);
  var otherShips = {};

  var render = function() {
    // check keys
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
      missile.setAttributes(ship.px, ship.py, ship.angle);
      missile.isFired = true;
    }
   // missile.isFired = (keys[32]);
    
    ctx.clearRect(0, 0, width, height);
    ship.update();
    ship.render();
    missile.update();
    requestAnimationFrame(render);
  }

  render();

  // socket.on('existing ship', function(shipData) {
  //   otherShips[shipData.id] = new Ship();
  //   otherShips[shipData.id].id = shipData.id;
  //   otherShips[shipData.id].x = shipData.x;
  //   otherShips[shipData.id].y = shipData.y;
  // });

  // socket.on('new ship', function(shipData) {
  //   otherShips[shipData.id] = new Ship();
  //   otherShips[shipData.id].id = shipData.id;
  //   otherShips[shipData.id].x = shipData.x;
  //   otherShips[shipData.id].y = shipData.y;
  // });

  // socket.on('move ship', function(shipData) {
  //   otherShips[shipData.id].x = shipData.x;
  //   otherShips[shipData.id].y = shipData.y;
  // });

  // socket.on('delete ship', function(shipData) {
  //   delete otherShips[shipData.id];
  // })

  // socket.emit('start', {x: ship.x, y: ship.y});

});