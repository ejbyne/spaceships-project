// $(document).ready(function() {

var Ship = function (shipColour) {
  this.x = 32 + (Math.random() * (canvas.width - 64));
  this.y = 32 + (Math.random() * (canvas.height - 64));
  this.radius = 10;

  this.isThrusting = false;
  this.thrust = 0.2;
  this.turnSpeed = 0.001;
  this.angle = 0;
  this.radians = 0;

  this.shipColour = shipColour || "#ffffff";
  this.thrustStrokeColour = "#ff0000"
  this.thrustFillColour = "#ff8000"

  this.launchLength = 15;
  this.missileLaunchX = 0;
  this.missileLaunchY = 0;

  this.velocityX = 0;
  this.velocityY = 0;
}

Ship.prototype.turn = function(dir) {
    this.angle += this.turnSpeed * dir;
    this.radians = this.angle/Math.PI * 180;
};

Ship.prototype.update = function() {
  this.checkCanvasBounds();
  this.calculateThrust();
  this.findPoint();
  this.applyFriction();
  this.applyVelocity();
  // socket.emit('move ship', {x: this.x, y: this.y});
};

Ship.prototype.checkCanvasBounds = function() {
  if(this.x < this.radius){
    this.x = canvas.width;
  }
  if(this.x > canvas.width){
    this.x = this.radius;
  }
  if(this.y < this.radius){
    this.y = canvas.height;
  }
  if(this.y > canvas.height){
    this.y = this.radius;
  }
};

Ship.prototype.calculateThrust = function() {
  if (this.isThrusting){
    this.velocityX += Math.cos(this.radians) * this.thrust;
    this.velocityY += Math.sin(this.radians) * this.thrust;
  }
};

Ship.prototype.findPoint = function() {
  this.missileLaunchX = this.x - this.launchLength * Math.cos(this.radians);
  this.missileLaunchY = this.y - this.launchLength * Math.sin(this.radians);
};

Ship.prototype.applyFriction = function(){
  this.velocityX *= 0.98;
  this.velocityY *= 0.98;
};

Ship.prototype.applyVelocity = function(){
  this.x -= this.velocityX;
  this.y -= this.velocityY;
};

Ship.prototype.render = function() {
  ctx.save();
  ctx.translate(this.x,this.y);
  ctx.rotate(this.radians);

  if (this.isThrusting) {
    ctx.beginPath();
    ctx.moveTo(20, 0);
    ctx.lineTo(12.5, 5);
    ctx.lineTo(10, 0);
    ctx.lineTo(12.5, -5);
    ctx.lineTo(20, 0);
    ctx.fillStyle = this.thrustFillColour;
    ctx.fill();
    ctx.strokeStyle = this.thrustStrokeColour;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(17.5, -5);
    ctx.lineTo(15, -2.5);
    ctx.lineTo(12.5, -5);
    ctx.lineTo(15, -7.5);
    ctx.fillStyle = this.thrustFillColour;
    ctx.fill();
    ctx.strokeStyle = this.thrustStrokeColour;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(17.5, 5);
    ctx.lineTo(15, 2.5);
    ctx.lineTo(12.5, 5);
    ctx.lineTo(15, 7.5);
    ctx.fillStyle = this.thrustFillColour;
    ctx.fill();
    ctx.strokeStyle = this.thrustStrokeColour;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.moveTo(-5, 0);
  ctx.lineTo(15, 10);
  ctx.lineTo(10, 0);
  ctx.lineTo(15, -10);
  ctx.lineTo(-5, 0);
  ctx.fillStyle = this.shipColour;
  ctx.fill();
  ctx.restore();
};
// });
