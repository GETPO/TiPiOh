import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import firebase from "firebase";
import { Paragraph, Subheading, Button, Card, Caption, Avatar } from 'react-native-paper'
require('firebase/firestore')

function Profile(props) {
    const [ userPosts, setUserPosts ] = useState([]);
    const [ user, setUser ] = useState(null);
    const [ following, setFollowing ] = useState(false);
    const [ searchUser, setSearchUser ] = useState([]);

    useEffect(() => {
        const { currentUser, posts } = props;
        fetchUsers(props.route.params.uid);
        
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
                // .get()                                      // 확인한 것을 가지고 옴
                .onSnapshot((snapshot) => {                       // 확인한 정보를 snapshot(통채로 들고옴)
                    if (snapshot.exists) {                  // 가지고 온게 있다면
                        setUser(snapshot.data());           // data를 user로 최신화 
                    }
                    else {
                        console.log('Does Not Exist');
                    }
                })                                     // 확인한 것을 가지고 옴

            firebase.firestore()                            // firestore에 접근하여
                .collection("posts")                        // 'posts' 컬렉션에 접근하고
                .doc(props.route.params.uid)                // currentUser의 uid를 기반의 doc에서
                .collection("userPosts")                    // userPosts 컬렉션에 접근
                .orderBy("creation", "desc")                 // 생성된 날짜를 기반으로 오름차순 정렬 (timestamp는 integer로 구성돼서 정렬이 가능함)
                .get()                                      // 확인한 것을 가지고 옴
                .then((snapshot) => {                       // 확인한 정보를 snapshot(통채로 들고옴)
                    let posts = snapshot.docs.map(doc => {  // map은 docs를 iterate(순차적으로 접근)해서 원하는 정보만 뽑아서 배열로 리턴한다.
                        const data = doc.data();
                        const id = doc.id;
                        return {id, ...data}
                    })
                    setUserPosts(posts);
                })
        }
        // 조회한 사용자가 follow 중인 사용자이면 0 이상의 수를 리턴, 아니라면 -1 리턴
        if (props.following.indexOf(props.route.params.uid) > -1) {
            setFollowing(true);
        } 
        else {
            setFollowing(false);
        }

        const newProfileMessage = props.navigation.addListener('focus', () =>{
            fetchUsers(props.route.params.uid);
        })
        return newProfileMessage;
   
    }, [props.route.params.uid, props.following])             // 배열 안에 있는 원소가 최신화가 됐을 때만 useEffect를 실행한다.

    // Follow 버튼을 누르게 되면 아직 팔로우 중이지 않은 사용자를 팔로우 하게 된다.
    // follwoing 컬렉션에 현재 로그인한 사용자가 팔로우 중인 유저들의 uid를 userFollowing 컬렉션에 보관하게 된다.
    const onFollow = () => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .set({})
    }

    // Following 버튼을 누르게 되면 이미 팔로우 중인 유저를 언팔로우 하겠다는 의미이다.
    // userFollowing 컬렉션에서 해당 유저의 uid를 삭제한다.
    const onUnfollow = () => {
        firebase.firestore()
            .collection('following')
            .doc(firebase.auth().currentUser.uid)
            .collection("userFollowing")
            .doc(props.route.params.uid)
            .delete()
    }

    // Logout 기능을 수행하는 함수
    const onLogout = () => {
        firebase.auth().signOut();
    }

    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .doc(search)
            .get()
            .then((snapshot) => {
                if (snapshot.exists) {                        // 가지고 온게 있다면
                    setSearchUser(snapshot.data());           // data를 user로 최신화 
                }
                else {
                    console.log('Does Not Exist');
                }
            })

        firebase.firestore()                            // firestore에 접근하여
            .collection("posts")                        // 'posts' 컬렉션에 접근하고
            .doc(props.route.params.uid)                // currentUser의 uid를 기반의 doc에서
            .collection("userPosts")                    // userPosts 컬렉션에 접근
            .orderBy("creation", "desc")                // 생성된 날짜를 기반으로 오름차순 정렬 (timestamp는 integer로 구성돼서 정렬이 가능함)
            .get()                                      // 확인한 것을 가지고 옴
            .then((snapshot) => {                       // 확인한 정보를 snapshot(통채로 들고옴)
                let posts = snapshot.docs.map(doc => {  // map은 docs를 iterate(순차적으로 접근)해서 원하는 정보만 뽑아서 배열로 리턴한다.
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                })
                setUserPosts(posts);
            })
    }

    if (user === null) {                                    // user가 없는 경우 발생 시 빈 페이지 리턴 
        return <View/>
    }

    return (
        // Profile tab의 View
        <View style={styles.container}>
            {/* 사용자 정보가 나타나는 View */}
            <View style={styles.containerInfo}>
                <Card>
                    <View style={{alignItems: 'center'}}>
                        <Avatar.Icon style={{marginTop: 10}} size={150} icon='alien'/>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Subheading style={{marginTop: 10, fontSize: 20}}>
                            {searchUser.name}
                        </Subheading>
                        <Caption style={{marginBottom: 10}}>
                            {searchUser.email}
                        </Caption>
                    </View>
                    <Card.Content style={{alignItems: 'center'}}>
                        <Paragraph>
                            {searchUser.intro}
                        </Paragraph>
                    </Card.Content>

                    { props.route.params.uid !== firebase.auth().currentUser.uid ? (
                    <View style={{marginTop: 10}}>
                        { following ? (
                            <Button mode='contained' onPress={ () => onUnfollow() }>
                                Following
                            </Button>
                        ) : 
                        (
                            <Button mode='outlined' onPress={ () => onFollow() }>
                                Follow
                            </Button>
                        ) }
                    </View>
                ) : 
                    <View style={{marginTop: 10, marginBottom: 15 ,flexDirection: 'row'}}>
                        <Button icon="logout" style={{flex: 1}}  mode='text' onPress={ () => onLogout() }>
                            Sign Out
                        </Button>
                        <Button icon="account-cog-outline" style={{flex: 1}} mode='text' onPress={() => props.navigation.navigate('Profile Settings', {searchUser, uid: props.route.params.uid} )} >
                            Settings
                        </Button>
                    </View>
                }
                </Card>
            
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
        flex: 0,
        margin: 10,
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
    posts: store.userState.posts,
    following: store.userState.following
})

export default connect(mapStateToProps, null)(Profile);