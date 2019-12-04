const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    if (msg.author.id === client.user.id) return;
    
    if (msg.content.toLowerCase().indexOf('goodnight') >= 0) {
        msg.channel.send(`Goodnight, <@${msg.author.id}>`);
    }
    if (msg.content === '❤️') {
        msg.channel.send('❤️'); 
    }
    console.log(`${msg.author.username}#${msg.author.discriminator}: ${msg.content}`);
});

client.login(process.env.BOT_TOKEN);