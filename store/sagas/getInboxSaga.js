import { put, takeEvery } from 'redux-saga/effects';
import messaging from '@react-native-firebase/messaging';
import functions from '@react-native-firebase/functions';

function* getInbox() {
    let registrationToken = yield messaging().getToken()
    let response = yield functions().httpsCallable('updateInbox')({registrationToken})
    console.log('response:', response)
    yield put({
        type: 'SET_INBOX',
        payload: response.data
    })   
}

function* getInboxSaga() {
    yield takeEvery('GET_INBOX', getInbox)
}

export default getInboxSaga;