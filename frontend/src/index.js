import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios'; 
import Root from './components/root'; 
import configureStore from './store/store'; 
import jwt_decode from 'jwt-decode'; 
import { setAuthToken } from './util/session_api_util'; 
import { logout } from './actions/session_actions'; 
// import reportWebVitals from './reportWebVitals';

document.addEventListener('DOMContentLoaded', () => {
  let store; 

  //if returning user has session token in localstorage
  if (localStorage.jwtToken) {
    setAuthToken(localStorage.jwtToken); //set token as common header for all axios requests
    const decodedUser = jwt_decode(localStorage.jwtToken); //decode token to obtain user's information
    const preloadedState = { session: { isAuthenticated: true, user: decodedUser } }; //create preconfigured state we can add to store
    store = configureStore(preloadedState); 
    const currentTime = Date.now() / 1000; 
    if (decodedUser.exp < currentTime) {
      //logout user and redirect to login page
      store.dispatch(logout()); 
      window.location.href = '/login'; 
    }
  } else {
    //first time user, start with empty store
    store = configureStore({}); 
  }

  //render root component and pass in store as prop
  const root = document.getElementById('root'); 
  ReactDOM.render(<Root store={store} />, root); 
})

// ReactDOM.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

// window.axios = axios

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
