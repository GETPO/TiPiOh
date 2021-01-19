import { USERS_DATA_STATE_CHANGE, USERS_POSTS_STATE_CHANGE, CLEAR_DATA, USERS_LIKES_STATE_CHANGE, USERS_COMMENTS_STATE_CHANGE } from "../constants/index";

const initialState = {
    users: [],
    feed: [],
    usersFollowingLoaded: 0
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
                usersFollowingLoaded: state.usersFollowingLoaded + 1,
                feed: [...state.feed, ...action.posts]     // feed에 있는 모든 post들을 feed 배열에 담아서 관리
            }
        case USERS_LIKES_STATE_CHANGE:
            return {
                ...state, 
                feed: state.feed.map(post => post.id == action.postId ? {...post, currentUserLike: action.currentUserLike} : post)
            }
        case CLEAR_DATA:
            return initialState;
        default:
            return state;
    }
    
}