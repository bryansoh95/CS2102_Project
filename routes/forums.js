const express = require('express')
const pool = require('../pool')
const router = express.Router()

const GET_ALL_THREADS_FOR_COURSE = `
SELECT * 
FROM Threads
WHERE module_code = $1
AND category = $2
`

const NEW_THREAD_ENTRY = `
INSERT INTO Threads
VALUES ($1, $2, $3, $4, NOW())
`

const GET_NEXT_POST_ID = `
SELECT MAX(COALESCE(post_id, 0))
FROM Posts 
WHERE module_code = $1 
AND category = $2 
AND thread_title = $3
`

const NEW_POST_ENTRY = `
INSERT INTO Posts
VALUES ($1, $2, $3, $4, $5, NOW(), $6)
`

const GET_ALL_POSTS_FOR_THREAD = `
SELECT * 
FROM Posts
WHERE module_code = $1
AND category = $2
AND thread_title = $3
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

const SEARCH_FOR_FORUM_POSTS = `
SELECT * FROM Posts
WHERE module_code = $1
AND category = $2
AND post_content LIKE '%' || $3 || '%'
`

const SEARCH_FOR_THREAD_POSTS = `
SELECT * FROM Posts
WHERE module_code = $1
AND category = $2
AND thread_title = $3
AND post_content LIKE '%' || $4 || '%'
`

router.get('/course/:module_code/forum/:category/thread', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        category: req.body.category
    }
    pool.query(GET_ALL_THREADS_FOR_COURSE, [data.module_code, data.category], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            res.send(dbRes.rows)
        }
    })
})

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

router.get('/course/:module_code/forum/:category/thread/:thread_title/post', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        category: req.body.category,
        thread_title: req.body.thread_title
    }
    pool.query(GET_ALL_POSTS_FOR_THREAD, [data.module_code, data.category, data.thread_title], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.post('/course/:module_code/forum/:category/thread/:thread_title/posts/new', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        category: req.body.category,
        thread_title: req.body.thread_title,
        post_content: req.body.post_content,
        uname: req.body.uname
    }
    pool.query(GET_NEXT_POST_ID, [data.module_code, data.category, data.thread_title], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            const post_id = dbRes.rows[0].max + 1
            pool.query(NEW_POST_ENTRY, [data.module_code, data.category, data.thread_title, data.post_content, post_id, data.uname], (err, dbRes) => {
                if (err) {
                    res.send('error!')
                } else {
                    res.send('new post entry success')
                }
            })
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

router.get('/course/:module_code/forum/:category/search', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        category: req.body.category,
        search_input: req.body.search_input
    }
    pool.query(SEARCH_FOR_FORUM_POSTS, [data.module_code, data.category, data.search_input], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            res.send(dbRes.rows)
        }
    })
})

router.get('/course/:module_code/forum/:category/thread/:thread_title/search', (req, res, next) => {
    const data = {
        module_code: req.body.module_code,
        category: req.body.category,
        thread_title: req.body.thread_title,
        search_input: req.body.search_input
    }
    pool.query(SEARCH_FOR_THREAD_POSTS, [data.module_code, data.category, data.thread_title, data.search_input], (err, dbRes) => {
        if (err) {
            res.send('error!')
        } else {
            res.send(dbRes.rows)
        }
    })
})

module.exports = router