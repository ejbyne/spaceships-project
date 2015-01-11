var Game = function(socket, ctx, ship, missile) {
  this.socket = socket;
  this.ctx = ctx;
  this.ship = ship;
  this.missile = missile;
  this.otherShips = {};
  this.otherMissiles = {};
  this.alive = true;
  this.playerId = false;
  this.score = 0;
  this.keys = [];
}

Game.prototype.movement = function() {
  this.ship.isThrusting = (this.keys[38]);
  if (this.keys[39]) {
    this.ship.turn(1);
  }
  if (this.keys[37]) {
    this.ship.turn(-1);
  }
  if (this.keys[32]) {
    this.missile.setAttributes(this.ship.missileLaunchX, this.ship.missileLaunchY, this.ship.x, this.ship.y);
    this.missile.isFired = true;
  }
}

Game.prototype.updatePlayerShipAndMissile = function() {
  if (this.alive) {
    this.ship.update();
    this.socket.emit('send ship data', {x: this.ship.x, y: this.ship.y, radians: this.ship.radians});
    this.ship.render();
    this.missile.update();
    this.socket.emit('send missile data', {x: this.missile.x, y: this.missile.y});
  }
}

Game.prototype.updateOtherShips = function() {
  if (Object.keys(this.otherShips).length > 0) {
    for (var key in this.otherShips) {
      this.otherShips[key].update();
      this.otherShips[key].render();
      this.checkOtherShipsCollisions(key);
    }
  }
}

Game.prototype.updateOtherMissiles = function() {
  if (Object.keys(this.otherMissiles).length > 0) {
    for (var key in this.otherMissiles) {
      this.otherMissiles[key].render();
      this.checkOtherMissilesCollisions(key);
    }
  }
}

Game.prototype.updateScore = function() {
  this.ctx.fillStyle = "#fff";
  this.ctx.font = "16px Helvetica";
  this.ctx.textAlign = "left";
  this.ctx.textBaseline = "top";
  this.ctx.fillText("Score: " + this.score, 32, 32);
}

Game.prototype.checkOtherShipsCollisions = function(key) {
  if (this.collision(this.missile, this.otherShips[key])) {
    this.score += 1;
  }
  if (this.collision(this.ship, this.otherShips[key])) {
    this.alive = false;
    this.socket.emit('ship hit ship');
    delete this.otherShips[key];
  } 
}

Game.prototype.checkOtherMissilesCollisions = function(key) {
  if (this.collision(this.ship, this.otherMissiles[key])) {
    this.alive = false;
    this.socket.emit('missile hit ship');
  }
}

Game.prototype.collision = function(entity1, entity2) {
    var dx = (entity1.x + entity1.radius) - (entity2.x + entity2.radius);
    var dy = (entity1.y + entity1.radius) - (entity2.y + entity2.radius);
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < entity1.radius + entity2.radius ? true : false
};