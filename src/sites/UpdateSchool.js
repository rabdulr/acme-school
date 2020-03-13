import React, { useEffect } from 'react';

const UpdateSchool = ({ id, school, setError, updateSchool, destroySchool, setSchoolName, schoolName }) => {

    useEffect(()=> {
        if(id){
            setSchoolName(school.name)
        } else {
            setError('School does not exist');
            window.location.href='#';
        }
    }, [id])

    return(
            <div className='school-update'>
                <input placeholder='School Name' value={ schoolName } onChange={ev => setSchoolName(ev.target.value)}/>
                <button onClick={ updateSchool }>Update</button>
                <button onClick={ ()=> destroySchool(school) }>Delete School</button>
            </div>

    )
};

export default UpdateSchool;