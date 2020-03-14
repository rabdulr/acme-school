const { Client } = require('pg');

const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/acme_school');

client.connect();

module.exports = {
    client,
};