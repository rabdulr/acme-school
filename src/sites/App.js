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
            return
        } else {
            console.log(studentId);
            setStudentId('')
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
                        <List students={ students } schools={ schools } setStudentId={ setStudentId} studentId={ studentId }/>
                    </div>
                )
            }
            <div id='update'>
                {
                    view === 'school' && 
                    <UpdateSchool setSchoolId={ setSchoolId } schoolId={ schoolId } schools={ schools } id={ id } school={ schools.find( school => school.id === id)} />
                }
                {
                    view === 'student' &&
                    <UpdateStudent setSchoolId={ setSchoolId } schoolId={ schoolId } schools={ schools } id={ id } student={ students.find( student => student.id === id)} />
                }
            </div>
        </main>
    )
};

export default App;