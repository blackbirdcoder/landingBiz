//  gulp v.0.5.1 beta (test)
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
    plumber      = require('gulp-plumber'),
    htmlbeautify = require('gulp-html-beautify');
    
    
   
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
            //Изменения
	'app/css/base-style.css',
        'app/css/final-style.css'
	])
		.pipe(cssnano())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('app/css'));
});

gulp.task('browser-sync', function(){
	browserSync({
		server: { 
			baseDir: 'app'
		}, notify: false
	});
});
//Задача для htmlbeautify (оформления html раметки после препроцессора)
gulp.task('htmlbeautify', function() {
  var options = { indentSize: 2,
      unformatted: [
            // https://www.w3.org/TR/html5/dom.html#phrasing-content
            // удалённые из массива теги будут форматироваться как блочные
            'abbr', 'area', 'b', 'bdi', 'bdo', 'br', 'cite',
            'code', 'data', 'datalist', 'del', 'dfn', 'em', 'embed', 'i', 'ins',
            'kbd', 'keygen', 'map', 'mark', 'math', 'meter', 'noscript',
            'object', 'output', 'progress', 'q', 'ruby', 's', 'samp', 'small',
            'strong', 'sub', 'sup', 'template', 'time', 'u', 'var', 'wbr', 'text',
            'acronym', 'address', 'big', 'dt', 'ins', 'strike', 'tt','span', 'a'
        ]
    };
  gulp.src('app/*.html')
    .pipe(htmlbeautify(options))
    .pipe(gulp.dest('app'));
});
  
//Делаю задачу PUG (изменения в пути и добавленны исключения)
gulp.task('pug-run', function buildHTML(){
    return gulp.src(['!app/pug/section/**/*.pug', 'app/pug/*.pug'])
            .pipe(plumber()) // plumber
            .pipe(pug()) //Убрал указания pug "упорядочить" теги
            .pipe(gulp.dest('app'))
            .pipe(htmlbeautify()); //htmlbeautify
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

gulp.task('watch', ['sprite', 'browser-sync', 'pug-run', 'sass', 'css-min', 'scripts-min'],function(){
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
});