var Ship = function (x, y, radius, color) {
  this.x = x || 0;
  this.y = y || 0;
  this.radius = radius || 10;
  
  this.isThrusting = false;
  this.thrust = 0.2;
  this.turnSpeed = 0.001;
  this.angle = 0;
  
  this.color = color || "#fff";
  
  this.pointLength = 20;
  this.px = 0;
  this.py = 0;

  this.velX = 0;
  this.velY = 0;
}

Ship.prototype.turn = function(dir){
    this.angle += this.turnSpeed * dir;
};

Ship.prototype.update = function () {
  // Get the direction we are facing
  var radians = this.angle/Math.PI*180;
  
  //get thrust
  if(this.isThrusting){
    this.velX += Math.cos(radians) * this.thrust;
    this.velY += Math.sin(radians) * this.thrust;
  }
  
  // bounds check    
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
  
  // calc the point out in front of the ship
  this.px = this.x - this.pointLength * Math.cos(radians);
  this.py = this.y - this.pointLength * Math.sin(radians);

  // apply friction
  this.velX *= 0.98;
  this.velY *= 0.98;
  
  // apply velocities    
  this.x -= this.velX;
  this.y -= this.velY;

};

Ship.prototype.render = function () {
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();
  
  ctx.strokeStyle = "#f00";
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.px, this.py);
  ctx.closePath();
  ctx.stroke();
};

// var Ship = function (x, y, radius, color, socket) {
//   this.socket = socket
//   this.x = x || 0;
//   this.y = y || 0;
//   this.radius = radius || 10;
  
//   this.isThrusting = false;
//   this.thrust = 0.2;
//   this.turnSpeed = 0.001;
//   this.angle = 0;
  
//   this.color = color || "#fff";
  
//   this.pointLength = 20;
//   this.px = 0;
//   this.py = 0;

//   this.velX = 0;
//   this.velY = 0;
// }

// Ship.prototype.turn = function(dir){
//     this.angle += this.turnSpeed * dir;
// };

// Ship.prototype.update = function () {
//   // Get the direction we are facing
//   var radians = this.angle/Math.PI*180;
  
//   //get thrust
//   if(this.isThrusting){
//     this.velX += Math.cos(radians) * this.thrust;
//     this.velY += Math.sin(radians) * this.thrust;
//   }
  
//   // bounds check    
//   if(this.x < this.radius){
//       this.x = canvas.width;   
//   }
//   if(this.x > canvas.width){
//       this.x = this.radius;   
//   }
//   if(this.y < this.radius){
//       this.y = canvas.height;   
//   }
//   if(this.y > canvas.height){
//       this.y = this.radius;   
//   }
  
//   // calc the point out in front of the ship
//   this.px = this.x - this.pointLength * Math.cos(radians);
//   this.py = this.y - this.pointLength * Math.sin(radians);

//   // apply friction
//   this.velX *= 0.98;
//   this.velY *= 0.98;
  
//   // apply velocities    
//   this.x -= this.velX;
//   this.y -= this.velY;

//   this.socket.emit('move ship', {x: this.x, y: this.y});

// };

// Ship.prototype.render = function () {
//   ctx.strokeStyle = this.color;
//   ctx.beginPath();
//   ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
//   ctx.closePath();
//   ctx.stroke();
  
//   ctx.strokeStyle = "#f00";
//   ctx.beginPath();
//   ctx.moveTo(this.x, this.y);
//   ctx.lineTo(this.px, this.py);
//   ctx.closePath();
//   ctx.stroke();
// };