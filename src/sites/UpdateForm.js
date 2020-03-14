import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import Create from './Create';
import List from './List';

const UpdateForm = () => {
    const [ schools, setSchools ] = useState([]);
    const [ schoolName, setSchoolName ] = useState('');
    const [ schoolIdSelection, setSchoolIdSelection ] = useState('');
    const [ students, setStudents ] = useState([]);
    const [ studentName, setStudentName ] = useState('');
    const [ updateSchoolName, setUpdateSchoolName ] = useState('');
    const [ updateStudent, setUpdateStudent ] = useState({});
    const [ updateStudentName, setUpdateStudentName ] = useState('');
    const [ updateStudentSchool, setUpdateStudentSchool ] = useState('');
    const [ error, setError ] = useState('');
    const [ params, setParams ] = useState(qs.parse(window.location.hash.slice(1)));

    const GETDATA = () => {
        Promise.all([
            axios.get('/api/schools'),
            axios.get('/api/students')
        ])
        .then( responses => responses.map( response => response.data))
        .then( results => {
            setSchools(results[0]);
            setStudents(results[1]);
        })
        .catch(ex => setError(ex.response.data.message))
    };

    useEffect(() => {
        GETDATA();
    }, []);

    useEffect(()=> {
        window.addEventListener('hashchange', ()=> {
            setParams(qs.parse(window.location.hash.slice(1)));
        });
    }, []);

    const { view, id, schoolId } = params;

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