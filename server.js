const express = require('express');
const app = express();
const path = require('path');
const db = require('./database/db');

app.use(express.json());

app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/dist', express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/schools', (req, res, next)=> {
    db.readSchools()
        .then(schools => res.send(schools))
        .catch(next)
});

app.get('/api/students', (req, res, next)=> {
    db.readStudents()
        .then(students => res.send(students))
        .catch(next)
});

app.post('/api/schools', (req, res, next)=> {
    db.createSchool(req.body)
        .then(school => res.send(school))
        .catch(next)
});

app.post('/api/students', (req, res, next)=> {
    db.createStudent(req.body)
        .then(student => res.send(student))
        .catch(next)
})

app.use((err, req, res, next)=> {
    res.status(500).send({message: err.message});
});

const port = process.env.PORT || 3000;

db.sync()
    .then(() => {
        app.listen(port, () => {
            console.log(`Listening on port ${ port }`)
        });
    });
