const inboxReducer = (state = [], action) => {
    if (action.type === 'SET_INBOX') {
        return action.payload;
    } else if (action.type === 'SET_INBOX_URL') {
        let inbox = state
        inbox[0].url = action.payload
        console.log('inbox with url:', inbox)
        return inbox
    } else if (action.type === 'DELETE_IMAGE') {
        state.shift();
        return state;
    } else {
        return state;
    }
}

export default inboxReducer;