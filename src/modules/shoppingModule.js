const events = require('../events')
const { getUserByDiscordId } = require('../database');

events.on('command', async message => {
    switch(message.commandName) {
        case '?':
        case 'help': {
            message.author.send(`
**Shopping:**
*These commands can also be accessed using the alias "s"*
__shopping add__
    Add an item to your shopping list.
__shopping remove__
    Remove an item from your shopping list.
__shopping list__ (or just "__shopping__")
    Display your shopping list.
__shopping clear__
    Empty your shopping list.
            `);
            return;
        }
        default:
            return;
        case 'shopping':
        case 's':
            break;
    }

    message.commandName = message.commandBody.getFirstWord();
    message.commandBody = message.commandBody.substring(message.commandName.length + 1);

    if(message.commandName.isWhitespace()) {
        message.commandName = 'list';
    }

    switch(message.commandName) {
        case 'add': {
            const user = await getUserByDiscordId(message.author.id);
            const items = message.commandBody.split(new RegExp(', |,', 'g'));
            user.shopping = [...user.shopping, ...items];
            await user.save();
            message.channel.send(`Added ${message.commandBody} to your shopping list.`);
            return;
        }
        case 'rem':
        case 'remove': {
            const user = await getUserByDiscordId(message.author.id);
            const items = message.commandBody.split(new RegExp(', |,', 'g'));
            user.shopping = user.shopping.filter(item => items.indexOf(item) < 0);
            await user.save();
            message.channel.send(`Removed ${message.commandBody} from your shopping list.`);
            return;
        }
        case 'list': {
            const user = await getUserByDiscordId(message.author.id);
            if (user.shopping.length <= 0)
                message.channel.send(`Your shopping list is empty.`);
            else
                message.channel.send(`Your shopping list:\n  - ${user.shopping.join('\n  - ')}`);
            return;
        }
        case 'clear': {
            const user = await getUserByDiscordId(message.author.id);
            user.shopping = [];
            await user.save();
            message.channel.send(`Cleared your shopping list.`);
            return;
        }
    }
})