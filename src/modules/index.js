const events = require('../events');

require('./adminModule');
require('./moneyModule');
require('./funModule');
require('./shoppingModule');
//require('./webcamModule');

const prefix = '>';

events.on('message', message => {
    if(message.content[0] !== prefix && message.channel.type !== 'dm')
        return;

    commandOffset = 0;
    if(message.content[0] === prefix) {
        commandOffset++;
    }

    var commandName = message.content.substring(commandOffset).getFirstWord();
    var commandBody = message.content.substring(commandName.length + commandOffset + 1);

    switch(commandName) {
        case 'help':
        case '?': {
            if(message.channel.type !== 'dm') {
                message.channel.send('check ur dms, yo')
            }
            message.author.send(`
**Welcome to Cosm-OS**
Commands are prefixed with "${prefix}".
Here, the prefix isn't required.
            `)
        }
    }

    if (message.content[0] === prefix || message.channel.type ==='dm') {
        events.emit('command', {
            ...message,
            commandName,
            commandBody
        });
    }
});