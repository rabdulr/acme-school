const express = require('express');
const app = express();
const path = require('path');
const db = require('./src/database/db')

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;

db.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${ port }`)
        });
    });
