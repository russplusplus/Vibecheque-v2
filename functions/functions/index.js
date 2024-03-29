const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();
const {Storage} = require('@google-cloud/storage');
const gcs = new Storage({keyFilename: './service-account.json'});

exports.addUser = functions.auth.user().onCreate(user => {
  console.log(user)
  admin
    .database()
    .ref(`users/${user.uid}`)
    .set({
      unbanTime: 0,
      email: user.email,
      phoneNumber: user.phoneNumber,
      settings: {
        location: false,
        distance: 500,
        leftHandedMode: false
      }
  });
});

exports.addImage = functions.storage.object('/images').onFinalize(async (object) => {
  console.log('storage object:', object)

  // Sender UID and isResponding are attached as metadata to storage object
  console.log('object.metadata.fromUid:', object.metadata.fromUid)
  let senderUid = object.metadata.fromUid

  // 'images/xxxxxxx' => 'xxxxxxx'
  let filename = object.name.substring(7)

  if (object.metadata.toUid) {
    let isResponse = true
    console.log('vibe has recipient metadata and therefore is a response. toUid:', object.metadata.toUid)
    let recipientUid = object.metadata.toUid

    // send FCM to recipient device registration token
    let snapshot = await admin  
      .database()
      .ref('users')
      .once('value')
    let users = snapshot.val()
    
    // generate download URL
    const bucket = gcs.bucket("vibecheque-543ff.appspot.com");
    console.log('bucket:', bucket)
    const file = bucket.file(object.name);
    console.log('file:', file)
    const urlArr = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    })
    const url = urlArr[0]

    console.log('in add image function. storage url:', url)

    // add entry to database
    console.log('recipientUid:', recipientUid)
    console.log('senderUid:', senderUid) 
    admin
      .database()
      .ref(`users/${recipientUid}/inbox/${filename}`)
      .set({
        from: senderUid,
        to: recipientUid,
        isResponse: isResponse,
        url: url,
        didTheyFavorite: object.metadata.didTheyFavorite
      })

    // send FCM
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
  } else {
    let isResponse = false
    console.log('vibe does not have recipient metadata and therefore is not a response')

    // Get users from database to randomly assign recipient
    let snapshot = await admin  
      .database()
      .ref('users')
      .once('value')
    let users = snapshot.val()
    console.log('snapshot:', users)
    let uidArr = []
    for (user in users) {
      //console.log('user:', user)
      if (users[user].unbanTime < new Date().getTime() && user != senderUid) {   // add [if in geographic radius...]
        console.log('user', user, 'is a suitable recipient')
        //console.log('senderUid:', senderUid)
        uidArr.push(user)
      } else {
        console.log('user', user, 'is NOT a suitable recipient')
        //console.log('senderUid:', senderUid)
      }
    }
    console.log('uidArr:', uidArr)
    console.log('senderUid:', senderUid)
    let recipientUid = uidArr[Math.floor(Math.random() * uidArr.length)]

    // randomly select from array of suitable UIDs
    // let i = 0
    // do {
    //   recipientUid = uidArr[Math.floor(Math.random() * uidArr.length)]
    //   i++
    //   console.log(`recipientUid number ${i}:`, recipientUid)
    // } while ((recipientUid === senderUid && i < 100) || users[recipientUid].unbanTime > new Date().getTime()) //delete i < 100 in prod
    
    //previously, uidArr contained all uids. Now, uid only contains suitable recipients, so the loop is not necessary.
    
    
    // generate download URL
    const bucket = gcs.bucket("vibecheque-543ff.appspot.com");
    console.log('bucket:', bucket)
    const file = bucket.file(object.name);
    console.log('file:', file)
    const urlArr = await file.getSignedUrl({
      action: 'read',
      expires: '03-09-2491'
    })
    const url = urlArr[0]

    console.log('storage url:', url)
            
    // add entry to database
    console.log('recipientUid:', recipientUid)
    console.log('senderUid:', senderUid) 
    console.log(`ref: users/${recipientUid}/inbox/${filename}`)
    admin
      .database()
      .ref(`users/${recipientUid}/inbox/${filename}`)
      .set({
        from: senderUid,
        to: recipientUid,
        isResponse: isResponse,
        url: url
    })

    // send FCM to recipient device registration token
    let recipientToken = users[recipientUid].registrationToken
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
  }
});