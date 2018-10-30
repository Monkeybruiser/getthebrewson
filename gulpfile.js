/*

	For initial install of plugins use below in order:

		npm init
		npm install gulp gutil --save-dev
		npm install gulp-notify jshint gulp-jshint gulp-concat gulp-uglify gulp-rename browser-sync gulp-postcss gulp-sourcemaps --save-dev
		npm install autoprefixer precss gulp-sass postcss-import css-mqpacker stylelint postcss-reporter --save-dev
		npm install postcss postcss-import postcss-url postcss-cssnext postcss-browser-reporter postcss-reporter --save-dev
		npm install postcss-color-rgba-fallback postcss-opacity postcss-pseudoelements postcss-vmin pixrem postcss-will-change cssnano fs postcss-style-guide --save-dev

		// Compression Extras
		npm install gulp-clean-css gulp-imagemin --save-dev

		// Prettier JS
		npm install prettier gulp-prettier-plugin --save-dev

		// Info for this one taken from here: http://alwaystwisted.com/articles/updating-dependencies-in-a-packagejson
		npm install npm-check-updates --save-dev

	To install from .json use:

		npm install

*/

// Include gulp
var gulp						= require('gulp');
var gutil 						= require('gulp-util');

// Task notify - https://www.npmjs.com/package/gulp-notify
var notify						= require("gulp-notify");

// JS Helpers
var jshint						= require('gulp-jshint');
var concat						= require('gulp-concat');
var uglify						= require('gulp-uglify');
var rename						= require('gulp-rename');

// Browser Sync for awesomeness - http://www.browsersync.io/docs/gulp/
var browserSync					= require('browser-sync');
var reload						= browserSync.reload;

// Bring in PostCSS
var postcss						= require('gulp-postcss');

// Source Map
var sourcemaps					= require('gulp-sourcemaps');

// Autoprefixer, CSSNEXT and PreCSS
var autoprefixer 				= require('autoprefixer');

var postcss_url					= require("postcss-url");
var postcss_cssnext				= require("postcss-cssnext");
var postcss_browser_reporter	= require("postcss-browser-reporter");
var postcss_reporter			= require("postcss-reporter");

var precss						= require('precss');
var sass						= require('gulp-sass');

// Import other files
var atImport					= require('postcss-import');

// Bring Media Queries into one
// var mqpacker					= require('css-mqpacker');

// CSS Lint
var stylelint					= require("stylelint");
var reporter					= require("postcss-reporter");

// Browser Support
var color_rgba_fallback 		= require('postcss-color-rgba-fallback');
var opacity 					= require('postcss-opacity');
var pseudoelements 				= require('postcss-pseudoelements');
var vmin 						= require('postcss-vmin');
var pixrem 						= require('pixrem'); // PX fallback for rem

// Strip and optimise CSS
var cssnano						= require('cssnano');
var cleanCSS 					= require('gulp-clean-css');

// Auto styleguide
var fs							= require('fs');
var styleGuide					= require('postcss-style-guide');
var processedCSS				= fs.readFileSync('src/style.scss', 'utf-8');

// Image optimisation
var imagemin					= require('gulp-imagemin');

// Prettier JS
var prettier					= require('gulp-prettier-plugin');



// Do all sorts of magic with CSS
gulp.task('css', function () {

	var processors = [
		atImport,
		autoprefixer({
			browsers: ['last 4 versions']
		}),
		//postcss_url,
		//postcss_cssnext,
		cssnano({
			zindex: false
		}), // Fixes z-index rebase issue
		precss,
		pseudoelements,
		postcss_browser_reporter,
		postcss_reporter,
	];

	return gulp.src([
			'!./src/style-local.scss',
			'./src/*.scss'
		])
		// create none sourcemap version
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(gulp.dest('./public/library/css'))
		// .pipe(notify("CSS compiled for <%= file.relative %>."));
		.pipe(notify({
			onLast: true,
			message: function(file) {
				return "All CSS Injected.";
			}
		}));

});



// Do all sorts of magic with CSS
gulp.task('css_op', function () {

	var processors = [
		atImport,
		autoprefixer({
			browsers: ['last 4 versions']
		}),
		cssnano({
			zindex: false
		}), // Fixes z-index rebase issue
		precss
	];

	return gulp.src('./src/style-local.scss')
		// create sourcemap version
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(postcss(processors))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest('./public/library/css'))
		.pipe(browserSync.stream());
		// .pipe(notify("Sourcemap added for <%= file.relative %>."))

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
	// .pipe(notify("Javascript has been linted"));

});



// Concatenate & Minify JS
gulp.task('scripts', function() {

    return gulp.src([
		"public/library/js/scripts.js",
		])
		.pipe(concat('all.js'))
		.pipe(gulp.dest('public/library/js/min'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('public/library/js/min'))
		// .pipe(notify("Javascript has been concatinated and uglified"));
		.pipe(notify({
			onLast: true,
			message: function(file) {
				return "All JS compiled.";
			}
		}));

});



// Re-run JS, CSS and Image optimisation
gulp.task('optimise', ['images'], function() {

	// CSS Optimisation tasks
	return gulp.src([
		'public/library/css/style.css',
		'public/library/css/ie.css',
		'public/library/css/login.css',
		])
		.pipe(cleanCSS({compatibility: 'ie9'}))
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log('Original ' + details.name + ': ' + details.stats.originalSize);
            console.log('New ' + details.name + ': ' + details.stats.minifiedSize);
        }))
	    .pipe(sourcemaps.write())
        .pipe(gulp.dest('public/library/css'))
		// .pipe(notify("CSS has been re-compressed for <%= file.relative %>"));

	// Image optimisation task
    return gulp.src('./public/library/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/library/images/'))
		// .pipe(notify("Theme images have been compressed"));

});



// Custom Critical CSS task
gulp.task('critical', ['css','css_op','optimise'], function() {

	return gulp.src('public/library/css/critical.css')
	    // convert it to a php file
	    .pipe(rename({
	        basename: 'critical-css',
	        extname: '.php'
	      }))
	    // insert it Wordpress theme folder
	    .pipe(gulp.dest('public/modules/'))
		.pipe(notify("Critical CSS file has been completed."));

});



// Watch files and act if they are changed
gulp.task('watch', function() {

	gulp.watch('public/library/js/*.js', ['lint', 'scripts']);

});



// Static Server + watching scss/html files
gulp.task('serve', ['critical'], function() {

	/*

		see http://www.browsersync.io/docs/options/#option-proxy

	*/
	browserSync.init({
		proxy: {
			target: "http://getthebrewson.mb",
			ws: true
		}
	});

	gulp.watch("src/**/*.scss", ['critical']);
    gulp.watch('public/library/js/scripts.js').on('change', browserSync.reload);
	gulp.watch(["public/**/*.php"]).on('change', browserSync.reload);

});



// Image optimisation task
gulp.task('images', function() {

    return gulp.src('./public/library/images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./public/library/images/'))

});



/*

	Run prettier on JS for formatting

	Taken from https://www.npmjs.com/package/gulp-prettier-plugin

	TODO - Make this do something with the gulp file without breaking it.

*/
gulp.task('prettier', () =>
    gulp
        // .src(['.public/library/js/scripts.js', './gulpfile.js'])
		.src('public/library/js/scripts.js')
        .pipe(
            prettier({
                trailingComma: 'all',
                singleQuote: true,
                bracketSpacing: true,
                useTabs: true,
                printWidth: 100,
            }
        )
    )
    .pipe(gulp.dest(file => file.base))
);



// Default Task
gulp.task('default', ['lint', 'scripts', 'watch', 'serve']);
