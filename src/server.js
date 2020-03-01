const express = require('express');
const app = express();
const client = require('./client');

app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to Cosm-OS.'))

app.post('/patreon/incoming', (req, res) => {
    client.channels.get(process.env.PATREON_CHANNEL_ID).send(
        "New Patreon Post\n" +
        "**" + req.body.attributes.title + "**\n" +
        "www.patreon.com/posts/" + req.body.id
    )
    res.send();
})

app.listen(process.env.PORT, () => console.log(`Web server listening on ${process.env.PORT}.`))