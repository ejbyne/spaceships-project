$(document).ready(function() {

  var socket = io.connect('/');
  var canvas = new Canvas();
  var ship = new Ship(width/2, height/2, 20, socket);
  var missile = new Missile(socket);
  var otherShips = {};
  render();

  // socket.on('existing ship', function(shipData) {
  //   otherShips[shipData.id] = new Ship();
  //   otherShips[shipData.id].id = shipData.id;
  //   otherShips[shipData.id].x = shipData.x;
  //   otherShips[shipData.id].y = shipData.y;
  // });

  // socket.on('new ship', function(shipData) {
  //   otherShips[shipData.id] = new Ship();
  //   otherShips[shipData.id].id = shipData.id;
  //   otherShips[shipData.id].x = shipData.x;
  //   otherShips[shipData.id].y = shipData.y;
  // });

  // socket.on('move ship', function(shipData) {
  //   otherShips[shipData.id].x = shipData.x;
  //   otherShips[shipData.id].y = shipData.y;
  // });

  // socket.on('delete ship', function(shipData) {
  //   delete otherShips[shipData.id];
  // })

  // socket.emit('start', {x: ship.x, y: ship.y});

});