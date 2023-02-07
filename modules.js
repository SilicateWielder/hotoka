///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: Loading and managing command files within Horsebot.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NOTES:
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const fs = require('node:fs');

class ModuleManager {
	constructor(dir) {
		this.dir = dir || './modules';
		this.modules = [];

		console.log('Module Management system initialized.')
	}

	load() {
		const dirExists = fs.existsSync(this.dir);

		if(!dirExists) {
			console.log(`Directory '${this.dir}' does not exist, creating it...`)
			fs.mkdirSync(this.dir);
			console.log(`\t...Directory created, no modules loaded.`);
			return;
		}
	
		console.log(`Searching directory '${this.dir}' for modules...`);

		const moduleFiles = fs.readdirSync(this.dir).filter(file => file.endsWith('.js'));

		console.log(`\t...Found ${moduleFiles.length} modules.`);

		for(const file of moduleFiles) {
			console.log(`Indexing ${this.dir}/${file}...`);

			let command = null

			try {
				command = require(this.dir + '/' + file);
				Object.freeze(command);
			} catch(e) {
				console.log('\t...Failed to load module: ' + e);
				console.log('\n');
				continue;
			}

			//if(command === null) continue;

			const commandExists = (this.commands[command.data.name] !== undefined)

			if(commandExists)
			{
				console.log('\t...Module exists, skipping.');
			}

			if(!commandExists) {
				this.publicListing.push(commandData);
				this.commands[command.data.name] = command;	
			}
		}
		
		Object.freeze(this.modules);

		let failed = moduleFiles.length - this.modules.length;
		console.log(`Loaded ${this.modules.length} of ${moduleFiles.length} modules, ${failed} modules contain errors.\n`)
	}
}

function test() {
	let sample = new ModuleManager();
	sample.load();

	console.log('\t' + Object.keys(sample.commands));
}

module.exports = ModuleManager
