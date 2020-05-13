import { put, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';

function* getInbox() {
    let uid = JSON.parse(yield AsyncStorage.getItem('user')).uid
    let response = yield functions().httpsCallable('updateInbox')({uid})
    console.log('response.data:', response.data)
    yield put({
        type: 'SET_INBOX',
        payload: response.data
    })   
}

function* getInboxSaga() {
    yield takeEvery('GET_INBOX', getInbox)
}

export default getInboxSaga;