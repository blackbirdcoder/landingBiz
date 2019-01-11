//Gulp file v.2.0.0 beta (появилась возможность взаимодействовать с PHP
//browser-sync изменил функционал, а также gulp начал следить за файлами .php)
//ВНИМАНИЕ: Каждый проект требует индивидуальной настройки.
//Для проекта "landing-business.hw"
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
    plumber      = require('gulp-plumber'),
    //для работы с php
    php          = require('gulp-connect-php');
    
    
//---ЗАДАЧИ---   

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

//Настраиваем сервер для работы с php
gulp.task('php', function(){
    php.server({base:'app', port:8080, keepalive:true});
});

//ЗАДАЧА BROWSER SYNC ДЛЯ BACK-END 
//(работа с PHP), ПОЗВОЛЯЕТ РАБОТАТЬ И С FRONT-END
//Если нет необходимости работать с PHP можно закомментировать
gulp.task('browser-sync',['php'], function(){
    browserSync.init({
        proxy:"landing-business.hw",
        baseDir: "app",
        open:true,
        notify:false
    });
});

//ЗАДАЧА BROWSER SYNC ДЛЯ FRONTEND
//ПРОСТАЯ СИНХРОНИЗАЦИЯ ДЛЯ FRONTEND РАЗРАБОТКИ
//Походит для клиентской части сайт.
// gulp.task('browser-sync', function(){
// 	browserSync({
//         open: false,
// 		server: { 
//             baseDir: 'app',
//             routes: {"/node_modules": "node_modules"},
// 		}, notify: false
// 	});
// });

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
    return gulp.src(['!app/img/res_ico/**/*', '!app/img/res_ico', 'app/img/**/*.+(png|jpg|gif|svg)'])
    .pipe(cache(imagemin({
        interlaced: true,
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        une: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

//---НАБЛЮДЕНИЕ---

gulp.task('watch', ['browser-sync', 'pug-run', 'sass', 'css-min', 'scripts-min'],function(){
    //наблюдаю за PUG и перезагружаю браузер 
    gulp.watch('app/pug/**/*.pug', ['pug-run'], browserSync.reload);
	gulp.watch(['app/sass/**/*.scss', 'app/sass/**/*.sass' ], ['sass']);
	gulp.watch('app/*.html', browserSync.reload);
    gulp.watch('app/js/**/*.js', browserSync.reload);
    //для наблюдаю за файлами php и перезагружаю браузер 
    gulp.watch('app/php/**/*.php' ,browserSync.reload);
});

//---СБОРКА---

gulp.task('build', ['clear', 'clear-cache', 'img', 'sass', 'scripts-min'], function(){
    
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
            .pipe(gulp.dest('dist/old-browser')); 
//PHP файлы            
    var buildPhp = gulp.src('app/php/**/*')
            .pipe(gulp.dest('dist/php'));                
});