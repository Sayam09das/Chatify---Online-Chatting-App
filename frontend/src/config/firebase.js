// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCcdGL9S_T4A8GMJhBL67qjSmxoL25mbrI",
    authDomain: "chatify-fae23.firebaseapp.com",
    projectId: "chatify-fae23",
    storageBucket: "chatify-fae23.appspot.com",
    messagingSenderId: "922262799037",
    appId: "1:922262799037:web:8ff031966de7ad26cd6dd4",
    measurementId: "G-LT7BQLJGFZ"
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
