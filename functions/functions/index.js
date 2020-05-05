const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addUser = functions.auth.user().onCreate(user => {
  console.log(user)
  admin
    .database()
    .ref(`users/${user.uid}`)
    .set({
      isBanned: 0,
      email: user.email,
      phoneNumber: user.phoneNumber
    });
});

exports.addImage = functions.storage.object('/images').onFinalize(async (object) => {
  console.log('storage object:', object)

  // Sender UID is attached as metadata to storage object
  console.log('object.metadata.fromToken:', object.metadata.fromToken)
  let senderToken = object.metadata.fromToken

  // 'images/xxxxxxx' => 'xxxxxxx'
  let filename = object.name.substring(7)

  // Get users from database to randomly assign recipient
  admin  
    .database()
    .ref('users')
    .once('value')
    .then(snapshot => {
      let users = snapshot.val()
      console.log('snapshot:', users)
      let tokenArr = []
      for (user in users) {
        console.log('user:', users[user])
        console.log('user.registrationToken:', users[user].registrationToken)
        // add [if not banned...], [if in geographic radius...]
        tokenArr.push(users[user].registrationToken)
      }
      console.log('tokenArr:', tokenArr)

      // randomly select from array of suitable UIDs
      let recipientToken
      let i = 0
      do {
        recipientToken = tokenArr[Math.floor(Math.random() * tokenArr.length)]
        i++
      } while (recipientToken === senderToken && i < 100)
      console.log('recipientToken:', recipientToken)

      // add entry to images table 
      admin
      .database()
      .ref(`images/${filename}`)
      .set({
        from: senderToken,
        to: recipientToken,
        isResponse: false
      })
    })
});
