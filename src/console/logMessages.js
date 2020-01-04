const events = require('../events')

function enable() {
    events.on('message', message => {
        console.log(`${message.author.username}#${message.author.discriminator}: ${message.content}`); 
    });
}

module.exports = {
    enable
}