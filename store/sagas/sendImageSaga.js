import { put, select, takeEvery } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';

function* sendImage(action) {
    console.log('in send image saga')

    // Get the time in milliseconds to use for the file names in S3
    let d = new Date();
    const Key = String(d.getTime());
    const ContentType = 'image/jpeg';

    // Get Firebase token from Async Storage
    let token = yield AsyncStorage.getItem("token")

    // Get reduxState
    const reduxState = yield select();
    const capturedImageBase64 = reduxState.capturedImage.base64;
    //console.log('base64:', capturedImageBase64)
    console.log('type of Base64:', typeof capturedImageBase64)

    // function base64toBlob(base64Data, contentType) {
    //     contentType = contentType || '';
    //     let sliceSize = 1024;
    //     let byteCharacters = Base64.atob(base64Data);
    //     let bytesLength = byteCharacters.length;
    //     let slicesCount = Math.ceil(bytesLength / sliceSize);
    //     let byteArrays = new Array(slicesCount);

    //     for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
    //         let begin = sliceIndex * sliceSize;
    //         let end = Math.min(begin + sliceSize, bytesLength);

    //         let bytes = new Array(end - begin);
    //         for (let offset = begin, i = 0 ; offset < end; ++i, ++offset) {
    //             bytes[i] = byteCharacters[offset].charCodeAt(0);
    //         }
    //         byteArrays[sliceIndex] = new Uint8Array(bytes);
    //     }
    //     return new Blob(byteArrays, { type: contentType });
    // }
    

    // const imageBlob = base64toBlob(capturedImageBase64, 'image/jpg')

    imageStorageRef.putString(capturedImageBase64, 'base64').then((snapshot) => {
        console.log('Uploaded image blob to Firebase storage!')
    })
    //const arr = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z','1','2','3','4','5','6','7','8','9','0','+','/']
    //console.log(capturedImageBase64.length)
    // for (let i = 0; i < capturedImageBase64.length; i++) {
    //     let match = false
    //     console.log(i)
    //     for (let char of arr) {
    //         if (capturedImageBase64[i] == char) {
    //             match = true
    //         }
    //     }
    //     if (!match) {
    //         console.log('index:', i, 'character:', capturedImageBase64[i])
    //     }
    // }

    // imageStorageRef.putString("5b6p5Y+344GX44G+44GX44Gf77yB44GK44KB44Gn44Go44GG77yB", 'base64').then((snapshot) => {
    //     console.log('Uploaded image to Firebase storage!')
    // })
   
    // GET PUT URL
    // fetch(`https://murmuring-lake-71708.herokuapp.com/aws/generate-put-url?Key=${Key}&ContentType=${ContentType}`, {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             Authorization: 'Bearer ' + jwt
    //         }
    // }).then((response) => {
    //     return response.json()
    // }).then((myJson) => {
    //     console.log('put url:', myJson.putURL)  //server returns URL as object with putURL attribute
    //     let putURL = myJson.putURL
    //     console.log(putURL)
    //     // PUT image to S3
    //     fetch(putURL, {
    //         method: 'PUT',
    //         body: reduxState.capturedImage //tell this to look in redux instead
    //     }).then((response) => {
    //         console.log('in putImageToS3 first .then')
    //         return response.text()
    //     }).then((myJson) => {
    //         console.log('in putImageToS3 second .then')
            
    //         // GET GET URL
    //         console.log('Key:', Key)
    //         fetch(`https://murmuring-lake-71708.herokuapp.com/aws/generate-get-url?Key=${Key}`, {
    //         method: 'GET',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             Authorization: 'Bearer ' + jwt
    //         }
    //         }).then((response) => {
    //             return response.json()
    //         }).then((myJson) => {
    //             console.log('get url:', myJson.getURL)  //server returns URL as object with putURL attribute
    //             const getURL = myJson.getURL
    //             fetch('https://vibecheque-543ff.firebaseio.com/images.json', {
    //                 method: 'POST',
    //                 body: JSON.stringify({url: getURL}),
    //                 headers: {
    //                     'Content-Type': 'application/json'
    //                 }
    //             }).then((response) => {
    //                 console.log('in Firebase .then')
    //                 return response.json()
    //             }).then((myJson) => {
    //                 console.log('in second Firebase .then. myJson:', myJson)
    //             })
    //         }).catch((error) => {
    //             console.log('error in generate-put-url:', error)
    //         })
    //     }).catch((error) => {
    //         console.log('error in putImageToS3:', error);
    //     })
    // }).catch((error) => {
    //     console.log('error in generate-put-url:', error)
    // })
}

function* sendImageSaga() {
    yield takeEvery('SEND_IMAGE', sendImage)
}

export default sendImageSaga;