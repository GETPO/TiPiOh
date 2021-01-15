import React, { useState } from 'react'
import { View, TextInput, Image, Button } from "react-native";
import firebase from 'firebase';
require("firebase/firestore")
require("firebase/firebase-storage")

// Add.js에서 navigate메소드의 인자로 image를 props로 전달해줬기 때문에 
// props = image 로 사용 가능하다.
export default function Save(props) {
    const [caption, setCaption] = useState("")
    const uploadImage = async() => {
        const uri = props.route.params.image;
        // 이미지가 저장될 Firebase의 Storage 경로
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
        console.log(childPath);
        const response = await fetch(uri);
        const blob = await response.blob();
        const task = firebase.storage().ref().child(childPath).put(blob);
        // 업로드 한 이미지 크기가 어느 정도인지 확인하는 기능
        const taskProgress = snapshot => {
            console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        // 업로드 한 이미지를 public하게 볼 수 있게 하는 기능
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                console.log(snapshot)
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }
        // task에 변화가 있을 때 마다 상위 3개 기능이 수행되도록 만든다. (인자 순서 중요)
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }
    return (
        <View style={{flex:1}}>
            <Image source={{uri: props.route.params.image}}/>
            <TextInput
                placeholder="Write a Caption ..."
                onChangeText={(caption) => setCaption(caption)}
            />

            <Button title="Save" onPress={() => uploadImage()}/>
        </View>
    )
}
