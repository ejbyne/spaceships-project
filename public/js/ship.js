var Ship = function (renderer, shipColour) {
  this.renderer = renderer;
  this.x = 32 + (Math.random() * (this.renderer.canvas.width - 64));
  this.y = 32 + (Math.random() * (this.renderer.canvas.height - 64));
  this.radius = 10;
  this.isThrusting = false;
  this.thrust = 0.2;
  this.turnSpeed = 0.001;
  this.angle = 0;
  this.radians = 0;
  this.shipColour = shipColour || "#ffffff";
  this.thrustStrokeColour = "#ff0000";
  this.thrustFillColour = "#ff8000";
  this.launchLength = 15;
  this.missileLaunchX = 0;
  this.missileLaunchY = 0;
  this.velocityX = 0;
  this.velocityY = 0;
};

Ship.prototype.turn = function(dir) {
  this.angle += this.turnSpeed * dir;
  this.radians = this.angle/Math.PI * 180;
};

Ship.prototype.update = function() {
  this._checkCanvasBounds();
  this._calculateThrust();
  this._findPoint();
  this._applyFriction();
  this._applyVelocity();
};

Ship.prototype._checkCanvasBounds = function() {
  if(this.x < this.radius){
    this.x = this.renderer.canvas.width;
  }
  if(this.x > this.renderer.canvas.width){
    this.x = this.radius;
  }
  if(this.y < this.radius){
    this.y = this.renderer.canvas.height;
  }
  if(this.y > this.renderer.canvas.height){
    this.y = this.radius;
  }
};

Ship.prototype._calculateThrust = function() {
  if (this.isThrusting){
    this.velocityX += Math.cos(this.radians) * this.thrust;
    this.velocityY += Math.sin(this.radians) * this.thrust;
  }
};

Ship.prototype._findPoint = function() {
  this.missileLaunchX = this.x - this.launchLength * Math.cos(this.radians);
  this.missileLaunchY = this.y - this.launchLength * Math.sin(this.radians);
};

Ship.prototype._applyFriction = function(){
  this.velocityX *= 0.98;
  this.velocityY *= 0.98;
};

Ship.prototype._applyVelocity = function(){
  this.x -= this.velocityX;
  this.y -= this.velocityY;
};
