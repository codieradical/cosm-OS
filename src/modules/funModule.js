const events = require('../events')

events.on('message', message => {
    if (message.content === '❤️') {
        message.channel.send('❤️'); 
    }

    if (message.content.toLowerCase().replace('\'', '') === 'im a baa') {
        message.channel.send('baa'); 
    }

    if (message.content.toLowerCase().replace('\'', '') === 'cosm-os i love you') {
        message.channel.send('centi i love you'); 
    }

    if (message.content.toLowerCase().replace('\'', '') === 'cosm-os show me epic robin') {
        message.channel.send('sweb'); 
    }
});

events.on('command', async message => {
    switch(message.commandName) {
        case '?':
        case 'help': {
            message.author.send(`
**Fun:**
It's screen real estate.
            `);
            return;
        }
        default:
            return;
        case 'shopping':
        case 's':
            break;
    }
});