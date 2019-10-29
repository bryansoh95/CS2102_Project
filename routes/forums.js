const express = require('express')
const pool = require('../pool')
const router = express.Router()

const NEW_THREAD_ENTRY = `
INSERT INTO Threads
VALUES ($1, $2, $3, $4, NOW())
`

const NEW_POST_ENTRY = `
INSERT INTO Posts
VALUES ($1, $2, $3, $4, $5, NOW(), $7)
`

const AMEND_POST_ENTRY = `
UPDATE Posts
SET post_content = $1, timestamp = NOW()
WHERE uname = $2
AND module_code = $3
AND category = $4
AND thread_title = $5
AND post_id = $6
`

router.post('/course/:module_code/forum/:category/thread/new', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        category: req.body.category,
        thread_title: req.body.thread_title,
        uname: req.body.uname
    }
    pool.query(NEW_THREAD_ENTRY, [data.module_code, data.category, data.thread_title, data.uname], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            res.send('insert success')
        }
    })
})

router.put('/course/:module_code/forum/:category/thread/:thread_title/posts/:post_id', (req, res, next) => {
    const data = {
        post_content: req.body.post_content,
        uname: req.body.uname,
        module_code: req.body.module_code,
        category: req.body.category,
        thread_title: req.body.thread_title,
        post_id: req.body.post_id
    }
    pool.query(AMEND_POST_ENTRY, [data.post_content, data.uname, data.module_code, data.category, data.thread_title, data.post_id], (err, dbRes) => {
        if (err) {
            console.log(err)
            res.send('error!')
        } else {
            res.send('update success')
        }
    })
})

module.exports = router