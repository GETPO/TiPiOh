import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import { Camera } from 'expo-camera';
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
    <View style={{flex: 1}}>
        <View style={styles.cameraContainer}>
            <Camera 
                ref={ref => setCamera(ref)}
                style={styles.fixedRatio} 
                type={type}
                ratio={'1:1'}/>
        </View>
        <Button
            title="Flip Image"
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
        </Button>
        {/* 사진 찍고 image state에 정보가 저장 */}
        <Button title="Take Picture" onPress={() => takePicture()}/>
        <Button title="Pick Image From Gallery" onPress={() => pickImage()}/>
        {/* Save Component에서 props를 통해 image 접근이 가능해진다. */}
        <Button title="Save" onPress={() => navigation.navigate('Save', {image})}/>
        {/* 갖고 있는 이미지가 있으면 불러온다. */}
        {image && <Image source={{uri: image}} style={{flex: 1}}/>}
    </View>
  );
}

const styles = StyleSheet.create({
    cameraContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    fixedRatio: {
        flex: 1,
        aspectRatio: 1
    }
})
