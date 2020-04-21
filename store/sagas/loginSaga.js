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
        yield put({
            type: 'SET_LOGIN_MESSAGE',
            payload: ''
        })
    } 
    catch (err) {
        console.log('error code:', err.code, typeof(err.code))
        switch (err.code) {
            case 'auth/invalid-email':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'Please enter a valid email address.'
                })
                break;
            case 'auth/user-not-found':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'User not found.'
                })
                break;
            case 'auth/wrong-password':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'Incorrect password.'
                })
                break;
            case 'auth/email-already-in-use':
                yield put({
                    type: 'SET_LOGIN_MESSAGE',
                    payload: 'Email address already in use.'
                })
                break;
        }
        // if (err.code === 'auth/invalid-email') {
        //     console.log('err match')
        //     yield put({
        //         type: 'SET_LOGIN_MESSAGE',
        //         payload: 'Please enter a valid email address.'
        //     })
        // } else if (err.cody)
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