var Renderer = function(ctx, canvas) {
	this.ctx = ctx;
	this.canvas = canvas;
};

Renderer.prototype.clearCanvas = function() {
	this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

Renderer.prototype.renderShip = function(ship) {
  this.ctx.save();
  this.ctx.translate(ship.x, ship.y);
  this.ctx.rotate(ship.radians);

  if (this.isThrusting) {
    this.ctx.beginPath();
    this.ctx.moveTo(20, 0);
    this.ctx.lineTo(12.5, 5);
    this.ctx.lineTo(10, 0);
    this.ctx.lineTo(12.5, -5);
    this.ctx.lineTo(20, 0);
    this.ctx.fillStyle = ship.thrustFillColour;
    this.ctx.fill();
    this.ctx.strokeStyle = ship.thrustStrokeColour;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(17.5, -5);
    this.ctx.lineTo(15, -2.5);
    this.ctx.lineTo(12.5, -5);
    this.ctx.lineTo(15, -7.5);
    this.ctx.fillStyle = ship.thrustFillColour;
    this.ctx.fill();
    this.ctx.strokeStyle = ship.thrustStrokeColour;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(17.5, 5);
    this.ctx.lineTo(15, 2.5);
    this.ctx.lineTo(12.5, 5);
    this.ctx.lineTo(15, 7.5);
    this.ctx.fillStyle = ship.thrustFillColour;
    this.ctx.fill();
    this.ctx.strokeStyle = ship.thrustStrokeColour;
    this.ctx.stroke();
  }

  this.ctx.beginPath();
  this.ctx.moveTo(-5, 0);
  this.ctx.lineTo(15, 10);
  this.ctx.lineTo(10, 0);
  this.ctx.lineTo(15, -10);
  this.ctx.lineTo(-5, 0);
  this.ctx.fillStyle = ship.shipColour;
  this.ctx.fill();
  this.ctx.restore();
};

Renderer.prototype.renderMissile = function(missile) {
  this.ctx.fillStyle = missile.missileColour;
  this.ctx.beginPath();
  this.ctx.arc(missile.x, missile.y, 3, 0, Math.PI * 2);
  this.ctx.closePath();
  this.ctx.fill();
};

Renderer.prototype.renderScore = function(score) {
  this.ctx.fillStyle = "#fff";
  this.ctx.font = "16px Helvetica";
  this.ctx.textAlign = "left";
  this.ctx.textBaseline = "top";
  this.ctx.fillText("Score: " + score, 32, 32);
};

Renderer.prototype.showWaitingMessage = function() {
  $('#waiting').fadeIn(3000);
};

Renderer.prototype.hideWelcomeMessage = function(game) {
  if (Object.keys(game.otherShips).length === 0) {
    $('#waiting').hide();
    $('#logo').slideUp(2000).delay(1000, function(){
      $('#canvas').show();
    });
  }
};

Renderer.prototype.showGameOverMessage = function() {
  $('#canvas').hide();
  $('#gameover').show();
};
