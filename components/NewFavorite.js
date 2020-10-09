import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';
import { connect } from 'react-redux';

class NewFavorite extends React.Component {

    favorite = async () => {
        console.log('in favorite')
        this.props.indicateFavorite()
        this.props.closeNewFavoriteModal();
    }    

    async componentDidMount() {
        console.log('in NewFavorite componentDidMount')
    }

    render() {
        return (
            <Modal visible={this.props.visible} animationType='slide' transparent={true}>
                <View style={{flex:1, alignItems: 'center', marginLeft:20, marginRight:20, marginTop:120, marginBottom:120, backgroundColor:'#FFFAAC', borderWidth:2, borderColor:'black', borderRadius:10}}>
                        <Text style={{fontSize:48, textAlign:'center', marginTop:100}}>Favorite Vibe?</Text>
                        <Text style={{fontSize:26, textAlign:'center', marginTop:50, marginLeft:20, marginRight:20}}>The image will be saved and will overwrite any currently saved image.</Text>
                        <TouchableOpacity 
                            onPress={() => this.favorite()} 
                            style={{ 
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: '#9EE7FF',
                                justifyContent: 'center',
                                marginTop: 50}}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                Save
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.props.closeNewFavoriteModal()} 
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

export default connect(mapReduxStateToProps)(NewFavorite);