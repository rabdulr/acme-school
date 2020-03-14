const { createSchool, readSchools, destroySchool, updateSchool } = require('./schools');
const { createStudent, readStudents, destroyStudent, updateStudent } = require('./students')

module.exports = {
    createSchool,
    createStudent,
    readSchools,
    readStudents,
    destroySchool,
    destroyStudent,
    updateSchool,
    updateStudent,
}