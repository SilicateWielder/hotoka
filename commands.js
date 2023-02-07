///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Purpose: Loading and managing command files within Horsebot.
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//
// NOTES:
//
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const builders = require('@discordjs/builders');
const fs = require('node:fs');

class CommandManager {
	constructor(dir) {
		this.dir = dir || './commands';
		this.publicListing = [];
		this.commands = [];

		console.log('Command Management system initialized.')
	}

	load() {
		// Check if the commands directory exists, if it doesn't create it then return null;
		const dirExists = fs.existsSync(this.dir);
	
			if(!dirExists) {
				console.log(`Directory '${this.dir}' does not exist, creating it...`)
				fs.mkdirSync(this.dir);
				console.log(`\t...Directory created, no modules loaded.`);
				return;
			}
	
		console.log(`Searching directory '${this.dir}' for commands...`);

		const commandFiles = fs.readdirSync(this.dir).filter(file => file.endsWith('.js'));

		console.log(`\t...Found ${commandFiles.length} commands.`);

		for(const file of commandFiles) {
			console.log(`Indexing ${this.dir}/${file}...`);

			let command = null

			try {
				command = require(this.dir + '/' + file);
				Object.freeze(command);
			} catch(e) {
				console.log('\t...Failed to load command: ' + e);
				console.log('\n');
				continue;
			}

			//if(command === null) continue;

			const commandExists = (this.commands[command.data.name] !== undefined)

			if(commandExists)
			{
				console.log('\t...Command exists, skipping.');
			}

			if(!commandExists) {
				let commandData = null;

				// Used to load more complex commands.
				if(command.builder !== undefined) {
					console.log('\t...Importing slash command.');

					commandData = command.builder(builders.SlashCommandBuilder);
				}

				if(command.builder === undefined) {
					console.log('\t...Importing basic command, building manually.');

					commandData = {
						name: command.data.name,
						description: command.data.description
					}
				}

				this.publicListing.push(commandData);
				this.commands[command.data.name] = command;	
			}
		}

		Object.freeze(this.publicListing);
		Object.freeze(this.commands);

		let failed = commandFiles.length - this.publicListing.length;
		console.log(`Loaded ${this.publicListing.length} of ${commandFiles.length} commands, ${failed} commands contain errors.\n`)
	}
}

function test() {
	let sample = new CommandManager('./commands');
	sample.load();

	console.log('\t' + Object.keys(sample.publicListing));
	console.log('\t' + Object.keys(sample.commands));
}

module.exports = CommandManager;
