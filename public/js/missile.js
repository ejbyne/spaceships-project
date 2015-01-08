var Missile = function (){
  this.x = 0;
  this.y = 0;
  this.targetX = 0;
  this.targetY = 0;
  this.startX = 0;
  this.startY = 0;
  this.sin = 0;
  this.cos = 0;
  this.radius = 3;
  this.isFired = false;
  this.shotSpeed = 10;
  this.color = '#fff';
  this.velX = 0;
  this.velY = 0;
  this.angle = 0;
};

Missile.prototype.setAttributes = function(targetX, targetY, startX, startY){
    this.targetX = targetX;
    this.targetY = targetY;
    this.startX = startX;
    this.startY = startY;
    this.x = targetX;
    this.y = targetY;
};

Missile.prototype.update = function(){
if(this.isFired){
    this.render();
    this.applyTrajectory();
    this.applyFriction();
    this.applyVelocity();
};
};

Missile.prototype.applyTrajectory = function(){
  this.angle = Math.atan2(this.targetY - this.startY, this.targetX - this.startX);
};

Missile.prototype.applyFriction = function(){
  this.velX *= 0.98;
  this.velY *= 0.98;
};

Missile.prototype.applyVelocity = function(){
  this.sin = Math.sin(this.angle) * this.shotSpeed;
  this.cos = Math.cos(this.angle) * this.shotSpeed;

  this.x += this.cos;
  this.y += this.sin;

};

//client
Missile.prototype.render = function(){
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
};