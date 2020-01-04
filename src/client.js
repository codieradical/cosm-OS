const events = require('./events');
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    client.user.setPresence({ game: { name: 'the stars.', type: 'WATCHING' } })
  });

client.on('message', msg => {
    if (msg.author.id === client.user.id) return;
    events.emit('message', msg)
});

module.exports = client;