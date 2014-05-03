module.exports = function (grunt) {
	grunt.initConfig({

		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			target: {
				src: 'src/js/**/*.js'
			}
		},

		csslint: {
			options: {
				csslintrc: '.csslintrc'
			},
			target: {
				src: 'src/css/**/*.css'
			}
		},

		copy: {
			dist: {
				cwd: 'src/', expand: true, src: '**', dest: 'dist/'
			}
		},

		concat: {
			options: {
				// separator: ';'
			},
			target: {
				src: ['dist/js/libs/jquery.js', 'dist/js/core.js', 'dist/js/sandbox.js', 'dist/js/modules/*.js'], // make sure jquery is loaded first
				dest: 'dist/js/compiled.js'
			}
		},

		uglify: {
			options: {
				mangle: true,
				compress: true,
				banner: '/* Test banner */\n'
			},
			target: {
				src: 'dist/js/compiled.js',
				dest: 'dist/scripts/compiled.min.js'
			}
		},

		uncss: {
			dist: {
				files: [
					{ src: 'src/*.html', dest: 'dist/css/compiled.min.css' }
				]
			}
		},

		cssmin: {
			options: {
				// banner: '/* My minified css file */'
			},
			target: {
				src: 'dist/css/*.css',
				dest: 'dist/styles/compiled.min.css'
			}
		},

		// Deletes all .js files, but skips min.js files
		clean: ['dist/js/', 'dist/css/'],

		processhtml: {
			dist: {
				files: {
					'dist/index.html': ['src/index.html']
				}
			}
		}

	});
	
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-csslint');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-uncss');
	
	//grunt.registerTask('default', ['jshint', 'csslint', 'copy', 'concat', 'uglify', 'cssmin', 'clean', 'processhtml']);
	grunt.registerTask('default', ['copy', 'concat', 'uglify', 'cssmin', 'clean', 'processhtml']);
	//grunt.registerTask('default', ['copy', 'concat', 'processhtml']);
}
