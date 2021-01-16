import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE } from "../constants/index";

const initialState = {
    currentUser: null,
    posts: [],
    following: []
}

// action으로 DB에서 데이터를 불러와서 fetching 하고, 데이터를 reducer로 전달하여 state를 업데이트 한다.
export const user = (state = initialState, action) => {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state, 
                currentUser: action.currentUser
            }
        
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state, 
                posts: action.posts
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state, 
                following: action.following
            }
        default:
            return state;
    }
    
}