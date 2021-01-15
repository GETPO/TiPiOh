import React from 'react'
import { View, Text, Image, FlatList, StyleSheet } from 'react-native'

import {connect} from 'react-redux'
function Profile(props) {
    const { currentUser, posts } = props;
    console.log({currentUser, posts})
    return (
        <View style={style.container}>
            <View style={style.containerInfo}>
                <Text>{currentUser.name}</Text>
                <Text>{currentUser.email}</Text>
            </View>
            <View style={style.containerGallery}>
                <FlatList 
                    numColumns={3}
                    horizontal={false}
                    data={posts}
                    renderItem={({item}) => (
                        <View style = {style.containerImage}>
                            <Image 
                                style={style.image}
                                source={{uri: item.downloadURL}}
                            />
                        </View> 
                    )}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 40
    },
    containerInfo:{
        margin: 30
    },
    containerGallery:{
        flex: 1
    },
    containerImage:{
        flex: 1/3
    },
    image:{
        flex: 1,
        aspectRatio: 1/1
    }
})

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser,
    posts: store.userState.posts
})

export default connect(mapStateToProps, null)(Profile)