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
  var randomColour = colours[Math.floor(Math.random() * colours.length-1)]; 
  var renderer = new Renderer(ctx, canvas);
  var ship = new Ship(renderer, randomColour);
  var missile = new Missile("#ff0000");
  var socketHandler = new SocketHandler(socket, renderer);
  var game = new Game(socketHandler, renderer, ship, missile);

  document.body.style.overflow = 'hidden';
  document.body.addEventListener("keydown", function(e) {
      game.keys[e.keyCode] = true;
  });
  document.body.addEventListener("keyup", function(e) {
      game.keys[e.keyCode] = false;
  });

  socketHandler.startSocketHandler(game, ship, missile);

});
