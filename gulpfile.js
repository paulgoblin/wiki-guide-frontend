var gulp = require('gulp');
var sass = require('gulp-sass');
var ignore = require('gulp-ignore');
var rimraf = require('gulp-rimraf');
var webpack = require('webpack');
var gutil = require('gulp-util')
var webserver = require('gulp-webserver');
var browserSync = require('browser-sync').create();
var minifyCss = require('gulp-minify-css');

var dirs = {
  src: {
    js: "src/app/**/*.js",
    scss: "src/app/app.scss",
    html: "src/app/**/*.html",
    lib: "src/assets/**/*"
  },
  out: {
    html: 'dist/',
    css: 'dist/',
    lib: 'dist/'
  }
}

gulp.task('default', ['clean' ,'sass', 'assets', 'bundle', 'templates', 'watch', 'serve']);

gulp.task('clean', function(done){
  if (stream) stream.emit('kill');
  return gulp.src('/dist/*', { read: false }) // much faster
  .pipe(ignore('node_modules/**'))
  .pipe(rimraf());
})

gulp.task('sass', ['clean'], function(done) {
  gulp.src(dirs.src.scss)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(minifyCss())
    .pipe(gulp.dest(dirs.out.css))
    .pipe(browserSync.reload({
      stream: true
    }))
    .on('end', done);
});

gulp.task('assets', function() {
  gulp.src(dirs.src.lib)
    .pipe(gulp.dest(dirs.out.lib))
});

gulp.task('bundle', ['clean'], function(done) {
  gulp.src(dirs.src.js)
    .pipe(gulp.dest('dist/js'))
    .on('end', done)
  // webpack(require("./webpack.config.js"), function(err, stats) {
  //   if(err) throw new gutil.PluginError("webpack", err);
  //   gutil.log("[webpack -wd]", stats.toString({}));
  //   done();
  // });
});

gulp.task('templates', function(){
  return gulp.src(dirs.src.html)
    .pipe(gulp.dest(dirs.out.html))
})

// gulp.task('browserSync', function() {
//   browserSync.init({
//     server: {
//       baseDir: 'dist'
//     },
//   })
// })

var stream
gulp.task('serve', function() {
  stream = gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false
    }));
});

gulp.task('watch', function() {
  gulp.watch(dirs.src.html, ['default']);
  gulp.watch(dirs.src.lib, ['default']);
  gulp.watch(dirs.src.scss, ['default']);
  gulp.watch(dirs.src.js, ['default']);
});
