import React, { Component } from 'react'
import { View, StyleSheet } from 'react-native';
import firebase from 'firebase';
import { TextInput, Button, Headline } from 'react-native-paper';

export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        }
        this.onSignUp = this.onSignUp.bind(this);
    }
    onSignUp() {
        const {email, password} = this.state;
        firebase.auth().signInWithEmailAndPassword(email, password)
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
    }
    render() {
        return (
            <View style={styles.default}>
                <Headline
                    style={styles.header}
                >TiPiOh!</Headline>
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
                <View style={{flexDirection:'row'}}>
                  <Button
                    style={styles.button}
                    icon="login"
                    mode="outlined"
                    onPress={() => this.onSignUp()}>
                Login
                </Button>
                <Button
                    style={styles.button}
                    icon="account-check-outline"
                    mode="outlined"
                    // onPress={() => this.onSignUp()}>
                    onPress={() => this.props.navigation.navigate('Register')}>
                Sign Up
                </Button>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        padding: 30,
        alignSelf: "center",
        fontSize: 40,
        margin: 30 
    },
    default: {
        marginTop: 150,
        padding: 40
    },
    button: {
        flex: 1,
        margin: 15,
        width: 100,
    }
})

export default Login