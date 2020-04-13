import { put, select, takeEvery } from 'redux-saga/effects';
import AsyncStorage from '@react-native-community/async-storage';
import auth from '@react-native-firebase/auth';


function* login(action) {
    console.log('in login saga')
    
    try {
        let user = yield auth().signInWithEmailAndPassword(action.payload.email, action.payload.password)
        console.log('user:', user)
        yield AsyncStorage.setItem("user", JSON.stringify(user))
        action.history.push('/camera');
        console.log('User signed in!');
    } 
    catch (err) {
        console.log(err)
    }

    //  yield put({
    //         type: 'SET_LOGIN_MESSAGE', 
    //         payload: message
    //     })
}

function* loginSaga() {
    yield takeEvery('LOGIN', login)
}

export default loginSaga;