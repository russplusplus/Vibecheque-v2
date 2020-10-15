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
    //console.log('get Inbox response.data:', response.data)
    yield put({
        type: 'SET_INBOX',
        payload: response.data
    })   
    let url;
    if (response.data[0]) {
        url = yield storage().ref(`images/${response.data[0].imageName}`).getDownloadURL()
        //console.log('in getInboxUrl. url:', url)
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
            
    if (snapshot._snapshot.value) {
        //console.log('snapshot is truthy')
    } else {
        //console.log('snapshot is falsey')
    }
    // console.log('type of null:', typeof(snapshot))
    // for (key in snapshot) {
    //     console.log('key:', key)
    //     console.log('value:', snapshot[key])
    // }


    // console.log('in getFavoriteURL. snapshot:', snapshot)
    // console.log('._snapshot.value:', snapshot._snapshot.value)
    // console.log('url:', snapshot.url)
    if (snapshot._snapshot.value) {
        yield put({
            type: 'SET_FAVORITE_URL',
            payload: snapshot._snapshot.value   // snapshot object has a bunch of hidden metadata that messes up retrieval on the ViewFavorite page. This is the true data.
        })
    }
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
    let reduxState = yield select()
    console.log('in deleteFavorite. userID:', reduxState.userID)

    // delete from database
    yield database().ref(`users/${reduxState.userID}/favorite`).remove();
    // delete from storage
    yield storage().ref(`images/${reduxState.favoriteUrl.name}`).delete();
    // reset redux favorite
    const initFav = {
        name: 'none',
        url: 'none'
    }
    yield put({
        type: 'SET_FAVORITE_URL',
        payload: initFav   // snapshot object has a bunch of hidden metadata that messes up retrieval on the ViewFavorite page. This is the true data.
    })
}

function* getInboxSaga() {
    yield takeEvery('GET_INBOX', getInbox)
    yield takeEvery('DELETE_IMAGE', deleteImage)
    yield takeEvery('GET_FAVORITE_URL', getFavoriteURL)
    yield takeEvery('DELETE_FAVORITE', deleteFavorite)
}

export default getInboxSaga;