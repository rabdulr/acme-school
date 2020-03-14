import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import Create from './Create';
import List from './List';
import UpdateStudentForm from './UpdateStudentForm';
import UpdateSchoolForm from './UpdateSchoolForm';

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
            const updatedSchoolList = schools.map(school => {
                if(school.id === updatedSchool.id){
                    return updatedSchool;
                } else {
                    return school;
                }
            });
            setSchools([...updatedSchoolList]);
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
            const updatedStudentList = students.map(student => {
                if(student.id === updatedStudent.id){
                    return updatedStudent;
                } else {
                    return student;
                }
            });
            setStudents([...updatedStudentList]);
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
            const updatedStudentList = students.map(student => {
                if(student.id === updatedStudent.id){
                    return updatedStudent;
                } else {
                    return student;
                }
            });
            setStudents([...updatedStudentList]);
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
            const updatedStudentList = students.map( student => {
                if(student.schoolId === schoolToDestroyId){
                    student.schoolId = null;
                    return student;
                } else {
                    return student;
                }
            })
            setStudents([...updatedStudentList])
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
            <h4>{ schools.length } School{ schools.length === 1 ? '' : 's'}</h4>
            <h4>{ students.length } Student{ students.length === 1 ? '': 's'} ({ students.filter(student => student.schoolId !== null).length } enrolled)</h4>
            {
                error
            }
            <hr />
            {
                !view && 
                <div>
                    <Create 
                        schools={ schools } 
                        schoolName={ schoolName } 
                        setSchoolName={ setSchoolName } s
                        choolIdSelection={ schoolIdSelection } 
                        setSchoolIdSelection={ setSchoolIdSelection } 
                        studentName={ studentName } 
                        setStudentName={ setStudentName } 
                        createStudent={ createStudent } 
                        createSchool={ createSchool }
                    />
                    <List 
                        schools={ schools } 
                        students={ students } 
                        moveStudentInit={ moveStudentInit } 
                        unenrollStudent={ unenrollStudent } 
                    />
                </div>
            }
            {
                view === 'student' &&
                <UpdateStudentForm 
                    schools={ schools } 
                    students={ students } 
                    setUpdateStudent={ setUpdateStudent } 
                    updateStudentName={ updateStudentName }
                    setUpdateStudentName={ setUpdateStudentName } 
                    updateStudentSchool={ updateStudentSchool } 
                    setUpdateStudentSchool={ setUpdateStudentSchool } 
                    destroyStudent={ destroyStudent }
                    updateStudentInfo={ updateStudentInfo }
                    view={ view } 
                    id={ id }
                    schoolId={ schoolId }
                />
            }
            {
                view === 'school' &&
                <UpdateSchoolForm
                    schools={ schools }
                    updateSchool={ updateSchool }
                    updateSchoolName={ updateSchoolName }
                    setUpdateSchoolName={ setUpdateSchoolName } 
                    destroySchool={ destroySchool }
                    id={ id }
                    updateSchoolName={ updateSchoolName }
                />
            }
        </main>
    )
};

export default App;