#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');
  var packageInfo = require('../package.json');
  var openurl = require('openurl');

  program
    .usage('[options]')
    .description('Radiian creates Ansible provisioning files for immutable infrastructure on AWS.\n' +
    '  Run `radiian init` to begin.')
    .version(packageInfo.version)
    .option('-o, --online-help', 'Opens online help');

  program
    .command('init')
    .description('initiate/start radiian')
    .action(function() {
      if (process.argv.length > 3) {
        console.log('Error: `radiian init` takes no arguments.');
        process.exit(1);
      }
      var init = require('./radiian-init');
    });

  // Warning if two or more arguments are passed.
  if (process.argv.length > 3) {
    console.log('Warning: `radiian` only accepts one argument');
    process.exit(1);
  }

  program.parse(process.argv);

  // If no arguments are passed, display help menu
  if (!process.argv.slice(2).length) { program.help(); }

  if (program.onlineHelp) {
    openurl.open('https://github.com/radify/radiian#readme');
    process.exit(0);
  }

  // Warning if unrecognized argument is passed
  if (process.argv[2] !== 'init') {
    console.log('Warning: unrecognized argument.');
    process.exit(1);
  }

}());
