import {REGISTER_USER} from '../actions/registerActions';

function userReducer(state = {}, action) {
	switch (action.type) {
		case REGISTER_USER:
			console.log("inside the register user reducer");
			return state;
		default:
			return state
		
	}
}

export default userReducer;