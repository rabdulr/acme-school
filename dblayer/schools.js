const { client } = require('./client');

const readSchools = async() => {
    return (await client.query('SELECT * FROM schools')).rows;
};

const createSchool = async({ schoolName }) => {
    return (await client.query('INSERT INTO schools(name) VALUES($1) RETURNING *', [ schoolName ])).rows[0];
};

const destroySchool = async(id) => {
    await client.query('DELETE FROM schools WHERE id=$1', [id])
};

const updateSchool = async({ updateSchoolName, id }) => {
    const SQL = 'UPDATE schools SET name=$1 WHERE id=$2 RETURNING *';
    return ( await client.query(SQL, [updateSchoolName, id])).rows[0];
};

module.exports = {
    readSchools,
    createSchool,
    destroySchool,
    updateSchool
}

