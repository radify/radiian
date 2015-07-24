#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');
  var inquirer = require('inquirer');

  var packageInfo = require('../package.json');
  var generator = require('./lib/Generator');
  var questions = require('./lib/questions');

  program
    .version(packageInfo.version)
    .parse(process.argv);

  inquirer.prompt(questions, generator.generate);
}());
