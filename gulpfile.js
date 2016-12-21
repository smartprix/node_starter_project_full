const smWebpack = require('sm-webpack-config');
const gulp = require('gulp');

const config = {
	sourceMap: true,
	devServerPort: 3001,
	appPort: 3000,
};

// The development server (the recommended option for development)
gulp.task('default', function(callback) {
    smWebpack.runDevServer({config}).then(callback);
});

// Build files for production
gulp.task('build', function(callback) {
    smWebpack.runProdWebpack().then(callback);
});
