import { combineReducers } from 'redux';

import inboxReducer from './inboxReducer';
import respondingToReducer from './respondingToReducer';
import capturedImageReducer from './capturedImageReducer';
import loginMessageReducer from './loginMessageReducer';
import registrationTokenReducer from './registrationTokenReducer';

const rootReducer = combineReducers({
    inbox: inboxReducer,
    respondingTo: respondingToReducer,
    capturedImage: capturedImageReducer,
    loginMessage: loginMessageReducer,
    registrationToken: registrationTokenReducer
})

export default rootReducer;