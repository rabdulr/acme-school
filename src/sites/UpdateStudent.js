import React, { useEffect } from 'react';

const UpdateStudent = ({setSchoolId, schoolId, schools, id, destroyStudent, student, setStudentName, studentName, setError, updateStudent}) => {

    useEffect(()=> {
            setStudentName(student.name);
    }, []);

    return(
        <div className='student-update'>
            <input placeholder='Student name' value={ studentName } onChange={ ev => setStudentName(ev.target.value)} />
            <select onChange={ev => setSchoolId(ev.target.value)} value={ student.schoolId || ''}>
                <option value=''>-- select school --</option>
                    {
                        schools.map(school => {
                            return(
                                <option value={ school.id } key={ school.id }>{ school.name }</option>
                            )
                        })
                    }
            </select>
            <button onClick={ ()=> updateStudent(id) }>Update</button>
            <button onClick={()=> destroyStudent(student)}>Delete Student</button>
        </div>
    )
};

export default UpdateStudent;