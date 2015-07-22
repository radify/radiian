var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');

// Proofread the code
gulp.task('lint', function() {
  return gulp.src(['src/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('style', function() {
  return gulp.src('src/**/*.js')
    .pipe(jscs());
});

gulp.task('default', ['lint', 'style']);
