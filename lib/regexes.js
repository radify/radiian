module.exports = {
  /**
   * The key must end with .pem
   */
  pem: /(.pem)$/,

  /**
   * The AMI ID must begin with "ami-" and must end with exactly eight,
   * lowercase, alphanumeric characters.
   */
  ami: /^ami-[a-z0-9]{8}$/,

  /**
   * AWS Key validation
   *
   * In plain English:
   *
   * The AWS key is 20 alphanumeric characters, so [A-Z0-9]{20} is the "core group,"
   * which matches the key itself. Now we must ensure nothing comes before or after the key.
   *
   * Unfortunately JavaScript (ES5) does not support lookbehind expressions such ?<! and ?<=.
   * I've faked it by replacing the ordinary lookbehind, (?<!.), with the rather
   * convoluted ^((?:(?!.).)*). This means "nothing can come before the key, [A-Z0-9]{20}".
   *
   * It's counterpart, (?!.) means "nothing can come after the key, [A-Z0-9]{20}".
   *
   * For a deep explanation,
   * see https://stackoverflow.com/questions/7376238/javascript-regex-look-behind-alternative
   */
  awsKey: /^((?:(?!.).)*)[A-Z0-9]{20}(?!.)/,

  /**
   * This regex is essentially the same as the above, but it looks for 40 character,
   * base-64 strings instead.
   */
  awsSecret: /^((?:(?!.).)*)[A-Za-z0-9/+=]{40}(?!.)/
};
