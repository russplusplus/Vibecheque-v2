import { put, select, takeEvery } from 'redux-saga/effects';
import storage from '@react-native-firebase/storage';
import database from '@react-native-firebase/database';

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

function* deleteFavoriteSaga() {
    yield takeEvery('DELETE_FAVORITE', deleteFavorite)
}

export default deleteFavoriteSaga;