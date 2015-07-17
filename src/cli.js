#!/usr/bin/env node
(function() {
  'use strict';

  var program = require('commander');
  var prompt = require('prompt');
  var mustache = require('mustache');
  var fs = require('fs');
  var Q = require('q');

  program
    .version('0.0.1')// TODO can this be taken from package.json?
    .parse(process.argv);

  var promptVars = [{
    name: 'appName',
    description: 'Name of your application',
    default: 'myApp',
    type: 'string',
    required: true
  }, {
    name: 'somethingElse',
    description: 'Something else',
    default: 'whatever',
    type: 'string',
    required: true
  }];

  prompt.start();

  // create promise versions of read and write files
  var read = Q.denodeify(fs.readFile);
  var write = Q.denodeify(fs.writeFile);

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
    return function (compiledTemplate) {
      return write(outputPath, compiledTemplate);
    };
  }

  function handler(err) {
    console.log("Something went wrong");
    console.log(err);
  }

  // Kick off a promise chain
  getVars(promptVars)
    .then(setVars)
    .then(getReader('template.mustache')).then(render).then(getWriter('hello.txt'))
    .then(getReader('other.mustache')).then(render).then(getWriter('other.txt'))
    .catch(handler);

}());
