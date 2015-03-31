// Generated on 2015-03-10 using generator-angular-fullstack 2.0.13
'use strict';

module.exports = function(grunt) {
	var localConfig;
	try {
		localConfig = require('./server/config/local.env');
	} catch (e) {
		localConfig = {};
	}

	// Load grunt tasks automatically, when needed
	require('jit-grunt')(grunt, {
		express: 'grunt-express-server',
		useminPrepare: 'grunt-usemin',
		ngtemplates: 'grunt-angular-templates',
		cdnify: 'grunt-google-cdn',
		buildcontrol: 'grunt-build-control'
	});

	// Time how long tasks take. Can help when optimizing build times
	require('time-grunt')(grunt);

	// Define the configuration for all the tasks
	grunt.initConfig({

		// Project settings
		pkg: grunt.file.readJSON('package.json'),
		rippleok: {
			// configurable paths
			client: require('./bower.json').appPath || 'client',
			dist: 'dist'
		},
		express: {
			options: {
				port: process.env.PORT || 9000
			},
			dev: {
				options: {
					script: 'server/app.js',
					debug: true
				}
			},
			prod: {
				options: {
					script: 'dist/server/app.js'
				}
			}
		},
		open: {
			server: {
				url: 'http://localhost:<%= express.options.port %>'
			}
		},
		watch: {
			injectJS: {
				files: [
					'<%= rippleok.client %>/{app,components}/**/*.js',
					'!<%= rippleok.client %>/{app,components}/**/*.spec.js',
					'!<%= rippleok.client %>/{app,components}/**/*.mock.js',
					'!<%= rippleok.client %>/app/app.js'
				],
				tasks: ['injector:scripts']
			},
			injectCss: {
				files: [
					'<%= rippleok.client %>/{app,components}/**/*.css'
				],
				tasks: ['injector:css']
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			livereload: {
				files: [
					'{.tmp,<%= rippleok.client %>}/{app,components}/**/*.css',
					'{.tmp,<%= rippleok.client %>}/{app,components}/**/*.html',
					'{.tmp,<%= rippleok.client %>}/{app,components}/**/*.js',
					'!{.tmp,<%= rippleok.client %>}{app,components}/**/*.spec.js',
					'!{.tmp,<%= rippleok.client %>}/{app,components}/**/*.mock.js',
					'<%= rippleok.client %>/assets/img/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
				],
				options: {
					livereload: true
				}
			},
			express: {
				files: [
					'server/**/*.{js,json}'
				],
				tasks: ['express:dev', 'wait'],
				options: {
					livereload: true,
					nospawn: true //Without this option specified express won't be reloaded
				}
			}
		},

		// Make sure code styles are up to par and there are no obvious mistakes
		jshint: {
			options: {
				jshintrc: '<%= rippleok.client %>/.jshintrc',
				reporter: require('jshint-stylish')
			},
			server: {
				options: {
					jshintrc: 'server/.jshintrc'
				},
				src: [
					'server/**/*.js',
					'!server/**/*.spec.js'
				]
			},
			serverTest: {
				options: {
					jshintrc: 'server/.jshintrc-spec'
				},
				src: ['server/**/*.spec.js']
			},
			all: [
				'<%= rippleok.client %>/{app,components}/**/*.js',
				'!<%= rippleok.client %>/{app,components}/**/*.spec.js',
				'!<%= rippleok.client %>/{app,components}/**/*.mock.js'
			],
			test: {
				src: [
					'<%= rippleok.client %>/{app,components}/**/*.spec.js',
					'<%= rippleok.client %>/{app,components}/**/*.mock.js'
				]
			}
		},

		// Empties folders to start fresh
		clean: {
			dist: {
				files: [{
					dot: true,
					src: [
						'.tmp',
						'<%= rippleok.dist %>/*',
						'!<%= rippleok.dist %>/.git*',
						'!<%= rippleok.dist %>/.openshift',
						'!<%= rippleok.dist %>/Procfile'
					]
				}]
			},
			server: '.tmp'
		},

		// Add vendor prefixed styles
		autoprefixer: {
			options: {
				browsers: ['last 2 version']
			},
			dist: {
				src: '.tmp/concat/assets/{,*/}*.css'
					//dest: '.tmp/'
			},
			dev: {}
		},

		// Debugging with node inspector
		'node-inspector': {
			custom: {
				options: {
					'web-host': 'localhost'
				}
			}
		},

		// Use nodemon to run server in debug mode with an initial breakpoint
		nodemon: {
			debug: {
				script: 'server/app.js',
				options: {
					nodeArgs: ['--debug-brk'],
					env: {
						PORT: process.env.PORT || 9000
					},
					callback: function(nodemon) {
						nodemon.on('log', function(event) {
							console.log(event.colour);
						});

						// opens browser on initial server start
						nodemon.on('config:update', function() {
							setTimeout(function() {
								require('open')('http://localhost:8080/debug?port=5858');
							}, 500);
						});
					}
				}
			}
		},

		// Automatically inject Bower components into the app
		wiredep: {
			target: {
				src: ['<%= rippleok.client %>/index.html',
					'<%= rippleok.client %>/ledger/gateway.html',
					'<%= rippleok.client %>/ledger/account.html'
				],
				ignorePath: '<%= rippleok.client %>/',
				exclude: [/bootstrap-sass-official/, '/json3/', '/es5-shim/']
			}
		},

		// Renames files for browser caching purposes
		filerev: {
			dist: {
				src: [
					'<%= rippleok.dist %>/public/{,*/}*.js',
					'<%= rippleok.dist %>/public/{,*/}*.css',
					'<%= rippleok.dist %>/public/assets/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= rippleok.dist %>/public/assets/fonts/*'
				]
			}
		},

		// Reads HTML for usemin blocks to enable smart builds that automatically
		// concat, minify and revision files. Creates configurations in memory so
		// additional tasks can operate on them
		useminPrepare: {
			target1: {
				src: ['<%= rippleok.client %>/index.html'],
				options: {
					dest: '<%= rippleok.dist %>/public'
				}
			},
			target2: {
				src: ['<%= rippleok.client %>/ledger/account.html', '<%= rippleok.client %>/ledger/gateway.html'],
				options: {
					dest: '<%= rippleok.dist %>/public/ledger'
				}
			},
		},

		// Performs rewrites based on rev and the useminPrepare configuration
		usemin: {
			html: ['<%= rippleok.dist %>/public/{,*/}*.html'],
			css: ['<%= rippleok.dist %>/public/{,*/css/}*.css'],
			js: ['<%= rippleok.dist %>/public/{,*/js/}*.js'],
			options: {
				assetsDirs: ['<%= rippleok.dist %>/public', '<%= rippleok.dist %>/public/assets/img'],
				blockReplacements: {
					// our 'replacement block'
					libjs: function(block) {
						return '<script src="' + block.dest + '"></script>';
					},
					libcss: function(block) {
							return '<link rel="stylesheet" href="' + block.dest + '" />';
						}
						// no need to redefine default blocks
				},
				// This is so we update image references in our ng-templates
				patterns: {
					js: [
						[/(assets\/img\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved img']
					]
				}
			}
		},

		// The following *-min tasks produce minified files in the dist folder
		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= rippleok.client %>/assets/img',
					src: '{,*/}*.{png,jpg,jpeg,gif}',
					dest: '<%= rippleok.dist %>/public/assets/img'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= rippleok.client %>/assets/img',
					src: '{,*/}*.svg',
					dest: '<%= rippleok.dist %>/public/assets/img'
				}]
			}
		},

		// Allow the use of non-minsafe AngularJS files. Automatically makes it
		// minsafe compatible so Uglify does not destroy the ng references
		ngAnnotate: {
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/concat',
					src: '**/**.js',
					dest: '.tmp/concat'
				}]
			}
		},

		// Package all the html partials into a single javascript payload
		ngtemplates: {
			options: {
				// This should be the name of your apps angular module
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				}

			},
			rippleok: {
				cwd: '<%= rippleok.client %>',
				src: ['{app,components}/**/*.html'],
				dest: '.tmp/rippleok-templates.js',
				options:{
					module: 'rippleokApp',
					usemin: 'assets/js/rippleok.min.js'
				}
			},
			// tmp: {
			// 	cwd: '.tmp',
			// 	src: ['{app,components}/**/*.html'],
			// 	dest: '.tmp/tmp-templates.js'
			// },
			account: {
				cwd: '<%= rippleok.client %>',
				src: ['components/footer/*.html'],
				dest: '.tmp/account-templates.js',
				options: {
					module: 'accountApp',
					prefix: '../',
					usemin: 'js/account.min.js'
				}
			},
      gateway: {
				cwd: '<%= rippleok.client %>',
				src: ['components/footer/*.html'],
				dest: '.tmp/gateway-templates.js',
				options: {
					module: 'gatewayApp',
					prefix: '../',
					usemin: 'js/gateway.min.js'
				}
			}
		},

		// Replace Google CDN references
		cdnify: {
			dist: {
				html: ['<%= rippleok.dist %>/public/*.html']
			}
		},

		// Copies remaining files to places other tasks can use
		copy: {
			dist: {
				files: [{
					expand: true,
					dot: true,
					cwd: '<%= rippleok.client %>',
					dest: '<%= rippleok.dist %>/public',
					src: [
						'*.{ico,png,txt}',
						'.htaccess',
						'assets/img/{,*/}*.{ico,webp}',
						'assets/fonts/**/*',
						'index.html',
						'ledger/*.html',
						'ledger/img/*'
					]
				}, {
					expand: true,
					cwd: '.tmp/img',
					dest: '<%= rippleok.dist %>/public/assets/img',
					src: ['generated/*']
				}, {
					expand: true,
					dest: '<%= rippleok.dist %>',
					src: [
						'package.json',
						'server/**/*'
					]
				}]
			},
			styles: {
				expand: true,
				cwd: '<%= rippleok.client %>',
				dest: '.tmp/',
				src: ['{app,components}/**/*.css']
			}
		},

		buildcontrol: {
			options: {
				dir: 'dist',
				commit: true,
				push: true,
				connectCommits: false,
				message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
			},
			heroku: {
				options: {
					remote: 'heroku',
					branch: 'master'
				}
			},
			openshift: {
				options: {
					remote: 'openshift',
					branch: 'master'
				}
			}
		},

		// Run some tasks in parallel to speed up the build process
		concurrent: {
			server: [],
			test: [],
			debug: {
				tasks: [
					'nodemon',
					'node-inspector'
				],
				options: {
					logConcurrentOutput: true
				}
			},
			dist: [
				'imagemin',
				'svgmin'
			]
		},
		env: {
			test: {
				NODE_ENV: 'test'
			},
			prod: {
				NODE_ENV: 'production'
			},
			all: localConfig
		},

		injector: {
			options: {},
			// Inject application script files into index.html (doesn't include bower)
			scripts: {
				options: {
					relative: true,
					starttag: '<!-- injector:js -->',
					endtag: '<!-- endinjector -->'
				},
				files: {
					'<%= rippleok.client %>/index.html': [
						'{.tmp,<%= rippleok.client %>}/assets/**/*.js',
						'{.tmp,<%= rippleok.client %>}/{app,components}/**/*.js',
						'!{.tmp,<%= rippleok.client %>}/app/app.js',
						'!{.tmp,<%= rippleok.client %>}/{app,components,assets}/**/*.spec.js',
						'!{.tmp,<%= rippleok.client %>}/{app,components,assets}/**/*.mock.js'
					],
					'<%= rippleok.client %>/ledger/account.html': [
						'{.tmp,<%= rippleok.client %>}/assets/**/*.js',
						'{.tmp,<%= rippleok.client %>}/ledger/account/**/*.js',
						'!{.tmp,<%= rippleok.client %>}/assets/**/ripple-gateways.js',
						'!{.tmp,<%= rippleok.client %>}/assets/**/ripple-price.js'
					],
					'<%= rippleok.client %>/ledger/gateway.html': [
						'{.tmp,<%= rippleok.client %>}/assets/**/*.js',
						'{.tmp,<%= rippleok.client %>}/ledger/gateway/**/*.js',
						'!{.tmp,<%= rippleok.client %>}/assets/**/ripple-price.js'
					]
				}
			},

			// Inject component css into index.html
			css: {
				options: {
					relative: true,
					starttag: '<!-- injector:css -->',
					endtag: '<!-- endinjector -->'
				},
				files: {
					'<%= rippleok.client %>/index.html': [
						'<%= rippleok.client %>/{app,components,assets}/**/*.css'
					],
					'<%= rippleok.client %>/ledger/account.html': [
						'<%= rippleok.client %>/assets/**/*.css'
					],
					'<%= rippleok.client %>/ledger/gateway.html': [
						'<%= rippleok.client %>/assets/**/*.css'
					]
				}
			}
		},
	});

	// Used for delaying livereload until after server has restarted
	grunt.registerTask('wait', function() {
		grunt.log.ok('Waiting for server reload...');

		var done = this.async();

		setTimeout(function() {
			grunt.log.writeln('Done waiting!');
			done();
		}, 1500);
	});

	grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
		this.async();
	});

	grunt.registerTask('serve', function(target) {
		if (target === 'dist') {
			return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
		}

		if (target === 'debug') {
			return grunt.task.run([
				'clean:server',
				'env:all',
				'concurrent:server',
				'injector',
				'wiredep',
				'autoprefixer:dev',
				'concurrent:debug'
			]);
		}

		grunt.task.run([
			'clean:server',
			'env:all',
			'concurrent:server',
			'injector',
			'wiredep',
			'autoprefixer:dev',
			'express:dev',
			'wait',
			'open',
			'watch'
		]);
	});

	grunt.registerTask('server', function() {
		grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
		grunt.task.run(['serve']);
	});

	grunt.registerTask('build', [
		'clean:dist',
		'concurrent:dist',
		'injector',
		'wiredep',
		'useminPrepare',
		'ngtemplates',
		'concat',
		'autoprefixer',
		'ngAnnotate',
		'copy:dist',
		//'cdnify',
		'cssmin',
		'uglify',
		//'filerev',
		'usemin'
	]);

	grunt.registerTask('default', [
		'newer:jshint',
		'build'
	]);
};
