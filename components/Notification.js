import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';
import functions from '@react-native-firebase/functions';
import messaging from '@react-native-firebase/messaging';

Notification = (props) => {

    getInbox = async (registrationToken) => {
        let response = await functions().httpsCallable('updateInbox')({registrationToken})
        //console.log('response:', response)
        console.log('updated inbox length:', response.data.length)
        props.dispatch({
            type: 'SET_INBOX',
            payload: response.data
        })   
    }

    closeNotification = async () => {
        let registrationToken = await messaging().getToken() //see if this slows it down. then try getting rid of useState
        console.log('registrationToken:', registrationToken)
        getInbox(registrationToken)
        props.setIsVisible(false)
    }

    return (
        <Modal isVisible={props.isVisible} animationIn='zoomIn' animationOut='zoomOut'>
            <View style={styles.container}>
                <Text style={styles.title}>You've received a vibe!</Text>
                <Text style={styles.subtitle}>View your inbox to see it</Text>
                <TouchableOpacity 
                    onPress={() => closeNotification()} 
                    style={styles.cancelButton}>
                    <Text
                        style={styles.cancelButtonText}>
                        Alright!
                    </Text>
                </TouchableOpacity>                    
            </View>   
        </Modal>
    )
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        alignItems: 'center', 
        marginLeft: '6%', 
        marginRight: '6%', 
        marginTop: Platform.OS === 'ios' ? '55%' : '45%', 
        marginBottom: Platform.OS === 'ios' ? '55%' : '45%', 
        backgroundColor: '#FFFAAC', 
        borderWidth: 2, 
        borderColor: 'black', 
        borderRadius: 10
    },
    title: {
        fontSize: 44, 
        textAlign: 'center', 
        marginTop: '15%'
    },
    subtitle: {
        fontSize: 30, 
        textAlign: 'center', 
    },
    yesButton: {
        width: '75%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#9EE7FF',
        justifyContent: 'center',
        marginTop: '20%'
    },
    yesButtonText: {
        fontSize: 30,
        textAlign: 'center'
    },
    cancelButton: { 
        width: '75%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#CC375E',
        justifyContent: 'center',
        marginTop: '4%'
    },
    cancelButtonText: {
        fontSize: 30,
        textAlign: 'center'
    }
})

export default connect(mapReduxStateToProps)(Notification);