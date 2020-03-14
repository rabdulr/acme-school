const { client } = require('./client')

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
        "schoolId" UUID REFERENCES schools(id) ON DELETE SET NULL,
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

    const[ red, ali, jake ] = await Promise.all([
        createStudent({ studentName: 'Red'}),
        createStudent({ studentName: 'Ali', schoolIdSelection: cuesta.id}),
        createStudent({ studentName: 'Jake', schoolIdSelection: UCI.id })
    ]);

};

sync()
    .then(()=> {
        console.log('Tables created!')
    })
    .catch(console.error);