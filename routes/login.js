const express = require("express");
const pool = require("../pool");
const router = express.Router();

const GET_USER_DETAILS = `
SELECT *
FROM Users
WHERE username = $1
`;

router.post("/login", (req, res, next) => {
  const data = {
    username: req.body.username,
    password: req.body.password
  };
  pool.query(GET_USER_DETAILS, [data.username], (err, dbRes) => {
    if (err || dbRes.rowCount === 0) {
      res.status(400).send(err);
    } else {
      if (dbRes.rows[0].password === data.password) {
        res.status(200).send(dbRes.rows);
      } else {
        res.status(400).send(err);
      }
    }
  });
});

module.exports = router;
