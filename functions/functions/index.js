const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

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
  console.log('storage object:', object)

  // Sender UID is attached as metadata to storage object
  console.log('object.metadata.fromUid:', object.metadata.fromUid)
  let senderUid = object.metadata.fromUid

  // 'images/xxxxxxx' => 'xxxxxxx'
  let filename = object.name.substring(7)

  // Get users from database to randomly assign recipient
  admin  
    .database()
    .ref('users')
    .once('value')
    .then(snapshot => {
      console.log('snapshot:', snapshot.val())
      let uidArr = []
      for (uid in snapshot.val()) {
        // add [if not banned...]
        uidArr.push(uid)
      }
      console.log('uidArr:', uidArr)

      // randomly select from array of suitable UIDs
      let recipientUid
      let i = 0
      do {
        recipientUid = uidArr[Math.floor(Math.random() * uidArr.length)]
        i++
      } while (recipientUid === senderUid && i < 100)
      console.log('recipientUid:', recipientUid)

      // add entry to images table 
      admin
      .database()
      .ref(`images/${filename}`)
      .set({
        from: senderUid,
        to: recipientUid,
        isResponse: false
      })
    })
  
});
