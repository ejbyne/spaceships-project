describe('Game', function() {

  var renderer, socketHandler, ship, missile, otherShip, otherMissile, game;

  beforeEach(function() {
    renderer = jasmine.createSpyObj('renderer',
      ['clearCanvas', 'renderScore', 'renderShip', 'renderMissile']);
    socketHandler = jasmine.createSpyObj('socketHandler',
      ['sendShipData', 'sendMissileData', 'sendShipHitShip', 'sendMissileHitShip']);
    ship = jasmine.createSpyObj('ship',
      ['turn', 'update']);
    missile = jasmine.createSpyObj('missile',
      ['setAttributes', 'update']);
    otherShip = jasmine.createSpyObj('otherShip',
      ['turn', 'update']);
    otherMissile = jasmine.createSpyObj('otherMissile',
      ['setAttributes', 'update']);
    ship.x = 300;
    ship.y = 300;
    ship.radius = 10;
    game = new Game(renderer, socketHandler, ship, missile);
    game.otherShips.otherShip = otherShip;
    game.otherMissiles.otherMissile = otherMissile;
  });

  it('updates the ship and missile positions and re-renders the canvas', function() {
    game.updateGame();
    expect(renderer.clearCanvas).toHaveBeenCalled();
    expect(ship.update).toHaveBeenCalled();
    expect(renderer.renderShip).toHaveBeenCalledWith(ship);
    expect(missile.update).toHaveBeenCalled();
    expect(renderer.renderMissile).toHaveBeenCalledWith(missile);
    expect(socketHandler.sendShipData).toHaveBeenCalled();
    expect(socketHandler.sendMissileData).toHaveBeenCalled();
    expect(renderer.renderShip).toHaveBeenCalledWith(otherShip);
    expect(renderer.renderMissile).toHaveBeenCalledWith(otherMissile);
    expect(renderer.renderScore).toHaveBeenCalledWith(game.score);
  });

  it ('does not move the ship forward if the forward arrow is not pressed', function() {
    game.keys[38] = false;
    game._updateMovement();
    expect(ship.isThrusting).toBe(false);
  });

  it ('moves the ship forward if the forward arrow is pressed', function() {
    game.keys[38] = true;
    game._updateMovement();
    expect(ship.isThrusting).toBe(true);
  });

  it ('does not turn the ship left if the left arrow is not pressed', function() {
    game.keys[37] = false;
    game._updateMovement();
    expect(ship.turn).not.toHaveBeenCalled();
  });

  it ('turns the ship left if the left arrow is pressed', function() {
    game.keys[37] = true;
    game._updateMovement();
    expect(ship.turn).toHaveBeenCalledWith(-1);
  });

  it ('does not turn the ship right if the right arrow is not pressed', function() {
    game.keys[39] = false;
    game._updateMovement();
    expect(ship.turn).not.toHaveBeenCalledWith();
  });

  it ('turns the ship right if the right arrow is pressed', function() {
    game.keys[39] = true;
    game._updateMovement();
    expect(ship.turn).toHaveBeenCalledWith(1);
  });

  it ('does not fire a missile if the space bar is not pressed', function() {
    game.keys[32] = false;
    game._updateMovement();
    expect(missile.setAttributes).not.toHaveBeenCalled();
  });

  it ('fires a missile if the space bar is pressed', function() {
    ship.missileLaunchX = 285;
    ship.missileLaunchY = 300;
    game.keys[32] = true;
    game._updateMovement();
    expect(missile.setAttributes).toHaveBeenCalledWith(285, 300, 300, 300);
  });

  it ('knows when the ship has not hit another ship', function() {
    otherShip.x = 200;
    otherShip.y = 200;
    otherShip.radius = 10;
    game._updateOtherShips();
    expect(game._isCollision(ship, otherShip)).toBe(false);
    expect(socketHandler.sendShipHitShip).not.toHaveBeenCalled();
  });

  it ('knows when the ship has hit another ship', function() {
    otherShip.x = 300;
    otherShip.y = 300;
    otherShip.radius = 10;
    game._updateOtherShips();
    expect(game._isCollision(ship, otherShip)).toBe(true);
    expect(socketHandler.sendShipHitShip).toHaveBeenCalledWith('otherShip');
  });

  it ('knows when the ship has not hit another missile', function() {
    otherMissile.x = 200;
    otherMissile.y = 200;
    otherMissile.radius = 6;
    game._updateOtherMissiles();
    expect(game._isCollision(missile, otherMissile)).toBe(false);
    expect(socketHandler.sendMissileHitShip).not.toHaveBeenCalled();
  });

  it ('knows when the ship has hit another missile', function() {
    otherMissile.x = 300;
    otherMissile.y = 300;
    otherMissile.radius = 6;
    game._updateOtherMissiles();
    expect(game._isCollision(missile, otherMissile)).toBe(false);
    expect(socketHandler.sendMissileHitShip).toHaveBeenCalled();
  });

});
