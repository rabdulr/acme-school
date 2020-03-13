import React, { useState } from 'react';

const UpdateSchool = ({setSchoolId, schoolId, schools, id, school}) => {
    const [ name, setname ] = useState([])

    return(
            <div className='school-update'>
                <input placeholder='School Name' />
                <button>Delete School</button>
            </div>

    )
};

export default UpdateSchool;