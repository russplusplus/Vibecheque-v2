const favoriteUrlReducer = (state = '', action) => {
    if (action.type === 'SET_FAVORITE_URL') {
        console.log('in SET_FAVORITE_URL. url:', action.payload)
        return action.payload
    } else {
        return state;
    }
}

export default favoriteUrlReducer;