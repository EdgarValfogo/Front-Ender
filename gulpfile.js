// gulpfile.js 
// Require the needed packages 
var gulp = require('gulp');
var jade = require('jade');
var gulpJade = require('gulp-jade');
var sass = require('gulp-sass');
var imageop = require('gulp-image-optimization');
var browserSync = require("browser-sync").create();
var ts = require("gulp-typescript");
var gutil = require('gulp-util');
var ftp = require("gulp-ftp");

// Diretório de Build
var buildDir = "./build/";
var devDir = "./dev/";

config = {
    bootstrapDir : './node_modules/bootstrap-sass/assets/stylesheets/',
    fontawesomeDir : './node_modules/font-awesome/scss/',
    jqueryDir : './node_modules/jquery/dist/',
    
    useJquery : true
};

/**
 * :: Pages : Processamento de páginas
 */
gulp.task( 'jade', function () {
  gulp.src( devDir + 'pages/*.jade')
    .pipe( gulpJade() )
    .pipe( gulp.dest( buildDir ) );
});
 
/**
 * :: Assets
 */

/**
 * CSS, SASS, SCSS, LESS
 */

/**
 * Compilação SCSS
 * O arquivo main.scss deverá incluir os necessários com @import
 */
gulp.task('sass', function() {
    gulp.src( devDir + 'assets/scss/main.scss' )
        .pipe( sass({
            /*outputStyle: 'compressed'*/
        }) )
        .pipe( gulp.dest( buildDir + "assets/css/" ) );
});

/**
 * Scripts
 */

/**
 * TypeScript
 * Os arquivos serão compilados para "js-compiled" e depois minificados com Uglify para a produção
 */
gulp.task( 'scriptsTsJs', function() {
    gulp.src( devDir + "assets/ts/main.ts")
        .pipe( ts() )
        .pipe( gulp.dest( devDir + 'assets/ts/js-compiled' ) );
    gulp.src( devDir + "assets/ts/js-compiled/*.js" )
        .pipe( gulp.dest( buildDir + 'assets/js/' ) );
        
    if( config.useJquery ) {
        gulp.src( config.jqueryDir + "jquery.min.js" )
            .pipe( gulp.dest( buildDir + "/assets/js/" ) );
    }
});

/**
 * Aprimoramento/Otimização para imagens
 */
gulp.task('images', function(cb) {
    gulp.src([ devDir + 'assets/img/**/*.png', devDir + 'assets/img/**/*.jpg', devDir + 'assets/img/**/*.gif', devDir + 'assets/img/**/*.jpeg']).pipe(imageop({
        optimizationLevel: 5,
        progressive: true,
        interlaced: true
    })).pipe(gulp.dest( buildDir + 'assets/img')).on('end', cb).on('error', cb);
});

// Serve Browser Sync
gulp.task('serve', ['compile-all'], function() {

    browserSync.init({
        server: buildDir
    });
    
    gulp.watch([
        buildDir + "/*.*"
    ], browserSync.reload );

    gulp.watch([
        devDir + "pages/*.jade",
        devDir + "assets/scss/main.scss",
        devDir + "assets/ts/*.ts"
        ], ['compile-all']);
});

gulp.task('deploy', function() {
    gulp.src( buildDir + "/**/*")
        .pipe(ftp({
            host: "",
            user: "",
            pass: "",
            remotePath: ""
        }))
        .pipe( gutil.noop() );
});

gulp.task('compile-all', [
        'jade',
        'sass',
        'scriptsTsJs',
        'images'    
      ], function() {
    
});

gulp.task('default', function(){
  gulp.start(
      /*'bootstrap-sass',*/
      'sass',
      'scriptsTsJs',
      'images',
      'jade');
});