import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView } from 'react-native';
import { Camera } from 'expo-camera';
import { IconButton, Colors } from 'react-native-paper'
import * as ImagePicker from 'expo-image-picker';

// navigation 메소드를 사용하가 위해 함수 인자로 navigation을 사용
export default function Write({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [image, setImage] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  // 카메라 or 갤러리 기능을 사용하기 위해 권한 요청, 이 때 비동기 처리 
  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === 'granted');

      const galleryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === 'granted');
    })();
    const unsubscribe = navigation.addListener('focus', () => {
      setImage(null)
  });
   return unsubscribe
  }, []);

  // Take Picture 버튼 클릭 시 실행, 사진을 찍을 때, 다른 모든 동작들 정지(async)
  const takePicture = async() => {
    if (camera) {
        const data = await camera.takePictureAsync(null); // 카메라가 사진을 찍으면 그 정보를 리턴
        setImage(data.uri); // 촬영된 사진의 uri를 저장
    }
  }

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  if (hasCameraPermission === null || hasGalleryPermission === false) {
    return <View />;
  }
  if (hasCameraPermission === false || hasGalleryPermission === false) {
    return <Text>No access to camera or gallery</Text>;
  }
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
          <IconButton 
            //tyle={{width:'50%'}}
            icon="keyboard-backspace"
            color={Colors.black}
            size={30}
            onPress={() => navigation.goBack()} />
          {/* <Text style={{width:'75%', alignSelf: 'center', textAlign: 'center', fontSize:30}}>TiPiOh!</Text> */}
      </View>
        <View style={styles.cameraContainer}>
          {image 
            ? <Image source={{uri: image}} style={styles.fixedRatio}/>
            : <Camera 
                  ref={ref => setCamera(ref)}
                  style={styles.fixedRatio}
                  type={type}
                  ratio={'1:1'}
              >
                <IconButton 
                style={{alignSelf: 'flex-end'}}
                icon="camera-retake-outline"
              color={Colors.white}
              size={30}
              onPress={() => {
                setType(
                  type === Camera.Constants.Type.back
                    ? Camera.Constants.Type.front
                    : Camera.Constants.Type.back
                );
              }} />
              </Camera>
          }
        </View>
        <View style={styles.buttonview}>
          {/* 사진 찍고 image state에 정보가 저장 */}
          <IconButton icon="image-filter-none"
              color={Colors.black}
              size={40}
              onPress={() => pickImage()} />
          <IconButton icon="circle-slice-8"
              color={Colors.black}
              size={80}
              onPress={() => takePicture()} />
          {/* Save Component에서 props를 통해 image 접근이 가능해진다. */}
          <IconButton icon="content-save-outline"
              color={Colors.black}
              size={45}
              onPress={() => navigation.navigate('Save', {image})} />
          {/* 갖고 있는 이미지가 있으면 불러온다. */}
          {/* {image && <Image source={{uri: image}} style={{flex: 1}}/>} */}
        </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container:{
      flex: 1,
      marginTop: 10,
      padding: 10,
      backgroundColor: 'white',
    },
    headerContainer:{
      flex: 0.5,
      flexDirection:'row', 
      //justifyContent:'space-between',
      //backgroundColor:'yellow'
    },
    cameraContainer: {
        flex: 3,
        // marginTop: 20,
        flexDirection: 'row',
      //backgroundColor:'blue'

    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    },
    buttonview: {
        marginTop: 70,
        marginLeft: 30,
        marginRight: 30,
        flex: 1.5,
        flexDirection:'row',
        //backgroundColor:'green',
        // justifyContent: 'center',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
})
