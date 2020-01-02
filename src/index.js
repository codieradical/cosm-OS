const Discord = require('discord.js');
const client = new Discord.Client();
const { enterSelection: selectChannel } = require('./channelSelection');
var channelId = undefined;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setPresence({ game: { name: 'the stars.', type: 'WATCHING' } })

  selectChannel(client).then(_channelId => {
    channelId = _channelId
  
    console.clear();
    console.log(`Now chatting with ${client.guilds.get(client.channels.get(channelId).guild.id).name} in #${client.channels.get(channelId).name}`)
    process.stdin.resume();
    process.stdin.on('data', data => {
      client.channels.get(channelId).send(data)
    });
  });
});

client.on('message', msg => {
    if (msg.author.id === client.user.id) return;

    if (msg.content === '❤️') {
        msg.channel.send('❤️'); 
    }

    if (msg.content.toLowerCase().replace('\'', '') === 'im a baa') {
        msg.channel.send('baa'); 
    }

    // This command is very dangerous don't enable it unless you're stupid like me.
    // - Codie
    // if (msg.content.indexOf('eval ') > -1) {
    //   eval(msg.content.replace('eval ', ''));
    //   return;
    // }

    if(channelId && msg.channel.id === channelId) {
      console.log(`${msg.author.username}#${msg.author.discriminator}: ${msg.content}`); 
    }
});

client.login(process.env.BOT_TOKEN);