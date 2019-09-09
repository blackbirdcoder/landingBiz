// Gulp file v.2.0.0 beta (now you can interact with PHP
// browser-sync changed the functionality, and also gulp started to monitor .php files)
// ATTENTION: Each project requires individual settings.
// For the project "landing-business.hw"
var gulp = require("gulp"),
  sass = require("gulp-sass"),
  browserSync = require("browser-sync"),
  concat = require("gulp-concat"),
  uglify = require("gulp-uglifyjs"),
  cssnano = require("gulp-cssnano"),
  rename = require("gulp-rename"),
  del = require("del"),
  imagemin = require("gulp-imagemin"),
  pngquant = require("imagemin-pngquant"),
  cache = require("gulp-cache"),
  autoprefixer = require("gulp-autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  pug = require("gulp-pug"),
  spritesmith = require("gulp.spritesmith"),
  plumber = require("gulp-plumber"),
  //to work with php
  php = require("gulp-connect-php");

//---TASKS---

gulp.task("sass", function() {
  return gulp
    .src(["app/sass/**/*.scss", "app/sass/**/*.sass"])
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle: "expanded" }).on("error", sass.logError))
    .pipe(
      autoprefixer(["last 15 versions", "> 1%", "ie 8", "ie 7"], {
        cascade: true
      })
    )
    .pipe(sourcemaps.write("."))
    .pipe(gulp.dest("app/css"))
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task("scripts-min", function() {
  return gulp
    .src("app/libs/jquery/dist/jquery.js")
    .pipe(concat("libs.min.js"))
    .pipe(uglify())
    .pipe(gulp.dest("app/js"));
});

gulp.task("css-min", function() {
  return gulp
    .src(["app/css/base-style.css", "app/css/final-style.css"])
    .pipe(cssnano())
    .pipe(rename({ suffix: ".min" }))
    .pipe(gulp.dest("app/css"));
});

// Set up the server to work with php
gulp.task("php", function() {
  php.server({ base: "app", port: 8080, keepalive: true });
});

// BROWSER SYNC TASK FOR BACK-END
// (work with PHP), LETS WORK WITH FRONT-END
// If you do not need to work with PHP, you can comment
gulp.task("browser-sync", ["php"], function() {
  browserSync.init({
    proxy: "landing-business.hw",
    baseDir: "app",
    open: true,
    notify: false
  });
});

// BROWSER SYNC TASK FOR FRONTEND
// SIMPLE SYNCHRONIZATION FOR FRONTEND DEVELOPMENT
// Suitable for the client side of the site.
// gulp.task('browser-sync', function(){
// 	browserSync({
//         open: false,
// 		server: {
//             baseDir: 'app',
//             routes: {"/node_modules": "node_modules"},
// 		}, notify: false
// 	});
// });

// I do the PUG task (changes in the path and exceptions added)
gulp.task("pug-run", function buildHTML() {
  return gulp
    .src(["!app/pug/section/**/*.pug", "app/pug/*.pug"])
    .pipe(plumber()) // plumber
    .pipe(
      pug({
        pretty: true
      })
    )
    .pipe(gulp.dest("app"));
});

gulp.task("clear", function() {
  return del.sync("dist");
});

gulp.task("clear-cache", function() {
  return cache.clearAll();
});

// I do a task for working with sprites
gulp.task("sprite", function() {
  var spriteData = gulp.src("app/img/res_ico/*.png").pipe(
    spritesmith({
      imgName: "sprite.png",
      imgPath: "../img/sprite.png",
      cssName: "_sprite.scss"
    })
  );
  return (
    spriteData.img.pipe(gulp.dest("app/img")),
    spriteData.css.pipe(gulp.dest("app/sass/sprite/"))
  ); //изменил путь
});

//changes added exceptions
gulp.task("img", function() {
  return gulp
    .src([
      "!app/img/res_ico/**/*",
      "!app/img/res_ico",
      "app/img/**/*.+(png|jpg|gif|svg)"
    ])
    .pipe(
      cache(
        imagemin({
          interlaced: true,
          progressive: true,
          svgoPlugins: [{ removeViewBox: false }],
          une: [pngquant()]
        })
      )
    )
    .pipe(gulp.dest("dist/img"));
});

//---watch---

gulp.task(
  "watch",
  ["browser-sync", "pug-run", "sass", "css-min", "scripts-min"],
  function() {
    gulp.watch("app/pug/**/*.pug", ["pug-run"], browserSync.reload);
    gulp.watch(["app/sass/**/*.scss", "app/sass/**/*.sass"], ["sass"]);
    gulp.watch("app/*.html", browserSync.reload);
    gulp.watch("app/js/**/*.js", browserSync.reload);
    gulp.watch("app/php/**/*.php", browserSync.reload);
  }
);

//---build---

gulp.task(
  "build",
  ["clear", "clear-cache", "img", "sass", "scripts-min"],
  function() {
    var buildCss = gulp.src("app/css/*").pipe(gulp.dest("dist/css"));

    var buildFonts = gulp.src("app/fonts/**/*").pipe(gulp.dest("dist/fonts"));

    var buildJs = gulp.src("app/js/**/*").pipe(gulp.dest("dist/js"));

    var buildHtml = gulp.src("app/*.html").pipe(gulp.dest("dist"));
    var buildStub = gulp
      .src("app/old-browser/**/*")
      .pipe(gulp.dest("dist/old-browser"));
    var buildPhp = gulp.src("app/php/**/*").pipe(gulp.dest("dist/php"));
  }
);
