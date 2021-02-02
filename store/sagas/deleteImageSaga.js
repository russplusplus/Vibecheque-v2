import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

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

function* deleteImageSaga() {
    yield takeEvery('DELETE_IMAGE', deleteImage)
}

export default deleteImageSaga;