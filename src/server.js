const express = require('express');
const app = express();
const client = require('./client');

app.get('/', (req, res) => res.send('Welcome to Cosm-OS.'))

app.post('/patreon/incoming', (req, res) => {
    console.log(req);
    client.channels.get(process.env.PATREON_CHANNEL_ID).send(JSON.stringify(req));
    res.send();
})

app.listen(process.env.PORT, () => console.log(`Web server listening on ${process.env.PORT}.`))