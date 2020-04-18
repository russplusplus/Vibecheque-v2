import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground } from 'react-native';

import EStyleSheet from 'react-native-extended-stylesheet';

import { connect } from 'react-redux';
import { RNCamera } from 'react-native-camera';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Logout from './Logout';


FontAwesome.loadFont()
Ionicons.loadFont()

class CameraPage extends React.Component {

    state = {
        isLogoutMode: false
    }

    logout = () => {
        this.props.dispatch({
            type: 'LOGOUT',
            history: this.props.history
        })
    }

    setIsLogoutMode = () => {
        this.setState({
            isLogoutMode: (this.state.isLogoutMode ? false : true)
        })
    }

    takePicture = async () => {
        if (this.camera) {
          const options = { quality: 0.5, base64: true };
          const data = await this.camera.takePictureAsync(options);
          console.log(data.uri);
        }
    }

    render() {
        return (
            <>
                <View style={styles.container}>
                    <Logout visible={this.state.isLogoutMode} logout={this.logout} setIsLogoutMode={this.setIsLogoutMode}/>
                    <RNCamera
                        ref={ref => {
                            this.camera = ref;
                        }}
                        style={styles.preview}
                        type={RNCamera.Constants.Type.back}
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
                                <TouchableOpacity onPress={this.setIsLogoutMode}>
                                    <Ionicons
                                        name='md-return-left'
                                        style={styles.logoutIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={this.reverseCamera}>
                                    <Ionicons
                                        name='md-reverse-camera'
                                        style={styles.switchCameraIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.bottomIcons}>
                                <TouchableOpacity onPress={this.viewInbox} style={styles.viewInbox}>
                                    <Text style={styles.inboxText}>2</Text>
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
    },
    topIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    viewInbox: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 3,
        backgroundColor: '#FFFAAC',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    viewFavorite: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 3,
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
        fontSize: 44
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

const eStyles = EStyleSheet.create({
    logoutIcon: {

    },
    switchCameraIcon: {

    },
    inboxText: {

    },
    captureIcon: {

    },
    favoriteIcon: {
        color: 'white',
        fontSize: '2rem'
    }
});

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(CameraPage);