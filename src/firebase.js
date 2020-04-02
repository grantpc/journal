import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/functions";

const config = {
  apiKey: "AIzaSyBxvOa0Yst7wuji5GC61jamKWREihjpyyY",
  authDomain: "journal-3d62c.firebaseapp.com",
  databaseURL: "https://journal-3d62c.firebaseio.com",
  projectId: "journal-3d62c",
  storageBucket: "journal-3d62c.appspot.com",
  messagingSenderId: "787028169911",
  appId: "1:787028169911:web:fcd3851633e6399f192932",
  measurementId: "G-X31VVDMRT2"
};

firebase.initializeApp(config);

export const auth = firebase.auth();

export const db = firebase.firestore();

export const storage = firebase.storage();

export const functions = firebase.functions();

export function snapshotToArray(snapshot) {
  const updatedArray = [];
  snapshot.forEach(s => {
    const data = s.data();
    data.id = s.id;
    updatedArray.push(data);
  });
  return updatedArray;
}
