import { combineReducers } from 'redux';

import inboxReducer from './inboxReducer';
import respondingReducer from './respondingReducer';
import capturedImageReducer from './capturedImageReducer';
import loginMessageReducer from './loginMessageReducer';

const rootReducer = combineReducers({
    inbox: inboxReducer,
    responding: respondingReducer,
    capturedImage: capturedImageReducer,
    loginMessage: loginMessageReducer
})

export default rootReducer;