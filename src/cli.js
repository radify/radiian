#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');
  var inquirer = require('inquirer');
  var mustache = require('mustache');
  var fs = require('fs');
  var Q = require('q');
  var mkdirp = require('mkdirp');

  program
    .version('0.0.1')// TODO can this be taken from package.json?
    .parse(process.argv);

  var questions = [
    {
      type: 'input',
      name: 'appName',
      message: 'What is the name of your application?',
      default: 'myApp'
    }, {
      type: 'list',
      name: 'region',
      message: 'In which region will it run?',
      default: 'us-east-1',
      // @TODO (1) change to 'US East (N. Virginia): us-east-1'
      // @TODO (2) filter answer so that 'region' variable only gets 'us-east-1'
      choices: [
        'us-east-1',
        'us-west-1',
        'us-west-2',
        'us-gov-west-1',
        'eu-west-1',
        'eu-central-1',
        'ap-southeast-1',
        'ap-southeast-2',
        'ap-southeast-3',
        'sa-east-1'
      ]
    }, {
      type: 'list',
      name: 'aws_zone',
      message: 'Within the region, in which zone will it run?',
      default: 'b',
      // @TODO (1) discover the zone choices of each specific region
      // @TODO (2) based on the region variable, give different choice lists
      choices: [
        'a',
        'b',
        'c',
        'd',
        'e',
        'f'
      ]
    }, {
      type: 'list',
      name: 'familyChoice',
      message: 'Please note the following about instance types:\n\n' +
      '  T2, M3, and M4 are general purpose.\n' +
      '  C3 and C4 are compute optimized.\n' +
      '  R3 is memory optimized.\n' +
      '  G2 is GPU optimized.\n' +
      '  I2 and D2 are storage optimized.\n' +
      '  I2 is for high I/O.\n' +
      '  D2 is for dense storage.\n\n' +
      '  For more information on instance types,\n' +
      '  please see https://aws.amazon.com/ec2/instance-types/\n\n' +
      '  Now you must choose an instance type from a given family.\n' +
      '  Which family do you choose?',
      default: 'T2',
      choices: [
          'T2',
          'M3',
          'M4',
          'C3',
          'C4',
          'R3',
          'G2',
          'I2',
          'D2'
      ]
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        't2.micro',
        't2.small',
        't2.medium',
        't2.large'
      ],
      when: function(answers) {
        return answers.familyChoice === 'T2';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'm3.medium',
        'm3.large',
        'm3.xlarge',
        'm3.2xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'M3';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'm4.large',
        'm4.xlarge',
        'm4.2xlarge',
        'm4.4xlarge',
        'm4.10xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'M4';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'c3.large',
        'c3.xlarge',
        'c3.2xlarge',
        'c3.4xlarge',
        'c3.8xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'C3';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'c4.large',
        'c4.xlarge',
        'c4.2xlarge',
        'c4.4xlarge',
        'c4.8xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'C4';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'r3.large',
        'r3.xlarge',
        'r3.2xlarge',
        'r3.4xlarge',
        'r3.8xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'R3';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'g2.2xlarge',
        'g2.8xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'G2';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'i2.xlarge',
        'i2.2xlarge',
        'i2.4xlarge',
        'i2.8xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'I2';
      }
    }, {
      type: 'list',
      name: 'instance_type',
      message: function(answers) {
        return setInstanceSizeQuestion(answers);
      },
      choices: [
        'd2.xlarge',
        'd2.2xlarge',
        'd2.4xlarge',
        'd2.8xlarge'
      ],
      when: function(answers) {
        return answers.familyChoice === 'D2';
      }
    }, {
      type: 'input',
      name: 'environment',
      message: 'What is your environment instance tag?',
      default: function(answers) {
        return appendTagDefaultValue(answers, 'Environment');
      }
    }, {
      type: 'input',
      name: 'className',
      message: 'What is your class instance tag?',
      default: function(answers) {
        return appendTagDefaultValue(answers, 'Class');
      }
    }, {
      type: 'input',
      name: 'tag_old_app',
      message: 'What tag name would you like for your old app?',
      default: 'myOldApp'
    }, {
      type: 'input',
      name: 'security_group',
      message: 'What is the name of your security group?',
      default: function(answers) {
        return prependTagDefaultValue(answers, 'sg_');
      }
    }, {
      type: 'input',
      name: 'group',
      message: 'What is your app\'s group name?\n' +
      '  (Note: Don\'t confuse this with your security group name.)\n ',
      default: function(answers) {
        return appendTagDefaultValue(answers, 'Group');
      }
    }, {
      type: 'input',
      name: 'load_balancer',
      message: 'What is the name of your load balancer',
      default: function(answers) {
        return prependTagDefaultValue(answers, 'lb_');
      }
    }, {
      type: 'input',
      name: 'remote_user',
      message: 'What is the username of the role that will\n' +
      '  install and configure your application?',
      default: function(answers) {
        return appendTagDefaultValue(answers, 'User');
      }
    }, {
      type: 'input',
      name: 'keypair',
      message: 'What is the name of your keypair?',
      default: function(answers) {
        return appendTagDefaultValue(answers, 'Keypair');
      }
    }, {
      type: 'input',
      name: 'app_pem',
      message: 'What is the name of your .pem private key?',
      validate: function(value) {
        var regex = /(.pem)$/;  // The key must end with .pem
        var errorMessage = 'Your private key must end in \'.pem\'';
        return validateInput(value, regex, errorMessage);
      },
      default: function(answers) {
        return appendTagDefaultValue(answers, '.pem');
      }
    }, {
      type: 'input',
      name: 'aws_key',
      message: 'What is your AWS Key?',
      validate: function(value) {
        var regex =  /^((?:(?!.).)*)[A-Z0-9]{20}(?!.)/;
        /* In plain English:
         * The AWS key is 20 alphanumeric characters, so [A-Z0-9]{20} is the "core group,"
         * which matches the key itself. Now we must ensure nothing comes before or after the key.
         * Unfortunately JavaScript (ES5) does not support lookbehind expressions such ?<! and ?<=.
         * I've faked it by replacing the ordinary lookbehind, (?<!.), with the rather
         * convoluted ^((?:(?!.).)*). This means "nothing can come before the key, [A-Z0-9]{20}".
         * It's counterpart, (?!.) means "nothing can come after the key, [A-Z0-9]{20}".
         * For a deep explanation,
         * see https://stackoverflow.com/questions/7376238/javascript-regex-look-behind-alternative
         */
        var errorMessage = 'AWS access key IDs must be 20 character, uppercase, ' +
            'alphanumeric strings with nothing before or after.';
        return validateInput(value, regex, errorMessage);
      }
    }, {
      type: 'input',
      name: 'aws_secret_key',
      message: 'What is your AWS Secret Key?',
      validate: function(value) {
        var regex =  /^((?:(?!.).)*)[A-Za-z0-9/+=]{40}(?!.)/;
        // This regex is essentially the same as the above, but it looks for 40 character,
        // base-64 strings instead.
        var errorMessage = 'The AWS secret key must be a 40 character, ' +
          'base-64 string with nothing before or after';
        return validateInput(value, regex, errorMessage);
      }
    }
  ];

  inquirer.prompt(questions, function(answers) {
    console.log(JSON.stringify(answers, null, '  '));
  });

  function validateInput(value, regex, errorMessage) {
    var isMatch = value.match(regex);
    if (isMatch) { return true; }
    return errorMessage;
  }

  function appendTagDefaultValue(answers, tagName) {
    return answers.appName + tagName;
  }

  function prependTagDefaultValue(answers, tagName) {
    return tagName + answers.appName;
  }

  function setInstanceSizeQuestion(answers) {
    return 'Which of the following ' + answers.familyChoice + ' instance sizes would you like?';
  }

  // create promise versions of read and write files and mkdirp
  var read = Q.denodeify(fs.readFile);
  var write = Q.denodeify(fs.writeFile);
  var mkdir = Q.denodeify(mkdirp);

  // create promise version of getting prompt variables
  //var getVars = Q.denodeify(prompt.get);

  /**
   * 'Global' variables - at least, global to this program - set up by prompt
   */
  var gVars;

  /**
   * Sets gVars, thereby making the vars from prompt available
   */
  function setVars(vars) {
    gVars = vars;
  }

  /**
   * render a template by injecting gVars into it
   * @param template string
   * @returns string rendered template
   */
  function render(template) {
    return mustache.render(template, gVars);
  }

  /**
   * Partial application - creates a function which allows reading and returns a promise
   * @param template string
   * @returns {Function} Promise
   */
  function getReader(template) {
    return function() {
      return read(__dirname + '/templates/' + template, 'utf8');
    };
  }

  /**
   * Partial application - creates a function which allows file writing and returns a promise
   * @param outputPath string e.g. 'out.txt'
   * @returns {Function} Promise with parameter "compiledTemplate", which is ready to write to outputPath
   */
  function getWriter(outputPath) {
    return function(compiledTemplate) {
      return write(outputPath, compiledTemplate);
    };
  }

  function handler(err) {
    console.log(('Something went wrong'));
    console.log(err);
  }

  // Kick off a promise chain
  //getVars(promptVars)
  //  .then(setVars)
  //  .then(mkdir('ansible/inventory', '0755'))
  //  .then(getReader('ansible.cfg.mustache')).then(render).then(getWriter('ansible/ansible.cfg'))
  //  .then(getReader('aws_keys.mustache')).then(render).then(getWriter('ansible/inventory/aws_keys'))
  //  .then(getReader('destroy-old-nodes.yaml.mustache')).then(render).then(getWriter('ansible/destroy-old-nodes.yaml'))
  //  .then(getReader('ec2.ini.mustache')).then(render).then(getWriter('ansible/inventory/ec2.ini'))
  //  .then(getReader('ec2.py')).then(render).then(getWriter('ansible/inventory/ec2.py'))
  //  .then(getReader('immutable.yaml.mustache')).then(render).then(getWriter('ansible/immutable.yaml'))
  //  .then(getReader('provision.sh.mustache')).then(render).then(getWriter('ansible/provision.sh'))
  //  .then(getReader('tag-old-nodes.yaml.mustache')).then(render).then(getWriter('ansible/tag-old-nodes.yaml'))
  //  .catch(handler);

}());
