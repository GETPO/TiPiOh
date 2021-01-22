import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { TextInput, Card, Avatar } from 'react-native-paper';
import firebase from 'firebase';
require('firebase/firestore')

export default function Search(props) {
    const [users, setUsers] = useState([])

    // 입력 받은 string과 일치하거나, 입력한 부분까지 일치하는 data를 가져옴 
    const fetchUsers = (search) => {
        firebase.firestore()
            .collection('users')
            .where('name', '>=', search)
            .get()
            .then((snapshot) => {
                let users = snapshot.docs.map(doc => {
                    const data = doc.data();
                    const id = doc.id;
                    return {id, ...data}
                });
                setUsers(users);
            })
    }
    const LeftContent = props => <Avatar.Icon {...props} icon="alien" />

    return ( 
        <View>
            <TextInput 
                style={{marginBottom: 10}}
                placeholder="Search User..." 
                onChangeText={(search) => fetchUsers(search)}/>
            <FlatList
                numColumns={1}
                horizontal={false}
                data={users}
                renderItem={({item}) => (
                    <TouchableOpacity 
                        // Search해서 나온 사용자 목록 중 하나를 선택하면 해당 사용자의 uid를 Profile 컴포넌트에게 props로 전달 함
                        onPress={() => props.navigation.navigate("Profile", {uid: item.id})}>
                        <Card.Title title={item.name} subtitle={item.intro} left={LeftContent} />
                    </TouchableOpacity>
                )}
            />
        </View>
    )
}
