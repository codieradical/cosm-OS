const events = require('../events')
const { getUserByDiscordId } = require('../database');

events.on('command', async message => {
    if (message.commandName === 'help') {
        message.author.send(`**Shopping:**
    shopping add
    \    Add an item to your shopping list.
    shopping remove
    \    Remove an item from your shopping list.
    shopping list (or slist)
    \    Display your shopping list.
    shopping clear
    \    Empty your shopping list.
        `);
    }

    if (message.commandName === 'slist') {
        message.commandBody = 'list ' + message.commandBody;
        message.commandName = 'shopping';
    }

    if (message.commandName !== 'shopping')
        return;

    message.commandName = message.commandBody.getFirstWord();
    message.commandBody = message.commandBody.substring(message.commandName.length + 1);

    switch(message.commandName) {
        case 'add': {
            const user = await getUserByDiscordId(message.author.id);
            const items = message.commandBody.split(new RegExp(', |,', 'g'));
            user.shopping = [...user.shopping, ...items];
            await user.save();
            message.channel.send(`Added ${message.commandBody} to your shopping list.`);
            return;
        }
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