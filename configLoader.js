let fs = require('fs');

function loadConfig(path, format) {
	const fileExists = fs.existsSync(path);
	const formatAvailable = format !== undefined && typeof format === 'object'

	if(!fileExists && formatAvailable) {
		console.log('No configuration file available... Creating ${path}')

		let defaultConfig = JSON.toString(format);

		fs.mkdirSync(path, { recursive: true }, error => {
			if(error) {
				console.error('Error creating directory.');
				return;
			}

			if(!error) {
				console.log('Created directory!');
			}
		});

		fs.writeFile(path, defaultConfig, error => {
			if(error) {
				console.error('Error when creating config file.')
				return;
			}

			if(!error) {
				console.log('Created configuration file with default values.');
			}
		});

		return format;
	}
}
