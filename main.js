import React from 'react';
import ReactDOM from 'react-dom';
import MyLogin from './modules/my-login.jsx';

ReactDOM.render(<MyLogin />, document.getElementById('login'));


// function get4sqKey() {
//     window.foursquareKey || window.open("api/login.php", "foursquareAuth", "width=960, height=548");
// }
//
// function set4sqKey(key, basePath, clientId) {
//     window.foursquareKey = key;
//     window.basePath = basePath;
//     window.clientId = clientId;
//
//     console.log(">> Logged in!");
// }
