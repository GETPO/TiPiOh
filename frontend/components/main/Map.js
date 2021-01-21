import React, {useState, useEffect} from 'react'
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Text, View, Dimensions,Button } from 'react-native';

export default function Map(props) {
    const [region, setRegion] = useState([])

    useEffect(() => {
        setRegion(props.route.params.TPO_region)
    }, [props])

    return (
        <View style={{flex:1}}>
            <Button
                title="Done"
                onPress={() => {
                    props.navigation.navigate("Save",{region})
                    }
                }
            />
            <MapView 
                style={styles.map}
                region= {region}
                onRegionChangeComplete={region => setRegion(region)}
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