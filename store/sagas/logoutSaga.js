import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';

function* logout(action) {
    try {
        yield AsyncStorage.removeItem("user");
        console.log('Successfully deleted user object')
    } catch (error) {
        console.log('AsyncStorage remove error:', error.message);
    }
    action.history.push('/')
}

function* logoutSaga() {
    yield takeEvery('LOGOUT', logout)
}

export default logoutSaga;