const { Client } = require('pg');
const client = new Client(process.env.DATABASE_URL || 'postgres://localhost/acme_school');

client.connect();

const sync = async() => {
    const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS students;
    DROP TABLE IF EXISTS schools;

    CREATE TABLE schools(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        CHECK (CHAR_LENGTH(name) > 0)
    );

    CREATE TABLE students(
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        "schoolId" UUID REFERENCES schools(id),
        name VARCHAR(100) NOT NULL,
        CHECK (CHAR_LENGTH(name) > 0)
    );
    `;

    client.query(SQL);

    const [ calPoly, UCI, cuesta ] = await Promise.all([
        createSchool({ name: 'Cal Poly'}),
        createSchool({ name: 'UCI'}),
        createSchool({ name: 'Cuesta College'})
    ]);

    Promise.all([
        createStudent({ name: 'Red'}),
        createStudent({ name: 'Ali', schoolId: cuesta.id}),
        createStudent({ name: 'Jake', schoolId: UCI.id })
    ])

};

const createSchool = async({ name }) => {
    return (await client.query('INSERT INTO schools(name) VALUES($1) RETURNING *', [ name ])).rows[0];
};

const createStudent = async({ name, schoolId }) => {
    return (await client.query('INSERT INTO students(name, "schoolId") VALUES($1, $2) RETURNING *', [ name, schoolId ])).rows[0];
};


module.exports = {
    sync,
    createSchool
}