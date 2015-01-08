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

var ship = new Ship(width/2, height/2, 20);
var missile = new Missile();

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
  ship.render();

  missile.update();