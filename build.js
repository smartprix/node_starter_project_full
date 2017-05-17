const smWebpack = require('sm-webpack-config');

const command = process.argv[2] || 'default';

const userConfig = {
	sourcePath: 'res/basic',
	destPath: 'static/dist/basic',
	publicUrl: '/static/dist/basic',
	devServerPort: 3001,
	appPort: 3000,
};

if (command === 'default' || command === 'run-user') {
	smWebpack.runDevServer({config: userConfig}).then(() => {
		console.log("Running Dev Server (Admin)!");
	});
}
else if (command === 'build') {
	Promise.all([
		smWebpack.runProdWebpack({config: userConfig}),
	]).then(() => {
		console.log("Done!");
	});
}
