const initFav = {
    name: 'none',
    url: 'none'
}

const favoriteUrlReducer = (state = initFav, action) => {
    if (action.type === 'SET_FAVORITE_URL') {
        console.log('in SET_FAVORITE_URL. url:', action.payload)
        return action.payload
    } else {
        return state;
    }
}

export default favoriteUrlReducer;