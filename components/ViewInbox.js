import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, AsyncStorage } from 'react-native';

import Report from './Report';
import NewFavorite from './NewFavorite';

import { connect } from 'react-redux';

class ViewInbox extends React.Component {

    state = {
        accessToken: '',
        reportMode: false,
        newFavoriteMode: false,
        starColor: 'white',
        ifResponse: ''
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
    
    handlePressAnywhere = () => {
        let imageId = this.props.reduxState.inbox[0].id;
        let senderId = this.props.reduxState.inbox[0].from_users_id;
        // delete viewed image from database
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
        console.log('before redux delete:', this.props.reduxState.inbox)
        // delete viewed image from redux
        
        console.log('after redux delete:', this.props.reduxState.inbox)
        
        //if the recieved image is not a response, prepare for responding by dispatching to redux
        console.log('this.props.reduxState.inbox[0].is_response:', this.props.reduxState.inbox[0].is_response)
        if (!this.props.reduxState.inbox[0].is_response) {
            this.props.dispatch({                 //still need to test if this works
                type: 'SET_RESPONDING',
                payload: { senderId: senderId }
            })
        }
        
        console.log('senderId:', this.props.reduxState.senderId)

        this.props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE'
        })
        this.props.history.push('/camera')
    }

    // report = () => {
    //     console.log('in report')
    //     fetch(`http://172.16.102.94:5000/users/${this.props.reduxState.inbox[0].from_users_id}`, {
    //         method: 'PUT',
    //         headers: {
    //             Accept: 'application/json',
    //             'Content-Type': 'application/json',
    //             Authorization: 'Bearer ' + this.state.accessToken
    //         }  
    //     })
    // }

    favorite = async () => {
        console.log('in favorite')
        // send image url to database and replace existing
        await fetch('https://murmuring-lake-71708.herokuapp.com/users', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + this.state.accessToken
            },
            body: JSON.stringify({
                "image_url": this.props.reduxState.inbox[0].image_url
            })
        }).then((response) => {
            console.log('in favorite .then')
        })
    }

    cancelReport = () => {
        this.setState({reportMode: false})
    }

    closeNewFavoriteModal = () => {
        this.setState({newFavoriteMode: false})
    }

    returnToCameraPage = () => {
        this.props.history.push('/camera')
    }

    indicateFavorite = () => {
        this.setState({starColor: '#FFFAAC'})
    }

    async componentDidMount() {
        console.log('in ViewInbox componentDidMount')
        console.log(this.state.reportMode)
        await this.getToken()
            .then(response => {
                //console.log('in new .then. token:', response)
                this.setState({accessToken: response});
            }).catch(error => {
                console.log('in catch,', error)
            });
        console.log('state access token:', this.state.accessToken)
        console.log('reduxState.inbox:', this.props.reduxState.inbox)
        if (this.props.reduxState.inbox[0].is_response) {
            this.setState({ifResponse: 'Response'})
        }
    }
    
    render() {
        return (
            <>
                <View style={{ flex: 1, margin: 0 }}>
                <NewFavorite visible={this.state.newFavoriteMode} closeNewFavoriteModal={this.closeNewFavoriteModal} indicateFavorite={this.indicateFavorite}></NewFavorite>
                <Report visible={this.state.reportMode} cancelReport={this.cancelReport} returnToCameraPage={this.returnToCameraPage}></Report>
                    <TouchableWithoutFeedback onPress={() => this.handlePressAnywhere()}>

                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.props.reduxState.inbox[0].image_url }}>
                        <View style={{flex:1, flexDirection:"column",justifyContent:"space-between",margin:10}}>
                            <Text style={{fontSize: 32, color: 'white', textAlign: 'center', marginTop: 10}}>{this.state.ifResponse}</Text>
                            <View style={{flexDirection:"row", justifyContent:"space-between"}}>
                                <TouchableOpacity
                                    style={{
                                        alignSelf: 'flex-end',
                                        alignItems: 'center',
                                        backgroundColor: '#CC375E',
                                        width: 47,
                                        height: 47,
                                        borderWidth: 3,
                                        borderColor: 'black',
                                        borderRadius: 10                   
                                    }}
                                    onPress={() => this.setState({reportMode: true})}>
                                    <FontAwesome
                                        name='thumbs-down'
                                        style={{ color: 'black', fontSize: 40}}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        alignSelf: 'flex-end',
                                        alignItems: 'center',
                                        backgroundColor: '#9EE7FF',
                                        width: 47,
                                        height: 47,
                                        borderWidth: 3,
                                        borderColor: 'black',
                                        borderRadius: 10                        
                                    }}
                                    onPress={() => this.setState({newFavoriteMode: true})}>
                                    <Ionicons
                                        name='md-star'
                                        style={{ color: this.state.starColor, fontSize: 40}}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ImageBackground>
                    </TouchableWithoutFeedback>
                </View>
            </>
        )
    }
}
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewInbox);