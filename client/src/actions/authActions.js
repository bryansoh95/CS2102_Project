import { SET_CURRENT_USER, LOGOUT } from "./types";
import axios from "axios";

export const validateLogin = loginData => dispatch => {
  axios
    .post("/login", loginData)
    .then(res => {
      dispatch({
        type: SET_CURRENT_USER,
        payload: res.data
      });
    })
    .catch(err => alert("Invalid credentials"));
};
export const setCurrentUser = reduxParams => dispatch => {
  dispatch({
    type: SET_CURRENT_USER,
    payload: reduxParams
  });
};

export const logout = () => dispatch => {
  dispatch({
    type: LOGOUT
  });
};
