#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');
  var prompt = require('prompt');
  var mustache = require('mustache');
  var fs = require('fs');
  var Q = require('q');
  var mkdirp = require('mkdirp');

  program
    .version('0.0.1')// TODO can this be taken from package.json?
    .parse(process.argv);

  var promptVars = [{
    name: 'appName',
    description: 'What is the name of your application?',
    default: 'myApp',
    type: 'string',
    required: true
  }, {
    name: 'region',
    description: 'In which region will it run?',
    default: 'us-east-1',
    type: 'string',
    required: true
  }, {
    name: 'aws_zone',
    description: 'Within the region, in which zone will it run?',
    default: 'b',
    type: 'string',
    required: true
  }, {
    name: 'instance_type',
    description: 'What is your instance type?',
    default: 't2.micro',
    type: 'string',
    required: true
  }, {
    name: 'environment',
    description: 'What is your environment instance tag?',
    default: 'myEnvironment',
    type: 'string',
    required: true
  }, {
    name: 'className',
    description: 'What is your class instance tag?',
    default: 'myClass',
    type: 'string',
    required: true
  }, {
    name: 'tag_old_app',
    description: 'What tag name would you like for your old app?',
    default: 'myOldApp',
    type: 'string',
    required: true
  }, {
    name: 'security_group',
    description: 'What is the name of your security group?',
    default: 'sg_myApp',
    type: 'string',
    required: true
  }, {
    name: 'group',
    description: 'What is your app\'s group name? ' +
    '(Don\'t confuse this with your security group name.',
    default: 'groupMyApp',
    type: 'string',
    required: true
  }, {
    name: 'load_balancer',
    description: 'What is the name of your load balancer?',
    default: 'lb_myApp',
    type: 'string',
    required: true
  }, {
    name: 'remote_user',
    description: 'What is the username of the role that will ' +
    'install and configure your application?',
    default: 'super_user',
    type: 'string',
    required: true
  }, {
    name: 'keypair',
    description: 'What is the name of your EC2 keypair?',
    default: 'myKeypair',
    type: 'string',
    required: true
  }, {
    name: 'app_pem',  // TODO: add regex to confirm '.pem' ending
    description: 'What is the name of your .pem private key?',
    default: 'my_private_key.pem',
    type: 'string',
    required: true
  }, {
    name: 'aws_key', // TODO: add regex
    description: 'What is your AWS Key?',
    default: 'AKIAIOSFODNN7EXAMPLE',
    type: 'string',
    required: true
  }, {
    name: 'aws_secret_key', // TODO: add regex
    description: 'What is your AWS Secret Key?',
    default: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    type: 'string',
    required: true
  }];

  prompt.start();

  // create promise versions of read and write files and mkdirp
  var read = Q.denodeify(fs.readFile);
  var write = Q.denodeify(fs.writeFile);
  var mkdir = Q.denodeify(mkdirp);

  // create promise version of getting prompt variables
  var getVars = Q.denodeify(prompt.get);

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
  getVars(promptVars)
    .then(setVars)
    .then(mkdir('ansible/inventory', '0755'))
    .then(getReader('ansible.cfg.mustache')).then(render).then(getWriter('ansible/ansible.cfg'))
    .then(getReader('aws_keys.mustache')).then(render).then(getWriter('ansible/inventory/aws_keys'))
    .then(getReader('destroy-old-nodes.yaml.mustache')).then(render).then(getWriter('ansible/destroy-old-nodes.yaml'))
    .then(getReader('ec2.ini.mustache')).then(render).then(getWriter('ansible/inventory/ec2.ini'))
    .then(getReader('ec2.py')).then(render).then(getWriter('ansible/inventory/ec2.py'))
    .then(getReader('immutable.yaml.mustache')).then(render).then(getWriter('ansible/immutable.yaml'))
    .then(getReader('provision.sh.mustache')).then(render).then(getWriter('ansible/provision.sh'))
    .then(getReader('tag-old-nodes.yaml.mustache')).then(render).then(getWriter('ansible/tag-old-nodes.yaml'))
    .catch(handler);

}());
