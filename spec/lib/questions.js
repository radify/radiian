var questions = require('../../src/lib/questions.js');

describe('questions.js', function() {
  describe('format', function() {
    it('should be an array of 24 questions', function() {
      expect(questions.length).toEqual(24);
    });
  });
});
