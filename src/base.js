import Rebase from "re-base";
import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyA2ZiOlbBBG1GmD3-kJN_2hhdmJ6Bz_Uu8",
  authDomain: "catch-of-the-day-tvkocken.firebaseapp.com",
  databaseURL: "https://catch-of-the-day-tvkocken.firebaseio.com",
});

const base = Rebase.createClass(firebaseApp.database());

//this is a named export
export { firebaseApp };

//this is a default export
export default base;
