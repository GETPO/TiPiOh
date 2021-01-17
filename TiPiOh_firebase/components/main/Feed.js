import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, Image, FlatList, Button } from 'react-native';
import { connect } from 'react-redux';
import firebase from "firebase";
require('firebase/firestore')

function Feed(props) {
    const [ posts, setPosts ] = useState([]);

    useEffect(() => {
        let posts = [];

        /*
         * usersLoaded 수랑 팔로우 수가 같으면 팔로우 중인 유저들의 데이터들 배열에 싹 모은다.
         * 최신 포스팅 순서대로 정렬하고 posts 배열에 싹 넣는다.
         */
        if (props.usersLoaded == props.following.length) {
            for (let i = 0; i < props.following.length; i++) {
                const user = props.users.find(el => el.uid === props.following[i]);

                if (user != undefined) {
                    posts = [...posts, ...user.posts]
                }
            }
            posts.sort(function(x, y) {
                return x.creation - y.creation
            })
            setPosts(posts);
        }

    }, [props.usersLoaded])             // 배열 안에 있는 원소가 최신화가 됐을 때만 useEffect를 실행한다.

    return (
        // Profile tab의 View
        <View style={styles.container}>
            {/* 사용자가 업로드한 이미지들이 나타나는 View */}
            <View style={styles.containerGallery}>
                <FlatList
                    numColumns={ 1 } 
                    horizontal={false}
                    data={posts}                        // mapStateToProps함수 실행 후 갖고오게 된 posts 배열
                    renderItem={({item}) => (               // item => usersPosts의 object
                        <View style={styles.containerImage}>
                            <Text style={styles.container}>{item.user.name}</Text>
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
    following: store.userState.following,
    users: store.usersState.users,
    usersLoaded: store.usersState.usersLoaded,
})

export default connect(mapStateToProps, null)(Feed);