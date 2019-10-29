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
WHERE suname = $1
ORDER BY module_code ASC
`

const PROF_GET_STUDENT_REQUESTS_FOR_COURSE = `
SELECT * 
FROM Requests
WHERE module_code = $1
`

const STUDENT_REQUEST_FOR_NEW_COURSE = `
INSERT INTO Requests
VALUES ($1, $2, NOW())
`

const ADD_NEW_TUTOR_TO_COURSE = `
INSERT INTO Tutors
VALUES ($1, $2, $3)
`

router.get('/module/all', (req, res, next) => {
    pool.query(GET_ALL_COURSES, (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.get('/module', (req, res, next) => {
    const data = {
        suname: req.body.suname
    }
    pool.query(GET_STUDENT_COURSES, [data.suname], (err, dbRes) => {
        if (err) {
            res.send("error!")
        } else {
            res.send(dbRes.rows)
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

router.post('/module/:module_code/addtutor', (req, res, next) => {
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