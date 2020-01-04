require('./extensions'); // prepare extension methods.
require('./modules'); // prepare command modules.

const client = require('./client');
const console = require('./console');

console.log("Logging in to Discord...");
client.login(process.env.BOT_TOKEN).then(() => {
  console.enable(); // Enable console io.
}).catch(() => {
  console.log('Failed to login.')
})
