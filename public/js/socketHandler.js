var SocketHandler = function(socket, renderer) {
	this.socket = socket;
	this.renderer = renderer;
}

SocketHandler.prototype.startSocketHandler = function(game, ship, missile) {
	this.game = game;
	this.ship = ship;
	this.missile = missile;
	this._sendStartData();
 	this._addListeners();
  $('#waiting').fadeIn(3000);
};

SocketHandler.prototype.sendShipData = function() {
	this.socket.emit('send ship data', {		x: 				this.ship.x,
																					y: 				this.ship.y,
																					radians: 	this.ship.radians});
};

SocketHandler.prototype.sendMissileData = function() {
  this.socket.emit('send missile data', {	x: 				this.missile.x,
																					y: 				this.missile.y});
};

SocketHandler.prototype.sendShipHitShip = function(key) {
	this.socket.emit('ship hit ship', {id: key});
};

SocketHandler.prototype.sendMissileHitShip = function() {
	this.socket.emit('missile hit ship');
};

SocketHandler.prototype._sendStartData = function() {
 	this.socket.emit('start', {	x: 					this.ship.x,
 															y: 					this.ship.y,
 															radians: 		this.ship.radians,
 															shipColour: this.ship.shipColour});
};

SocketHandler.prototype._addListeners = function() {
 	this._listenForPlayerId();
	this._listenForAddShip();
 	this._listenForDeleteShip();
 	this._listenForDeleteMissile();
 	this._listenForUpdateShip();
 	this._listenForUpdateMissile();
};

SocketHandler.prototype._listenForPlayerId = function() {
	_this = this;
	this.socket.on('socket id', function(socketId) {
    _this.game.playerId = socketId.id;
  });
};

SocketHandler.prototype._listenForAddShip = function() {
	_this = this;
  this.socket.on('add ship', function(shipData) {
    $('#waiting').hide();
    $('#logo').slideUp(2000).delay(1000, function(){
      _this.game.runGame();
    }).fadeOut(3000);
    _this.game.otherShips[shipData.id] = new Ship(_this.renderer.ctx);
    _this.game.otherShips[shipData.id].x = shipData.x;
    _this.game.otherShips[shipData.id].y = shipData.y;
    _this.game.otherShips[shipData.id].radians = shipData.radians;
    _this.game.otherShips[shipData.id].shipColour = shipData.shipColour;
    _this.game.otherMissiles[shipData.id] = new Missile(_this.renderer.ctx);
  });
};

SocketHandler.prototype._listenForDeleteShip = function() {
	_this = this;
	this.socket.on('delete ship', function(shipData) {
    if (_this.game.otherShips[shipData.id]) {
      delete _this.game.otherShips[shipData.id];
    }
    if (shipData.id === _this.game.playerId) {
      _this.game.alive = false;
      $('#canvas').hide();
      $('#gameover').show();
    }
  });
};

SocketHandler.prototype._listenForDeleteMissile = function() {
	_this = this;
	this.socket.on('delete missile', function(missileData) {
    if (_this.game.otherMissiles[missileData.id]) {
      delete _this.game.otherMissiles[missileData.id];
    }
  });
};

SocketHandler.prototype._listenForUpdateShip = function() {
  _this = this;
  this.socket.on('update ship', function(shipData) {
    if (_this.game.otherShips[shipData.id]) {
      _this.game.otherShips[shipData.id].x = shipData.x;
      _this.game.otherShips[shipData.id].y = shipData.y;
      _this.game.otherShips[shipData.id].radians = shipData.radians;
    }
  });
};

SocketHandler.prototype._listenForUpdateMissile = function() {
  _this = this;
  this.socket.on('update missile', function(missileData) {
    if (_this.game.otherMissiles[missileData.id]) {
      _this.game.otherMissiles[missileData.id].x = missileData.x;
      _this.game.otherMissiles[missileData.id].y = missileData.y;
    }
  });
};
