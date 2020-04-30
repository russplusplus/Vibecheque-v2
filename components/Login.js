import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, ImageBackground, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { Image, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getPhoneNumber } from 'react-native-device-info';

import messaging from '@react-native-firebase/messaging';


const Login = props => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');

    setMessage = (message) => {
        props.dispatch({
            type: 'SET_LOGIN_MESSAGE',
            payload: message
        })
    }

    sendCode = async () => {
        console.log('in sendCode function');
        if (!phoneNumber) {
            setMessage('Please enter a valid phone number to proceed.')
            return
        }
        setIsLoginLoading(true)

        const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
        setConfirm(confirmation);
        
        
        
        // Firebase login
        // props.dispatch({
        //     type: 'LOGIN',
        //     history: props.history,
        //     payload: {
        //         email: emailInput,
        //         password: passwordInput
        //     }
        // })
        
        setIsLoginLoading(false)
    }

    confirmCode = async () => {
        try {
          await confirm.confirm(code);
          console.log('code is valid!')
          props.history.push('/camera')
        } catch (error) {
          console.log('Invalid code.');
        }
    }

    register = async () => {
        console.log('in register function');
        if (!emailInput) {
            setMessage("You're gonna need a username.")
            return
        }
        if (!passwordInput) {
            setMessage("You're gonna need a password too.")
            return
        }
        if (passwordInput.length < 6) {
            setMessage("Password must be at least six characters.")
            return
        }
        setIsRegisterLoading(true);
        // Firebase register
        props.dispatch({
            type: 'SIGN_UP',
            history: props.history,
            payload: {
                email: emailInput,
                password: passwordInput
            }
        })
        setIsRegisterLoading(false);
    }

    checkIfLoggedIn = async () => {
        try {
            const user = await AsyncStorage.getItem("user")
            console.log('user:', user)
            if (user) {
                props.history.push('/camera')
            }
        } catch (error) {
            console.log('error retrieving user info')
        }
    }

    getDevicePhoneNumber = async () => {
        let phoneNumber = await getPhoneNumber()
        console.log('phoneNumber:', phoneNumber)
        setPhoneNumber(await getPhoneNumber())
    }

    useEffect(() =>  {
        checkIfLoggedIn()
        // getDevicePhoneNumber() // this doesn't quite work yet. Should figure out later
    }, [])

    return (
        <>
            <View style={styles.container}>
                <Text 
                    style={styles.message}>
                    {props.reduxState.loginMessage}
                </Text>
                <Image source={require('../assets/Vibecheque_logo.png')} style={styles.logo}/>
                {!confirm ?
                <>    
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setPhoneNumber(text)}
                        placeholder='phone number'
                        keyboardType='phone-pad'
                        autoCapitalize='none'
                    />
                    {isLoginLoading ?
                        <ActivityIndicator/> 
                    :
                        <TouchableOpacity
                            onPress={sendCode}
                            style={styles.loginButton}>
                            <Text
                                style={{
                                    fontSize: 26}}>
                                Send Code
                            </Text>
                        </TouchableOpacity>
                    }
                </>
                :
                <>
                    <TextInput
                        style={styles.input}
                        onChangeText={text => setCode(text)}
                        placeholder='code'
                        keyboardType='visible-password'
                        autoCapitalize='none'
                    />
                    {isLoginLoading ?
                        <ActivityIndicator/> 
                    :
                        <TouchableOpacity
                            onPress={confirmCode}
                            style={styles.loginButton}>
                            <Text
                                style={{
                                    fontSize: 26}}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    }
                </>
                }
            </View>
        </>
    )
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

const styles = StyleSheet.create({
    container: { 
        flex: 1,  
        justifyContent: 'flex-start',
        alignItems: 'center', 
        backgroundColor: '#FFFAAC'
    },
    message: { 
        color: '#CC375E', 
        fontSize: 24, 
        marginHorizontal: '15%', 
        marginTop: Platform.OS === 'ios' ? '45%' : '35%', 
        textAlign: 'center',
        height: Platform.OS === 'ios' ? '10%' : '12%',
    },
    logo: {
        resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover', 
        width: '100%',
        height: '17%',
        marginTop: '5%'
    },
    input: { 
        marginBottom: 2, 
        fontSize: 24, 
        borderWidth: 2, 
        borderColor: 'black', 
        backgroundColor: 'white', 
        padding: 4, 
        width: '50%'
    },
    loginButton: {
        width: '30%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'transparent',
        alignItems: 'center',
        marginBottom: 6
    },
    registerButton: {
        width: '30%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'transparent',
        alignItems: 'center'
    }
})

export default connect(mapReduxStateToProps)(Login);