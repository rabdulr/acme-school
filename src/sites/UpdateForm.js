import React, { useEffect } from 'react';

const UpdateForm = ({schools, students, updateSchool, setUpdateSchoolName, setUpdateStudent, updateStudentName, setUpdateSchoolName, updateStudentSchool, setUpdateStudentSchool, destroySchool, destroyStudent, view, id}) => {

    useEffect(()=> {
        if(view === 'school'){
            const nameLookUp = schools.find(school => school.id === id);
            if(nameLookUp){
                setUpdateSchoolName(nameLookUp.name);
            }
            else {
                window.location.hash='#'
            }
        }
        else if(view === 'student'){
            const nameLookUp = students.find(student => student.id === id)
            if(nameLookUp){
                setUpdateStudentName(nameLookUp.name)
                setUpdateStudent(nameLookUp);
                setUpdateStudentSchool(schoolId);            
            }
            else {
                window.location.hash='#'
            }
        }
        else if(!id){
            window.location.hash='#'
        }
    }, [id]);


    return(
            <div id='update'>
                { view === 'school' && (
                    <div id='school-update'>
                        <form onSubmit={ updateSchool }>
                            <input type='text' placeholder='School name' value={ updateSchoolName } onChange={ ev => setUpdateSchoolName(ev.target.value)}/>
                            <button disabled={ !updateSchoolName }>Update School</button>
                        </form>
                        <button onClick={()=> destroySchool(id) }>Delete School</button>
                    </div>)
                }
                { view === 'student' && (
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
                    </div>)
                }
            </div>
    )
};

export default UpdateForm;