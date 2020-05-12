import { combineReducers } from 'redux';

import inboxReducer from './inboxReducer';
import respondingReducer from './respondingReducer';
import capturedImageReducer from './capturedImageReducer';
import loginMessageReducer from './loginMessageReducer';
import registrationTokenReducer from './registrationTokenReducer';

const rootReducer = combineReducers({
    inbox: inboxReducer,
    responding: respondingReducer,
    capturedImage: capturedImageReducer,
    loginMessage: loginMessageReducer,
    registrationToken: registrationTokenReducer
})

export default rootReducer;