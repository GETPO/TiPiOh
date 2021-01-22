import React, { Component } from 'react'
import ReactNative, { View, SafeAreaView, StyleSheet } from 'react-native';
import { TextInput, Button, Headline } from 'react-native-paper'
import firebase from 'firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

export class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            name: '',
            confirmPassword: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }

    // Register 화면에서 Sign Up 버튼을 누르면 호출되는 함수 
    onSignUp() {
        const {email, password, name, confirmPassword} = this.state;
        if (password !== confirmPassword) {
            alert("Password Does Not Match!")
            return;
        }
        // firestore의 authentication 메뉴에 새로운 유저들 등록
        firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((result) => {                                 // 유저 생성에 성공했으면
            firebase.firestore().collection("users")        // firestore의 'users' collection에 
            .doc(firebase.auth().currentUser.uid)           // currentUser(현재 로그인 한 사용자(없으면 null))의 uid를 토대로 
            .set({                                          // Register할 때 입력한 email과 name을 저장한다.
                name,
                email
            })
        })
        .catch((error) => {
            console.log(error);
        })
    }

    _scrollToInput = (reactNode) => {
        if(this.scroll.props){
            this.scroll.props.scrollToFocusedInput(reactNode)
        }
    }

    render() {
        return (
            <KeyboardAwareScrollView style={styles.default} innerRef={ref => {
                this.scroll = ref
              }}>
                <Headline
                    style={styles.header}
                >Register</Headline>
                <View style={{margin: 20}}>
                    <TextInput 
                        style={{marginBottom: 10}}
                        label="Name"
                        placeholder="Name"
                        left={<TextInput.Icon name= "account-circle-outline"/>}
                        onChangeText={(inputName) => this.setState({name: inputName})}
                    />
                    <TextInput 
                        style={{marginBottom: 10}}
                        label="Email"
                        placeholder="email"
                        left={<TextInput.Icon name= "email-outline"/>}
                        onChangeText={(inputEmail) => this.setState({email: inputEmail})}
                    />
                    <TextInput 
                        style={{marginBottom: 10}}
                        label="Password"
                        placeholder="password"
                        left={<TextInput.Icon name= "lock-outline"/>}
                        secureTextEntry={true}
                        onChangeText={(inputPassword) => this.setState({password: inputPassword})}
                    />
                    <TextInput 
                        label="Confirm Password"
                        placeholder="Confirm password"
                        left={<TextInput.Icon name= "lock-outline"/>}
                        secureTextEntry={true}
                        onChangeText={(inputPassword) => this.setState({confirmPassword: inputPassword})}
                    />
                </View>
                <View style={{flexDirection:'row'}}>
                    <Button
                        style={styles.button}
                        icon="login"
                        mode="outlined"
                        onPress={() => this.onSignUp()}>
                    Register
                    </Button>
                </View>
            </KeyboardAwareScrollView>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        padding: 30,
        alignSelf: "center",
        fontSize: 30,
        marginBottom: 1,
    },
    default: {
        marginTop: 50,
        padding: 10
    },
    button: {
        flex: 1,
        margin: 15,
        width: 100,
    }
})

export default Register