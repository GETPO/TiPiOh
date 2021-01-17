import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';

import firebase from 'firebase'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'
import LoginScreen from './components/auth/Login'
import MainScreen from './components/Main'
import WriteScreen from './components/main/Write'
import SaveScreen from './components/main/Save'
import CommentScreen from './components/main/Comment'

import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'

const Stack = createStackNavigator();
const store = createStore(rootReducer,applyMiddleware(thunk))
import fbconfig from './config/FirebaseConfig'

const firebaseConfig = {
  apiKey: fbconfig.apiKey,
  authDomain: fbconfig.authDomain,
  projectId: fbconfig.projectId,
  storageBucket: fbconfig.storageBucket,
  messagingSenderId: fbconfig.messagingSenderId,
  appId: fbconfig.appId,
  measurementId: fbconfig.measurementId
};

if(firebase.apps.length === 0){
  firebase.initializeApp(firebaseConfig)
}

export class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loaded: false, 
    }
  }

  componentDidMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(!user){
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      }else{
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const {loggedIn, loaded} = this.state;
    if(!loaded){
      return(
        <View style = {{flex: 1, justifyContent: 'center'}}>
          <Text> Loading </Text>
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{headerShown: false}}/>
            <Stack.Screen name="Register" component={RegisterScreen}/>
            <Stack.Screen name="Login" component={LoginScreen}/>
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return(
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Main">
              <Stack.Screen name="Main" component={MainScreen}/>
              <Stack.Screen name="WriteFunc" component={WriteScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App