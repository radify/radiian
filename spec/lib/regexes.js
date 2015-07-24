var regexes = require('../../src/lib/regexes.js');

describe('regexes.js', function() {


  describe('pem', function() {
    it('should fail on anything not ending in pem', function() {
      expect(regexes.pem.test('invalid')).toBeFalsy();
    });

    it('should succeed on anything ending in pem', function() {
      expect(regexes.pem.test('valid.pem')).toBeTruthy();
    });
  });

  describe('awsKey', function() {
    // TODO
  });

  describe('awsSecret', function() {
    // TODO
  });
});
