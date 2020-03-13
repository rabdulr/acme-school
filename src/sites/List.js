import React from 'react';

const List = ({students, schools, setStudentId, studentId, setDropDown}) => {
    return(
        <div id='list'>
            <div id='unenrolled'>
                <h3>Unenrolled</h3>
                <ul>
                    {
                        students.filter( student => student.schoolId === null).map( student => {
                            return(
                                    <li key={student.id}>
                                        <a href={`#view=student&id=${student.id}`}>
                                            {student.name}
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
                                    <h3>{school.name}</h3>
                                </a>
                                <select onChange={ (ev)=> setDropDown(ev) } value={ studentId }>
                                    <option value=''>-- enroll student --</option>
                                    {
                                        students.filter( student => student.schoolId !== school.id ).map(student => {
                                            return(
                                                <option value={ student.id } key={ student.id }>{ student.name }</option>
                                            )
                                        })
                                    }
                                </select>
                                <ul>
                                    {
                                        students.filter(student => student.schoolId === school.id).map( student => {
                                            return(
                                                <li key={student.id}>
                                                    <a href={`#view=student&id=${student.id}`}>
                                                        {student.name}
                                                    </a>
                                                    <button>Unenroll</button>
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
}

export default List;