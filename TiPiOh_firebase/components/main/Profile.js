import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import firebase from "firebase";
require('firebase/firestore')

function Profile(props) {
    const [ userPosts, setUserPosts ] = useState([]);
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        const { currentUser, posts } = props;
        console.log({currentUser, posts});

        // Search 컴포넌트에서 props로 전달 받은 uid와 currentUser.uid와 동일하다면 본인의 프로필 보여주기
        if (props.route.params.uid === firebase.auth().currentUser.uid) {
            setUser(currentUser);
            setUserPosts(posts);
        }
        // Search 컴포넌트에서 props로 전달 받은 uid와 currentUser.uid가 다르다면 uid에 해당하는 프로필 보여주기
        else {
            firebase.firestore()                            // firestore에 접근하여
                .collection("users")                        // 'users' 컬렉션에 접근하고
                .doc(props.route.params.uid)                // currentUser의 uid를 기반으로 정보를 확인
                .get()                                      // 확인한 것을 가지고 옴
                .then((snapshot) => {                       // 확인한 정보를 snapshot(통채로 들고옴)
                    if (snapshot.exists) {                  // 가지고 온게 있다면
                        setUser(snapshot.data());           // data를 user로 최신화 
                    }
                    else {
                        console.log('Does Not Exist');
                    }
                })

            firebase.firestore()                            // firestore에 접근하여
                .collection("posts")                        // 'posts' 컬렉션에 접근하고
                .doc(props.route.params.uid)                // currentUser의 uid를 기반의 doc에서
                .collection("userPosts")                    // userPosts 컬렉션에 접근
                .orderBy("creation", "asc")                 // 생성된 날짜를 기반으로 오름차순 정렬 (timestamp는 integer로 구성돼서 정렬이 가능함)
                .get()                                      // 확인한 것을 가지고 옴
                .then((snapshot) => {                       // 확인한 정보를 snapshot(통채로 들고옴)
                    let posts = snapshot.docs.map(doc => {  // map은 docs를 iterate(순차적으로 접근)해서 원하는 정보만 뽑아서 배열로 리턴한다.
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data}
                    })
                    //console.log(posts)
                    setUserPosts(posts);
                })
        }
    }, [props.route.params.uid])                            // 배열 안에 있는 원소가 최신화가 됐을 때만 useEffect를 실행한다.

    if (user === null) {                                    // user가 없는 경우 발생 시 빈 페이지 리턴 
        return <View/>
    }

    return (
        // Profile tab의 View
        <View style={styles.container}>
            {/* 사용자 정보가 나타나는 View */}
            <View style={styles.containerInfo}>
                <Text>{ user.name }</Text>
                <Text>{ user.email }</Text>
            </View>

            {/* 사용자가 업로드한 이미지들이 나타나는 View */}
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={ 3 } 
                    horizontal={false}
                    data={userPosts}                        // mapStateToProps함수 실행 후 갖고오게 된 posts
                    renderItem={({item}) => (               // item => userPosts의 object
                        <View style={styles.containerImage}>
                            <Image 
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                        </View>
                    )}
                />
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerInfo: {
        margin: 20
    },
    containerGallery: {
        flex: 1
    },
    containerImage: {
        flex: 1/3
    },
    image: {
        flex: 1,
        aspectRatio: 1/1
    }
})
const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile);