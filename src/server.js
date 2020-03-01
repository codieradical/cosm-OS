const express = require('express');
const app = express();

app.get('/', (req, res) => res.send('Welcome to Cosm-OS.'))

app.listen(process.env.PORT, () => console.log(`Web server listening on ${port}.`))