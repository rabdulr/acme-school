import React from 'react';

const UpdateStudent = ({setSchoolId, schoolId, schools, id, view }) => {
    return(
        <div id='update'>
            <div className='student-update'>
                <input placeholder='Student Name' />
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
                <button>Update</button>
                <button>Delete Student</button>
            </div>

            <div className='school-update'>
                <input placeholder='School Name' />
                <button>Delete School</button>
            </div>
        </div>
    )
};

export default UpdateStudent;