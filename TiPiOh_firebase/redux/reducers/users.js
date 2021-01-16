import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE } from "../constants/index";

const initialState = {
    users: [],
    userLoaded: 0
}

// action으로 DB에서 데이터를 불러와서 fetching 하고, 데이터를 reducer로 전달하여 state를 업데이트 한다.
export const users = (state = initialState, action) => {
    switch (action.type) {
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state, 
                users: [...state.users, action.user]
            }
        
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state, 
                userLoaded: state.userLoaded + 1,
                users: state.users.map(user => user.uid === action.uid ? {...user, posts: action.posts} : user)
            }

        default:
            return state;
    }
    
}