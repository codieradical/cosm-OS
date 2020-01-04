const chat = require('./chat');
const logCommands = require('./logCommands');
const logMessages = require('./logMessages');

function enable() {
    console.log('cosm-os is running yo')
    //chat.enterSelection();
    logCommands.enable();
}

module.exports = console;
module.exports.enable = enable;