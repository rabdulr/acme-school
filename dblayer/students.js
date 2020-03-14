const { client } = require('./client')

const readStudents = async() => {
    return (await client.query('SELECT * FROM students')).rows;
};

const createStudent = async({ studentName, schoolIdSelection }) => {
    const id = schoolIdSelection ? schoolIdSelection : null;
    return (await client.query('INSERT INTO students(name, "schoolId") VALUES($1, $2) RETURNING *', [ studentName, id ])).rows[0];
};

const destroyStudent = async(id) => {
    await client.query('DELETE FROM students WHERE id=$1', [id])
};

const updateStudent = async(student) => {
    const SQL = 'UPDATE students SET name=$1, "schoolId"=$2 WHERE id=$3 RETURNING *';
    return ( await client.query(SQL, [student.name, student.schoolId, student.id])).rows[0];
};

module.exports = {
    readStudents,
    createStudent,
    destroyStudent,
    updateStudent
}