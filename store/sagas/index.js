import { all } from 'redux-saga/effects';

import sendImageSaga from './sendImageSaga';
import loginSaga from './loginSaga';
import signUpSaga from './signUpSaga';
import logoutSaga from './logoutSaga';
import getInboxSaga from './getInboxSaga';
import getRegistrationTokenSaga from './getRegistrationTokenSaga';
import getInboxUrlSaga from './getInboxUrlSaga';

function* rootSaga() {
    yield all([
        loginSaga(),
        signUpSaga(),
        logoutSaga(),
        sendImageSaga(),
        getInboxSaga(),
        getRegistrationTokenSaga(),
        getInboxUrlSaga()
    ]);
  }

export default rootSaga