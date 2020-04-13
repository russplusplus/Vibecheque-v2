import { put, select, takeEvery } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';

function* signUp(action) {
    console.log('in signUp saga')
    console.log('email:', action.payload.email)
    console.log('password:', action.payload.password)
    let response = yield fetch('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD-LWQewi7ZMRBiKQks-7H6t2bZH3rlPIo', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: action.payload.email,
            password: action.payload.password,
            returnSecureToken: true
        })
    })
    
    if (!response.ok) {
        console.log('not okay')
    }
    
    
    let myJSON = yield response.json()
    console.log('myJSON:', myJSON)

    try {
        console.log('before both Async yields')
        yield AsyncStorage.setItem("token", myJSON.idToken)
        console.log('between the two Async yields')
        yield AsyncStorage.setItem("userId", myJSON.localId)
        console.log('after both Async yields')
    } catch (error) {
        console.log('AsyncStorage error:', error.message)
    }
    
}

function* signUpSaga() {
    yield takeEvery('SIGN_UP', signUp)
}

export default signUpSaga;