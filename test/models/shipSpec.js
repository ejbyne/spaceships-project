describe("Ship", function() {

  var ship;

  beforeEach(function() {
    ship = new Ship();
  });

  it('should have x and y co-ordinates', function() {
    expect(ship.x).toBe(undefined);
    expect(ship.y).toBe(undefined);
  });

  it('should have width and height of 24 pixels', function() {
    expect(ship.width).toEqual(24);
    expect(ship.height).toEqual(24);
  });

  it('should have a speed of 256 pixels per second', function() {
    expect(ship.speed).toEqual(256);
  });

  it('should have 3 missiles', function() {
    expect(ship.missiles).toEqual(3);
  });

  it('should have an id', function() {
    expect(ship.id).toBe(undefined);
  });
});