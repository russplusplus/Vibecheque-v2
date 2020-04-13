import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';

import { connect } from 'react-redux';

class NewFavorite extends React.Component {

    state = {
        accessToken: ''
    }

    getToken = async () => {
        try {
            const token = await AsyncStorage.getItem("access_token")
            console.log('getToken token:', token);
            return token;
        } catch (error) {
            console.log('AsyncStorage retrieval error:', error.message);
        }
        return '(missing token)';
    }

    favorite = async () => {
        console.log('in favorite')
        // turn star yellow
        this.props.indicateFavorite()

        // send image url to database and replace existing
        fetch('https://murmuring-lake-71708.herokuapp.com/users', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            },
            body: JSON.stringify({
                "image_url": this.props.reduxState.inbox[0].image_url
            })
        })
        console.log('past fetch')
        this.props.closeNewFavoriteModal();
    }    

    async componentDidMount() {
        console.log('in NewFavorite componentDidMount')
        await this.getToken()
            .then(response => {
                //console.log('in new .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
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