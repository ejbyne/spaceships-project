var Missile = function (ctx, colour){
  this.ctx = ctx;
  this.missileColour = colour || "#1e90ff";
  this.x = -10;
  this.y = -10;
  this.targetX = 0;
  this.targetY = 0;
  this.startX = 0;
  this.startY = 0;
  this.sin = 0;
  this.cos = 0;
  this.radius = 6;
  this.isFired = false;
  this.shotSpeed = 15;
  this.velocityX = 0;
  this.velocityY = 0;
  this.angle = 0;
};

Missile.prototype.setAttributes = function(targetX, targetY, startX, startY) {
  this.targetX = targetX;
  this.targetY = targetY;
  this.startX = startX;
  this.startY = startY;
  this.x = targetX;
  this.y = targetY;
};

Missile.prototype.update = function() {
  if(this.isFired){
    this._applyTrajectory();
    this._applyFriction();
    this._applyVelocity();
  };
};

Missile.prototype.render = function() {
  this.ctx.fillStyle = this.missileColour;
  this.ctx.beginPath();
  this.ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
  this.ctx.closePath();
  this.ctx.fill();
};

Missile.prototype._applyTrajectory = function() {
  this.angle = Math.atan2(this.targetY - this.startY, this.targetX - this.startX);
};

Missile.prototype._applyFriction = function() {
  this.velocityX *= 0.98;
  this.velocityY *= 0.98;
};

Missile.prototype._applyVelocity = function() {
  this.sin = Math.sin(this.angle) * this.shotSpeed;
  this.cos = Math.cos(this.angle) * this.shotSpeed;
  this.x += this.cos;
  this.y += this.sin;
};