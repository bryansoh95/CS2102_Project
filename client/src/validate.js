import axios from "axios";

module.exports = function validate(userData) {
  axios.post("/login", userData).then(res => {
    return { data: res.data };
  });
};
