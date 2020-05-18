import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

function* getInbox() {
    let uid = JSON.parse(yield AsyncStorage.getItem('user')).uid
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

function* deleteImage() {
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

    // delete from storage
    yield storage().ref(`images/${toBeDeleted.imageName}`).delete()
}

function* getInboxSaga() {
    yield takeEvery('GET_INBOX', getInbox)
    yield takeEvery('DELETE_IMAGE', deleteImage)
}

export default getInboxSaga;