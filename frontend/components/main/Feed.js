import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList } from 'react-native';
import { Avatar, Button, Card, Title, Paragraph, TextInput, IconButton, Colors } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
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
                return x.creation - y.creation;
            })
            setPosts(props.feed);
        }
    }, [props.usersFollowingLoaded, props.feed])             // 배열 안에 있는 원소가 최신화가 됐을 때만 useEffect를 실행한다.

    const onLikePress = (userId, postId) => {
        console.log("Like Occur");
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

    const LeftContent = props => <Avatar.Icon {...props} icon="folder" />

    return (
        // Profile tab의 View
        <Card style={styles.container}>
            {/* 사용자가 업로드한 이미지들이 나타나는 View */}
            <Card style={styles.containerGallery}>
                <FlatList
                    numColumns={ 1 } 
                    horizontal={false}
                    data={posts}                            // mapStateToProps함수 실행 후 갖고오게 된 posts 배열
                    renderItem={({item}) => (               // item => usersPosts의 object
                        <Card style={styles.containerImage}>
                            <Card.Title title={item.user.name} subtitle="위치 태그가 들어가면 좋을듯? ex) 국립현대미술관" left={LeftContent} />
                                <Image
                                    style={styles.image}
                                    source={{uri: item.downloadURL}}
                                />
                                <Card.Actions>
                                    {item.currentUserLike ? (<IconButton icon="tshirt-crew"
                                                                         color={Colors.red500}
                                                                         size={28}
                                                                         onPress={() => onDislikePress(item.user.uid, item.id)} />
                                                            )
                                                          : (<IconButton icon="tshirt-crew-outline"
                                                                         color={Colors.black}
                                                                         size={28}
                                                                         onPress={() => onLikePress(item.user.uid, item.id)} />
                                                            )
                                    }
                                    <IconButton icon="comment-text-outline"
                                                color={Colors.black}
                                                size={24}
                                                onPress={() => props.navigation.navigate('Comment', {postId: item.id, uid: item.user.uid})} />
                                </Card.Actions>
                        </Card>
                    )}
                />
            </Card>

        </Card>
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