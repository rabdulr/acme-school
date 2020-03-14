import React from 'react';

const List = ({schools, students, moveStudentInit, unenrollStudent}) => {

    return(
        <div id='list'>
            <div id='unenrolled'>
                <h3>Unenrolled Students</h3>
                <ul>
                    {
                        students.filter(student => student.schoolId === null).map(student => {
                            return(
                                <li key={ student.id }>
                                    <a href={`#view=student&id=${student.id}`}>
                                        { student.name }
                                    </a>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

                {
                    schools.map(school => {
                        return(
                            <div className='school' key={ school.id } value={ school.id }>
                                <a href={`#view=school&id=${school.id}`}>
                                    <h3>{ school.name }</h3>
                                </a>
                                <select value={''} onChange={ moveStudentInit }>
                                    <option value=''>-- select student --</option>
                                    {
                                        students.filter(student => student.schoolId !== school.id).map(student => {
                                            return(
                                                <option value={ student.id } key={ student.id }>
                                                    { student.name }
                                                </option>
                                            )
                                        })
                                    }
                                </select>
                                <ul>
                                    {
                                        students.filter(student => student.schoolId === school.id).map(student => {
                                            return(
                                                <li key={ student.id}>
                                                    <a href={`#view=student&id=${student.id}&schoolId=${school.id}`}>
                                                        { student.name }
                                                    </a>
                                                    <button onClick={()=> unenrollStudent(student)}>Unenroll</button>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        )
                    })
                }
        </div>
    )
};

export default List;