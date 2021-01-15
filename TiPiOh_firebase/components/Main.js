// Landing, Login, Register 화면 이후 나타나게 될 화면
import React, { Component } from 'react';
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchUser } from "../redux/actions/index";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialBottomTabNavigator();
const EmptyScreen = () => {
    return(null)
}

export class Main extends Component {
    componentDidMount() {
        this.props.fetchUser();
    }
    render() {
        return (
            <Tab.Navigator initialRouteName="Feed" labeled={false}>
                {/* Tab 이름은 Feed, 옵션으로 Tab icon은 집 모양, 컬러는 기본, 크기는 26 */}
                <Tab.Screen name="Feed" component={FeedScreen}
                    options={{
                        tabBarIcon: ( {color, size} ) => (
                            <MaterialCommunityIcons name="home" color={color} size={26}/>
                        )
                    }}/>
                 <Tab.Screen name="AddContainer" component={EmptyScreen}
                    listeners={({ navigation }) => ({
                        tabPress: event => {
                            event.preventDefault();
                            navigation.navigate("Add")
                        }
                    })}
                    options={{
                        tabBarIcon: ( {color, size} ) => (
                            <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
                        )
                    }}/>
                 <Tab.Screen name="Profile" component={ProfileScreen}
                    options={{
                        tabBarIcon: ( {color, size} ) => (
                            <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
                        )
                    }}/>
            </Tab.Navigator>
        )
    }
}

const mapStateToProps = (store) => ({
    currentUser: store.userState.currentUser
})
// fetchUser함수와 dispatch를 쉽게 연동할 수 있는 redux 기능
const mapDispatchToProps = (dispatch) => bindActionCreators({fetchUser}, dispatch);

/*
 * connect는 Provider 컴포넌트 하위의 컴포넌트들이 쉽게 store에 접근할 수 있게 만든다.
 * 여기서는 (Main) 컴포넌트가 store에 접근할 수 있게 만들어진다.
 * 
 * mapStateToProps는 connect함수에 첫번째 인수로 들어가는 함수 혹은 객체다.
 * mapStateToProps는 기본적으로 store가 업데이트가 될때 마다 자동적으로 호출이 된다.이를 원하지 않는다면 null 혹은 undefined값을 제공해야한다.
 * 여기서는 null로 사용
 * 
 * mapDispatchToProps는 connect함수의 두번째 인자로 사용된다.
 * 이것은 기본적으로 store에 접근한 컴포넌트가 store의 상태를 바꾸기 위해
 * dispatch를 사용할수 있게 만들어준다.
 */
export default connect(mapStateToProps, mapDispatchToProps)(Main);
