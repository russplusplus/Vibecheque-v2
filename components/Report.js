import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';

import { connect } from 'react-redux';

class Report extends React.Component {

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

    report = () => {
        console.log('in report')
        fetch(`https://murmuring-lake-71708.herokuapp.com/users/${this.props.reduxState.inbox[0].from_users_id}`, {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            }  
        })

        //delete photo from database
        let imageId = this.props.reduxState.inbox[0].id;
        fetch('https://murmuring-lake-71708.herokuapp.com/images', {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            },
            body: JSON.stringify({
                "imageId": imageId
            })
        })

        //delete photo from Redux
        this.props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE'
        })

        this.props.returnToCameraPage();
    }

    async componentDidMount() {
        console.log('in Report componentDidMount')
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
                        <Text style={{fontSize:48, textAlign:'center', marginTop:100}}>Bad Vibes?</Text>
                        <Text style={{fontSize:26, textAlign:'center', marginTop:50}}>The sender will be permanently banned.</Text>
                        <TouchableOpacity 
                            onPress={() => this.report()} 
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
                                BAD VIBES
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.props.cancelReport()} 
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

export default connect(mapReduxStateToProps)(Report);