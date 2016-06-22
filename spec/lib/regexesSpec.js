var regexes = require('../../lib/regexes.js');

describe('regexes.js', function() {

  describe('pem', function() {
    it('should fail on anything not ending in pem', function() {
      expect(regexes.pem.test('invalid')).toBeFalsy();
    });

    it('should succeed on anything ending in pem', function() {
      expect(regexes.pem.test('valid.pem')).toBeTruthy();
    });
  });

  describe('vpc_subnet_id', function(){
    it("should fail on anything that doesnt start with subnet", function(){
      expect(regexes.vpc.test('ami-47a23a30')).toBeFalsy();
    });

    it("should fail on anything that doesnt end with 8 alphanumeric chars", function(){
      expect(regexes.vpc.test('subnet-47a2330')).toBeFalsy();
    });

    it('should pass on valid subnet ids', function(){
      expect(regexes.vpc.test('subnet-47a23350')).toBeTruthy();
    });
  });

  describe('awsKey', function() {
    it('should fail on anything that is not exactly 20 characters long', function(){
      expect(regexes.awsKey.test("435FFGSGHF5")).toBeFalsy();
      expect(regexes.awsKey.test("AKLFDSKFDKSFJGSDDSJ467463FDGJGDK7575DFG")).toBeFalsy();
    });
    it('should fail on anything that is not all caps', function(){
      expect(regexes.awsKey.test("ABCDEFGHJLDJVYEHDAFo")).toBeFalsy();
    });
    it('should accept on any 20 character alphanumeric uppercase string', function(){
      expect(regexes.awsKey.test('AKIAIOSFODNN7EXAMPLE')).toBeTruthy();
    });
  });

  describe('awsSecret', function() {
    it('should fail on anything that is not exactly 40 characters long', function(){
      expect(regexes.awsSecret.test("435FFGSGHF5")).toBeFalsy();
      expect(regexes.awsSecret.test("AKLFDSKFDKSFJGSDDSJ467463FDGJGDK7575D984759485974SDFGSFGSHFGDS45FG")).toBeFalsy();
    });

    it('should accept on any 40 character alphanumeric string', function(){
      expect(regexes.awsSecret.test('wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY')).toBeTruthy();
    });
  });
});
