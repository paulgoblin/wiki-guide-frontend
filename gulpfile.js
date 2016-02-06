var gulp = require('gulp');
var sass = require('gulp-sass');
var rimraf = require('rimraf');
var webpack = require('webpack');
var gutil = require('gulp-util')
var webserver = require('gulp-webserver');
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
  rimraf('./dist/*', done)
})

// gulp.task('dev', ['sass','assets', 'bundle', 'templates']);

gulp.task('sass', ['clean'], function(done) {
  gulp.src(dirs.src.scss)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(minifyCss())
    .pipe(gulp.dest(dirs.out.css))
    .on('end', done);
});

gulp.task('assets', function() {
  gulp.src(dirs.src.lib)
    .pipe(gulp.dest(dirs.out.lib))
});

gulp.task('bundle', ['clean'], function(done) {
  webpack(require("./webpack.config.js"), function(err, stats) {
    if(err) throw new gutil.PluginError("webpack", err);
    gutil.log("[webpack]", stats.toString({}));
    done();
  });
});

gulp.task('templates', function(){
  return gulp.src(dirs.src.html)
    .pipe(gulp.dest(dirs.out.html))
})

gulp.task('serve', function() {
  gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false
    }));
});

gulp.task('watch', function() {
  gulp.watch(dirs.src.html, ['templates']);
  gulp.watch(dirs.src.lib, ['assets']);
  gulp.watch(dirs.src.scss, ['sass']);
  gulp.watch(dirs.src.js, ['bundle']);
});
