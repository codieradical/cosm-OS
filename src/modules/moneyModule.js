const events = require('../events')
const { getUserByDiscordId } = require('../database');

events.on('command', async message => {
    switch(message.commandName) {
        case 'setallowance': {
            const user = await getUserByDiscordId(message.author.id);
            user.allowance = Number.parseFloat(message.commandBody);
            user.savings = 0;
            user.balance = user.allowance;
            user.allowanceBegan = new Date().getTime();
            user.allowanceLastUpdate = user.allowanceBegan;
            await user.save();
            message.channel.send(`Your allowance is now ${user.currency}${user.allowance}.`);
            return;
        }
        case 'setinterval': {
            const user = await getUserByDiscordId(message.author.id);
            await updateMoney(user);
            const intervalDays = Number.parseInt(message.commandBody);
            user.allowanceInterval = Number.parseInt(message.commandBody) * (24 * 60 * 60 * 1000);
            await user.save();
            message.channel.send(`Your balance will now be reset every ${intervalDays} days.`);
            return;
        }
        case 'setcurrency': {
            const user = await getUserByDiscordId(message.author.id);
            user.currency = message.commandBody;
            await user.save();
            message.channel.send(`Your currency is now ${user.currency}.`);
            return;
        }
        case 'reset': {
            const user = await getUserByDiscordId(message.author.id);
            const savings = user.savings;
            const fromDate = new Date(user.allowanceBegan);
            user.savings = 0;
            user.balance = user.allowance;
            user.allowanceBegan = new Date().getTime();
            user.allowanceLastUpdate = user.allowanceBegan;
            await user.save();
            message.channel.send(`Allowance Reset. Since ${fromDate.toDateString()} you saved ${user.currency}${savings}.`);
            return;
        }
        case 'spend': {
            const user = await getUserByDiscordId(message.author.id);
            await updateMoney(user);
            user.balance -= Number.parseFloat(message.commandBody);
            await user.save();
            message.channel.send(`Spent ${user.currency}${Number.parseFloat(message.commandBody)}. Remaining balance: ${user.currency}${user.balance}`);
            return;
        }
        case 'balance': {
            const user = await getUserByDiscordId(message.author.id);
            await updateMoney(user);
            const nextUpdate =
                user.allowanceBegan + (
                    (Math.floor((user.allowanceLastUpdate - user.allowanceBegan) / user.allowanceInterval) + 1)
                    * user.allowanceInterval
                );
            const nextDate = new Date(nextUpdate);
            message.channel.send(`You have ${user.currency}${user.balance} remaining until ${nextDate.toDateString()}.`);
            return;
        }
        case 'savings': {
            const user = await getUserByDiscordId(message.author.id);
            await updateMoney(user);
            const fromDate = new Date(user.allowanceBegan);
            message.channel.send(`Since ${fromDate.toDateString()} you have saved ${user.currency}${user.savings}.`);
            return;
        }
    }
})

async function updateMoney(user) {
    const lastUpdateIntervalBegan =
        user.allowanceBegan + (
            Math.floor((user.allowanceLastUpdate - user.allowanceBegan) / user.allowanceInterval) // Get the amount of iterations so far (0)
            * user.allowanceInterval
        );

    var pendingUpdates = Math.floor((new Date().getTime() - lastUpdateIntervalBegan) / user.allowanceInterval);

    for (; pendingUpdates > 0; pendingUpdates--) {
        user.savings += user.balance;
        user.balance = user.allowance;
    }

    user.allowanceLastUpdate = new Date().getTime();
    await user.save();
}