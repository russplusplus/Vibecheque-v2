import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import Modal from 'react-native-modal';

Notification = (props) => {

    // const [width, setWidth] = useState('')
    // const [height, setHeight] = useState('')

    closeNotification = async () => {
        props.dispatch({
            type: 'GET_INBOX'
        })
        props.setIsVisible(false)
    }

    // useEffect(() => {
    //     setWidth(Dimensions.get('window').width)
    //     setHeight(Dimensions.get('window').height)
    // })

    return (
        <Modal isVisible={props.isVisible} animationIn='zoomIn' animationOut='zoomOut'>
            <View style={styles.container}>
                <Text style={styles.title}>You've received</Text>
                <Text style={styles.title}>a vibe!</Text>
                
                {/* <Text style={styles.subtitle}>width: {width}</Text>
                <Text style={styles.subtitle}>height: {height}</Text> */}

                <TouchableOpacity 
                    onPress={() => closeNotification()} 
                    style={styles.alrightButton}>
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
        flex:1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginLeft:'5%', 
        marginRight:'5%', 
        marginTop:'40%', 
        marginBottom:'40%', 
        backgroundColor:'#FFFAAC', 
        borderWidth:2, 
        borderColor:'black', 
        borderRadius:10, 
        paddingLeft:'5%', 
        paddingRight:'5%'
    },
    title: {
        fontSize: 36, 
        textAlign: 'center', 
    },
    alrightButton: { 
        width: '75%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#9EE7FF',
        justifyContent: 'center',
        marginTop: '15%'
    },
    cancelButtonText: {
        fontSize: 30,
        textAlign: 'center'
    }
})

export default connect(mapReduxStateToProps)(Notification);