import React, { useState } from "react";
import { View } from 'react-native'
import { Button, TextInput, Headline, Subheading } from "react-native-paper";
import firebase from "firebase";
require('firebase/firestore')

export default function setProfile(props) {
    const [ intro, setIntro ] = useState("");
    const currentUser = props.route.params.searchUser;

    const updateIntro = () => {
        firebase.firestore()
            .collection('users')
            .doc(props.route.params.uid)
            .update({intro: intro});
    }

    return (
        <View style={{margin: 20}}>
            <Headline style={{marginBottom: 30}}>Edit Profile</Headline>

            <Subheading style={{fontSize: 14, marginLeft: 3}}>Profile Message</Subheading>

            <View style={{justifyContent: 'center', flexDirection: 'row', marginBottom: 15}}>
                <TextInput style={{height: 40, flex: 1}} mode='flat' placeholder={currentUser.intro} returnKeyType="done" onChangeText={(intro) => setIntro(intro)} clearButtonMode="always"/>
                <Button style={{height: 40}} mode='contained' onPress={() => {updateIntro(); props.navigation.goBack();}}>Update</Button>
            </View>

        </View>
    )
}

