import { SET_CURRENT_USER } from "../actions/types";
import { LOGOUT } from "../actions/types";

const initialState = {
  username: null,
  name: null,
  isLoggedIn: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      console.log(action.payload[[0]].username);
      return {
        ...state,
        username: action.payload[[0]].username,
        name: action.payload[[0]].name,
        isLoggedIn: true
      };
    case LOGOUT:
      return {
        ...state,
        username: null,
        name: null,
        isLoggedIn: false
      };
    default:
      return state;
  }
}
