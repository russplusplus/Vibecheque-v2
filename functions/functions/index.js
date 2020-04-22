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

exports.addImage = functions.storage.object('/images').onFinalize(async (object) => {
  console.log(object)
  let filename = object.name.substring(7)
  admin  
    .database()
    .ref('users')
    .once('value')
    .then(snapshot => {
      console.log('snapshot:', snapshot.val())
      let uidArr = []
      for (uid in snapshot.val()) {
        uidArr.push(uid)
      }
      console.log('uidArr:', uidArr)
      let recipientUid = uidArr[Math.floor(Math.random() * uidArr.length)]
      console.log('recipientUid:', recipientUid)
      admin
      .database()
      .ref(`images/${filename}`)
      .set({
        from: 'fromUser',
        to: recipientUid,
        isResponse: false
      })
    })
  
});
