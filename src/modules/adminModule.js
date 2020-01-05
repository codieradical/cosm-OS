const Discord = require('discord.js');
const events = require('../events');
const fs = require('fs');

events.on('command', async message => {
    if (message.author.id !== process.env.OPERATOR_DISCORD_ID) {
        message.channel.send("You're not allowed to use this command.")
        return;
    }

    switch(message.commandName) {
        case '?':
            case 'help': {
                message.author.send(`
**Admin:**
*These commands can only be accessed by the bot operator.*
__eval__
    Executes JavaScript code.
__file__
    Retrieve a file by it's path.
                `);
                return;
            }
        case 'eval': {
            try {
                eval(message.commandBody);
            } catch (err) {
                message.channel.send("Error evaluating JavaScript.");
            }
            return;
        }
        case 'file': {
            const exists = fs.existsSync(message.commandBody);
            if(!exists) {
                message.channel.send('File not found');
                return;
            } else {
                try {
                    await message.channel.send(new Discord.Attachment(message.commandBody));
                } catch(err) {
                    console.log(err);
                    message.channel.send('Something went wrong. The file is probably too big, yo.')
                }
            }
        }
    }
})