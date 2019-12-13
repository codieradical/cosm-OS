const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ game: { name: 'the stars.', type: 'WATCHING' } })
});

client.on('message', msg => {
    if (msg.author.id === client.user.id) return;

    if (msg.content === '❤️') {
        msg.channel.send('❤️'); 
    }
    if (msg.content.toLowerCase().replace('\'', '') === 'im a baa') {
        msg.channel.send('baa'); 
    }
    console.log(`${msg.author.username}#${msg.author.discriminator}: ${msg.content}`);
});

client.login(process.env.BOT_TOKEN);