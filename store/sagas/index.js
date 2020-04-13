import { all } from 'redux-saga/effects';

import sendImageSaga from './sendImageSaga';
import loginSaga from './loginSaga';
import signUpSaga from './signUpSaga';
import logoutSaga from './logoutSaga';

function* rootSaga() {
    yield all([
        loginSaga(),
        signUpSaga(),
        logoutSaga(),
        sendImageSaga()
    ]);
  }

export default rootSaga