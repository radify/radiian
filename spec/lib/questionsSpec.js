var questions = require('../../lib/questions.js');

describe('questions.js', function() {
  describe('format', function() {
    it('should be an array of 23 questions', function() {
      expect(questions.length).toEqual(23);
    });
  });
});
