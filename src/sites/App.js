import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import List from './List';
import Create from './Create';
import UpdateSchool from './UpdateSchool';
import UpdateStudent from './UpdateStudent';

const App = () => {
    const [ error, setError ] = useState('')
    const [ schools, setSchools ] = useState([]);
    const [ schoolName, setSchoolName ] = useState('');
    const [ schoolId, setSchoolId ] = useState('');
    const [ students, setStudents ] = useState([]);
    const [ studentName, setStudentName ] = useState('');
    const [ studentId, setStudentId ] = useState('');
    const [ params, setParams ] = useState(qs.parse(window.location.hash.slice(1)));
    const { view, id } = params;

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

    useEffect(() => {
        if(!studentId) {
            setSchoolId('');
            setStudentName('');
        } else {
            updateStudent(studentId);
        }
    }, [studentId]);

    const createSchool = async() => {
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
    };

    const destroySchool = async(schoolToDestroy) => {
        try {
            await axios.delete(`/api/schools/${schoolToDestroy.id}`);
            setSchools(schools.filter( school => school.id !== schoolToDestroy.id));
            setError('');
            window.location.hash='#';
        }
        catch(ex) {
            setError(ex.response.data.message)
        }
    };

    const destroyStudent = async(studentToDestroy) => {
        try {
            await axios.delete(`/api/students/${studentToDestroy.id}`);
            setError('');
            setStudents(students.filter( student => student.id !== studentToDestroy.id))
            window.location.has='#';
        }
        catch(ex) {
            setError(ex.response.data.message)
        }
    }
    const updateSchool = async() => {
        try {
            const updatedSchool = (await axios.put(`/api/schools/${id}`, { schoolName, id })).data;
            schools.map(school => {
                if(school.id === updatedSchool.id){
                    school.name = updatedSchool.name;
                }
            });
            setSchools([...schools])
            setSchoolName('');
            setError('');
            window.location.hash='#';
        }
        catch(ex) {
            setError(ex.response.data.message)
        }
    };

    const updateStudent = async(id) => {

        try {
            const updatedStudent = (await axios.put(`/api/students/${id}`, { studentName, id, schoolId })).data;
            students.map( student => {
                if(student.id === updatedStudent.id){
                    student.name = updatedStudent.name;
                     student.schoolId = updatedStudent.schoolId
                }
            });
            setStudents([...students]);
            setStudentName('');
            setSchoolId('');
            setStudentId('');
            setError('');
        }
        catch(ex) {
            setError(ex.response.data.message)
        }
    };

    const setDropDown = async(ev) => {
        Promise.all([
            setStudentId(ev.target.value),
            setStudentName( students.find(student => student.id === ev.target.value).name),
            setSchoolId(ev.target.parentNode.getAttribute('value'))
        ])
        // await updateStudent(id);
    }

    return(
        <main>
            <div id='info'>
                <a href='#'><h1>Acme School</h1></a>
                <h4>{schools.length} Schools</h4>
                <h4>{students.length} Students ({students.filter(student => student.schoolId !== null).length} enrolled)</h4>
                { 
                    error 
                }
                <hr />
            </div>
            {
                !view && (
                    <div>
                        <Create createStudent={ createStudent } studentName= { studentName } setStudentName={ setStudentName } setSchoolId={ setSchoolId } schools={ schools } createSchool={ createSchool } schoolName={ schoolName } setSchoolName={ setSchoolName } schoolId={ schoolId }/>
                        <List students={ students } schools={ schools } setStudentId={ setStudentId} studentId={ studentId } setDropDown={ setDropDown }/>
                    </div>
                )
            }
                {
                    view === 'school' && 
                    <UpdateSchool id={ id } school={ schools.find( school => school.id === id)} setError={ setError } updateSchool={ updateSchool } destroySchool={ destroySchool } setSchoolName={ setSchoolName } schoolName={ schoolName} />
                }
                {
                    view === 'student' &&
                    <UpdateStudent setSchoolId={ setSchoolId } schoolId={ studentId } schools={ schools } id={ id } student={ students.find( student => student.id === id)} destroyStudent={ destroyStudent } setStudentName={ setStudentName } studentName={ studentName } setError={ setError } updateStudent={ updateStudent } />
                }
        </main>
    )
};

export default App;