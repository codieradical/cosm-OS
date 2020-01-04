const events = require('../events');

//require('./evalModule');
require('./moneyModule');
require('./funModule');

const prefix = '>';

events.on('message', message => {
    var commandName = message.content.substring(1).split(' ')[0];
    var commandBody = message.content.substring(commandName.length + 2);

    if (message.content[0] === prefix) {
        events.emit('command', {
            ...message,
            commandName,
            commandBody
        });
    }
});