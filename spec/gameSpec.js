var Game = require('../public/js/game');
var Ship = require('../public/js/ship');
var Missile = require('../public/js/missile');

describe('Game', function() {

  var game;

  beforeEach(function() {
    ship = new Ship('canvasStub', 'ctxStub');
    missile = new Missile('ctxStub');
    game = new Game('socketStub', 'ctxStub', ship, missile);
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