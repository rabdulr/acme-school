import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';

const App = () => {
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
            setUpdateSchoolName(schools.find(school => school.id === id).name)
        }
        else if(view === 'student'){
            setUpdateStudentName(students.find(student => student.id === id).name)
            setUpdateStudent(students.find(student => student.id === id));
            setUpdateStudentSchool(schoolId);
        }
    }, [id]);

    const createSchool = async(ev) => {
        ev.preventDefault();
        try {
            const newSchool = (await axios.post('/api/schools', { schoolName })).data;
            setSchools([...schools, newSchool]);
            setSchoolName('');
            setError('');
        }
        catch(ex){
            setError(ex.response.data.message)
        }
    };

    const createStudent = async(ev) => {
        ev.preventDefault();
        try {
            const newStudent = (await axios.post('/api/students', { studentName, schoolIdSelection })).data;
            setStudents([...students, newStudent]);
            setStudentName('');
            setSchoolIdSelection('');
            setError('');
        }
        catch(ex) {
            setError(ex.response.data.message)
        }
    };

    const unenrollStudent = async(student) => {
        student.schoolId = null
        try {
            await axios.put(`/api/students/${student.id}`, student);
            setStudents([...students]);
            setError('');
        }
        catch(ex) {
            setError(ex.response.data.message);
        }
    };

    const updateSchool = async(ev) => {
        ev.preventDefault();
        try {
            const updatedSchool = (await axios.put(`/api/schools/${id}`, { updateSchoolName, id })).data;
            schools.map(school => {
                if(school.id === updatedSchool.id){
                    school.name = updatedSchool.name;
                }
            });
            setSchools([...schools]);
            setUpdateSchoolName('');
            setError('');
            window.location.hash='#';
        }
        catch(ex) {
            setError(ex.response.data.message)
        }
    };

    const updateStudentInfo = async(ev) => {
        ev.preventDefault();
        try {
            updateStudent.name = updateStudentName
            updateStudent.schoolId = updateStudentSchool
            const updatedStudent = (await axios.put(`/api/students/${id}`, updateStudent)).data;
            students.map(student => {
                if(student.id === updatedStudent.id){
                    return updatedStudent;
                } else {
                    return student;
                }
            });
            setStudents([...students]);
            setUpdateStudentName('');
            setUpdateStudentSchool('');
            setUpdateStudent({});
            setError('');
            window.location.hash='#';
        }
        catch(ex){
            setError(ex.response.data.message);
        }
    };

    const moveStudentInit = async(ev) => {
        try {
            updateStudent.id = ev.target.value,
            updateStudent.schoolId = ev.target.parentNode.getAttribute('value'),
            updateStudent.name = students.find(student => student.id === updateStudent.id).name

            const updatedStudent = (await axios.put(`/api/students/${updateStudent.id}`, updateStudent)).data;
            const studentList = students.map(student => {
                if(student.id === updatedStudent.id){
                    return updatedStudent;
                } else {
                    return student;
                }
            });
            setStudents([...studentList]);
            setSchools([...schools])
            setUpdateStudent({});
            setError('');
            window.location.hash='#'
        }
        catch(ex) {
            setError(ex.response.data.message);
        }
    };

    const destroyStudent = async(studentToDestroyId) => {
        try {
            await axios.delete(`/api/students/${studentToDestroyId}`)
            setStudents(students.filter( student => student.id !== studentToDestroyId))
            setError('');
            window.location.hash='#';
        }
        catch(ex) {
            setError(ex.response.data.message);
        }
    };

    const destroySchool = async(schoolToDestroyId) => {
        try {
            await axios.delete(`/api/schools/${schoolToDestroyId}`)
            setSchools(schools.filter( school => school.id !== schoolToDestroyId))
            const updatedList = students.map( student => {
                if(student.schoolId === schoolToDestroyId){
                    student.schoolId = null;
                    return student;
                } else {
                    return student;
                }
            })
            setStudents([...updatedList])
            setError('');
            window.location.hash='#';
        }
        catch(ex) {
            setError(ex.response.data.message);
        }
    }

    return(
        <main>
            <a href='#'>
                <h1>Acme School</h1>
            </a>
            <h4>{ schools.length } Schools</h4>
            <h4>{ students.length } Students ({ students.filter(student => student.schoolId !== null).length } enrolled)</h4>
            {
                error
            }
            <hr />

            <div id='create'>
                <div id='create-student'>
                    <h3>Create Student</h3>
                    <form onSubmit={ createStudent }>
                        <input type='text' placeholder='Student name' value={ studentName } onChange={ ev => setStudentName(ev.target.value) }/>
                        <select value={ schoolIdSelection } onChange={ev => setSchoolIdSelection(ev.target.value)}>
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
                        <button>Create</button>
                    </form>
                    <hr />
                </div>

                <div id='create-school'>
                    <h3>Create School</h3>
                    <form onSubmit={ createSchool }>
                        <input type='text' placeholder='School name' onChange={ ev => setSchoolName(ev.target.value) } value={ schoolName } />
                        <button>Create</button>
                    </form>
                    <hr />
                </div>
            </div>

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
                    <hr />
                </div>

                <div id='enrolled'>
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
                                    <hr />
                                </div>
                            )
                        })
                    }
                </div>
            </div>

            <div id='update'>
                { view === 'school' && (
                    <div id='school-update'>
                        <form onSubmit={ updateSchool }>
                            <input type='text' placeholder='School name' value={ updateSchoolName } onChange={ ev => setUpdateSchoolName(ev.target.value)}/>
                            <button>Update School</button>
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
        </main>
    )
};

export default App;