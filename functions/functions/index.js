const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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


