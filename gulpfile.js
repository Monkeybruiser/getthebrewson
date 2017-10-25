/*

	For initial install of plugins use below in order:

		npm init
		npm install gulp --save-dev
		npm install gulp-notify jshint gulp-jshint gulp-concat gulp-uglify gulp-rename browser-sync gulp-postcss gulp-sourcemaps --save-dev
		npm install autoprefixer cssnext precss gulp-sass postcss-import css-mqpacker stylelint postcss-reporter --save-dev
		npm install postcss-color-rgba-fallback postcss-opacity postcss-pseudoelements postcss-vmin pixrem postcss-will-change cssnano fs postcss-style-guide --save-dev

	To install from .json use:

		npm install

*/

// Include gulp
var gulp					= require('gulp');

// Task notify - https://www.npmjs.com/package/gulp-notify
var notify					= require("gulp-notify");

// JS Helpers
var jshint					= require('gulp-jshint');
var concat					= require('gulp-concat');
var uglify					= require('gulp-uglify');
var rename					= require('gulp-rename');

// Browser Sync for awesomeness - http://www.browsersync.io/docs/gulp/
var browserSync				= require('browser-sync');
var reload					= browserSync.reload;

// Bring in PostCSS
var postcss					= require('gulp-postcss');

// Source Map
var sourcemaps				= require('gulp-sourcemaps');

// Autoprefixer, CSSNEXT and PreCSS
var autoprefixer 			= require('autoprefixer');
var cssnext					= require('cssnext');
var precss					= require('precss');
var sass					= require('gulp-sass');

// Import other files
var atImport				= require('postcss-import');

// Bring Media Queries into one
var mqpacker				= require('css-mqpacker');

// CSS Lint
var stylelint				= require("stylelint");
var reporter				= require("postcss-reporter");

// Browser Support
var color_rgba_fallback 	= require('postcss-color-rgba-fallback');
var opacity 				= require('postcss-opacity');
var pseudoelements 			= require('postcss-pseudoelements');
var vmin 					= require('postcss-vmin');
var pixrem 					= require('pixrem'); // PX fallback for rem
var will_change 			= require('postcss-will-change');

// Strip and optimise CSS
var cssnano					= require('cssnano');

// Auto styleguide
var fs						= require('fs');
var styleGuide				= require('postcss-style-guide');
var processedCSS			= fs.readFileSync('src/style.scss', 'utf-8');



// Do all sorts of magic with CSS
gulp.task('css', function () {
	var processors = [
        autoprefixer({
			browsers: ['last 4 versions']
		}),
		will_change,
		atImport,
		cssnano({
			zindex: false
		}), // Fixes z-index rebase issue
		precss,
		cssnext,
		color_rgba_fallback,
		opacity,
		pseudoelements,
		vmin,
		pixrem,
		/*
		mqpacker({
			sort: true
		}),
		*/
	];
	return gulp.src('./src/*.scss')
	    .pipe(sourcemaps.init())
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
	    .pipe(sourcemaps.write())
        .pipe(gulp.dest('./public/library/css'))
		.pipe(browserSync.stream())
        .pipe(notify("CSS has been compiled and organised."));
});



// Create a styleguide
gulp.task('guide', function () {
    return gulp.src('src/style.scss')
        .pipe(postcss([
            require('postcss-style-guide')({
                name: "Project name",
                processedCSS: processedCSS,
                dir: 'public/styleguide/'
            })
        ]))
        .pipe(gulp.dest('public/styleguide/'))
});



// Lint JS
gulp.task('lint', function() {
    return gulp.src('public/library/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(notify("Javascript has been linted"));
});



// Concatenate & Minify JS
gulp.task('scripts', function() {
    return gulp.src([
		// "public/library/js/libs/jquery.fitvids.js",
		"public/library/js/libs/jquery.cookies.js",
		"public/library/js/scripts.js",
		])
        .pipe(concat('all.js'))
        .pipe(gulp.dest('public/library/js/min'))
        .pipe(rename('all.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/library/js/min'))
        .pipe(notify("Javascript has been concatinated and uglified"));
});



// Watch files and act if they are changed
gulp.task('watch', function() {
	gulp.watch('public/library/js/*.js', ['lint', 'scripts']);
	//gulp.watch('src/*.scss', ['css']);
});


// Static Server + watching scss/html files
gulp.task('serve', ['css'], function() {

	/*

		see http://www.browsersync.io/docs/options/#option-proxy

	*/
	browserSync.init({
		proxy: {
			target: "http://getthebrewson.mb",
			ws: true
		}
	});

	gulp.watch("src/**/*.scss", ['css']);
	//gulp.watch("src/*.css", ['guide']);
    gulp.watch('public/library/js/scripts.js').on('change', browserSync.reload);
	gulp.watch("public/**/*.php").on('change', browserSync.reload);
});


// Default Task
//gulp.task('default', ['css', 'lint', 'scripts', 'guide', 'watch', 'serve']);
gulp.task('default', ['lint', 'scripts', 'watch', 'serve']);
