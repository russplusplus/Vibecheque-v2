import { put, select, takeEvery } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';

function* login(action) {
    console.log('in login saga')
    let response = yield fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD-LWQewi7ZMRBiKQks-7H6t2bZH3rlPIo', {
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

    let resData = yield response.json()

    if (!response.ok) {
        console.log('not okay')
        console.log(resData)
        let message = 'Something went wrong!'
        const errorId = resData.error.message
        if (errorId === 'EMAIL_NOT_FOUND') {
            message = 'This email could not be found.'
        } else if (errorId === 'INVALID_PASSWORD') {
            message = 'Incorrect password.'
        } else if (errorId === 'INVALID_EMAIL') {
            message = 'Please enter a valid email.'
        } else if (errorId === 'TOO_MANY_ATTEMPTS_TRY_LATER : Too many unsuccessful login attempts. Please try again later.') {
            message = 'Too many attempts. Try again later if you wish.'
        }
        console.log('at end of loginSaga error block, message:', message)
        yield put({
            type: 'SET_LOGIN_MESSAGE', 
            payload: message
        })
        return;
    }
    console.log('after loginSaga error return')

    action.history.push('/camera')
    
    // yield put({
    //     type: 'SET_IS_LOGGED_IN',
    //     payload: {
    //         status: true
    //     }
    // })

    try {
        yield AsyncStorage.setItem("token", resData.idToken)
        yield AsyncStorage.setItem("userId", resData.localId)
    } catch (error) {
        console.log('AsyncStorage error:', error.message)
    }

}

function* loginSaga() {
    yield takeEvery('LOGIN', login)
}

export default loginSaga;