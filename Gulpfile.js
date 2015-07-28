
var path = require('path');
var gulp = require('gulp');
var webpack = require('webpack-stream');
var serve = require('browser-sync');

var paths = {
  entry: path.join(__dirname, 'index.js'),
  output: path.join(__dirname, 'dist')
};

gulp.task('build', ['webpack:build', 'serve'])

gulp.task('webpack:build', function(callback){
  return gulp.src(paths.entry)
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest(paths.output));
  callback();
});

gulp.task('serve', function(){
  serve({
    port: process.env.PORT || 3000,
    open: false,
    server: {
      baseDir: paths.output
    }
  });
  gulp.watch('dist/*', serve.reload)
});

gulp.task('watch', function(){
  gulp.watch(paths.app, ['lint']);
});

gulp.task('default', ['build', 'watch']);
