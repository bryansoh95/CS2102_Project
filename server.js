(express = require("express")),
(cors = require("cors")),
(bodyParser = require("body-parser")),
(app = express());

coursesRoute = require("./routes/courses");
forumsRoute = require("./routes/forums");
loginRoute = require("./routes/login");

//Allowed cors in localhost
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", coursesRoute);
app.use("/", forumsRoute);
app.use("/", loginRoute);

//Server
app.listen(8080, function() {
  console.log("API listening on http://localhost:8080/server");
});
