import React, { useEffect } from 'react';

const UpdateStudent = ({setSchoolId, schoolId, schools, id, destroyStudent, student, setStudentName, studentName, setError, updateStudent}) => {

    useEffect(()=> {
        if(id){
            setStudentName(student.name)
        } else {
            setError('Student does not exist');
            window.location.href='#';
        }
    }, [id]);

    return(
        <div className='student-update'>
            <input placeholder='Student name' value={ studentName } onChange={ ev => setStudentName(ev.target.value)} />
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
            <button onClick={ updateStudent }>Update</button>
            <button onClick={()=> destroyStudent(student)}>Delete Student</button>
        </div>
    )
};

export default UpdateStudent;