var socket = function(io) {
  var remoteShips = {};

  io.on('connection', function(socket) {

    console.log(socket.id + ' connected');
    for (var keys in remoteShips) {
      io.to(socket.id).emit("existing ship", {id: remoteShips[keys].id, x: remoteShips[keys].x, y: remoteShips[keys].y, px: remoteShips[keys].px, py: remoteShips[keys].py});
    };
    remoteShips[socket.id] = {id: socket.id};

    socket.on('disconnect', function() {
      console.log(socket.id + ' disconnected');
      delete remoteShips[socket.id];
      io.emit("delete ship", {id: socket.id});
    });

    socket.on('start', function(shipData) {
      console.log('Player created');
      remoteShips[socket.id].x = shipData.x;
      remoteShips[socket.id].y = shipData.y;
      socket.broadcast.emit("new ship", {id: socket.id, x: shipData.x, y: shipData.y, px: shipData.px, py: shipData.py});
    });

    socket.on('move ship', function(shipData) {
      // console.log(shipData);
      remoteShips[socket.id].x = shipData.x;
      remoteShips[socket.id].y = shipData.y;
      socket.broadcast.emit("move ship", {id: remoteShips[socket.id].id, x: remoteShips[socket.id].x, y: remoteShips[socket.id].y, px: remoteShips[socket.id].y, py: remoteShips[socket.id].py})
    });
  });
};

module.exports = socket;