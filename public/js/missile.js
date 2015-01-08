var Missile = function (){
  this.x = 0;
  this.y = 0;
  this.radius = 3;
  this.isFired = false;
  this.shotSpeed = 0.2 ;
  this.color = '#fff';
  this.velX = 0;
  this.velY = 0;
  this.angle = 0;
};

Missile.prototype.setAttributes = function(x, y, angle){
  this.x = x;
  this.y = y;
  this.angle = angle;
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
  var radians = this.angle/Math.PI*180;
  this.velX += Math.cos(radians) * this.shotSpeed;
  this.velY += Math.sin(radians) * this.shotSpeed;
};

Missile.prototype.applyFriction = function(){
  this.velX *= 0.98;
  this.velY *= 0.98;
};

Missile.prototype.applyVelocity = function(){
  this.x -= this.velX;
  this.y -= this.velY;
};

Missile.prototype.render = function(){
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fill();
};

// var Missile = function (socket) {
//   this.socket = socket;
//   this.x = 0;
//   this.y = 0;
//   this.radius = 3;
//   this.isFired = false;
//   this.shotSpeed = 0.2 ;
//   this.color = '#fff';
//   this.velX = 0;
//   this.velY = 0;
//   this.angle = 0;
// };

// Missile.prototype.setAttributes = function(x, y, angle){
//   this.x = x;
//   this.y = y;
//   this.angle = angle;
// };

// Missile.prototype.update = function(){
//   if(this.isFired){
//     this.render();

//     var radians = this.angle/Math.PI*180;
//     // get shot speed
//     this.velX += Math.cos(radians) * this.shotSpeed;
//     this.velY += Math.sin(radians) * this.shotSpeed;

//     // apply friction
//     this.velX *= 0.98;
//     this.velY *= 0.98;

//     // apply velocity
//     this.x -= this.velX;
//     this.y -= this.velY;
//   };
// };

// Missile.prototype.render = function(){
//   ctx.fillStyle = this.color;
//   ctx.beginPath();
//   ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.fill();
// };