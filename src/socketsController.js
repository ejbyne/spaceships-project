var socket = function(io) {
  var remoteShips = {};
  var remoteMissiles = {};

  io.on('connection', function(socket) {

    console.log(socket.id + ' connected');
    for (var keys in remoteShips) {
      io.to(socket.id).emit("add ship", {id: remoteShips[keys].id, x: remoteShips[keys].x, y: remoteShips[keys].y});
      io.to(socket.id).emit("socket id", {id: socket.id});
    };
    remoteShips[socket.id] = {id: socket.id};
    remoteMissiles[socket.id] = {id: socket.id};

    socket.on('disconnect', function() {
      console.log(socket.id + ' disconnected');
      delete remoteShips[socket.id];
      io.emit("delete ship", {id: socket.id});
    });

    socket.on('start', function(shipData) {
      console.log('Player created');
      remoteShips[socket.id].x = shipData.x;
      remoteShips[socket.id].y = shipData.y;
      socket.broadcast.emit("add ship", {id: socket.id, x: shipData.x, y: shipData.y});
    });

    socket.on('move ship', function(shipData) {
      if (remoteShips[socket.id]) {
        remoteShips[socket.id].x = shipData.x;
        remoteShips[socket.id].y = shipData.y;
        socket.broadcast.emit("move ship", {id: remoteShips[socket.id].id, x: remoteShips[socket.id].x, y: remoteShips[socket.id].y})
      }
    });

    socket.on('missile location', function(missileData) {
      if (remoteMissiles[socket.id]) {
        remoteMissiles[socket.id].x = missileData.x;
        remoteMissiles[socket.id].y = missileData.y;
        socket.broadcast.emit('show missile', {id: remoteMissiles[socket.id].id, x: remoteMissiles[socket.id].x, y: remoteMissiles[socket.id].y})
      }
    });

    socket.on('missile hit ship', function(winnerData) {
      delete remoteShips[socket.id];
      delete remoteMissiles[socket.id];
      io.emit("delete ship", {id: socket.id});
      io.emit('delete missile', {id: socket.id});
    });

    socket.on('ship hit ship', function(shipData) {
      delete remoteShips[socket.id];
      delete remoteShips[shipData.id];
      io.emit('delete ship', {id: socket.id});
      io.emit('delete ship', {id: shipData.otherShip});
    })
  });
};

module.exports = socket;