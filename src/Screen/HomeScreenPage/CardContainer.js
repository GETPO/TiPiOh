import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import CardView from './Cardview'

// const [kkk, setdata] = useState();
export default class CardContainer extends React.Component {
  
  state = {
    data: ["1","2","3"],
    isLoading: false
  }
//   componentDidMount(){
//     this.getPostData();
//   }

//   getPostData = async() => {
//     const data = await this.callPostData();
//     this.setState({
//       data: data.rows,
//       isLoading: true
//     })
//   }

//   callPostData = async() => {
//     return fetch('api주소')
//     .then(request => request.json())
//     .catch(err => console.log(err))
//   }

    render() {
      return (
        <View style={styles.container}>
          <ScrollView style={styles.cardContainer}>
          {this.state.data.map((data, index) => (
            <CardView
              data={data}
              key={index}
            />
          ))}
          </ScrollView>
        </View>
      );
    }
  }
  
  const styles = StyleSheet.create({
    header: {
      flex: 1,
    },
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardContainer: {
      flex: 1,
      flexDirection: 'column',
      width: '100%'
    }
  });