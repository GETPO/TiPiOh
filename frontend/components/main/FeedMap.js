import React, {useState, useEffect} from 'react'
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Dimensions,Button } from 'react-native';

export default function Map(props) {
    const [region, setRegion] = useState([])

    useEffect(() => {
        console.log(props)
        setRegion(props.route.params.region)
    }, [props])

    return (
        <View style={{flex:1}}>
            <Button
                title="Done"
                onPress={() =>  props.navigation.goBack()
                }
            />
            <MapView 
                style={styles.map}
                region= {region}
                showsUserLocation={true}
            >
                <Marker
                    coordinate={{latitude: region.latitude, longitude: region.longitude}}
                    title="Here"
                />
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    },
  });