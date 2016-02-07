var gulp = require('gulp');
var sass = require('gulp-sass');
var ignore = require('gulp-ignore');
var del = require('del');
var gutil = require('gulp-util')
var minifyCss = require('gulp-minify-css');

var dirs = {
  src: {
    js: "src/app/**/*",
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

gulp.task('default', ['clean', 'sass', 'assets', 'bundle', 'watch']);

gulp.task('clean', function(){
  del('dist/*');
})

gulp.task('sass', function(done) {
  gulp.src(dirs.src.scss)
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(minifyCss())
    .pipe(gulp.dest(dirs.out.css))
    .on('end', done);
});

gulp.task('assets',['sass'], function() {
  gulp.src(dirs.src.lib)
    .pipe(gulp.dest(dirs.out.lib))
});

gulp.task('bundle', ['clean'], function(done) {
  gulp.src('src/app/index.html')
    .pipe(gulp.dest('dist'))
  gulp.src(dirs.src.js)
    .pipe(ignore('index.html'))
    .pipe(gulp.dest('dist/js'))
    .on('end', done)
});

var stream
gulp.task('serve', function() {
  stream = gulp.src('dist')
    .pipe(webserver({
      livereload: true,
      directoryListing: false
    }));
});

gulp.task('watch', function() {
  gulp.watch(dirs.src.html, ['assets', 'bundle']);
  gulp.watch(dirs.src.lib, ['assets']);
  gulp.watch(dirs.src.scss, ['sass']);
  gulp.watch(dirs.src.js, ['bundle']);
});
