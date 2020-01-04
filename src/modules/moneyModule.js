const events = require('../events')
const { getUserByDiscordId } = require('../database');

events.on('command', async message => {
    if (message.commandName === 'help') {
        message.author.send(`**Money:**
    money setallowance
        Set a regular allowance amount.
        eg. setallowance 9
    money setinterval
        Set an allowance interval.
        This is how often you recieve your allowance, in days.
        Any leftover money goes into savings.
    money setcurrency
        The currency symbol displayed.
    money reset
        Resets your balance and savings.
    spend
        Subtracts an amount from your balance.
    balance
        Displays your balance.
    savings
        Displays your savings.
        `);
    }

    if(message.commandName === 'money') {
        message.commandName = message.commandBody.getFirstWord();
        message.commandBody = message.commandBody.substring(message.commandName.length + 1);
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
        }
    }

    switch(message.commandName) {
        case 'spend': {
            const user = await getUserByDiscordId(message.author.id);
            if (!user.allowanceBegan) {
                message.channel.send(`You have not set an allowance yet. Type >help to see more.`);
                return;
            }
            await updateMoney(user);
            user.balance -= Number.parseFloat(message.commandBody);
            await user.save();
            message.channel.send(`Spent ${user.currency}${Number.parseFloat(message.commandBody)}. Remaining balance: ${user.currency}${user.balance}`);
            return;
        }
        case 'balance': {
            const user = await getUserByDiscordId(message.author.id);
            if (!user.allowanceBegan) {
                message.channel.send(`You have not set an allowance yet. Type >help to see more.`);
                return;
            }
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
            if (!user.allowanceBegan) {
                message.channel.send(`You have not set an allowance yet. Type >help to see more.`);
                return;
            }
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