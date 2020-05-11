const inboxReducer = (state = [], action) => {
    if (action.type === 'SET_INBOX') {
        return action.payload;
    } else if (action.type === 'DELETE_IMAGE') {
        state.shift();
        return state;
    } else {
        return state;
    }
}

export default inboxReducer;