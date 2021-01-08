import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CardContainer from './CardContainer'
class HomeScreen extends React.Component {
  render() {
    return (
      // <View style={styles.container}>
      //   <Text>Homee</Text>
      // </View>
      <CardContainer style={styles.container}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeScreen;