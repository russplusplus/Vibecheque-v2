import { combineReducers } from 'redux';

import inboxReducer from './inboxReducer';
import favoriteUrlReducer from './favoriteUrlReducer';
import respondingToReducer from './respondingToReducer';
import capturedImageReducer from './capturedImageReducer';
import loginMessageReducer from './loginMessageReducer';
import registrationTokenReducer from './registrationTokenReducer';
import userIDReducer from './userIDReducer';
import userDataReducer from './userDataReducer';

const rootReducer = combineReducers({
    inbox: inboxReducer,
    favoriteUrl: favoriteUrlReducer,
    respondingTo: respondingToReducer,
    capturedImage: capturedImageReducer,
    loginMessage: loginMessageReducer,
    registrationToken: registrationTokenReducer,
    userID: userIDReducer,
    userData: userDataReducer
})

export default rootReducer;