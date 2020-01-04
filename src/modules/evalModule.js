const events = require('../events')

events.on('command', message => {
    switch(message.commandName) {
        case 'eval': {
            eval(message.commandBody);
            return;
        }
    }
})