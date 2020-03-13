import React from 'react';

const Create = ({createStudent, studentName, setStudentName, setSchoolId, schools, createSchool, schoolName, setSchoolName, schoolId}) => {
    return(
        <div id='create'>
            <div id='create-student'>
                <h3>Create Student</h3>
                <form onSubmit={ createStudent }>
                    <input type='text' value={ studentName } onChange={ev => setStudentName(ev.target.value)} />
                    <select onChange={ev => setSchoolId(ev.target.value)} value={ schoolId }>
                        <option value=''>-- select school --</option>
                            {
                                schools.map(school => {
                                    return(
                                        <option value={ school.id } key={ school.id }>{ school.name }</option>
                                    )
                                })
                            }
                    </select>
                    <button disabled={ !studentName }>Create</button>
                </form>
            </div>

            <div id='create-school'>
                <h3>Create School</h3>
                <form onSubmit={ createSchool}>
                    <input type='text' value={ schoolName } onChange={ev => setSchoolName(ev.target.value)} />
                    <button disabled={!schoolName}>Create</button>
                </form>
            </div>
        </div>
    )
};

export default Create;