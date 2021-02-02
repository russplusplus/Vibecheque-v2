import { put, select, takeEvery } from 'redux-saga/effects';
import functions from '@react-native-firebase/functions';
import storage from '@react-native-firebase/storage';

function* getInbox() {
    //user ID should be retrieved once and stored in redux
    //let uid = JSON.parse(yield AsyncStorage.getItem('user')).uid
    let reduxState = yield select()
    let uid = reduxState.userID
    let response = yield functions().httpsCallable('updateInbox')({uid})
    console.log('get Inbox response.data:', response.data)
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

function* getInboxSaga() {
    yield takeEvery('GET_INBOX', getInbox)
}

export default getInboxSaga;