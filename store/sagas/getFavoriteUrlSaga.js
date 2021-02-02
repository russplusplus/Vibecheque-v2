import { put, select, takeEvery } from 'redux-saga/effects';
import database from '@react-native-firebase/database';

function* getFavoriteURL() {
    let reduxState = yield select()
    const ref = `users/${reduxState.userID}/favorite`
    const snapshot = yield database()
        .ref(ref)
        .once('value')
            
    console.log('snapshot.val():', snapshot.val())
    console.log('snapshot._snapshot.value:', snapshot._snapshot.value)

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

function* getFavoriteUrlSaga() {
    yield takeEvery('GET_FAVORITE_URL', getFavoriteURL)
}

export default getFavoriteUrlSaga;