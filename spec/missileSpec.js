var Missile = require('../public/js/missile');

describe('Missile', function() {

  var missile;

  beforeEach(function() {
    missile = new Missile('ctxStub');
  });

  it ('moves in direction ship is pointing', function() {
    missile.setAttributes(285, 300, 300, 300);
    missile.isFired = true;
    missile.update();
    expect(missile.x).toEqual(270);
    expect(missile.y).toEqual(300);
  });

});