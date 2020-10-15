import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, TouchableNativeFeedbackBase } from 'react-native';

import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import storage from '@react-native-firebase/storage';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

import Logout from './Logout';
import ReviewImage from './ReviewImage';
import NoFavorite from './NoFavorite';

FontAwesome.loadFont()
Ionicons.loadFont()


class CameraPage extends React.Component {

    state = {
        isLogoutMode: false,
        isReviewMode: false,
        isNoFavoriteMode: false,
        cameraType: RNCamera.Constants.Type.back,
        capturedImageUri: '',
        uid: '',
        isSending: false,
    }

    logout = () => {
        this.props.dispatch({
            type: 'LOGOUT',
            history: this.props.history
        })
    }

    reverseCamera = () => {
        this.setState({
            // these might just be 1 or 0, look into that with a real device
            cameraType: this.state.cameraType === RNCamera.Constants.Type.back ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back
        })
        console.log(this.state.cameraType)
    }

    toggleLogoutMode = () => {
        console.log('in toggleLogoutMode')
        this.setState({
            isLogoutMode: (this.state.isLogoutMode ? false : true)
        })
    }

    toggleReviewMode = () => {
        this.setState({
            isReviewMode: (this.state.isReviewMode ? false : true)
        })
    }

    toggleNoFavoriteMode = () => {
        this.setState({
            isNoFavoriteMode: (this.state.isNoFavoriteMode ? false : true)
        })
    }

    takePicture = async () => {
        if (this.camera) {
            const options = { quality: 1, base64: true };
            const data = await this.camera.takePictureAsync(options);
            console.log('uri:', data.uri);
            this.setState({
                capturedImageUri: data.uri
            })
            console.log('after setState')
            this.toggleReviewMode()
        }
    }

    sendImage = async () => {
        if (this.state.uid) {
            this.setState({
                isSending: true
            })
            let registrationToken = this.props.reduxState.registrationToken
            console.log('token:', registrationToken)
            
            // generate filename from current time in milliseconds
            let d = new Date();
            let filename = d.getTime();
            console.log('filename:', filename)
            const ref = storage().ref('images/' + String(filename));
            const metadata = {
                customMetadata: {
                    fromUid: this.state.uid,
                    toUid: this.props.reduxState.respondingTo
                }
            }
            await ref.putFile(this.state.capturedImageUri, metadata);
            
            // this.setState({
            //     isResponding: false
            // })
            console.log('this.props.reduxState.respondingTo:', this.props.reduxState.respondingTo)
            this.props.dispatch({
                type: 'SET_NOT_RESPONDING'
            })
            this.toggleReviewMode()
            this.setState({
                isSending: false
            })
        }
        
    }

    viewInbox = async () => {
        console.log('in viewInbox')
        if (this.props.reduxState.inbox[0]) {
            if (this.props.reduxState.inbox[0].url) {
                this.props.history.push('/ViewInbox')
            } else {
                console.log('url not loaded')
            }
        } else {
            console.log('inbox is empty')
        }
    }

    viewFavorite = () => {
        console.log('in viewFavorite')
        if (this.props.reduxState.favoriteUrl.name === 'none') {
            this.toggleNoFavoriteMode()
        } else {
            this.props.history.push('/favorite')
        }
    }

    requestUserPermission = async () => {
        const settings = await messaging().requestPermission();

        if (settings) {
            console.log('Permission settings:', settings);
        }
    }

    // getStorageUrl = async () => {
    //     this.setState({
    //         url: await storage().ref(`images/${this.props.reduxState.inbox[0]}`).getDownloadURL()
    //     })
    // }

    componentDidMount = async () => {
        //get user ID
        let uid = JSON.parse(await AsyncStorage.getItem('user')).uid
        this.props.dispatch({
            type: 'SET_USER_ID',
            payload: uid
        })

        this.props.dispatch({
            type: 'GET_INBOX'
        })
        // this.props.dispatch({
        //     type: 'GET_INBOX_URL'
        // })
        this.props.dispatch({
            type: 'GET_FAVORITE_URL'
        })
        this.setState({
            uid: JSON.parse(await AsyncStorage.getItem('user')).uid
        })
        this.props.dispatch({
            type: 'GET_REGISTRATION_TOKEN'
        })
        
        this.requestUserPermission()
        // if (this.props.reduxState.respondingTo) {
        //     this.setState({
        //         isResponding: true
        //     })
        // } else {
        //     this.setState({
        //         isResponding: false
        //     })
        // }
        console.log('favoriteUrl:', this.props.reduxState.favoriteUrl)
    }

    render() {
        console.log('in CameraPage render. reduxState:', this.props.reduxState)
        return (
            <>
                <View style={styles.container}>
                    <Logout visible={this.state.isLogoutMode} logout={this.logout} toggleLogoutMode={this.toggleLogoutMode}/>
                    <ReviewImage visible={this.state.isReviewMode} sendImage={this.sendImage} toggleReviewMode={this.toggleReviewMode} capturedImageUri={this.state.capturedImageUri} isSending={this.state.isSending}/>
                    <NoFavorite visible={this.state.isNoFavoriteMode} toggleNoFavoriteMode={this.toggleNoFavoriteMode}/>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={this.state.cameraType}
                        flashMode={RNCamera.Constants.FlashMode.off}
                        androidCameraPermissionOptions={{
                            title: 'Permission to use camera',
                            message: 'We need your permission to use your camera',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        androidRecordAudioPermissionOptions={{
                            title: 'Permission to use audio recording',
                            message: 'We need your permission to use your audio',
                            buttonPositive: 'Ok',
                            buttonNegative: 'Cancel',
                        }}
                        captureAudio={false}
                    >
                        <View style={styles.iconContainer}>
                            <View style={styles.topIcons}>
                                <TouchableOpacity onPress={this.toggleLogoutMode}>
                                    <Ionicons
                                        name='md-return-left'
                                        style={styles.logoutIcon}
                                    />
                                </TouchableOpacity>
                                {this.props.reduxState.respondingTo ? 
                                    <Text style={styles.respondingMessage}>
                                        Responding
                                    </Text>
                                :
                                    <Text style={styles.respondingMessage}>

                                    </Text>
                                }
                                <TouchableOpacity onPress={this.reverseCamera}>
                                    <Ionicons
                                        name='md-reverse-camera'
                                        style={styles.switchCameraIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                            {this.props.reduxState.respondingTo ?
                                <View style={styles.respondingBottomIcons}>
                                    <TouchableOpacity onPress={this.takePicture.bind(this)}>
                                        <FontAwesome
                                            name='circle-thin'
                                            style={styles.captureIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            :
                                <View style={styles.bottomIcons}>
                                    <TouchableOpacity onPress={this.viewInbox} style={styles.viewInbox}>
                                        <Text style={styles.inboxText}>{this.props.reduxState.inbox.length}</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.takePicture.bind(this)}>
                                        <FontAwesome
                                            name='circle-thin'
                                            style={styles.captureIcon}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.viewFavorite} style={styles.viewFavorite}>
                                        <Ionicons
                                            name='md-star'
                                            style={styles.favoriteIcon}
                                        />
                                    </TouchableOpacity>
                                </View>
                            }
                        </View>
                    </RNCamera>
                </View>
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
    preview: {
        flex: 6,
    },
    iconContainer: {
        display: 'flex',
        flex: 6, 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        margin: '3%',
        marginTop: Platform.OS === 'ios' ? '8%' : '3%',
        marginBottom: Platform.OS === 'ios' ? '5%' : '3%'
    },
    topIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    respondingBottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },  
    viewInbox: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'flex-end',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#FFFAAC',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    viewFavorite: {
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
    respondingMessage: {
        fontSize: 32,
        fontFamily: 'Rubik-Regular',
        color: 'white'
    },
    switchCameraIcon: {
        color: 'white', 
        fontSize: 44
    },
    inboxText: {
        color: 'black',
        fontSize: 40,
        fontFamily: 'Rubik-Regular'
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

export default connect(mapReduxStateToProps)(CameraPage);