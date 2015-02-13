var SocketsController = function(io) {
  this.io = io;
  this.remoteShips = {};
  this.remoteMissiles = {};
};

SocketsController.prototype.listenForConnection = function() {
  _this = this;
  this.io.on('connection', function(socket) {
    _this.socket = socket;
    _this.sendExistingShips();
    _this.addListeners();
  });
};

SocketsController.prototype.sendExistingShips = function() {
  _this = this;
  console.log(this.socket.id + ' connected');
  for (var keys in this.remoteShips) {
    this.io.to(this.socket.id).emit("add ship", {
      id:         _this.remoteShips[keys].id,
      x:          _this.remoteShips[keys].x,
      y:          _this.remoteShips[keys].y,
      radians:    _this.remoteShips[keys].radians,
      shipColour: _this.remoteShips[keys].shipColour
    });
  }
  this.remoteShips[this.socket.id] = {id: this.socket.id};
  this.remoteMissiles[this.socket.id] = {id: this.socket.id};
};

SocketsController.prototype.addListeners = function() {
  this.listenForDisconnect();
  this.listenForNewPlayer();
  this.listenForShipData();
  this.listenForMissileData();
  this.listenForMissileHitShip();
  this.listenForShipHitShip();
};

SocketsController.prototype.listenForDisconnect = function() {
  _this = this;
  this.socket.on('disconnect', function() {
    console.log(_this.socket.id + ' disconnected');
    _this.deleteShipAndMissile(_this.socket.id);
  });
};

SocketsController.prototype.listenForNewPlayer = function() {
  _this = this;
  this.socket.on('start', function(shipData) {
    _this.remoteShips[_this.socket.id].x = shipData.x;
    _this.remoteShips[_this.socket.id].y = shipData.y;
    _this.remoteShips[_this.socket.id].radians = shipData.radians;
    _this.remoteShips[_this.socket.id].shipColour = shipData.shipColour;
    _this.socket.broadcast.emit("add ship", {
      id:         _this.socket.id,
      x:          shipData.x,
      y:          shipData.y,
      radians:    shipData.radians,
      shipColour: shipData.shipColour
    });
    _this.io.to(_this.socket.id).emit("socket id", {id: _this.socket.id});
  });
}

SocketsController.prototype.listenForShipData = function() {
  _this = this;
  this.socket.on('send ship data', function(shipData) {
    if (_this.remoteShips[_this.socket.id]) {
      _this.remoteShips[_this.socket.id].x = shipData.x;
      _this.remoteShips[_this.socket.id].y = shipData.y;
      _this.remoteShips[_this.socket.id].radians = shipData.radians;
      _this.socket.broadcast.emit("update ship", {
        id:       _this.remoteShips[_this.socket.id].id,
        x:        _this.remoteShips[_this.socket.id].x,
        y:        _this.remoteShips[_this.socket.id].y,
        radians:  _this.remoteShips[_this.socket.id].radians
      });
    }
  });
};

SocketsController.prototype.listenForMissileData = function() {
  _this = this;
  this.socket.on('send missile data', function(missileData) {
    if (_this.remoteMissiles[_this.socket.id]) {
      _this.remoteMissiles[_this.socket.id].x = missileData.x;
      _this.remoteMissiles[_this.socket.id].y = missileData.y;
      _this.socket.broadcast.emit('update missile', {
        id:       _this.remoteMissiles[_this.socket.id].id,
        x:        _this.remoteMissiles[_this.socket.id].x,
        y:        _this.remoteMissiles[_this.socket.id].y
      });
    }
  });
};

SocketsController.prototype.listenForMissileHitShip = function() {
  _this = this;
  this.socket.on('missile hit ship', function() {
    _this.deleteShipAndMissile(_this.socket.id);
  });
};

SocketsController.prototype.listenForShipHitShip = function() {
  _this = this;
  this.socket.on('ship hit ship', function(otherShipData) {
    _this.deleteShipAndMissile(otherShipData.id);
    _this.deleteShipAndMissile(_this.socket.id);
  });
};

SocketsController.prototype.deleteShipAndMissile = function(shipId) {
  if (this.remoteShips[shipId]) { 
    delete this.remoteShips[shipId];
    delete this.remoteMissiles[shipId];
    this.io.emit("delete ship", {id: shipId});
    this.io.emit('delete missile', {id: shipId});
  }
};

module.exports = SocketsController;
