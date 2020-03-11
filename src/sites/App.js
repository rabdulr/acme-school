import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

const App = () => {
    const [ error, setError ] = useState('')
    const [ schools, setSchools ] = useState([]);
    const [ schoolName, setSchoolName ] = useState('');
    const [ schoolId, setSchoolId ] = useState('');
    const [ students, setStudents ] = useState([]);
    const [ studentName, setStudentName ] = useState('');

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

    const createSchool = async(ev) => {
        ev.preventDefault();
        try {
            const newSchool = (await axios.post('/api/schools', { schoolName })).data;
            setSchools([...schools, newSchool]);
            setSchoolName('');
            setError('');
        }
        catch(ex) {
            setError(ex.response.data.message);
        }
    };

    const createStudent = async(ev) => {

        ev.preventDefault();
        const studentPackage = {}

        if(!schoolId) {
            studentPackage.studentName = studentName;
        } else {
            studentPackage.studentName = studentName;
            studentPackage.schoolId = schoolId;
        };

        try {
            const newStudent = (await axios.post('/api/students', studentPackage)).data;
            setStudents([...students, newStudent]);
            setStudentName('');
            setSchoolId('');
            setError('');
        }
        catch(ex) {
            setError(ex.response.data.message);
        }
    }

    return(
        <main>
            <div id='nav'>
                <h1>Acme School</h1>
                <h4>{schools.length} Schools</h4>
                <h4>{students.length} Students ({students.filter(student => student.schoolId !== null).length} enrolled)</h4>
                <hr />
            </div>

            <div id='create-student'>
                <label>Create Student</label>
                <form onSubmit={ createStudent }>
                    <input type='text' value={ studentName } onChange={ev => setStudentName(ev.target.value)} />
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
                    <button disable={`${ studentName }`}>Create</button>
                </form>
            </div>

            <div id='create-school'>
                <label>Create School</label>
                <form onSubmit={ createSchool }>
                    <input type='text' value={ schoolName } onChange={ev => setSchoolName(ev.target.value)} />
                    <button disable={`${!schoolName}`}>Create</button>
                </form>
            </div>

            <div id='schools'>
                    {
                        schools.map(school => {
                            return(
                                <div className='school'>
                                    <h3 key={school.id}>{school.name}</h3>
                                    <ul>
                                        {
                                            students.filter(student => student.schoolId === school.id).map( student => {
                                                return(
                                                    <li key={student.id}>{student.name}</li>
                                                )
                                            })
                                        }
                                    </ul>
                                </div>
                            )
                        })
                    }
            </div>

            <div id='unenrolled'>
                <h3>Unenrolled</h3>
                <ul>
                    {
                        students.filter( student => student.schoolId === null).map( student => {
                            return(
                                <div>
                                    <li key={student.id}>{student.name}</li>
                                </div>
                            )
                        })
                    }

                </ul>
            </div>
        </main>
    )
};

export default App