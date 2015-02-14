$(document).ready(function() {

  var socket = io();
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;

  var shipColourOptions = ["#f6546a", "#1e90ff", "#f2d007", "#0000ff",
                           "#00c7cc", "#4584d3", "#dd40a7", "#804a2d",
                           "#48b427", "#7ab5ec", "#ff004c", "#8974bd",
                           "#ff40a7", "#488627"];
  var shipColour = shipColourOptions[Math.floor(Math.random() * shipColourOptions.length-1)];
  var missileColour = "#ff0000";
  
  var renderer = new Renderer(ctx, canvas);
  var socketHandler = new SocketHandler(socket, renderer);
  var ship = new Ship(renderer, shipColour);
  var missile = new Missile(missileColour);
  var game = new Game(renderer, socketHandler, ship, missile);

  var runGame = function() {
    renderer.clearCanvas();
    game.updateGame();
    requestAnimationFrame(runGame); 
  };

  document.body.style.overflow = 'hidden';
  document.body.addEventListener("keydown", function(e) {
      game.keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", function(e) {
      game.keys[e.keyCode] = false;
  });

  socketHandler.startSocketHandler(game, ship, missile);
  runGame();

});
