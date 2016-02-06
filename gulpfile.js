var gulp = require('gulp');
var sass = require('gulp-sass');
var minifyCss = require('gulp-minify-css');

var dirs = {
  src: {
    js: "src/app/**/*.js",
    scss: "src/app/**/*.scss",
    html: "src/app/**/*.html",
    lib: "src/assets/**/*"
  },
  out: {
    html: 'dist/',
    css: 'dist/',
    lib: 'dist/'
  }
}

gulp.task('default', ['sass','assets', 'bundle', 'templates']);

// gulp.task('dev', ['sass','assets', 'bundle', 'templates']);

gulp.task('sass', function(done) {
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

gulp.task('bundle', function() {
  gulp.src(dirs.src.lib)
    .pipe(gulp.dest(dirs.out.lib))
});

gulp.task('templates', function(){
  return gulp.src(dirs.src.html)
    .pipe(gulp.dest(dirs.out.html))
})

gulp.task('watch', function() {
  gulp.watch(dirs.src.html, ['templates']);
  gulp.watch(dirs.src.lib, ['assets']);
  gulp.watch(dirs.src.scss, ['sass']);
  gulp.watch(dirs.src.js, ['bundle']);
});
