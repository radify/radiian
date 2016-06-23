(function() {
  'use strict';

  var mustache = require('mustache');
  var fs = require('fs');
  var Q = require('q');
  var mkdirp = require('mkdirp');
  // create promise versions of read and write files
  var read = Q.denodeify(fs.readFile);
  var write = Q.denodeify(fs.writeFile);

  module.exports = {
    generate: function(answers) {

      answers.tag_old_app = 'old' + answers.appName.charAt(0).toUpperCase() + answers.appName.slice(1);
      answers.converted_environment = answers.environment.replace(/-/g, "_");


      // create promise versions of chmod and mkdirp
      var chmod = Q.denodeify(fs.chmod);
      var mkdir = Q.denodeify(mkdirp);

      //function that handles .gitignore
      function gitignore(path){
        return function(){
          return fs.appendFile('.gitignore', "\n" + path, function(err){
            if(err) return Promise.reject(err);
            return Promise.resolve();
          });
        };
      }

      // Kick off a promise chain
      mkdir('ansible/inventory', '0755')
        .then(getReader('ansible.cfg.mustache')).then(render).then(getWriter('ansible/ansible.cfg'))
        .then(getReader('aws_keys.mustache')).then(render).then(getWriter('ansible/inventory/aws_keys'))
        .then(gitignore('ansible/inventory/aws_keys'))
        .then(getReader('destroy-old-nodes.yaml.mustache')).then(render)
          .then(getWriter('ansible/destroy-old-nodes.yaml'))
        .then(getReader('ec2.ini.mustache')).then(render).then(getWriter('ansible/inventory/ec2.ini'))
        .then(getReader('ec2.py')).then(render).then(getWriter('ansible/inventory/ec2.py'))
        .then(getReader('immutable.yaml.mustache')).then(render).then(getWriter('ansible/immutable.yaml'))
        .then(getReader('provision.sh.mustache')).then(render).then(getWriter('ansible/provision.sh'))
          .then(chmod('ansible/provision.sh', '0744'))
        .then(getReader('tag-old-nodes.yaml.mustache')).then(render).then(getWriter('ansible/tag-old-nodes.yaml'))
        .then(mkdir('ansible/roles/' + answers.appName + '/tasks'))
        .then(getReader('roles/appName/tasks/main.yaml.mustache')).then(render).then(getWriter('ansible/roles/' +
          answers.appName + '/tasks/main.yaml'))
        .then(getReader('myApp.pem.mustache')).then(render).then(getWriter('ansible/' + answers.appPem))
        .then(gitignore('ansible/' + answers.appPem))
        .finally(function() {
          fs.chmod('ansible/provision.sh', '0744');
          fs.chmod('ansible/inventory/ec2.py', '0755');
        })
        .catch(handler);

      /**
       * Render a template by injecting answers into it
       *
       * @param {String} template
       * @returns {String} rendered template
       */
      function render(template) {
        return mustache.render(template, answers);
      }
    }
  };

  /**
   * Partial application - creates a function which allows reading and returns a promise
   *
   * @param {String} template
   * @returns {Function} Promise
   */
  function getReader(template) {
    return function() {
      return read(__dirname + '/templates/' + template, 'utf8');
    };
  }

  /**
   * Partial application - creates a function which allows file writing and returns a promise
   *
   * @param {String} outputPath e.g. 'out.txt'
   * @returns {Function} Promise with parameter "compiledTemplate", which is ready to write to outputPath
   */
  function getWriter(outputPath) {
    return function(compiledTemplate) {
      return write(outputPath, compiledTemplate);
    };
  }

  /**
   * Generic error handler. Simply logs to the console.
   *
   * @param {Error} err
   */
  function handler(err) {
    console.log(('Something went wrong'));
    console.log(err);
  }

}());
