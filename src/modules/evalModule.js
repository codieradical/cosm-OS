const events = require('../events')

events.on('command', message => {
    switch(message.commandName) {
        case '?':
            case 'help': {
                message.author.send(`
**Eval:**
__eval__
    Executes JavaScript code.
    Only the bot operator can use this command.
                `);
                return;
            }
        case 'eval': {
            if (message.author.id !== process.env.OPERATOR_DISCORD_ID) {
                message.channel.send("You're not allowed to use this command.")
                return;
            }
            eval(message.commandBody);
            return;
        }
    }
})