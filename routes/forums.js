const express = require("express");
const pool = require("../pool");
const router = express.Router();

const CHECK_PROF_TEACHES = `
SELECT * 
FROM Teaches
WHERE module_code = $1
AND puname = $2
`;

const CREATE_NEW_FORUM = `
INSERT INTO Forums
VALUES ($1, $2)
`;

const DELETE_FORUM = `
DELETE FROM Forums
WHERE module_code = $1
AND category = $2
`;

const GET_ALL_THREADS_FOR_COURSE_CATEGORY = `
SELECT t.module_code, t.category, t.thread_title, t.uname, u.name, TO_CHAR(t.timestamp, 'dd-mm-yyyy hh12:mi am') AS timestamp 
FROM Threads t JOIN Users u ON t.uname = u.username
WHERE module_code = $1
AND category = $2
`;

const GET_ALL_CATEGORIES_FOR_COURSE = `
SELECT * 
FROM Forums
WHERE module_code = $1
`;

const NEW_THREAD_ENTRY = `
INSERT INTO Threads
VALUES ($1, $2, $3, $4, NOW())
`;

const AMEND_THREAD_ENTRY = `
UPDATE Threads SET thread_title = $1
WHERE module_code = $2
AND category = $3
AND thread_title = $4
AND uname = $5
`;

const DELETE_THREAD = `
DELETE FROM Threads 
WHERE module_code = $1
AND category = $2
AND thread_title = $3
AND uname = $4
`;

const GET_NEXT_POST_ID = `
SELECT MAX(COALESCE(post_id, 0))
FROM Posts 
WHERE module_code = $1 
AND category = $2 
AND thread_title = $3
`;

const NEW_POST_ENTRY = `
INSERT INTO Posts
VALUES ($1, $2, $3, $4, $5, NOW(), $6)
`;

const GET_ALL_POSTS_FOR_THREAD = `
SELECT P.module_code, P.category, P.thread_title, P.post_content, P.post_id, P.uname, U.name, TO_CHAR(P.timestamp, 'dd-mm-yyyy hh12:mi am') AS timestamp
FROM Posts P, Users U
WHERE module_code = $1
AND category = $2
AND thread_title = $3
AND P.uname = U.username
ORDER BY timestamp ASC
`;

const AMEND_POST_ENTRY = `
UPDATE Posts
SET post_content = $1, timestamp = NOW()
WHERE uname = $2
AND module_code = $3
AND category = $4
AND thread_title = $5
AND post_id = $6
`;

const DELETE_POST_ENTRY = `
DELETE FROM Threads 
WHERE module_code = $1
AND category = $2
AND thread_title = $3
AND post_id = $4
AND uname = $5
`;

const SEARCH_FOR_FORUM_POSTS = `
SELECT P.module_code, P.category, P.thread_title, P.post_content, P.post_id, P.uname, U.name, TO_CHAR(P.timestamp, 'dd-mm-yyyy hh12:mi am') AS timestamp
FROM Posts P, Users U
WHERE module_code = $1
AND P.uname = U.username
AND LOWER(post_content) LIKE '%' || $2 || '%'
`;

const SEARCH_FOR_THREAD_POSTS = `
SELECTP.module_code, P.category, P.thread_title, P.post_content, P.post_id, P.uname, U.name, TO_CHAR(P.timestamp, 'dd-mm-yyyy hh12:mi am') AS timestamp
FROM Posts P, Users U
WHERE module_code = $1
AND category = $2
AND P.uname = U.username
AND LOWER(post_content) LIKE '%' || $3 || '%'
`;

const GET_COURSE_HOT_FORUM_THREADS = `
SELECT category, thread_title 
FROM Posts
WHERE module_code = $1
GROUP BY category, thread_title
HAVING COUNT(*) >= ALL (
    SELECT COUNT(*)
    FROM Posts
    WHERE module_code = $1
    GROUP BY category, thread_title
)
`;

router.post("/course/forum", (req, res, next) => {
  const data = {
    module_code: req.body.module_code
  };
  pool.query(
    GET_ALL_CATEGORIES_FOR_COURSE,
    [data.module_code],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send(dbRes.rows);
      }
    }
  );
});
router.post("/course/forum/thread", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    category: req.body.category
  };
  pool.query(
    GET_ALL_THREADS_FOR_COURSE_CATEGORY,
    [data.module_code, data.category],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send(dbRes.rows);
      }
    }
  );
});

router.post("/course/forum/add", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    category: req.body.category,
    puname: req.body.puname
  };
  pool.query(
    CHECK_PROF_TEACHES,
    [data.module_code, data.puname],
    (err, dbRes) => {
      if (err) {
        res.send("error");
      } else {
        if (dbRes.rowCount > 0) {
          pool.query(
            CREATE_NEW_FORUM,
            [data.module_code, data.category],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("add new forum success");
              }
            }
          );
        } else {
          res.send("error prof does not teach this course");
        }
      }
    }
  );
});

router.post("/course/forum/delete", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    category: req.body.category,
    puname: req.body.puname
  };
  pool.query(
    CHECK_PROF_TEACHES,
    [data.module_code, data.puname],
    (err, dbRes) => {
      if (err) {
        res.send("error");
      } else {
        if (dbRes.rowCount > 0) {
          pool.query(
            DELETE_FORUM,
            [data.module_code, data.category],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("delete new forum success");
              }
            }
          );
        } else {
          res.send("error prof does not teach this course");
        }
      }
    }
  );
});

router.post(
  "/course/forum/thread/new",
  (req, res, next) => {
    const data = {
      module_code: req.body.module_code,
      category: req.body.category,
      thread_title: req.body.thread_title,
      uname: req.body.uname
    };
    pool.query(
      NEW_THREAD_ENTRY,
      [data.module_code, data.category, data.thread_title, data.uname],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          res.send("insert success");
        }
      }
    );
  }
);

router.post("/course/forum/hot", (req, res, next) => {
  const data = {
    module_code: req.body.module_code
  };
  pool.query(GET_COURSE_HOT_FORUM_THREADS, [data.module_code], (err, dbRes) => {
    if (err) {
      res.send("error!");
    } else {
      res.send(dbRes.rows);
    }
  });
});

router.post(
  "/course/forum/thread/edit",
  (req, res, next) => {
    const data = {
      module_code: req.body.module_code,
      category: req.body.category,
      new_thread_title: req.body.new_thread_title,
      old_thread_title: req.body.old_thread_title,
      uname: req.body.uname
    };
    pool.query(
      AMEND_THREAD_ENTRY,
      [
        data.new_thread_title,
        data.module_code,
        data.category,
        data.old_thread_title,
        data.uname
      ],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          res.send("edit thread title success");
        }
      }
    );
  }
);

router.post(
  "/course/forum/thread/delete",
  (req, res, next) => {
    const data = {
      module_code: req.body.module_code,
      category: req.body.category,
      thread_title: req.body.thread_title,
      uname: req.body.uname
    };
    pool.query(
      DELETE_THREAD,
      [data.module_code, data.category, data.thread_title, data.uname],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          res.send("delete thread success");
        }
      }
    );
  }
);

router.post(
  "/course/forum/thread/posts",
  (req, res, next) => {
    const data = {
      module_code: req.body.module_code,
      category: req.body.category,
      thread_title: req.body.thread_title
    };
    pool.query(
      GET_ALL_POSTS_FOR_THREAD,
      [data.module_code, data.category, data.thread_title],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          res.send(dbRes.rows);
        }
      }
    );
  }
);

router.post(
  "/course/forum/thread/posts/new",
  (req, res, next) => {
    const data = {
      module_code: req.body.module_code,
      category: req.body.category,
      thread_title: req.body.thread_title,
      post_content: req.body.post_content,
      uname: req.body.uname
    };
    pool.query(
      GET_NEXT_POST_ID,
      [data.module_code, data.category, data.thread_title],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          const post_id = dbRes.rows[0].max + 1;
          pool.query(
            NEW_POST_ENTRY,
            [
              data.module_code,
              data.category,
              data.thread_title,
              data.post_content,
              post_id,
              data.uname
            ],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("new post entry success");
              }
            }
          );
        }
      }
    );
  }
);

router.post(
  "/course/forum/thread/posts/edit",
  (req, res, next) => {
    const data = {
      post_content: req.body.post_content,
      uname: req.body.uname,
      module_code: req.body.module_code,
      category: req.body.category,
      thread_title: req.body.thread_title,
      post_id: req.body.post_id
    };
    pool.query(
      AMEND_POST_ENTRY,
      [
        data.post_content,
        data.uname,
        data.module_code,
        data.category,
        data.thread_title,
        data.post_id
      ],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          res.send("update success");
        }
      }
    );
  }
);

router.post(
  "/course/forum/thread/posts/delete",
  (req, res, next) => {
    const data = {
      module_code: req.body.module_code,
      category: req.body.category,
      thread_title: req.body.thread_title,
      post_id: req.body.post_id,
      uname: req.body.uname
    };
    pool.query(
      DELETE_POST_ENTRY,
      [
        data.module_code,
        data.category,
        data.thread_title,
        data.post_id,
        data.uname
      ],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          res.send("delete post success");
        }
      }
    );
  }
);

router.post("/course/forum/search", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    search_input: req.body.search_input
  };
  pool.query(
    SEARCH_FOR_FORUM_POSTS,
    [data.module_code, data.search_input.toLowerCase()],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send(dbRes.rows);
      }
    }
  );
});

router.post(
  "/cours/forum/thread/search",
  (req, res, next) => {
    const data = {
      module_code: req.body.module_code,
      category: req.body.category,
      search_input: req.body.search_input
    };
    pool.query(
      SEARCH_FOR_THREAD_POSTS,
      [
        data.module_code,
        data.category,
        data.search_input.toLowerCase()
      ],
      (err, dbRes) => {
        if (err) {
          res.send("error!");
        } else {
          res.send(dbRes.rows);
        }
      }
    );
  }
);

module.exports = router;
