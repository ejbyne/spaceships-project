var SocketsController = function(io) {
  this.io = io;
  this.remoteShips = {};
  this.remoteMissiles = {};
};

SocketsController.prototype.listenForConnection = function() {
  _this = this;
  this.io.on('connection', function(socket) {
    _this.sendExistingShips(socket);
    _this.addListeners(socket);
  });
};

SocketsController.prototype.sendExistingShips = function(socket) {
  _this = this;
  console.log(socket.id + ' connected');
  for (var keys in this.remoteShips) {
    this.io.to(socket.id).emit("add ship", {
      id:         _this.remoteShips[keys].id,
      x:          _this.remoteShips[keys].x,
      y:          _this.remoteShips[keys].y,
      radians:    _this.remoteShips[keys].radians,
      shipColour: _this.remoteShips[keys].shipColour
    });
  }
  this.remoteShips[socket.id] = {id: socket.id};
  this.remoteMissiles[socket.id] = {id: socket.id};
};

SocketsController.prototype.addListeners = function(socket) {
  this.listenForDisconnect(socket);
  this.listenForNewPlayer(socket);
  this.listenForShipData(socket);
  this.listenForMissileData(socket);
  this.listenForMissileHitShip(socket);
  this.listenForShipHitShip(socket);
};

SocketsController.prototype.listenForDisconnect = function(socket) {
  _this;
  socket.on('disconnect', function() {
    console.log(socket.id + ' disconnected');
    _this.deleteShipAndMissile(socket.id);
  });
};

SocketsController.prototype.listenForNewPlayer = function(socket) {
  _this = this;
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

SocketsController.prototype.listenForShipData = function(socket) {
  _this = this;
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

SocketsController.prototype.listenForMissileData = function(socket) {
  _this = this;
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

SocketsController.prototype.listenForMissileHitShip = function(socket) {
  _this = this;
  socket.on('missile hit ship', function() {
    _this.deleteShipAndMissile(socket.id);
  });
};

SocketsController.prototype.listenForShipHitShip = function(socket) {
  _this = this;
  socket.on('ship hit ship', function(otherShipData) {
    _this.deleteShipAndMissile(otherShipData.id);
    _this.deleteShipAndMissile(socket.id);
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
