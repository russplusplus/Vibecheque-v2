import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Report from './Report';
import NewFavorite from './NewFavorite';

import { connect } from 'react-redux';

import storage from '@react-native-firebase/storage';


class ViewInbox extends React.Component {

    state = {
        reportMode: false,
        newFavoriteMode: false,
        starColor: 'white',
        responseMessage: '',
        url: ''
    }
    
    handlePressAnywhere = () => {
        let imageId = this.props.reduxState.inbox[0].id;
        let senderId = this.props.reduxState.inbox[0].from_users_id;
        // delete viewed image from database
        
        console.log('before redux delete:', this.props.reduxState.inbox)
        // delete viewed image from redux
        
        console.log('after redux delete:', this.props.reduxState.inbox)
        
        //if the recieved image is not a response, prepare for responding by dispatching to redux
        // if (!this.props.reduxState.inbox[0].is_response) {
        //     this.props.dispatch({                 //still need to test if this works
        //         type: 'SET_RESPONDING',
        //         payload: { senderId: senderId }
        //     })
        // }
        
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

    

    componentDidMount() {
        console.log('in ViewInbox componentDidMount')
        console.log('reduxState.inbox:', this.props.reduxState.inbox)
        this.setState({
            image: this.props.reduxState.inbox[0]
        })
        if (this.props.reduxState.inbox[0].is_response) {
            this.setState({responseMessage: 'Response'})
        }
    }
    
    render() {
        console.log('in render(). this.state.url:', this.state.url)
        return (
            <>
                <NewFavorite visible={this.state.newFavoriteMode} closeNewFavoriteModal={this.closeNewFavoriteModal} indicateFavorite={this.indicateFavorite}></NewFavorite>
                <Report visible={this.state.reportMode} cancelReport={this.cancelReport} returnToCameraPage={this.returnToCameraPage}></Report>
                    <TouchableWithoutFeedback onPress={this.handlePressAnywhere}>
                        <ImageBackground
                        style={{ flex: 1 }}
                        source={{ uri: this.props.reduxState.inboxUrl }}>
                            <View style={styles.iconContainer}>
                                <View style={styles.topIcons}>
                                    <Text style={{fontSize: 32, color: 'white', textAlign: 'center', marginTop: 10}}>Response</Text>
                                </View>
                                <View style={styles.bottomIcons}>
                                        <TouchableOpacity
                                            style={styles.badVibes}
                                            onPress={() => this.setState({reportMode: true})}>
                                            <FontAwesome
                                                name='thumbs-down'
                                                style={{ color: 'black', fontSize: 40}}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.favorite}
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
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 6,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    iconContainer: {
        display: 'flex',
        flex: 6, 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        margin: '3%',
        marginTop: Platform.OS === 'ios' ? '8%' : '3%',
        marginBottom: Platform.OS === 'ios' ? '5%' : '3%',
    },
    topIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    badVibes: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#FFFAAC',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    favorite: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#9EE7FF',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    logoutIcon: {
        color: 'white', 
        fontSize: 44
    },
    switchCameraIcon: {
        color: 'white', 
        fontSize: 44
    },
    inboxText: {
        color: 'black',
        fontSize: 40
    },
    captureIcon: {
        color: 'white', 
        fontSize: 82
    },
    favoriteIcon: {
        color: 'white',
        fontSize: 44
    }
});
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewInbox);