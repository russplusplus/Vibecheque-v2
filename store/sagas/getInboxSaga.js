import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

function* getInbox() {
    //user ID should be retrieved once and stored in redux
    //let uid = JSON.parse(yield AsyncStorage.getItem('user')).uid
    let reduxState = yield select()
    let uid = reduxState.userID
    let response = yield functions().httpsCallable('updateInbox')({uid})
    console.log('response.data:', response.data)
    yield put({
        type: 'SET_INBOX',
        payload: response.data
    })   
    let url;
    if (response.data[0]) {
        url = yield storage().ref(`images/${response.data[0].imageName}`).getDownloadURL()
        console.log('in getInboxUrl. url:', url)
    } else {
        url = null
    }
    
    yield put({
        type: 'SET_INBOX_URL',
        payload: url
    })  
}

function* getFavoriteURL() {
    let reduxState = yield select()
    const ref = `users/${reduxState.userID}/favorite`
    const snapshot = yield database()
        .ref(ref)
        .once('value')
            console.log('in getFavoriteURL .then. snapshot:', snapshot)
    yield put({
        type: 'SET_FAVORITE_URL',
        payload: {
            snapshot
        }
    })
}

function* deleteImage(action) {
    console.log('in deleteImage. action.payload: ', action.payload)
    // delete from redux
    let reduxState = yield select()
    let newInbox = reduxState.inbox
    console.log('before shift:', newInbox)
    let toBeDeleted = newInbox.shift()
    console.log('after shift:', newInbox)
    console.log('toBeDeleted:', toBeDeleted)
    console.log('imageName:', toBeDeleted.imageName)
    // yield put({  // this might not be necessary since redux inbox will get refreshed upon cameraPage load
    //     type: 'SET_INBOX',
    //     payload: newInbox
    // })

    // delete from database
    let uid = JSON.parse(yield AsyncStorage.getItem('user')).uid
    yield database().ref(`users/${uid}/inbox/${toBeDeleted.imageName}`).remove()

    // delete from storage if image isn't favorited
    if (action.payload.isFavorited) {
        console.log('image was favorited, so not deleted from storage')
    } else {
        yield storage().ref(`images/${toBeDeleted.imageName}`).delete()
    }
}

function* deleteFavorite() {
    // delete from storage
    //yield storage().ref(`images/${toBeDeleted.imageName}`).delete()
    //this won't work because toBeDeleted isn't defined
}

function* getInboxSaga() {
    yield takeEvery('GET_INBOX', getInbox)
    yield takeEvery('DELETE_IMAGE', deleteImage)
    yield takeEvery('GET_FAVORITE_URL', getFavoriteURL)
}

export default getInboxSaga;