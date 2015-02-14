var SocketsController = function(io) {
  this.io = io;
  this.remoteShips = {};
  this.remoteMissiles = {};
};

SocketsController.prototype.listenForConnection = function() {
  var _this = this;
  this.io.on('connection', function(socket) {
    _this._sendExistingShips(_this, socket);
    _this._recordNewShipAndMissile(_this, socket);
    _this._addListeners(_this, socket);
  });
};

SocketsController.prototype._sendExistingShips = function(_this, socket) {
  console.log(socket.id + ' connected');
  for (var keys in _this.remoteShips) {
    _this.io.to(socket.id).emit("add ship", {
      id:         _this.remoteShips[keys].id,
      x:          _this.remoteShips[keys].x,
      y:          _this.remoteShips[keys].y,
      radians:    _this.remoteShips[keys].radians,
      shipColour: _this.remoteShips[keys].shipColour
    });
  }
};

SocketsController.prototype._recordNewShipAndMissile = function(_this, socket) {
  _this.remoteShips[socket.id] = {id: socket.id};
  _this.remoteMissiles[socket.id] = {id: socket.id};
};

SocketsController.prototype._addListeners = function(_this, socket) {
  _this._listenForDisconnect(_this, socket);
  _this._listenForNewPlayer(_this, socket);
  _this._listenForShipData(_this, socket);
  _this._listenForMissileData(_this, socket);
  _this._listenForMissileHitShip(_this, socket);
  _this._listenForShipHitShip(_this, socket);
};

SocketsController.prototype._listenForDisconnect = function(_this, socket) {
  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected');
    _this._deleteShipAndMissile(_this, socket.id);
  });
};

SocketsController.prototype._listenForNewPlayer = function(_this, socket) {
  socket.on('start', function(shipData) {
    _this.remoteShips[socket.id].x = shipData.x;
    _this.remoteShips[socket.id].y = shipData.y;
    _this.remoteShips[socket.id].radians = shipData.radians;
    _this.remoteShips[socket.id].shipColour = shipData.shipColour;
    socket.broadcast.emit("add ship", {
      id:         socket.id,
      x:          shipData.x,
      y:          shipData.y,
      radians:    shipData.radians,
      shipColour: shipData.shipColour
    });
    _this.io.to(socket.id).emit("socket id", {id: socket.id});
  });
}

SocketsController.prototype._listenForShipData = function(_this, socket) {
  socket.on('send ship data', function(shipData) {
    if (_this.remoteShips[socket.id]) {
      _this.remoteShips[socket.id].x = shipData.x;
      _this.remoteShips[socket.id].y = shipData.y;
      _this.remoteShips[socket.id].radians = shipData.radians;
      socket.broadcast.emit("update ship", {
        id:       _this.remoteShips[socket.id].id,
        x:        _this.remoteShips[socket.id].x,
        y:        _this.remoteShips[socket.id].y,
        radians:  _this.remoteShips[socket.id].radians
      });
    }
  });
};

SocketsController.prototype._listenForMissileData = function(_this, socket) {
  socket.on('send missile data', function(missileData) {
    if (_this.remoteMissiles[socket.id]) {
      _this.remoteMissiles[socket.id].x = missileData.x;
      _this.remoteMissiles[socket.id].y = missileData.y;
      socket.broadcast.emit('update missile', {
        id:       _this.remoteMissiles[socket.id].id,
        x:        _this.remoteMissiles[socket.id].x,
        y:        _this.remoteMissiles[socket.id].y
      });
    }
  });
};

SocketsController.prototype._listenForMissileHitShip = function(_this, socket) {
  socket.on('missile hit ship', function() {
    _this._deleteShipAndMissile(_this, socket.id);
  });
};

SocketsController.prototype._listenForShipHitShip = function(_this, socket) {
  socket.on('ship hit ship', function(otherShipData) {
    _this._deleteShipAndMissile(_this, otherShipData.id);
    _this._deleteShipAndMissile(_this, socket.id);
  });
};

SocketsController.prototype._deleteShipAndMissile = function(_this, shipId) {
  if (_this.remoteShips[shipId]) { 
    delete _this.remoteShips[shipId];
    delete _this.remoteMissiles[shipId];
    _this.io.emit("delete ship", {id: shipId});
    _this.io.emit('delete missile', {id: shipId});
  }
};

module.exports = SocketsController;
