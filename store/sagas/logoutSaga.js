import { put, select, takeEvery } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';

function* logout(action) {
    try {
        yield AsyncStorage.removeItem("token");
        yield AsyncStorage.removeItem("userId");
        console.log('Successfully deleted token and userId')
    } catch (error) {
        console.log('AsyncStorage remove error:', error.message);
    }

    action.history.push('/')

}

function* logoutSaga() {
    yield takeEvery('LOGOUT', logout)
}

export default logoutSaga;