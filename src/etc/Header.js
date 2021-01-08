import React from 'react';
import { StyleSheet, Text, View, StatusBar } from 'react-native';

const Header = () => (
    <View style={styles.HeaderContainer}>
        <Text style={styles.HeaderText}>TiPiOh</Text>
    </View>
)

const styles = StyleSheet.create({
    HeaderContainer: {
        backgroundColor: '#708098',
        width: '100%',
        padding: 5,
        marginTop: 0
    },
    HeaderText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#ffffff',
        textAlign: 'center'
    }
});

export default Header;