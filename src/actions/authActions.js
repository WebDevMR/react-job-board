import axios from 'axios';
import {ROOT_URL} from './index';
import jwt from 'jsonwebtoken';

import setAuth from '../utils/utils';

export const REGISTER_USER = 'REGISTER_USER';
export const FETCHING_USER = 'FETCHING_USER';

export const REGISTER_USER_ERROR = 'REGISTER_USER_ERROR';
export const REGISTER_USER_SUCCESS = 'REGISTER_USER_SUCCESS';

export const LOGIN_USER_SUCCESS = 'LOGIN_USER_SUCCESS';
export const LOGIN_USER_ERROR = 'LOGIN_USER_ERROR';

export const SET_USER = 'SET_USER';


export const LOG_OUT_USER = 'LOG_OUT_USER';

//this get's called after the server registers a new user
export function registerUserSuccess(user) {
	return {
		type: REGISTER_USER_SUCCESS,
		payload: user
	}
}

export function registerUserError(error) {
	console.log("there was an error and we're inside the register user error function");
	return {
		type: REGISTER_USER_ERROR,
		payload: {isFetching: false, error}
	}
}

export function fetchingUser() {
	return {
		type: FETCHING_USER,
		payload: {isFetching: true}
	}
}

export function registerUser(userObject) {
	
	return dispatch => {
		
		dispatch(fetchingUser());
		
		axios.post(`${ROOT_URL}register`, userObject)
			.then((response) => {
				dispatch(registerUserSuccess(response.data.user));
				
			})
			.catch((error) => {
				dispatch(registerUserError(error));
				
			});
	}
	
};

// =============================
// CLEAR
// =============================
export function logOutUser(){
	
	//clear the local storaage
	localStorage.clear();
	
	return{
		type: LOG_OUT_USER,
		payload: "user being logged out..."
	}
}

// =============================
// SETTING USER
// =============================
export function setUser(user){
	return {
		type: SET_USER,
		payload: user
	}
}

// =============================
// FETCHING INFO
// =============================

export function fetchThisUserInfo(userId){
	
	// return {
	// 	type: 'FETCHING_THIS_USER_INFO',
	// 	payload: "fetching on load"
	// }

	return dispatch => {
		dispatch(fetchingUser());
		
		console.log("going to call with:", userId);
		axios.post(`${ROOT_URL}login/dashboardinit`, {userId})
			.then((response)=>{
				console.log(response);
				
				dispatch(setUser(response.data.user));
			})
			.catch((error)=>{
			console.log("the error in fetchThisUserInfo():", error);
			})

	}
}

// =============================
// LOGIN
// =============================

export function logInUserError(error) {
	console.log("inside the loginUser error page with:", error);
	if (error === 401) {
		return {
			type: LOGIN_USER_ERROR,
			errorMessage: 'Either the password or email are incorrect!'
		}
	}
}

//requires a user and token property
export function logInUserSuccess(data) {
	
	return {
		type: LOGIN_USER_SUCCESS,
		payload: data
	}
	
}

export function logInOnLoad(token){
	
	return dispatch => {
		dispatch(fetchingUser());

		axios.post(`${ROOT_URL}login/logcheck`, {token})
			.then((response)=>{
				//response contains uer, which is our decoded token
				
				//set token as part of our request headers
				setAuth(token);
				
				let userVerified = {user: response.user, token};
				
				//send user information to be stored in the store
				dispatch(logInUserSuccess(userVerified));
				
			})
			.catch((error)=>{
				dispatch(logInUserError(error.response.status));
			})
	}
}

//this will dispatch the users email and password to server for verification
export function logInUser(user) {
	
	return dispatch => {
		
		dispatch(fetchingUser());
		
		axios.post(`${ROOT_URL}login`, user)
			.then((response) => {
				//save token to local storage
				const token = response.data.token;
				localStorage.setItem('tkn', token);
				
				//set the token as part of our request header
				setAuth(token);
				
				//data contains message, user, token
				dispatch(logInUserSuccess(response.data))
				
			})
			.catch((error) => {
				
				dispatch(logInUserError(error.response.status));
				
			})
	}
	
}

