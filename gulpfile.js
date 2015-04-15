'use strict';

var gulp = require('gulp');
var gulpLoadPlugins = require('gulp-load-plugins');


var plugins = gulpLoadPlugins({
	pattern: ['gulp-*', 'gulp.*',
		'del',
		'autoprefixer-core',
		'run-sequence',
		'main-bower-files',
		'minimist',
		'lazypipe'
	], // the glob(s) to search for
	//config: 'package.json', // where to find the plugins, by default  searched up from process.cwd()
	scope: ['dependencies', 'devDependencies', 'peerDependencies'], // which keys in the config to look within
	replaceString: /^gulp(-|\.)/, // what to remove from the name of the module when adding it to the context
	camelize: true, // if true, transforms hyphenated plugins names to camel case
	lazy: true, // whether the plugins should be lazy loaded on demand
	rename: {
		'gulp-if': 'gulpif',
		'autoprefixer-core': 'autoprefixer'
	} // a mapping of plugins to rename
});

// parse environment
var options = plugins.minimist(process.argv.slice(2), {
	string: 'env',
	default: {
		env: 'dev'
	}
});

var localConfig;
try {
	localConfig = require('./server/config/local.env');
} catch (e) {
	localConfig = {};
}
gulp.task('clean', plugins.del.bind(null, ['.tmp', 'dist']));
gulp.task('html', function() {
	var assets = plugins.useref.assets({
		searchPath: '{.tmp,app}'
	});

	var jsChannel = lazypipe()
		.pipe(plugins.requirejsOptimize, {
			name: '../lib/bower/almond/almond',

			optimize: 'none',
			useStrict: true,

			mainConfigFile: 'app/scripts/config/prod-config.js',
			baseUrl: 'app/scripts',

			include: ['main'],
			insertRequire: ['main']
		})
		.pipe(plugins.uglify);

	var libChannel = lazypipe()
		.pipe(plugins.uglify);

	var cssChannel = lazypipe()
		.pipe(plugins.minifyCss)
		.pipe(plugins.replace, '../lib/bower/bootstrap/fonts/', '../fonts/');

	var htmlChannel = lazypipe()
		.pipe(plugins.minifyHtml);

	return gulp.src('app/*.html')
		//.pipe(plugins.debug({title: 'gulp.src:'}))
		.pipe(assets)
		//.pipe(plugins.debug({title: 'gulpif1 mainjs before:'}))
		.pipe(plugins.gulpif('**/scripts/main.js', jsChannel()))
		// //.pipe(plugins.debug({title: 'gulpif2 libjs before:'}))
		.pipe(plugins.gulpif('**/lib/*.js', libChannel()))
		// // .pipe(plugins.debug({title: 'gulpif3 css before:'}))
		.pipe(plugins.gulpif('**/*.css', cssChannel()))
		// //.pipe(plugins.debug({title: 'rev before:'}))
		.pipe(plugins.rev())
		//.pipe(plugins.debug({title: 'restore before:'}))
		.pipe(assets.restore())
		//	.pipe(plugins.debug({title: 'restore after:'}))
		.pipe(plugins.useref())
		//	.pipe(plugins.debug({title: 'useref  after:'}))
		.pipe(plugins.revReplace())
		//.pipe(debug())
		.pipe(plugins.gulpif('**/*.html', htmlChannel()))
		//.pipe(debug())
		.pipe(gulp.dest('dist'));
});

gulp.task('serve', function() {

})
