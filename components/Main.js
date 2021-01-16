import React, { Component } from 'react'
import {View, Text} from 'react-native'
import { createBottomTabNavigator }from '@react-navigation/bottom-tabs'
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from 'firebase'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { fetchUser, fetchUserPost, fetchUserFollowing} from '../redux/actions/index'

import FeedScreen from './main/Feed'
import RankingScreen from './main/Ranking'
import NotificationScreen from './main/Notification'
import ProfileScreen from './main/Profile'
import SearchScreen from './main/Search'

const EmptyScreen = () => {
    return(null)
}
const Tab = createBottomTabNavigator();

export class Main extends Component {
    componentDidMount(){
        this.props.fetchUser();
        this.props.fetchUserPost();
        this.props.fetchUserFollowing();
    }
    render() {
        const {currentUser} = this.props;
        console.log(currentUser)
        if(currentUser==undefined){
            return(
                <View><Text></Text></View>
            )
        }
        return (
            <Tab.Navigator
                initialRouteName = "Feed"
                screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
        
                    if (route.name === 'Feed') {
                    iconName = focused ? 'ios-file-tray' : 'ios-file-tray-outline';
                    } else if (route.name === 'Ranking') {
                    iconName = focused ? 'ios-hand-right' : 'ios-hand-right-outline';
                    } else if (route.name === 'Search') {
                    iconName = focused ? 'ios-hand-right' : 'ios-hand-right-outline';
                    } else if (route.name === 'Write') {
                    iconName = focused ? 'ios-add-circle' : 'ios-add-circle-outline';
                    } else if (route.name === 'Notification') {
                    iconName = focused ? 'ios-chatbubble' : 'ios-chatbubble-outline';
                    } else if (route.name === 'Profile') {
                    iconName = focused ? 'ios-happy' : 'ios-happy-outline';
                    }
        
                    // You can return any component that you like here!
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
                })}
            >
            <Tab.Screen name="Feed" component={FeedScreen} />
            {/* <Tab.Screen name="Ranking" component={RankingScreen} /> */}
            <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation} />
            <Tab.Screen name="Write" component={EmptyScreen}
                listeners={({navigation}) => ({
                    tabPress: event =>{
                        event.preventDefault();
                        navigation.navigate("WriteFunc")
                    }
                })} 
            />
            <Tab.Screen name="Notification" component={NotificationScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} 
                listeners={({navigation}) => ({
                    tabPress: event =>{
                        event.preventDefault();
                        navigation.navigate("Profile", {uid: firebase.auth().currentUser.uid})
                    }
                })} 
            />
          </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({fetchUser, fetchUserPost, fetchUserFollowing}, dispatch)

export default connect(mapStateToProps, mapDispatchProps)(Main);
