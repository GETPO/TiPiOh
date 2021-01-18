import React, { Component } from 'react'
import { View, Button, TextInput } from 'react-native';
import firebase from 'firebase';

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }

    // Register 화면에서 Sign Up 버튼을 누르면 호출되는 함수 
    onSignUp() {
        const {email, password, name} = this.state;

        // firestore의 authentication 메뉴에 새로운 유저들 등록
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {                                 // 유저 생성에 성공했으면
            firebase.firestore().collection("users")        // firestore의 'users' collection에 
            .doc(firebase.auth().currentUser.uid)           // currentUser(현재 로그인 한 사용자(없으면 null))의 uid를 토대로 
            .set({                                          // Register할 때 입력한 email과 name을 저장한다.
                name,
                email
            })
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render() {
        return (
            <View>
                <TextInput 
                    placeholder="name"
                    onChangeText={(inputName) => this.setState({name: inputName})}
                />
                <TextInput 
                    placeholder="email"
                    onChangeText={(inputEmail) => this.setState({email: inputEmail})}
                />
                <TextInput 
                    placeholder="password"
                    secureTextEntry={true}
                    onChangeText={(inputPassword) => this.setState({password: inputPassword})}
                />
                <Button
                    onPress={() => this.onSignUp()}
                    title="Sign Up"
                />
            </View>
        )
    }
}

export default Register
