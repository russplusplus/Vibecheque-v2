const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
//const admin = require('firebase-admin');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

//const usersRef = admin.database().ref('/users');

exports.helloWorld = functions.https.onCall((data, context) => {
  return 'Hello from Firebase!';
});

exports.addUser = functions.auth.user().onCreate(user => {
  admin
    .database()
    .ref(`users/${user.uid}`)
    .set({
      isBanned: 0,
      email: user.email,
    });
});
