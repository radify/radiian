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
    .command('init', 'initiate/start radiian')
    .action(function(input) {
      if(input !== 'init') {
        console.log('\nerror: unknown option `' + input + '`\n');
      }
    });

  program.parse(process.argv);

  // If no arguments are passed, display help menu
  if (!process.argv.slice(2).length) { program.help(); }

  if (program.onlineHelp) {
    openurl.open('https://github.com/radify/radiian#readme');
  }

}());
