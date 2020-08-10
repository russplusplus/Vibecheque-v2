import { all } from 'redux-saga/effects';

import loginSaga from './loginSaga';
import signUpSaga from './signUpSaga';
import logoutSaga from './logoutSaga';
import getInboxSaga from './getInboxSaga';
import getRegistrationTokenSaga from './getRegistrationTokenSaga';

function* rootSaga() {
    yield all([
        loginSaga(),
        signUpSaga(),
        logoutSaga(),
        getInboxSaga(),
        getRegistrationTokenSaga(),
    ]);
  }

export default rootSaga