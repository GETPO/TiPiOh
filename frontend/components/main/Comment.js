import React, { useState, useEffect } from 'react'
import { View, FlatList, Text } from 'react-native'
import firebase from 'firebase'
require('firebase/firestore')
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUsersData, fetchUsersFollowingComments } from '../../redux/actions/index'
import { Paragraph, Subheading, TextInput, Button } from 'react-native-paper'

function Comment(props) {
    const [comments, setComments] = useState([]);
    const [postId, setPostId] = useState("");
    const [text, setText] = useState("");

    useEffect( () => {
        // 어떤 comment가 누가 쓴 것인지 매칭 시키는 함수
        function matchUserToComment(comments) {
            for (let i = 0; i < comments.length; i++) {                                 // comments 배열에 post에 달린 댓글이 있을건데 
                if (comments[i].hasOwnProperty('user')) {                               // 만약 특정 comment가 이미 어떤 user와 연결 돼있으면 그건 스킵
                    continue;
                }
                const user = props.users.find(x => x.uid === comments[i].creator);      // comment creator uid와 어떤 유저의 uid가 일치하는지 찾음
                if (user == undefined) {                                                // user가 없으면 문제가 있는것이니
                    props.fetchUsersData(comments[i].creator, false);                   // fetch 돌림
                }
                else {
                    comments[i].user = user;                                            // 아니면 찾은 유저와 comment를 매칭
                }
            }
            setComments(comments);
        }

        if (props.route.params.postId !== postId) {
            firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .onSnapshot((snapshot) => {                         // data에 변화가 있을 때 마다 새로 가져오는거
                    let comments = snapshot.docs.map(doc => {
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data}
                    })
                    matchUserToComment(comments);
                })
            setPostId(props.route.params.postId);
        }
        else {
            matchUserToComment(comments);
        }
    }, [props.route.params.postId, props.users])

    const onCommentSend = () => {
        firebase.firestore()
                .collection('posts')
                .doc(props.route.params.uid)
                .collection('userPosts')
                .doc(props.route.params.postId)
                .collection('comments')
                .add({                                              // add메소드는 id를 자동으로 생성하고 사용자가 원하는 값들을 넣을 수 있게한다.                          
                    creator: firebase.auth().currentUser.uid,       // 해당 comment를 작성한게 누구인지 creator로 등록하고
                    text                                            // setText메소드로 입력한 text를 객체로 전달한다.
                })
    }
    return (
        <View style={{margin: 10}}>
                <View>
                    <TextInput style={{height: 40}} mode='outlined' placeholder="Comment..." onChangeText={(text) => setText(text)} />
                    <Button style={{marginTop: 3, marginBottom: 10}} mode='contained' onPress={() => onCommentSend()}>Send</Button>
                </View>
                <FlatList
                    style={{margin: 5}}
                    numColumns={ 1 }
                    horizontal={false}
                    data={comments}
                    renderItem={({item}) => (           // View Comment 버튼을 누른 해당 Post의 posts->userPost->comment 컬렉션에 접근한다.
                        <View>
                                {item.user !== undefined ? <Subheading style={{fontWeight:"500"}}>{item.user.name}
                                                                <Paragraph>   {item.text}</Paragraph>
                                                            </Subheading> 
                                                            : null
                                }
                        </View>
                    )}
                />
        </View>
    )
}

const mapStateToProps = (store) => ({
    users: store.usersState.users,
})
// fetchUser함수와 dispatch를 쉽게 연동할 수 있는 redux 기능
const mapDispatchToProps = (dispatch) => bindActionCreators({ fetchUsersData }, dispatch);

/*
 * connect는 Provider 컴포넌트 하위의 컴포넌트들이 쉽게 store에 접근할 수 있게 만든다.
 * 여기서는 (Comment) 컴포넌트가 store에 접근할 수 있게 만들어진다.
 * 
 * mapStateToProps는 connect함수에 첫번째 인수로 들어가는 함수 혹은 객체다.
 * mapStateToProps는 기본적으로 store가 업데이트가 될때 마다 자동적으로 호출이 된다.이를 원하지 않는다면 null 혹은 undefined값을 제공해야한다.
 * 
 * mapDispatchToProps는 connect함수의 두번째 인자로 사용된다.
 * 이것은 기본적으로 store에 접근한 컴포넌트가 store의 상태를 바꾸기 위해
 * dispatch를 사용할수 있게 만들어준다.
 */
export default connect(mapStateToProps, mapDispatchToProps)(Comment);
