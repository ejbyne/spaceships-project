var Ship = require('../public/js/ship');

describe('Ship', function() {

  var ship;

  beforeEach(function() {
    ship = new Ship('canvasStub', 'ctxStub');
    ship.x = 300;
    ship.y = 300;
  });

  it ('turns left', function() {
    expect(ship.radians).toEqual(0);
    ship.turn(-1);
    expect(ship.radians).toEqual(-0.057295779513082325);
  });

  it ('turns right', function() {
    expect(ship.radians).toEqual(0);
    ship.turn(1);
    expect(ship.radians).toEqual(0.057295779513082325);
  });

  it ('moves forward', function() {
    expect(ship.x).toEqual(300);
    expect(ship.y).toEqual(300);
    ship.isThrusting = true;
    ship.update();
    expect(ship.x).toEqual(299.804);
    expect(ship.y).toEqual(300);
  });

});