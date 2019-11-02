const express = require("express");
const pool = require("../pool");
const router = express.Router();

const CHECK_IF_STUDENT = `
SELECT *
FROM Students
WHERE username = $1
`;

const GET_ALL_COURSES = `
SELECT *
FROM Courses
`;

const GET_STUDENT_COURSES = `
SELECT * 
FROM Enrolls
NATURAL JOIN Courses
WHERE suname = $1
ORDER BY module_code ASC
`;

const GET_STUDENT_PASSED_COURSES = `
SELECT * 
FROM Passed
NATURAL JOIN Courses
WHERE suname = $1
ORDER BY module_code ASC
`;

const GET_PROF_TEACHINGS = `
SELECT * 
FROM Teaches 
NATURAL JOIN Courses
WHERE puname = $1
ORDER BY module_code ASC
`;

const PROF_GET_STUDENT_REQUESTS_FOR_COURSE = `
SELECT * 
FROM Requests
WHERE module_code = $1
`;

const PROF_ADD_STUDENT_TO_COURSE = `
INSERT INTO Enrolls
VALUES ($1, $2)
`;

const CHECK_PROF_TEACHES = `
SELECT * 
FROM Teaches
WHERE module_code = $1
AND puname = $2
`;

const STUDENT_REQUEST_FOR_NEW_COURSE = `
INSERT INTO Requests
VALUES ($1, $2, NOW())
`;

const GET_ALL_TUTORS_FOR_COURSE = `
SELECT * 
FROM Tutors
WHERE module_code = $1
`;

const ADD_NEW_TUTOR_TO_COURSE = `
INSERT INTO Tutors
VALUES ($1, $2, $3)
`;

const DELETE_TUTOR_FROM_COURSE = `
DELETE FROM Tutors
WHERE suname = $1
AND module_code = $2
`;

const GET_ALL_COURSE_ANNOUNCEMENTS_FOR_STUDENT = `
SELECT *
FROM Announcements A, Users U
WHERE module_code IN (
    SELECT module_code 
    FROM Enrolls
    WHERE suname = $1
)
AND A.puname = U.username
ORDER BY A.timestamp DESC
`;

const GET_ALL_COURSE_ANNOUNCEMENTS_FOR_PROF = `
SELECT *
FROM Announcements 
WHERE module_code IN (
    SELECT module_code 
    FROM Teaches
    WHERE puname = $1
)
`;

const GET_CURRENT_COURSE_ANNOUNCEMENTS = `
SELECT *
FROM Announcements A, Users U
WHERE module_code = $1 
AND A.puname = U.username
`;

const ADD_NEW_COURSE_ANNOUNCEMENT = `
INSERT INTO Announcements
VALUES ($1, $2, $3, $4, NOW())
`;

const EDIT_COURSE_ANNOUNCEMENT = `
UPDATE Announcements SET title = $1, content = $2, timestamp = NOW()
WHERE module_code = $3
AND title = $4
AND puname = $5
`;

const DELETE_COURSE_ANNOUNCEMENT = `
DELETE FROM Announcements 
WHERE module_code = $1
AND title = $2
AND puname = $3
`;

const GET_ALL_COURSE_ASSESSMENT = `
SELECT *
FROM Assessment
WHERE module_code = $1
`;

const ADD_NEW_COURSE_ASSESSMENT = `
INSERT INTO Assessment
VALUES ($1, $2, $3)
`;

const DELETE_COURSE_ASSESSMENT = `
DELETE FROM Assessment
WHERE module_code = $1
AND title = $2
`;

const EDIT_COURSE_ASSESSMENT = `
UPDATE Assessment SET title = $1, max_mark = $2
WHERE module_code = $3
AND title = $4
`;

const GET_STUDENT_COURSE_SCORES = `
SELECT * 
FROM Scores
WHERE module_code = $1
AND suname = $2
`;

const ADD_NEW_COURSE_ASSESSMENT_SCORE = `
INSERT INTO Scores 
VALUES ($1, $2, $3, $4)
`;

const DELETE_COURSE_ASSESSMENT_SCORE = `
DELETE FROM Scores 
WHERE suname = $1
AND module_code = $2
AND title = $3
`;

const EDIT_COURSE_ASSESSMENT_SCORE = `
UPDATE Scores SET score = $1
WHERE suname = $2
AND module_code = $3
AND title = $4
`;

const ADD_STUDENT_TO_PASSED = `
INSERT INTO Passed
VALUES ($1, $2, $3, $4, $5)
`;

const GET_BUDDY_PAIRS = `
SELECT DISTINCT S1.username, S2.username
FROM Students S1, Students S2 
WHERE S1.username < S2.username 
AND EXISTS (SELECT 1 FROM Passed WHERE suname = S1.username) 
AND NOT EXISTS (
	SELECT 1 FROM Passed P1 
	WHERE suname = S1.username 
	AND NOT EXISTS (SELECT 1 FROM Passed P2 WHERE suname = S2.username AND module_code = P1.module_code AND academic_year = P1.academic_year AND semester = P1.semester)
) 
AND NOT EXISTS (
	SELECT 1 FROM Passed P2 
	WHERE suname = S2.username 
	AND NOT EXISTS (SELECT 1 FROM Passed P1 WHERE suname = S1.username AND module_code = P2.module_code AND academic_year = P2.academic_year AND semester = P2.semester)
)
`;

router.post("/course", (req, res, next) => {
  const data = {
    username: req.body.username
  };
  pool.query(CHECK_IF_STUDENT, [data.username], (err, dbRes) => {
    if (err) {
      res.send("error");
    } else {
      if (dbRes.rowCount === 1) {
        pool.query(GET_STUDENT_COURSES, [data.username], (err, dbRes) => {
          if (err) {
            res.send("error!");
          } else {
            res.send(dbRes.rows);
          }
        });
      } else {
        pool.query(GET_PROF_TEACHINGS, [data.username], (err, dbRes) => {
          if (err) {
            res.send("error");
          } else {
            res.send(dbRes.rows);
          }
        });
      }
    }
  });
});

router.post("/course/student", (req, res, next) => {
  const data = {
    username: req.body.username
  };
  pool.query(CHECK_IF_STUDENT, [data.username], (err, dbRes) => {
    if (err) {
      res.send("error");
    } else {
      if (dbRes.rowCount === 1) {
        pool.query(
          GET_ALL_COURSE_ANNOUNCEMENTS_FOR_STUDENT,
          [data.username],
          (err, dbRes) => {
            if (err) {
              res.send("error!");
            } else {
              res.send(dbRes.rows);
            }
          }
        );
      } else {
        pool.query(
          GET_ALL_COURSE_ANNOUNCEMENTS_FOR_PROF,
          [data.username],
          (err, dbRes) => {
            if (err) {
              res.send("error");
            } else {
              res.send(dbRes.rows);
            }
          }
        );
      }
    }
  });
});

router.get("/course/all", (req, res, next) => {
  pool.query(GET_ALL_COURSES, (err, dbRes) => {
    if (err) {
      res.send("error!");
    } else {
      res.send(dbRes.rows);
    }
  });
});

router.post("/course/passed", (req, res, next) => {
  const data = {
    suname: req.body.suname
  };
  pool.query(GET_STUDENT_PASSED_COURSES, [data.suname], (err, dbRes) => {
    if (err) {
      res.send("error!");
    } else {
      res.send(dbRes.rows);
    }
  });
});

router.post("/course/add", (req, res, next) => {
  const data = {
    suname: req.body.suname,
    module_code: req.body.module_code,
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
            PROF_ADD_STUDENT_TO_COURSE,
            [data.suname, data.module_code],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("added student in");
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

router.post("/course/announcements", (req, res, next) => {
  const data = {
    module_code: req.body.module_code
  };
  pool.query(
    GET_CURRENT_COURSE_ANNOUNCEMENTS,
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

router.post("/course/:module_code/announcements/new", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    title: req.body.title,
    puname: req.body.puname,
    content: req.body.content
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
            ADD_NEW_COURSE_ANNOUNCEMENT,
            [data.module_code, data.title, data.puname, data.content],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("add announcement success");
              }
            }
          );
        } else {
          res.send("error prof does not teach course");
        }
      }
    }
  );
});

router.post("/course/:module_code/announcements/edit", (req, res, next) => {
  const data = {
    new_title: req.body.new_title,
    new_content: req.body.new_content,
    old_title: req.body.old_title,
    module_code: req.body.module_code,
    puname: req.body.puname
  };
  pool.query(
    EDIT_COURSE_ANNOUNCEMENT,
    [
      data.new_title,
      data.new_content,
      data.module_code,
      data.old_title,
      data.puname
    ],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send("amend announcement success");
      }
    }
  );
});

router.post("/course/:module_code/announcements/delete", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    title: req.body.title,
    puname: req.body.puname
  };
  pool.query(
    DELETE_COURSE_ANNOUNCEMENT,
    [data.module_code, data.title, data.puname],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send("delete announcement success");
      }
    }
  );
});

router.post("/course/:module_code/requests", (req, res, next) => {
  const data = {
    module_code: req.body.module_code
  };
  pool.query(
    PROF_GET_STUDENT_REQUESTS_FOR_COURSE,
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

router.post("/course/:module_code/tutor", (req, res, next) => {
  const data = {
    module_code: req.body.module_code
  };
  pool.query(GET_ALL_TUTORS_FOR_COURSE, [data.module_code], (err, dbRes) => {
    if (err) {
      res.send("error!");
    } else {
      res.send(dbRes.rows);
    }
  });
});

router.post("/course/:module_code/tutor/add", (req, res, next) => {
  const data = {
    suname: req.body.suname,
    module_code: req.body.module_code,
    tutorial_group: req.body.tutorial_group,
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
            ADD_NEW_TUTOR_TO_COURSE,
            [data.suname, data.module_code, data.tutorial_group],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("insert tutor success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.post("/course/:module_code/tutor/delete", (req, res, next) => {
  const data = {
    suname: req.body.suname,
    module_code: req.body.module_code
  };
  pool.query(
    DELETE_TUTOR_FROM_COURSE,
    [data.suname, data.module_code],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send("delete tutor ok");
      }
    }
  );
});

router.post("/course/all/request", (req, res, next) => {
  const data = {
    suname: req.body.suname,
    module_code: req.body.module_code
  };
  pool.query(
    STUDENT_REQUEST_FOR_NEW_COURSE,
    [data.suname, data.module_code],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send("request add ok");
      }
    }
  );
});

router.post("/course/:module_code/assessment", (req, res, next) => {
  const data = {
    module_code: req.body.module_code
  };
  pool.query(GET_ALL_COURSE_ASSESSMENT, [data.module_code], (err, dbRes) => {
    if (err) {
      res.send("error!");
    } else {
      res.send(dbRes.rows);
    }
  });
});

router.post("/course/:module_code/assessment/add", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    title: req.body.title,
    max_mark: req.body.max_mark,
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
            ADD_NEW_COURSE_ASSESSMENT,
            [data.module_code, data.title, data.max_mark],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("insert assessment success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.post("/course/:module_code/assessment/delete", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    title: req.body.title,
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
            DELETE_COURSE_ASSESSMENT,
            [data.module_code, data.title],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("delete assessment success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.post("/course/:module_code/assessment/edit", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    old_title: req.body.old_title,
    new_title: req.body.new_title,
    max_mark: req.body.max_mark,
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
            EDIT_COURSE_ASSESSMENT,
            [data.new_title, data.max_mark, data.module_code, data.old_title],
            (err, dbRes) => {
              if (err) {
                console.log(err);
                res.send("error!");
              } else {
                res.send("amend assessment success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.post("/course/:module_code/gradebook", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    suname: req.body.suname
  };
  pool.query(
    GET_STUDENT_COURSE_SCORES,
    [data.module_code, data.suname],
    (err, dbRes) => {
      if (err) {
        res.send("error!");
      } else {
        res.send(dbRes.rows);
      }
    }
  );
});

router.post("/course/:module_code/gradebook/add", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    title: req.body.title,
    score: req.body.score,
    suname: req.body.suname,
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
            ADD_NEW_COURSE_ASSESSMENT_SCORE,
            [data.suname, data.module_code, data.score, data.title],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("add student course assessment score success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.delete("/course/:module_code/gradebook/delete", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    title: req.body.title,
    suname: req.body.suname,
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
            DELETE_COURSE_ASSESSMENT_SCORE,
            [data.suname, data.module_code, data.title],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("delete student course assessment score success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.put("/course/:module_code/gradebook/edit", (req, res, next) => {
  const data = {
    module_code: req.body.module_code,
    title: req.body.title,
    suname: req.body.suname,
    score: req.body.score,
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
            EDIT_COURSE_ASSESSMENT_SCORE,
            [data.score, data.suname, data.module_code, data.title],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("amend student course assessment score success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.post("/course/passed/add", (req, res, next) => {
  const data = {
    suname: req.body.suname,
    module_code: req.body.module_code,
    academic_year: req.body.academic_year,
    semester: req.body.semester,
    grade: req.body.grade,
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
            ADD_STUDENT_TO_PASSED,
            [
              data.suname,
              data.module_code,
              data.academic_year,
              data.semester,
              data.grade
            ],
            (err, dbRes) => {
              if (err) {
                res.send("error!");
              } else {
                res.send("add student to passed success");
              }
            }
          );
        } else {
          res.send("prof does not teach course");
        }
      }
    }
  );
});

router.get("/course/buddies", (req, res, next) => {
  pool.query(GET_BUDDY_PAIRS, (err, dbRes) => {
    if (err) {
      res.send("error!");
    } else {
      res.send(dbRes.rows);
    }
  });
});

module.exports = router;
