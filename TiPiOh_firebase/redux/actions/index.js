import firebase from 'firebase';
import { USER_STATE_CHANGE } from '../constants/index';

export function fetchUser() {
    return((dispatch) => {
        firebase.firestore()                        // firestore에 접근하여
        .collection("users")                         // 'users' 컬렉션에 접근하고
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