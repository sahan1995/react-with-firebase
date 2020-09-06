import firebase from "firebase";
const fireBaseConfig = {
    apiKey: "AIzaSyBuHdXqm4Lh-V_-RUvw2hTzT0YnACWH3Pc",
    authDomain: "react-demo-2b888.firebaseapp.com",
    databaseURL: "https://react-demo-2b888.firebaseio.com",
    projectId: "react-demo-2b888",
    storageBucket: "react-demo-2b888.appspot.com",
    messagingSenderId: "164891283710",
    appId: "1:164891283710:web:04d8e725fc4831dd7c95af"
}

firebase.initializeApp( fireBaseConfig );

export default firebase;