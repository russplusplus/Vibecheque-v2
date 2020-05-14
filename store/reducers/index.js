import { combineReducers } from 'redux';

import inboxReducer from './inboxReducer';
import respondingReducer from './respondingReducer';
import capturedImageReducer from './capturedImageReducer';
import loginMessageReducer from './loginMessageReducer';
import registrationTokenReducer from './registrationTokenReducer';
import inboxUrlReducer from './inboxUrlReducer';

const rootReducer = combineReducers({
    inbox: inboxReducer,
    responding: respondingReducer,
    capturedImage: capturedImageReducer,
    loginMessage: loginMessageReducer,
    registrationToken: registrationTokenReducer,
    inboxUrl: inboxUrlReducer
})

export default rootReducer;