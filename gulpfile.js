//  gulp v.1.1.0 beta (browser-sync добавил новые опции, а также в таске bulid добавлен
// перенос папки с "заглушкой" для старых браузеров в папку dist)
//  задачи для проекта "landing-business.hw", который выполняю в рамках курса ITVDN
var gulp         = require('gulp'),
    sass         = require('gulp-sass'),
    browserSync  = require('browser-sync'),
    concat       = require('gulp-concat'),
    uglify       = require('gulp-uglifyjs'),
    cssnano      = require('gulp-cssnano'),
    rename       = require('gulp-rename'),
    del          = require('del'),
    imagemin     = require('gulp-imagemin'),
    pngquant     = require('imagemin-pngquant'),
    cache        = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer'),
    sourcemaps   = require('gulp-sourcemaps'),
    pug          = require('gulp-pug'),
    spritesmith  = require('gulp.spritesmith'),
    plumber      = require('gulp-plumber');
    
    
   
gulp.task('sass', function() {
	return gulp.src(['app/sass/**/*.scss', 'app/sass/**/*.sass' ])
        .pipe(sourcemaps.init())
		.pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
        .pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'],
                {cascade: true}))
        .pipe(sourcemaps.write('.'))        
		.pipe(gulp.dest('app/css'))
		.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts-min', function(){
	return gulp.src('app/libs/jquery/dist/jquery.js')
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('app/js'));
});

gulp.task('css-min', function(){
	return gulp.src([
	'app/css/base-style.css',
        'app/css/final-style.css'
	])
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function(){
	browserSync({
        open: false,
		server: { 
            baseDir: 'app',
            routes: {"/node_modules": "node_modules"},
		}, notify: false
	});
});

//Делаю задачу PUG (изменения в пути и добавлены исключения)
gulp.task('pug-run', function buildHTML(){
    return gulp.src(['!app/pug/section/**/*.pug', 'app/pug/*.pug'])
            .pipe(plumber()) // plumber
            .pipe(pug({
                pretty: true
            }))
            .pipe(gulp.dest('app'));
});

gulp.task('clear', function(){
    return del.sync('dist');
});

gulp.task('clear-cache', function(){
    return cache.clearAll();
});

//Делаю задачу для работы со спрайтами
gulp.task('sprite', function () {
  var spriteData = gulp.src('app/img/res_ico/*.png').pipe(spritesmith({
    imgName: 'sprite.png',
    imgPath: '../img/sprite.png',
    cssName: '_sprite.scss'
  }));
  return spriteData.img.pipe(gulp.dest('app/img')),
         spriteData.css.pipe(gulp.dest('app/sass/sprite/'));  //изменил путь      
});

//Провёл изменения добавил исключения
gulp.task('img', function(){
    return gulp.src(['!app/img/res_ico/**/*', '!app/img/res_ico', 'app/img/**/*/'])
            .pipe(cache(imagemin({
                interlaced: true,
                progressive: true,
                svgoPlugins: [{removeViewBox: false}],
                une: [pngquant()]
            })))
            .pipe(gulp.dest('dist/img'));
});

gulp.task('watch', ['browser-sync', 'pug-run', 'sass', 'css-min', 'scripts-min'],function(){
    //наблюдаю за PUG и перезагружаю браузер 
        gulp.watch('app/pug/**/*.pug', ['pug-run'], browserSync.reload);
	gulp.watch(['app/sass/**/*.scss', 'app/sass/**/*.sass' ], ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
	gulp.watch('app/js/**/*.js', browserSync.reload);
});

gulp.task('bulid', ['clear', 'clear-cache', 'img', 'sass', 'scripts-min'], function(){
    
    var buildCss = gulp.src('app/css/*')
            .pipe(gulp.dest('dist/css'));
    
    var buildFonts = gulp.src('app/fonts/**/*')
            .pipe(gulp.dest('dist/fonts'));
    
    var buildJs = gulp.src('app/js/**/*')
            .pipe(gulp.dest('dist/js'));
    
    var buildHtml = gulp.src('app/*.html')
            .pipe(gulp.dest('dist'));

//"Заглушка" для старых браузеров проноситься в папку dist
    var buildStub = gulp.src('app/old-browser/**/*')
            .pipe(gulp.dest('dist'));        
});