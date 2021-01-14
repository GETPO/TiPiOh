import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import * as firebase from 'firebase';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import rootReducer from './redux/reducers';
import thunk from 'redux-thunk';
import MainScreen from './components/Main';

const store = createStore(rootReducer, applyMiddleware(thunk));

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC6KJkB9SJqvYj2eX1__5S16pHDPPdkECQ",
  authDomain: "tipioh-dev.firebaseapp.com",
  projectId: "tipioh-dev",
  storageBucket: "tipioh-dev.appspot.com",
  messagingSenderId: "325988342839",
  appId: "1:325988342839:web:5ffa46171460a714e1f3b2",
  measurementId: "G-K8Q0F9863X"
};

if (firebase.apps.length === 0) { // No Firebase Instance
  firebase.initializeApp(firebaseConfig);
}

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false
    }
  }
  // 첫 렌더링이 진행되고 첫 번째로 실행되는 함수
  componentDidMount() {
    // 현재 로그인한 사용자 가져오기, onAuthStateChanged -> 관찰자 
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) { // 로그인 한 상태가 아니라면
        this.setState({
          loggedIn: false,
          loaded: true
        })
      }
      else { // 로그인 한 상태라면 
        this.setState({
          loggedIn: true,
          loaded: true
        })
      }
    })
  }
  render() {
    const {loggedIn, loaded} = this.state;
    // loaded 상태가 false이면 user 정보를 가져오는 중이라는 Loading 메시지를 띄워준다.
    if (!loaded) {
      return (
        <View style={{flex:1, justifyContent: 'center'}}>
          <Text>Loading</Text>
        </View>
      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
        {/* 앱을 실행시키면 무조건 Landing Page로 간다. */}
        <Stack.Navigator initialRouteName="Landing"> 
          <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      )
    }

    return (
      <Provider store={store}>
        <MainScreen/>
      </Provider>
    )
  }
}

export default App
