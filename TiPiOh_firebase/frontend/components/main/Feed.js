import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from "firebase";
require('firebase/firestore')

function Feed(props) {
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        /*
         * usersLoaded 수랑 팔로우 수가 같으면 팔로우 중인 유저들의 post들을
         * 최신 포스팅 순서대로 정렬하고 usersState의 feed 배열에 싹 넣는다.
         */
        if (props.usersFollowingLoaded == props.following.length && props.following.length !== 0) {
            props.feed.sort(function(x, y) {
                return x.creation - y.creation
            })
            setPosts(props.feed);
        }
        console.log(posts);

    }, [props.usersFollowingLoaded, props.feed])             // 배열 안에 있는 원소가 최신화가 됐을 때만 useEffect를 실행한다.

    const onLikePress = (userId, postId) => {
        firebase.firestore()                            // firestore에 접근하여
            .collection("posts")                        // 'posts' 컬렉션에 접근하고
            .doc(userId)                                   // currentUser의 uid를 기반의 doc에서
            .collection("userPosts")                    // userPosts 컬렉션에 접근
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .set({})
    }
    const onDislikePress = (userId, postId) => {
        firebase.firestore()                            // firestore에 접근하여
            .collection("posts")                        // 'posts' 컬렉션에 접근하고
            .doc(userId)                                   // currentUser의 uid를 기반의 doc에서
            .collection("userPosts")                    // userPosts 컬렉션에 접근
            .doc(postId)
            .collection("likes")
            .doc(firebase.auth().currentUser.uid)
            .delete()
    }

    return (
        // Profile tab의 View
        <View style={styles.container}>
            {/* 사용자가 업로드한 이미지들이 나타나는 View */}
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={ 1 } 
                    horizontal={false}
                    data={posts}                            // mapStateToProps함수 실행 후 갖고오게 된 posts 배열
                    renderItem={({item}) => (               // item => usersPosts의 object
                        <View style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
                            <Image 
                                style={styles.image}
                                source={{uri: item.downloadURL}}
                            />
                            {item.currentUserLike ? (<Button title="Dislike" onPress={() => onDislikePress(item.user.uid, item.id)}/>)
                                                  : (<Button title="Like" onPress={() => onLikePress(item.user.uid, item.id)}/>)}
                            <Text onPress={() => props.navigation.navigate('Comment', {postId: item.id, uid: item.user.uid})}>
                                View Comment...
                            </Text>
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
    following: store.userState.following,
    feed: store.usersState.feed,
    usersFollowingLoaded: store.usersState.usersFollowingLoaded,
})

export default connect(mapStateToProps, null)(Feed);