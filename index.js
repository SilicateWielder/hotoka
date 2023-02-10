const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { Client, Intents, MessageEmbed} = require('discord.js');
const builders = require('@discordjs/builders');
const voice = require('@discordjs/voice')
const fs = require('node:fs');

const configLoader = require('./configLoader.js');

const toolbox = require('./toolbox.js');

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Configuration Setup.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const CONFIG_TEMPLATE = {
	CLIENT_INFO: {
		id: '1234567890ABCDEFGHI',
		token: '1234567890ABCDEFGHIJKLMNOP.123456.1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZab'
	},

	CLIENT_META: {
		name: 'Hotoka',
		ver: '0.1.6',
		buildType: 'Alpha',
		botColor: 0x0EE08B,
		commandCount: 0
	},

	CLIENT_ADMIN: {
		id: '1234567890ABCDEFGHI',
		guild: '1234567890ABCDEFGHI'
	}
}

const LOADED_CONFIG = configLoader('./config.properties', CONFIG_TEMPLATE);
const CLIENT_INFO = LOADED_CONFIG.CLIENT_INFO;
const CLIENT_META = LOADED_CONFIG.CLIENT_META;
const CLIENT_ADMIN = LOADED_CONFIG.CLIENT_ADMIN;

let origin_sample = JSON.stringify(CONFIG_TEMPLATE);
let real_sample = JSON.stringify(LOADED_CONFIG);
if(origin_sample === real_sample) {
	console.error(`SETUP ERROR: Please edit config.properties with your appropriate bot configuration.`);
	process.exit();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const BOT_TEMPLATES = {
	footer: `${CLIENT_META.name} - Version ${CLIENT_META.ver} ${CLIENT_META.buildType}`
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let BOT_TASKS_CACHE = {};

function getTaskId(guild, command) {
	return guild + '_' + command;
}

function checkTaskExists(taskId) {
	return (BOT_TASKS_CACHE[taskId] === undefined || BOT_TASKS_CACHE[taskId] === null) ? false : true;
}

function createTask(taskId) {	
	if(BOT_TASKS_CACHE[taskId] === undefined || BOT_TASKS_CACHE[taskId] === null) BOT_TASKS_CACHE[taskId] = [];
}

let tasks = {
	Cache: BOT_TASKS_CACHE,
	Create: createTask,
	Exists: checkTaskExists,
	GetId: getTaskId
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load modules and index them appropriately.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// WIP.
const moduleManager = require('./modules.js');
let modIndex = new moduleManager();
modIndex.load();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load commands and refresh them with Discord.
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const commandManager = require('./commands.js');
let cmdIndex = new commandManager();
cmdIndex.load();

const rest = new REST({ version: '9' }).setToken(CLIENT_INFO.token);

(async () => {
	try {
		console.log(`All commands ${cmdIndex.publicListing.length} loaded, refreshing slash commands with Discord...`);

		await rest.put(
			Routes.applicationGuildCommands(CLIENT_INFO.id, CLIENT_ADMIN.guild),
			{ body: cmdIndex.publicListing },
		);

		console.log('Successfully refreshed slash commands.');
		CLIENT_META.commandCount = cmdIndex.publicListing.length;
	} catch (error) {
		console.error(error);
	}
})();

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const client = new Client({
	intents: [
		Intents.FLAGS.GUILDS,
		Intents.FLAGS.GUILD_MESSAGES,
		Intents.FLAGS.GUILD_VOICE_STATES
	]
});

const extenders = {
	Client: client,
	ClientInfo: CLIENT_META,
	Templates: BOT_TEMPLATES,
	MessageEmbed: MessageEmbed,
	Builders: builders,
	Voice: voice,
	Tasks: tasks
};

client.once('ready', () => {
	console.log(CLIENT_META.name + ' is ready, awaiting commands.');
	client.user.setPresence({ activities: [{ name: 'anime', type:'WATCHING' }] });
});

client.on('interactionCreate', async interaction => {
	if(!interaction.isCommand()) return;

	if(cmdIndex.commands[interaction.commandName] != undefined) cmdIndex.commands[interaction.commandName].func(interaction, extenders);
});


// Looks like I had a template so this is easy!1
client.on('messageCreate', async interaction => {

	if (interaction.author.bot) return;

	// Future code for handling user interaction. 
	// TODO: Implement Language model interaction.
});

client.login(CLIENT_INFO.token);
