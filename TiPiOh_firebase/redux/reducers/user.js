const initialState = {
    currentUser: null
}

// action으로 DB에서 데이터를 불러와서 fetching 하고, 데이터를 reducer로 전달하여 state를 업데이트 한다.
export const user = (state = initialState, action) => {
    return {
        ...state, 
        currentUser: action.currentUser
    }
}