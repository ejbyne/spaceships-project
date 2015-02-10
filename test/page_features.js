describe('webpage', function(){

  before(function(){
    casper.start('http://localhost:3000/');
  });

  it('shows a welcome message', function(){
    casper.then(function(){
      expect('#logo').to.be.inDOM;
      expect('body').to.contain.text('Waiting for other players...');
    });
  });

});