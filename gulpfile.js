var gulp = require('gulp');
var sass = require('gulp-sass')
var sourcemaps = require("gulp-sourcemaps")
var babel = require("gulp-babel")
var concat = require("gulp-concat")

gulp.task('sass', function() {
    return gulp.src('scss/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('css'))
})

gulp.task('watch', ['babel', 'sass'], function() {
    gulp.watch('scss/**/*.scss', ['sass'])
    gulp.watch('src/**/*.js', ['babel'])
})

gulp.task("babel", function() {
    return gulp.src("src/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel())
        .pipe(concat("all.js"))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("js/"))
})
