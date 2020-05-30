import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';

const config = {
  //.env is hidden in storycollab
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "storycollab-def01.firebaseapp.com",
  databaseURL: "https://storycollab-def01.firebaseio.com",
  projectId: "storycollab-def01",
  storageBucket: "storycollab-def01.appspot.com",
  messagingSenderId: "246768205772",
  appId: "1:246768205772:web:aa742d8c191d5f9ba96769"
}

firebase.initializeApp(config);

export default firebase;
