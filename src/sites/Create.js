import React from 'react';

const Create = ({ schools, schoolName, setSchoolName, schoolIdSelection, setSchoolIdSelection, studentName, setStudentName, createStudent, createSchool}) => {

    return(
        <div id='create'>
            <div id='create-student'>
                <h3>Create Student</h3>
                <form onSubmit={ createStudent }>
                    <input type='text' placeholder='Student name' value={ studentName } onChange={ ev => setStudentName(ev.target.value) }/>
                    <select value={ schoolIdSelection } onChange={ev => setSchoolIdSelection(ev.target.value)}>
                        <option value=''>-- select school --</option>
                        {
                            schools.map(school => {
                                return(
                                    <option value={ school.id } key={ school.id }>
                                        { school.name }
                                    </option>
                                )
                            })
                        }
                    </select>
                    <button disabled={ !studentName }>Create</button>
                </form>
                <hr />
            </div>

            <div id='create-school'>
                <h3>Create School</h3>
                <form onSubmit={ createSchool }>
                    <input type='text' placeholder='School name' onChange={ ev => setSchoolName(ev.target.value) } value={ schoolName } />
                    <button disabled={ !schoolName }>Create</button>
                </form>
                <hr />
            </div>
        </div>
    )
};

export default Create;