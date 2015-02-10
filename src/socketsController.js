var socket = function(io) {
  
  var remoteShips = {};
  var remoteMissiles = {};

  var deleteShipAndMissile = function(shipId) {
    if (remoteShips[shipId]) { 
      delete remoteShips[shipId];
      delete remoteMissiles[shipId];
      io.emit("delete ship", {id: shipId});
      io.emit('delete missile', {id: shipId});
    }
  };

  io.on('connection', function(socket) {

    console.log(socket.id + ' connected');
    for (var keys in remoteShips) {
      io.to(socket.id).emit("add ship", {
        id:         remoteShips[keys].id,
        x:          remoteShips[keys].x,
        y:          remoteShips[keys].y,
        radians:    remoteShips[keys].radians,
        shipColour: remoteShips[keys].shipColour
      });
    }
    remoteShips[socket.id] = {id: socket.id};
    remoteMissiles[socket.id] = {id: socket.id};

    socket.on('disconnect', function() {
      console.log(socket.id + ' disconnected');
      deleteShipAndMissile(socket.id);
    });

    socket.on('start', function(shipData) {
      remoteShips[socket.id].x = shipData.x;
      remoteShips[socket.id].y = shipData.y;
      remoteShips[socket.id].radians = shipData.radians;
      remoteShips[socket.id].shipColour = shipData.shipColour;
      socket.broadcast.emit("add ship", {
        id:         socket.id,
        x:          shipData.x,
        y:          shipData.y,
        radians:    shipData.radians,
        shipColour: shipData.shipColour
      });
      io.to(socket.id).emit("socket id", {id: socket.id});
    });

    socket.on('send ship data', function(shipData) {
      if (remoteShips[socket.id]) {
        remoteShips[socket.id].x = shipData.x;
        remoteShips[socket.id].y = shipData.y;
        remoteShips[socket.id].radians = shipData.radians;
        socket.broadcast.emit("update ship", {
          id:       remoteShips[socket.id].id,
          x:        remoteShips[socket.id].x,
          y:        remoteShips[socket.id].y,
          radians:  remoteShips[socket.id].radians
        });
      }
    });

    socket.on('send missile data', function(missileData) {
      if (remoteMissiles[socket.id]) {
        remoteMissiles[socket.id].x = missileData.x;
        remoteMissiles[socket.id].y = missileData.y;
        socket.broadcast.emit('update missile', {
          id:       remoteMissiles[socket.id].id,
          x:        remoteMissiles[socket.id].x,
          y:        remoteMissiles[socket.id].y
        });
      }
    });

    socket.on('missile hit ship', function() {
      deleteShipAndMissile(socket.id);
    });

    socket.on('ship hit ship', function(otherShipData) {
      deleteShipAndMissile(otherShipData.id);
      deleteShipAndMissile(socket.id);
    });

  });

};

module.exports = socket;
