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
        "schoolId" UUID REFERENCES schools(id) ON DELETE CASCADE,
        name VARCHAR(100) NOT NULL,
        CHECK (CHAR_LENGTH(name) > 0)
    );
    `;

    client.query(SQL);

    const [ calPoly, UCI, cuesta ] = await Promise.all([
        createSchool({ schoolName: 'Cal Poly'}),
        createSchool({ schoolName: 'UCI'}),
        createSchool({ schoolName: 'Cuesta College'})
    ]);

    Promise.all([
        createStudent({ studentName: 'Red'}),
        createStudent({ studentName: 'Ali', schoolId: cuesta.id}),
        createStudent({ studentName: 'Jake', schoolId: UCI.id })
    ]);

};

const readSchools = async() => {
    return (await client.query('SELECT * FROM schools')).rows;
};

const readStudents = async() => {
    return (await client.query('SELECT * FROM students')).rows;
};

const createSchool = async({ schoolName }) => {
    return (await client.query('INSERT INTO schools(name) VALUES($1) RETURNING *', [ schoolName ])).rows[0];
};

const createStudent = async({ studentName, schoolId }) => {
    return (await client.query('INSERT INTO students(name, "schoolId") VALUES($1, $2) RETURNING *', [ studentName, schoolId ])).rows[0];
};

const destroySchool = async(id) => {
    await client.query('DELETE FROM schools WHERE id=$1', [id])
};

const destroyStudent = async(id) => {
    await client.query('DELETE FROM students WHERE id=$1', [id])
};

const updateSchool = async({ schoolName, id}) => {
    const SQL = 'UPDATE schools SET name=$1 WHERE id=$2 RETURNING *';
    return ( await client.query(SQL, [schoolName, id])).rows[0];
};

const updateStudent = async({ studentName, id}) => {
    const SQL = 'UPDATE students SET name=$1 WHERE id=$2 RETURNING *';
    return ( await client.query(SQL, [studentName, id])).rows[0];
}


module.exports = {
    sync,
    createSchool,
    createStudent,
    readSchools,
    readStudents,
    destroySchool,
    destroyStudent,
    updateSchool,
    updateStudent
}