const events = require('../events');

//require('./evalModule');
require('./moneyModule');
require('./funModule');
require('./shoppingModule');

const prefix = '>';

events.on('message', message => {
    var commandName = message.content.substring(1).getFirstWord();
    var commandBody = message.content.substring(commandName.length + 2);

    if(commandName === 'help') {
        message.channel.send('check ur dms, yo')
    }

    if (message.content[0] === prefix) {
        events.emit('command', {
            ...message,
            commandName,
            commandBody
        });
    }
});