const inboxUrlReducer = (state = '', action) => {
    if (action.type === 'SET_INBOX_URL') {
        console.log('in SET_INBOX_URL')
        return action.payload;
    } else {
        return state;
    }
}

export default inboxUrlReducer;