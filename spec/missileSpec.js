describe('Missile', function() {

  var missile;

  beforeEach(function() {
    missile = new Missile();
  });

  it ('does not move if it has not been fired', function() {
    missile.setAttributes(285, 300, 300, 300);
    missile.update();
    expect(missile.x).toEqual(285);
    expect(missile.y).toEqual(300);
  });

  it ('moves in direction ship is pointing if it has been fired', function() {
    missile.setAttributes(285, 300, 300, 300);
    missile.isFired = true;
    missile.update();
    expect(missile.x).toEqual(270);
    expect(missile.y).toEqual(300);
  });

});
