import React, { useState, useEffect } from 'react'
import { View,  Image, StyleSheet, ScrollView, Text} from "react-native";
import { ProgressBar, TextInput, Chip} from 'react-native-paper';

import * as Location from 'expo-location';

import * as eva from '@eva-design/eva';
import { ApplicationProvider, Datepicker, IconRegistry ,Input, Icon,Button, NativeDateService, Select, SelectItem, Divider } from '@ui-kitten/components';
    import { EvaIconsPack } from '@ui-kitten/eva-icons';

import firebase from 'firebase';
require("firebase/firestore")
require("firebase/firebase-storage")

// Add.js에서 navigate메소드의 인자로 image를 props로 전달해줬기 때문에 
// props = image 로 사용 가능하다.
export default function Save(props) {
    // 이미지 설명 -> caption, setCaption 함수로 react에게 입력한 값 전달
    const [caption, setCaption] = useState("")
    const [imageURI, setImageURI] = useState("")

    // TPO중 T
    const [TPO_time, setTPOtime] = useState(new Date())
    const [TPO_season, setTPOseason] = useState([])
    const [selectedIndex, setSelectedIndex] = useState([]);
    const now = new Date();
    const SeasonData = [
          'Spring',
          'Summer',
          'Fall',
          'Winter'
    ];

    // TPO중 P
    const [TPO_region, setTPOregin] = useState([])
    const [TPO_regioncomments, setTPOregioncomments] = useState("")
    const [locationCheck, setlocationCheck] = useState(true)

    // TPO중 O
    const [occasiontext, setOccasiontext] = useState("")
    const [TPO_occasion, setTPOoccasion] = useState([])
    
    const [Progress, setProgress] = useState(0);

    const uploadIcon = (props) => (
        <Icon {...props} name='arrow-circle-up'/>
    );
    const mapIcon = (props) => (
        <Icon {...props} name='globe-2-outline'/>
    );
    const plusIcon = (props) => (
        <Icon {...props} name='plus-outline'/>
    );
    
    const groupDisplayValues = selectedIndex.map(index => {
        return SeasonData[index.row];
    });
    const renderOption = (title) => (
        <SelectItem title={title}/>
    );
        
    const addOccasion = () => {
        console.log(occasiontext)
        if(occasiontext !== "")
            setTPOoccasion([ ...TPO_occasion, occasiontext])
        setOccasiontext("")
        console.log(TPO_occasion)
    }

    const deleteOccasion = (item) => {
        setTPOoccasion(TPO_occasion.filter((n) =>{
            return n !== item
        }))
    }

    useEffect(() => {
            (async () => {
                let { status } = await Location.requestPermissionsAsync();
                if (status !== 'granted') {
                    setErrorMsg('Permission to access location was denied');
                    return;
                }
                let location = await Location.getCurrentPositionAsync({});
                let nowlocation ={
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.009,
                    longitudeDelta: 0.009
                }
                if(locationCheck){
                    setlocationCheck(!locationCheck)
                    setTPOregin(nowlocation)
                }
            })();
            
            const unsubscribe = props.navigation.addListener('focus', () => {
                if(props.route.params.region !== undefined){
                    setTPOregin(props.route.params.region)
                }
            });
            
            let season = selectedIndex.map(idx => {
                return SeasonData[idx.row]
            })
            setTPOseason(season)
            setImageURI(props.route.params.image)
            return unsubscribe
            
        }, [props,imageURI, Progress, selectedIndex, TPO_occasion])
        
    const uploadImage = async() => {
        const uri = props.route.params.image;
        // 이미지가 저장될 Firebase의 Storage 경로
        const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
         //console.log(childPath);
        const response = await fetch(uri);
        const blob = await response.blob();
        const task = firebase.storage().ref().child(childPath).put(blob);
        
        
        // 업로드 한 이미지 크기가 어느 정도인지 확인하는 기능
        const taskProgress = snapshot => {
            setProgress(0.3)
            //console.log(`transferred: ${snapshot.bytesTransferred}`)
        }
        // 업로드 한 이미지를 public하게 볼 수 있게 하는 기능
        const taskCompleted = () => {
            task.snapshot.ref.getDownloadURL().then((snapshot) => {
                setProgress(1)
                savePostData(snapshot);     // Storage 말고 firestore DB에 이미지 업로드 했다는 post 저장하기
                //console.log(snapshot)
            })
        }
        const taskError = snapshot => {
            console.log(snapshot)
        }
        // task에 변화가 있을 때 마다 상위 3개 기능이 수행되도록 만든다. (인자 순서 중요)
        task.on("state_changed", taskProgress, taskError, taskCompleted);
    }

    // Storage에 이미지 업로드 성공하면 firestore DB에도 이미지 정보를 post해서 다른 사람도 이미지를 볼 수 있게 만든다.
    const savePostData = (downloadURL) => {             //downloadURL -> task.snapshot.ref.getDownloadURL()로 가져온 이미지 URL
        firebase.firestore()
            .collection('posts')                        // firestore의 posts 컬렉션에
            .doc(firebase.auth().currentUser.uid)       // 사용자 uid로 된 doc 안에다가 (현재 로그인한 사용자가 업로드한 이미지를 한 곳에 모아두는 역할)
            .collection("userPosts")                    // userPosts라는 컬렉션에
            .add({                                      // 객체를 추가한다.
                downloadURL,
                caption,
                likesCount: 0,
                TPO_time,
                TPO_season,
                TPO_regioncomments,
                TPO_region,
                TPO_occasion,
                creation: firebase.firestore.FieldValue.serverTimestamp(),
            }).then((function () {
                props.navigation.popToTop() // 이미지 업로드를 하고 나면 Main page로 돌아가는 기능
            }))
    }

    return (
        <>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={eva.light}>
                <View style={styles.container}>
                    <View style={styles.imageview}>
                        <Image
                            style={styles.image}
                            source={{uri:imageURI}}/>
                    </View>
                    <View style={styles.contents}> 
                        <ScrollView style={styles.scrollview}>
                            <Divider/>
                            <View style={styles.timeview}>
                                <Datepicker
                                    style={{width:"45%"}}
                                    label='Date'
                                    min={new Date(1900)}
                                    max={new Date(now.getFullYear(), now.getMonth(), now.getDate())}
                                    dateService={new NativeDateService('en', { format: 'YYYY년 MM월 DD일' })}
                                    size='small'
                                    date={TPO_time}
                                    onSelect={nextDate => setTPOtime(nextDate)}
                                />
                                <Select
                                    style={{width:"50%"}}
                                    label='Season'
                                    size='small'
                                    placeholder='Season'
                                    multiSelect={true}
                                    value={groupDisplayValues.join(', ')}
                                    selectedIndex={selectedIndex}
                                    onSelect={index => setSelectedIndex(index)}>
                                    {SeasonData.map(renderOption)}
                                </Select>
                            </View>

                            <View style={styles.placeview}>
                                <Input
                                    style={{width:'75%'}}
                                    label='Place'
                                    placeholder='Describe the place.'
                                    onChangeText={nextValue => setTPOregioncomments(nextValue)}
                                />
                                <Button
                                    style={{width:'20%', height:"10%",marginTop:22}}
                                    appearance='outlined'
                                    accessoryLeft={mapIcon}
                                    onPress={() => {
                                        props.navigation.navigate('Map', {TPO_region})
                                    }}
                                />
                            </View>
                            <View style={styles.occasionview}>
                                <View style={styles.placeview}>
                                    <Input
                                        style={{width:'85%'}}
                                        label='Occasion'
                                        placeholder='Tag Occasion.'
                                        value={occasiontext}
                                        onChangeText={nextValue => setOccasiontext(nextValue)}
                                    />
                                    <Button
                                        style={{width:'5%', height:"10%",marginTop:22}}
                                        appearance='outlined'
                                        accessoryLeft={plusIcon}
                                        onPress={addOccasion}
                                    />
                                </View>
                                <View style={{flexDirection:'row'}}>
                                    {TPO_occasion.map(item =>
                                        (<Chip onClose={() => deleteOccasion(item)}>{`#${item}`}</Chip>)
                                    )}
                                </View>
                            </View>
                        </ScrollView>
                    </View>

                    <ProgressBar progress={Progress}/>
                    <View style={styles.footerview} >
                        <View style={styles.commentview}>
                            <TextInput
                                style={styles.commentstyle}
                                placeholder="comments..."
                                onChangeText={(caption) => setCaption(caption)}
                            />

                        </View>
                        <View style={styles.uploadview}>
                            <Button
                                appearance='ghost'
                                accessoryLeft={uploadIcon}
                                onPress={() => uploadImage()}
                            />
                        </View>
                    </View>
                </View>
            </ApplicationProvider>
        </>
    )
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        marginTop: 8,
        padding: 10,
        backgroundColor: 'white',
    },
    imageview:{
        flex: 5,
        marginTop: 20,
        backgroundColor: 'white',
    },
    contents:{
        flex: 5,
        marginTop: 5,
        backgroundColor: 'white',
    },
    scrollview:{
        flex: 1,
    },
    timeview:{
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    placeview:{
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
    },
    occasionview:{
        flex: 1,
    },
    footerview:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop:10,
        backgroundColor: 'white',
    },
    commentview:{
        width:"80%",
        backgroundColor: 'white',
    },
    uploadview:{
        width:"20%",
        backgroundColor: 'white',
    },
    
    image:{
        width: '100%',
        height: '100%',
        resizeMode:'contain',
    },
    commentstyle:{
        height: 40
    },
    buttonstyle:{
        margin:2,
        justifyContent: 'center',
    },
})