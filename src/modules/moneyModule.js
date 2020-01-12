const events = require('../events')
const { getUserByDiscordId } = require('../database');

events.on('command', async message => {
    switch(message.commandName) {
        case '?':
        case 'help': {
            message.author.send(`
**Money:**
__setallowance__
    Set a regular allowance amount.
    eg. setallowance 9
__setinterval__
    Set an allowance interval.
    This is how often you recieve your allowance, in days.
    Any leftover money goes into savings.
__setcurrency__
    The currency symbol displayed.
__resetallowance__
    Resets your balance and savings.
__ spend__
    Subtracts an amount from your balance.
__balance__
    Displays your balance.
__savings__
    Displays your savings.
            `);
            return;
        }

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

        case 'resetallowance': {
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

        case 'pay':
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
        case 'bal':
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
            const lastUpdateIntervalBegan =
            user.allowanceBegan + (
                Math.floor((user.allowanceLastUpdate - user.allowanceBegan) / user.allowanceInterval) // Get the amount of iterations so far (0)
                * user.allowanceInterval
            );
            const perDay = 
                (
                    user.balance / 
                    Math.ceil(
                        (
                            user.allowanceInterval - // allowance interval in ms
                            ( new Date().getTime() - lastUpdateIntervalBegan) // ms since last update
                        ) / (24 * 60 * 60 * 1000)
                    )
                ).toFixed(2)
            message.channel.send(`You have ${user.currency}${user.balance} ${user.allowanceInterval !== 1 ? `(${user.currency}${perDay} per day)` : ''} remaining until ${nextDate.toDateString()}.`);
            return;
        }
        case 'saved':
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