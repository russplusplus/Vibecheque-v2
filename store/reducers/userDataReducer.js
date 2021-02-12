const userDataReducer = (state = {}, action) => {
    if (action.type === 'SET_USER_DATA') {
        return action.payload;
    } else {
        return state;
    }
}

export default userDataReducer;