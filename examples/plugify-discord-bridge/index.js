const Plugify = require('../..');
const Discord = require('discord.js');
require('dotenv').config();

const plugifyClient = new Plugify.Client();
const discordClient = new Discord.Client({ intents: [Discord.Intents.FLAGS.GUILDS, Discord.Intents.FLAGS.GUILD_MESSAGES] });

plugifyClient.on('ready', () => {
    console.log('[PJS] Ready!');
});

discordClient.on('ready', () => {
    console.log('[DJS] Ready!');
});

plugifyClient.on('messageNew', message => {
    if (!message.content.startsWith('(FWD) ')) return;
    discordClient.channels.cache.get(process.env.DISCORD_CHANNEL).send(`**@${message.authorName}**: ${message.content.substring(6)}`);
});

discordClient.on('messageCreate', message => {
    if (message.author.bot) return;
    plugifyClient.channels.cache.get(process.env.PLUGIFY_CHANNEL).send(`**${message.author.username}#${message.author.discriminator}**: ${message.content}`);
});

plugifyClient.login({
    token: process.env.PLUGIFY_TOKEN,
    joinChannel: process.env.PLUGIFY_CHANNEL,
});

discordClient.login(process.env.DISCORD_TOKEN);