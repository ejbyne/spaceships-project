describe('Game', function() {

  var ship, missile, game, rendererStub, socketHandlerStub;

  beforeEach(function() {
    rendererStub = { canvas: { width: 1000,
                               height: 1000 } };
    socketHandlerStub = {};
    ship = new Ship(rendererStub);
    missile = new Missile();
    game = new Game(rendererStub, socketHandlerStub, ship, missile);
    ship.x = 300;
    ship.y = 300;
  });

  it ('moves the ship forward if the forward arrow is pressed', function() {
    game.keys[38] = true;
    game._updateMovement();
    expect(ship.isThrusting).toBe(true);
  });

  it ('turns the ship left if the left arrow is pressed', function() {
    game.keys[37] = true;
    game._updateMovement();
    expect(ship.radians).toEqual(-0.057295779513082325);
  });

  it ('turns the ship left if the left arrow is pressed', function() {
    game.keys[39] = true;
    game._updateMovement();
    expect(ship.radians).toEqual(0.057295779513082325);
  });

  it ('fires a missile if the space bar is pressed', function() {
    game.keys[32] = true;
    game._updateMovement();
    expect(missile.isFired).toBe(true);
  })

  it ('knows when two entities have not collided', function() {
    missile.x = 200;
    missile.y = 200;
    expect(game._isCollision(ship, missile)).toBe(false);
  });

  it ('knows when two entities have collided', function() {
    missile.x = 300;
    missile.y = 300;
    expect(game._isCollision(ship, missile)).toBe(true);
  });

});