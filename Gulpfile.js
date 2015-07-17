var gulp = require('gulp');
var jshint = require('gulp-jshint');

// Proofread the code
gulp.task('lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('default', ['lint']);
