import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

const CardView = ({data}) => (
    <View style={styles.CardContainer}>
        <Image source={{uri: 'https://i.pinimg.com/564x/80/bc/15/80bc15c3651af22b255c772524032644.jpg'}} style={{width:"100%", height: 200, borderRadius: 4}}/>
        {/* <Text style={styles.CardTitle}>{data.name}</Text> */}
        {/* <Text style={styles.CardContent}>{data.address}</Text> */}
        <Text style={styles.CardTitle}>Title</Text>
        <Text style={styles.CardContent}>Contents</Text>
    </View>
)

const styles = StyleSheet.create({
    CardContainer: {
        elevation: 5,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
        margin: 12,
        elevation: 5
    },
    CardTitle: {
        width: '100%',
        fontWeight: 'bold',
        fontSize: 20,
        padding: 3
    },
    CardContent: {
        width: '100%',
        fontSize: 12,
        padding: 3
    },
});

export default CardView;