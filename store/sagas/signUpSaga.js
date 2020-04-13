import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';

function* signUp(action) {
    console.log('in signUp saga')
    try {
        let user = yield auth().createUserWithEmailAndPassword(action.payload.email, action.payload.password)
        console.log('user:', user)
        yield AsyncStorage.setItem("user", JSON.stringify(user))
        action.history.push('/cameraPage');
        console.log('User signed up and in!');
    } 
    catch (err) {
        console.log(err)
    }
    
}

function* signUpSaga() {
    yield takeEvery('SIGN_UP', signUp)
}

export default signUpSaga;