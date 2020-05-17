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
      phoneNumber: user.phoneNumber,
  });
});

exports.addImage = functions.storage.object('/images').onFinalize(async (object) => {
  console.log('storage object:', object)

  // Sender UID and isResponding are attached as metadata to storage object
  console.log('object.metadata.fromUid:', object.metadata.fromUid)
  let senderUid = object.metadata.fromUid
  let isResponse = object.metadata.isResponse

  // 'images/xxxxxxx' => 'xxxxxxx'
  let filename = object.name.substring(7)

  if (object.metadata.toUid) {
    console.log('in response block. toUid:', object.metadata.toUid)
    let recipientUid = object.metadata.toUid
    admin  
      .database()
      .ref('users')
      .once('value')
      .then(snapshot => {
        let users = snapshot.val()
        let recipientToken = users[recipientUid].registrationToken
        console.log('response block recipientToken:', recipientToken)
        let payload = {
          notification: {
            title: 'New Vibecheque response!',
            body: 'Open the app to view it',
            imageUrl: 'https://my-cdn.com/app-logo.png',
          },
        }
        admin
          .messaging()
          .sendToDevice(recipientToken, payload)
          .then(function(response) {
            console.log("Successfully sent message:", response);
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
        });
            
        // add entry to database
        console.log('recipientUid:', recipientUid)
        console.log('senderUid:', senderUid) 
        admin
          .database()
          .ref(`users/${recipientUid}/inbox/${filename}`)
          .set({
            from: senderUid,
            to: recipientUid,
            isResponse: isResponse
        })
      })
  } else {
    console.log('in default block')
    // Get users from database to randomly assign recipient
    admin  
      .database()
      .ref('users')
      .once('value')
      .then(snapshot => {
        let users = snapshot.val()
        console.log('snapshot:', users)
        let uidArr = []
        for (user in users) {
          console.log('user:', user)
          // add [if not banned...], [if in geographic radius...]
          uidArr.push(user)
        }
        console.log('uidArr:', uidArr)
        console.log('senderUid:', senderUid)

        // randomly select from array of suitable UIDs
        let recipientUid
        let i = 0
        do {
          recipientUid = uidArr[Math.floor(Math.random() * uidArr.length)]
          i++
        } while (recipientUid === senderUid && i < 100)
        console.log('recipientUid:', recipientUid)
        let recipientToken = users[recipientUid].registrationToken
        console.log('recipientToken:', recipientToken)

        let payload = {
          notification: {
            title: 'New Vibe!',
            body: 'Open the app to view it.',
            imageUrl: 'https://my-cdn.com/app-logo.png',
          },
        }
        admin
          .messaging()
          .sendToDevice(recipientToken, payload)
          .then(function(response) {
            console.log("Successfully sent message:", response);
          })
          .catch(function(error) {
            console.log("Error sending message:", error);
        });
            
        // add entry to database
        console.log('recipientUid:', recipientUid)
        console.log('senderUid:', senderUid) 
        admin
          .database()
          .ref(`users/${recipientUid}/inbox/${filename}`)
          .set({
            from: senderUid,
            to: recipientUid,
            isResponse: isResponse
        })
      })
  }

  // console.log('after if block. recipientToken:', recipientToken)
  // admin
  //   .messaging()
  //   .sendToDevice(recipientToken, payload)
  //   .then(function(response) {
  //     console.log("Successfully sent message:", response);
  //   })
  //   .catch(function(error) {
  //     console.log("Error sending message:", error);
  // });
      
  // // add entry to database
  // console.log('recipientUid:', recipientUid)
  // console.log('senderUid:', senderUid) 
  // admin
  //   .database()
  //   .ref(`users/${recipientUid}/inbox/${filename}`)
  //   .set({
  //     from: senderUid,
  //     to: recipientUid,
  //     isResponse: isResponse
  // })
});
  
exports.updateInbox = functions.https.onCall((data, context) => {
  console.log('data.registrationToken:', data.uid)
  let inboxArr = []
  return admin  
    .database()
    .ref(`users/${data.uid}/inbox`)
    .once('value')
    .then(snapshot => {
      console.log('snapshot.val():', snapshot.val())
      let images = snapshot.val()
      for (image in images) {
        if (images[image].to === data.uid) {
          inboxArr.push({
            imageName: image,
            url: '',
            isResponse: images[image].isResponse,
            from: images[image].from
          })
        }
      }
      console.log('in .then. inboxArr:', inboxArr)
      return inboxArr
    })
});