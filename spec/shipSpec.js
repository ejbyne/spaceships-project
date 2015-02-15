describe('Ship', function() {

  var ship, renderer;

  beforeEach(function() {
    renderer = {
      canvas: {
        width: 1000,
        height: 1000
      }
    };
    ship = new Ship(renderer);
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

  it ('does not move forward if it is not thrusting', function() {
    ship.update();
    expect(ship.x).toEqual(300);
    expect(ship.y).toEqual(300);
  });

  it ('moves forward if it is thrusting', function() {
    ship.isThrusting = true;
    ship.update();
    expect(ship.x).toEqual(299.804);
    expect(ship.y).toEqual(300);
  });

  it ('will move to the right edge of the screen if it reaches the left edge', function() {
    ship.x = 0;
    ship.update();
    expect(ship.x).toEqual(1000);
  });

  it ('will move to the left edge of the screen if it reaches the right edge', function() {
    ship.x = 1001;
    ship.update();
    expect(ship.x).toEqual(10);
  });

  it ('will move the the bottom edge of the screen if it reaches the top edge', function() {
    ship.y = 0;
    ship.update();
    expect(ship.y).toEqual(1000);
  });

  it ('will move to the top edge of the screen if it reaches the bottom edge', function() {
    ship.y = 1001;
    ship.update();
    expect(ship.y).toEqual(10);
  });

});
