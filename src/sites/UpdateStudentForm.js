import React, { useEffect } from 'react';

const UpdateStudent = ({schools, students, setUpdateStudent, updateStudentName, setUpdateStudentName, updateStudentSchool, setUpdateStudentSchool, destroyStudent, id, updateStudentInfo, schoolId}) => {

    useEffect(()=> {
        const nameLookUp = students.find(student => student.id === id)
        if(nameLookUp){
            setUpdateStudentName(nameLookUp.name)
            setUpdateStudent(nameLookUp);
            setUpdateStudentSchool(schoolId);            
        }
        else {
            window.location.hash='#';
        }
    }, [id]);


    return(
        <div id='student-update'>
            <form onSubmit={ updateStudentInfo }>
                <input type='text' placeholder='Student name' value ={ updateStudentName } onChange={ ev => setUpdateStudentName(ev.target.value)} />
                <select value={ updateStudentSchool } onChange={ev => setUpdateStudentSchool(ev.target.value)}>
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
                <button>Update Student</button>
            </form>
            <button onClick={()=> destroyStudent(id)}>Delete Student</button>
        </div>
    )
};

export default UpdateStudent;