const respondingReducer = (state = null, action) => {
    if (action.type === 'SET_RESPONDING') {
        return action.payload.senderId;
    } else if (action.type === 'SET_NOT_RESPONDING') {
        return null;
    } else {
        return state;
    }
}

export default respondingReducer;