import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';

export default Logout = (props) => {

    return (
        <Modal isVisible={props.isVisible} animationIn='zoomIn' animationOut='zoomOut'>
            <View style={styles.container}>
                <Text style={styles.title}>You've received a vibe!</Text>
                <Text style={styles.subtitle}>View your inbox to see it</Text>
                <TouchableOpacity 
                    onPress={() => props.setIsVisible(false)} 
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

