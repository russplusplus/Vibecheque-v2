import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { connect } from 'react-redux';

class NoFavorite extends React.Component {

    async componentDidMount() {
        console.log('in NoFavorite componentDidMount')
    }

    render() {
        return (
            <Modal visible={this.props.visible} animationType='slide' transparent={true}>
                <View style={{
                    flex:1, 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginLeft:'5%', 
                    marginRight:'5%', 
                    marginTop:'40%', 
                    marginBottom:'40%', 
                    backgroundColor:'#FFFAAC', 
                    borderWidth:2, 
                    borderColor:'black', 
                    borderRadius:10, 
                    paddingLeft:'5%', 
                    paddingRight:'5%'
                    }}>
                        <Text style={{
                            fontSize:40, 
                            textAlign:'center', 
                            }}>
                                You haven't selected a favorite vibe yet.
                        </Text>
                        <TouchableOpacity 
                            onPress={() => this.props.toggleNoFavoriteMode()} 
                            style={{ 
                                marginTop: '15%',
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: '#9EE7FF',
                                justifyContent: 'center',
                                }}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                Oh okay
                            </Text>
                        </TouchableOpacity>                    
                </View>  
            </Modal>
        )
    }
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(NoFavorite);