import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { connect } from 'react-redux';

class DeleteFavorite extends React.Component {

    state = {
    }

    

    deleteFavorite = () => {
        console.log('in delete function');
        //actually delete image
        this.props.dispatch({
            type: 'DELETE_FAVORITE'
        })
        this.props.returnToCameraPage()
        //this.props.closeDeleteFavoriteModal();
    }

    async componentDidMount() {
        console.log('in DeleteFavorite componentDidMount')
        
    }

    render() {
        return (
            <Modal visible={this.props.visible} animationType='slide' transparent={true}>
                <View style={{flex:1, alignItems: 'center', marginLeft:20, marginRight:20, marginTop:120, marginBottom:120, backgroundColor:'#FFFAAC', borderWidth:2, borderColor:'black', borderRadius:10}}>
                        <Text style={{fontSize:48, textAlign:'center', marginTop:100}}>Delete image?</Text>
                        <Text style={{fontSize:26, textAlign:'center', marginTop:50, marginLeft:20, marginRight:20}}>The image will be permanently deleted.</Text>
                        <TouchableOpacity 
                            onPress={this.deleteFavorite} 
                            style={{ 
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: '#CC375E',
                                justifyContent: 'center',
                                marginTop: 50}}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                Delete
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={this.props.closeDeleteFavoriteModal} 
                            style={{ 
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: 'transparent',
                                justifyContent: 'center',
                                marginTop: 10}}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                Cancel
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

export default connect(mapReduxStateToProps)(DeleteFavorite);