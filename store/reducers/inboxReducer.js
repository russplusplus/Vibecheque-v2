const inboxReducer = (state = [], action) => {
    if (action.type === 'SET_INBOX') {
        return action.payload;
    } else if (action.type === 'SET_INBOX_URL') {
        if (!state[0]) {
            return state
        } else {
            let inbox = state
            inbox[0].url = action.payload
            console.log('inbox with url:', inbox)
            return inbox
        }
    } else {
        return state;
    }
}

export default inboxReducer;