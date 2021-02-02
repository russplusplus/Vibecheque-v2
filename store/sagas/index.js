import { all } from 'redux-saga/effects';

import loginSaga from './loginSaga';
import signUpSaga from './signUpSaga';
import logoutSaga from './logoutSaga';
import getInboxSaga from './getInboxSaga';
import getRegistrationTokenSaga from './getRegistrationTokenSaga';
import deleteImageSaga from './deleteImageSaga';
import deleteFavoriteSaga from './deleteFavoriteSaga';
import getUserData from './getUserDataSaga';

function* rootSaga() {
    yield all([
        loginSaga(),
        signUpSaga(),
        logoutSaga(),
        getInboxSaga(),
        getRegistrationTokenSaga(),
        deleteImageSaga(),
        deleteFavoriteSaga(),
        getUserData()
    ]);
  }

export default rootSaga