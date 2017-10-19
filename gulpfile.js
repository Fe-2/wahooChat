var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
gulp.task('skin', function() {
    return gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(autoprefixer({
            browsers: ['last 4 versions'],
            cascade: true,
        }))
        .pipe(gulp.dest('./css'))
});
gulp.task('watch-sass',function(){
    gulp.watch('./sass/*.scss',['skin']);
})