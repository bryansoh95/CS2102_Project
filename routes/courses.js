const express = require('express')
const pool = require('../pool')
const router = express.Router()

const GET_ALL_COURSES = `
SELECT *
FROM Courses
`

const GET_STUDENT_COURSES = `
SELECT * 
FROM Enrolls
NATURAL JOIN Courses
WHERE suname = $1
ORDER BY module_code ASC
`

const GET_PROF_TEACHINGS = `
SELECT * 
FROM Teaches 
NATURAL JOIN Courses
WHERE puname = $1
ORDER BY module_code ASC
`

const PROF_GET_STUDENT_REQUESTS_FOR_COURSE = `
SELECT * 
FROM Requests
WHERE module_code = $1
`

const PROF_ADD_STUDENT_TO_COURSE = `
INSERT INTO Enrolls
SELECT $1 $2
WHERE EXISTS (
    SELECT 1 
    FROM Teaches 
    WHERE puname = $3
    AND module_code = $2
)
`

const STUDENT_REQUEST_FOR_NEW_COURSE = `
INSERT INTO Requests
VALUES ($1, $2, NOW())
`

const GET_ALL_TUTORS_FOR_COURSE = `
SELECT * 
FROM Tutors
WHERE module_code = $1
`

const ADD_NEW_TUTOR_TO_COURSE = `
INSERT INTO Tutors
VALUES ($1, $2, $3)
`

const DELETE_TUTOR_FROM_COURSE = `
DELETE FROM Tutors
WHERE suname = $1
AND module_code = $2
`

const GET_ALL_COURSE_ANNOUNCEMENTS = `
SELECT *
FROM Announcements 
WHERE module_code = $1
`

const ADD_NEW_COURSE_ANNOUNCEMENT = `
INSERT INTO Announcements
VALUES ($1, $2, $3, $4, NOW())
`

const EDIT_COURSE_ANNOUNCEMENT = `
UPDATE Announcements SET title = $1, content = $2, timestamp = NOW()
WHERE module_code = $3
AND title = $4
AND puname = $5
`

const DELETE_COURSE_ANNOUNCEMENT = `
DELETE FROM Announcements 
WHERE module_code = $1
AND title = $2
AND puname = $3
`

router.get('/module', (req, res, next) => {
    const data = {
        username: req.body.username
    }
    pool.query(GET_STUDENT_COURSES, [data.suname], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.get('/module/all', (req, res, next) => {
    pool.query(GET_ALL_COURSES, (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.post('/module/add', (req, res, next) => {
    const data = {
        suname: req.body.suname,
        module_code: req.body.module_code,
        puname: req.body.puname
    }
    pool.query(PROF_ADD_STUDENT_TO_COURSE, [data.suname, data.module_code, data.puname], (err, dbRes) => {
        if (err) {
            console.log(err)
            res.send("error!")
        } else {
            res.send('added student in')
        }
    })
})

router.get('/module/:module_code/announcements', (req, res, next) => {
    const data = {
        module_code: req.body.module_code
    }
    pool.query(GET_ALL_COURSE_ANNOUNCEMENTS, [data.module_code], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.post('/module/:module_code/announcements/new', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        title: req.body.title,
        puname: req.body.puname,
        content: req.body.content
    }
    pool.query(ADD_NEW_COURSE_ANNOUNCEMENT, [data.module_code, data.title, data.puname, data.content], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send('add announcement success')
        }
    })
})

router.put('/module/:module_code/announcements/edit', (req, res, next) => {
    const data = {
        new_title: req.body.new_title,
        new_content: req.body.new_content,
        old_title: req.body.old_title,
        module_code: req.body.module_code,
        puname: req.body.puname
    }
    pool.query(EDIT_COURSE_ANNOUNCEMENT, [data.new_title, data.new_content, data.module_code, data.old_title, data.puname], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send('amend announcement success')
        }
    })
})

router.delete('/module/:module_code/announcements/delete', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        title: req.body.title,
        puname: req.body.puname
    }
    pool.query(DELETE_COURSE_ANNOUNCEMENT, [data.module_code, data.title, data.puname], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send('delete announcement success')
        }
    })
})

router.get('/module/:module_code/requests', (req, res, next) => {
    const data = {
        module_code: req.body.module_code
    }
    pool.query(PROF_GET_STUDENT_REQUESTS_FOR_COURSE, [data.module_code], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.get('/module/:module_code/tutor', (req, res, next) => {
    const data = {
        module_code: req.body.module_code
    }
    pool.query(GET_ALL_TUTORS_FOR_COURSE, [data.module_code], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.post('/module/:module_code/tutor/add', (req, res, next) => {
    const data = {
        suname: req.body.suname,
        module_code: req.body.module_code,
        tutorial_group: req.body.tutorial_group
    }
    pool.query(ADD_NEW_TUTOR_TO_COURSE, [data.suname, data.module_code, data.tutorial_group], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send('insert ok')
        }
    })
})

router.delete('/module/:module_code/tutor/delete', (req, res, next) => {
    const data = {
        suname: req.body.suname,
        module_code: req.body.module_code
    }
    pool.query(DELETE_TUTOR_FROM_COURSE, [data.suname, data.module_code], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send('delete tutor ok')
        }
    })
})

router.post('/module/all/request', (req, res, next) => {
    const data = {
        suname: req.body.suname,
        module_code: req.body.module_code
    }
    pool.query(STUDENT_REQUEST_FOR_NEW_COURSE, [data.suname, data.module_code], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            res.send('request add ok')
        }
    })
})

module.exports = router