var generator = require('../../src/lib/Generator.js');

describe('generator.js', function() {
  describe('generate()', function() {
    it('should be a function', function() {
      expect(typeof generator.generate).toEqual('function');
    });
  });
});
