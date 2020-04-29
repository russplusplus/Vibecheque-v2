import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

class Logout extends React.Component {

    render() {
        return (
            <Modal visible={this.props.visible} animationType='flip'>
                <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.props.capturedImageUri }}>
                    <View style={styles.iconContainer}>
                        <View style={styles.bottomIcons}>
                            <TouchableOpacity onPress={this.props.toggleReviewMode} style={styles.cancel}>
                                <Ionicons
                                    name='md-close'
                                    style={styles.cancelIcon}
                                />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.props.sendImage} style={styles.sendImage}>
                                <Ionicons
                                    name='md-send'
                                    style={styles.sendImageIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </ImageBackground> 
            </Modal>
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
        justifyContent: 'flex-end',
        margin: '3%',
        marginTop: Platform.OS === 'ios' ? '8%' : '3%'
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    cancel: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#FFFAAC',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    sendImage: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#9EE7FF',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    cancelIcon: {
        color: 'black',
        fontSize: 44,
        
        // borderWidth: 2,
        // borderColor: 'black'
    },
    sendImageIcon: {
        color: 'white',
        fontSize: 44
    }
})

export default Logout;