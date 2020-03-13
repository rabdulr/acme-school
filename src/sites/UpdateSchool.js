import React, { useEffect } from 'react';

const UpdateSchool = ({ id, school, setError, updateSchool, destroySchool, setSchoolName, schoolName }) => {

    useEffect(()=> {
        if(school){
            setSchoolName(school.name);
        }
        else {
            setSchoolName('');
        }
    }, [school])

    return(
            <div className='school-update'>
                <input value={ schoolName } onChange={ev => setSchoolName(ev.target.value)}/>
                <button onClick={ updateSchool }>Update</button>
                <button onClick={ ()=> destroySchool(school) }>Delete School</button>
            </div>

    )
};

export default UpdateSchool;