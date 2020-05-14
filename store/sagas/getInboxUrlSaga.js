import { put, select, takeEvery } from 'redux-saga/effects';
import storage from '@react-native-firebase/storage';

function* getInboxUrl() {
    const reduxState = yield select();
    const inbox = reduxState.inbox
    console.log('in getInboxUrl. inbox:', inbox)
    let url = yield storage().ref(`images/${inbox[0]}`).getDownloadURL()
    console.log('in getInboxUrl. url:', url)
    yield put({
        type: 'SET_INBOX_URL',
        payload: url
    })  
}

function* getRegistrationTokenSaga() {
    yield takeEvery('GET_INBOX_URL', getInboxUrl)
}

export default getRegistrationTokenSaga;