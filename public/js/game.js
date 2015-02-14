var Game = function(renderer, socketHandler, ship, missile) {
  this.socketHandler = socketHandler;
  this.renderer = renderer;
  this.ship = ship;
  this.missile = missile;
  this.otherShips = {};
  this.otherMissiles = {};
  this.alive = true;
  this.playerId = false;
  this.score = 0;
  this.keys = [];
};

Game.prototype.updateGame = function() {
  this.renderer.clearCanvas();
  this._updateMovement();
  this._updatePlayerShipAndMissile();
  this._updateOtherShips();
  this._updateOtherMissiles();
  this.renderer.renderScore(this.score);
};

Game.prototype._updateMovement = function() {
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
};

Game.prototype._updatePlayerShipAndMissile = function() {
  if (this.alive) {
    this.ship.update();
    this.renderer.renderShip(this.ship);
    this.missile.update();
    this.renderer.renderMissile(this.missile);
    this.socketHandler.sendShipData();
    this.socketHandler.sendMissileData();
  }
};

Game.prototype._updateOtherShips = function() {
  for (var key in this.otherShips) {
    this._checkOtherShipsCollisions(key);
    this.renderer.renderShip(this.otherShips[key]);
  }
};

Game.prototype._updateOtherMissiles = function() {
  for (var key in this.otherMissiles) {
    this._checkOtherMissilesCollisions(key);
    this.renderer.renderMissile(this.otherMissiles[key]);
  }
};

Game.prototype._checkOtherShipsCollisions = function(key) {
  if (this._isCollision(this.ship, this.otherShips[key])) {
    this.alive = false;
    this.socketHandler.sendShipHitShip(key);
  }
  if (this._isCollision(this.missile, this.otherShips[key])) {
    this.score += 1;
  }
};

Game.prototype._checkOtherMissilesCollisions = function(key) {
  if (this._isCollision(this.ship, this.otherMissiles[key])) {
    this.alive = false;
    this.socketHandler.sendMissileHitShip();
  }
};

Game.prototype._isCollision = function(entity1, entity2) {
    var dx = (entity1.x + entity1.radius) - (entity2.x + entity2.radius);
    var dy = (entity1.y + entity1.radius) - (entity2.y + entity2.radius);
    var distance = Math.sqrt(dx * dx + dy * dy);
    return distance < entity1.radius + entity2.radius ? true : false;
};
