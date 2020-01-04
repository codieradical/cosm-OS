const client = require('./client');
const console = require('./console');
require('./modules');

console.log("Logging in to Discord...");
client.login(process.env.BOT_TOKEN).then(() => {
  console.enable();
}).catch(() => {
  console.log('Failed to login.')
})
