import React, { useEffect } from 'react';

const UpdateSchoolForm = ({schools, updateSchool, setUpdateSchoolName, updateSchoolName, destroySchool, id }) => {

    useEffect(()=> {
        const nameLookUp = schools.find(school => school.id === id);
        if(nameLookUp){
            setUpdateSchoolName(nameLookUp.name);
        }
        else {
            window.location.hash='#'
        }
    }, [id]);


    return(
        <div id='school-update'>
            <form onSubmit={ updateSchool }>
                <input type='text' placeholder='School name' value={ updateSchoolName } onChange={ ev => setUpdateSchoolName(ev.target.value)}/>
                <button disabled={ !updateSchoolName }>Update School</button>
            </form>
            <button onClick={()=> destroySchool(id) }>Delete School</button>
        </div>
    )
};

export default UpdateSchoolForm;