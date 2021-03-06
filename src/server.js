const express = require('express');
const app = express();
const client = require('./client');

app.use(express.json());

app.get('/', (req, res) => res.send('Welcome to Cosm-OS.'))

app.post('/patreon/incoming', (req, res) => {
    console.log("Patreon Webhook Incoming", req.body.data)
    client.channels.get(process.env.PATREON_CHANNEL_ID).send(
        "<@&755886739796656228>\n" +
        "New Patreon Post!\n" +
        "**" + req.body.data.attributes.title + "**\n" +
        "https://www.patreon.com/posts/" + req.body.data.id
    )
    res.send();
})

app.listen(process.env.PORT, () => console.log(`Web server listening on ${process.env.PORT}.`))
