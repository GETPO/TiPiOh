import firebase from 'firebase';
import { USER_STATE_CHANGE, USER_POSTS_STATE_CHANGE, USER_FOLLOWING_STATE_CHANGE } from '../constants/index';

export function fetchUser() {
    return((dispatch) => {
        firebase.firestore()                        // firestore에 접근하여
        .collection("users")                        // 'users' 컬렉션에 접근하고
        .doc(firebase.auth().currentUser.uid)       // currentUser의 uid를 기반으로 정보를 확인
        .get()                                      // 확인한 것을 가지고 옴
        .then((snapshot) => {                       // 확인한 정보를 snapshot(통채로 들고옴)
            if (snapshot.exists) {                  // 가지고 온게 있다면, dispatch 실행(reducer 자동 호출, state 최신화)
                dispatch({type: USER_STATE_CHANGE, currentUser: snapshot.data()})
            }
            else {
                console.log('Does Not Exist');
            }
        })
    })
}

// 사용자가 새로 post한게 생기면 trigger되는 함수 
export function fetchUserPosts() {
    return((dispatch) => {
        firebase.firestore()                        // firestore에 접근하여
        .collection("posts")                        // 'posts' 컬렉션에 접근하고
        .doc(firebase.auth().currentUser.uid)       // currentUser의 uid를 기반의 doc에서
        .collection("userPosts")                    // userPosts 컬렉션에 접근
        .orderBy("creation", "asc")                 // 생성된 날짜를 기반으로 오름차순 정렬 (timestamp는 integer로 구성돼서 정렬이 가능함)
        .get()                                      // 확인한 것을 가지고 옴
        .then((snapshot) => {                       // 확인한 정보를 snapshot(통채로 들고옴)
            let posts = snapshot.docs.map(doc => {  // map은 docs를 iterate(순차적으로 접근)해서 원하는 정보만 뽑아서 배열로 리턴한다.
                const data = doc.data();
                const id = doc.id;
                return {id, ...data}
            })
            dispatch({type: USER_POSTS_STATE_CHANGE, posts})
        })
    })
}

// userFollow 컬렉션에 변화가 생기면 trigger 되는 함수
export function fetchUserFollowing() {
    return((dispatch) => {
        firebase.firestore()                        
        .collection("following")                        
        .doc(firebase.auth().currentUser.uid)       
        .collection("userFollowing")                   
        .onSnapshot((snapshot) => {                       
            let following = snapshot.docs.map(doc => { 
                const id = doc.id;
                return id
            })
            dispatch({type: USER_FOLLOWING_STATE_CHANGE, following})
        })
    })
}