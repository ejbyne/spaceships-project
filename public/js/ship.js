// $(document).ready(function() {

var Ship = function (x, y, color, pointerColor) {
  this.x = 32 + (Math.random() * (canvas.width - 64));
  this.y = 32 + (Math.random() * (canvas.height - 64));
  this.radius = 20;
  
  this.isThrusting = false;
  this.thrust = 0.2;
  this.turnSpeed = 0.001;
  this.angle = 0;
  this.radians = 0;
  
  this.color = color || "#fff";
  this.pointerColor = color || "#f00";
  
  this.pointLength = 20;
  this.px = 0;
  this.py = 0;

  this.velX = 0;
  this.velY = 0;
}

Ship.prototype.turn = function(dir){
    this.angle += this.turnSpeed * dir;
    this.radians = this.angle/Math.PI*180;
};

Ship.prototype.update = function(){ 
  this.checkCanvasBounds();
  this.calculateThrust();
  this.findPoint();
  this.applyFriction();
  this.applyVelocity();
  // socket.emit('move ship', {x: this.x, y: this.y});
};

Ship.prototype.checkCanvasBounds = function(){
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

Ship.prototype.calculateThrust = function(){
  if(this.isThrusting){
    this.velX += Math.cos(this.radians) * this.thrust;
    this.velY += Math.sin(this.radians) * this.thrust;
  }
};

Ship.prototype.findPoint = function(){
  this.px = this.x - this.pointLength * Math.cos(this.radians);
  this.py = this.y - this.pointLength * Math.sin(this.radians);
};

Ship.prototype.applyFriction = function(){
  this.velX *= 0.98;
  this.velY *= 0.98;
};

Ship.prototype.applyVelocity = function(){
  this.x -= this.velX;
  this.y -= this.velY;
};

//client
Ship.prototype.render = function(){
  ctx.strokeStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.stroke();
  
  ctx.strokeStyle = this.pointerColor;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(this.px, this.py);
  ctx.closePath();
  ctx.stroke();
};

// });