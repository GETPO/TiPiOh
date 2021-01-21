import React, { useState } from "react";
import { View, StyleSheet } from 'react-native'
import { Button, TextInput, Headline, Subheading } from "react-native-paper";
import firebase from "firebase";
require('firebase/firestore')


export default function setProfile(props) {
     const [ intro, setIntro ] = useState("");

    const user = firebase.auth().currentUser;

    const updateIntro = () => {
        user.updateProfile({
            displayName: intro,
          })
          .then(function() {
            console.log("update success");
          })
          .catch(function(error) {
            console.log(error);
          });
    }

    return (
        <View style={{margin: 20}}>
            <Headline style={{marginBottom: 30}}>프로필 메시지로 감정을 표현해보세요!</Headline>

            <Subheading style={{fontSize: 14}}>Profile Message</Subheading>

            <View style={{flex: 1, justifyContent: 'center', flexDirection: 'row', marginBottom: 15}}>
                <TextInput style={{height: 40, flex: 1}} mode='flat' placeholder={user.displayName} returnKeyType="done" onChangeText={(intro) => setIntro(intro)} clearButtonMode="always"/>
                <Button style={{height: 40}} mode='contained' onPress={() => {updateIntro(); props.navigation.goBack();}}>Update</Button>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        padding: 30,
        alignSelf: "center",
        fontSize: 40,
        margin: 30 
    },
    default: {
        padding: 40
    },
    button: {
        flex: 1,
        margin: 15,
        width: 100,
    }
})
