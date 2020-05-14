import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';

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
        url = yield storage().ref(`images/${response.data[0]}`).getDownloadURL()
        console.log('in getInboxUrl. url:', url)
    } else {
        url = null
    }
    
    yield put({
        type: 'SET_INBOX_URL',
        payload: url
    })  
}

function* getInboxSaga() {
    yield takeEvery('GET_INBOX', getInbox)
}

export default getInboxSaga;