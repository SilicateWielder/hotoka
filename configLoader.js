let fs = require('fs');

function parseString(source) {
	return new String(source);
}

function parseBigInt(source) {
	return BigInt(source);
}

function parseBoolean(source) {
	return new Boolean(source);
}

// Learned this is called "Dispatching on the type" pretty neat.
const converters = {
	string: value => value,
	number: value => parseFloat(value),
	bigint: value => BigInt(value),
	boolean: value => value === 'true',
}

function objectToProperties(obj) {
	let catKeys = Object.keys(obj);

	let groups = {};
	let result = '';

	for(const key of catKeys) {
		const isArray = (typeof obj[key] === 'object');

		if(!isArray) {
			console.error('Array item "' + key + '", is not an object, and has been skipped. Please wrap this in an associative array.\n');
		};

		if(isArray) groups[key] = obj[key];
	}

	/////////////////////////////////////////////////////////

	for(const [groupId, group] of Object.entries(groups)) {
		result += `[${groupId}]\n`;

		for(const [entryName, entryValue] of Object.entries(group)) {
			result += `${entryName}=${group[entryName]}\n`;
		}
		
		result += '\n';
	}

	return result;
}

function propertiesToObject(properties, reference) {
	const lines = properties.split('\n');
	const obj = {};

	let currentGroup = '';

	for(const line of lines) {
		let groupTag = (line[0] === '[')

		if(groupTag) {
			currentGroup = line.slice(1, -1);

			if(obj[currentGroup] === undefined) obj[currentGroup] = {};
		}

		if(line.includes('=')) {
			let pieces = line.split('=');

			let label = pieces[0];

			pieces.shift();

			let originType = 'string'
			
			let referenceExists = reference !== undefined;
			let groupExists = (referenceExists) ? reference[currentGroup] !== undefined : false;
			let labelExists = (groupExists) ? reference[currentGroup][label] !== undefined : false;

			if(labelExists) originType = typeof reference[currentGroup][label];
			
			let value = pieces.join('=');

			obj[currentGroup][label] = converters[originType](value);
		}
	}

	return obj;
}



function loadConfig(path, format) {
	const fileExists = fs.existsSync(path);
	const formatAvailable = format !== undefined && typeof format === 'object'

	if(!fileExists && formatAvailable) {
		console.log('No configuration file available... Creating ${path}')

		let defaultConfigRaw = JSON.toString(format);

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

let sampleConfig = {
	general: {
		name: 'Gamebot',
		version: '0.2',
		rev: 1
	},

	config: {
		token: '84329104o3jh143h4i32h413h2o41i3412jk4l3j2k14',
		hashKey: '4391-4083904-01434190-3418-43821-9048908490-31'
	}
}

console.log('Original')
console.log(sampleConfig);

let file = objectToProperties(sampleConfig);

console.log('\n Result');
console.log(propertiesToObject(file, sampleConfig));
