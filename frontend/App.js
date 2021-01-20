import { StatusBar } from 'expo-status-bar';
import React, {Component} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ActivityIndicator, Colors } from 'react-native-paper';
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
import fbconfig from './config/FirebaseConfig'

const Stack = createStackNavigator();
const store = createStore(rootReducer,applyMiddleware(thunk))

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: fbconfig.apiKey,
  authDomain: fbconfig.authDomain,
  projectId: fbconfig.projectId,
  storageBucket: fbconfig.storageBucket,
  messagingSenderId: fbconfig.messagingSenderId,
  appId: fbconfig.appId,
  measurementId: fbconfig.measurementId
};

if(firebase.apps.length === 0){// No Firebase Instance
  firebase.initializeApp(firebaseConfig)
}

export class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      loaded: false, 
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
    if(!loaded){
      return(
        <View style = {{flex: 1, justifyContent: 'center'}}>
          <ActivityIndicator animating={true} color={Colors.red800} />
        </View>
      )
    }
    if(!loggedIn){
      return (
        <NavigationContainer>
          {/* 앱을 실행시키면 무조건 Landing Page로 간다.
            Stack.Navigator는 무조건 NavigationContainer 컴포넌트 안에 있어야 한다. */}
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
               {/* Main 화면에서 Add 버튼을 누르면 Main 화면 위에 stack으로 Add 창이 생김 
                navigation을 props로 사용*/}
              <Stack.Screen name="WriteFunc" component={WriteScreen} navigation={this.props.navigation}/>
              <Stack.Screen name="Save" component={SaveScreen} navigation={this.props.navigation} options={{headerShown: false}}/>
              <Stack.Screen name="Comment" component={CommentScreen} navigation={this.props.navigation}/>
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    )
  }
}

export default App