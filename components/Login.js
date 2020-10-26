import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, ImageBackground, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { connect } from 'react-redux';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { Image, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { getPhoneNumber } from 'react-native-device-info';

import messaging from '@react-native-firebase/messaging';
import database from '@react-native-firebase/database';
import { absoluteFill } from 'react-native-extended-stylesheet';

const Login = props => {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [confirm, setConfirm] = useState(null);
    const [code, setCode] = useState('');
    const [loginMode, setLoginMode] = useState('');
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

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

        try {   
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
            setConfirm(confirmation);
        } catch {
            console.log('Error. Text not sent')
        }
        
        setIsLoginLoading(false);
    }

    confirmCode = async () => {
        try {
          let user = await confirm.confirm(code);
          console.log('code is valid! user:', user)
          updateRegistrationToken(user)
          await AsyncStorage.setItem("user", JSON.stringify(user))
          setMessage('')
          props.history.push('/camera')
        } catch (error) {
          console.log('Invalid code.');
          setMessage('Invalid code.')
        }
    }

    login = async () => {
        console.log('in login function');
        if (!emailInput && !passwordInput) {
            setMessage('Please enter an email address and a password to proceed.')
            return
        }
        if (!emailInput || !passwordInput) {
            setMessage('Please enter an email address AND a password to proceed.')
            return
        }
        setIsLoginLoading(true)

        // Firebase login
        props.dispatch({
            type: 'LOGIN',
            history: props.history,
            payload: {
                email: emailInput,
                password: passwordInput
            }
        })
        
        setIsLoginLoading(false)
    }

    register = async () => {
        console.log('in register function');
        if (!emailInput) {
            setMessage("We're gonna need an email address.")
            return
        }
        if (!passwordInput) {
            setMessage("You should probably set a password too.")
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
            const user = JSON.parse(await AsyncStorage.getItem("user"))
            console.log('in checkIfLoggedIn. user.uid:', user.uid)
            if (user) {
                updateRegistrationToken(user)
                props.history.push('/camera')
            }
        } catch (error) {
            console.log('error retrieving user info')
        }
    }

    updateRegistrationToken = async (user) => {
        console.log('in updateRegistrationToken', user)
        console.log('user.uid:', user.uid)
        let registrationToken = await messaging().getToken()
        console.log('updateRegistrationToken token:', registrationToken)
        await database()
            .ref(`/users/${user.uid}`)
            .update({
                registrationToken: registrationToken
            })
    }

    back = () => {
        setMessage('')
        setIsRegisterLoading(false)
        setIsLoginLoading(false)
        setConfirm(null)
        setLoginMode('')
    }

    useEffect(() =>  {
        checkIfLoggedIn()
        console.log('loginMode:', loginMode)
        // getDevicePhoneNumber() // this doesn't quite work yet. Should figure out later
    }, [])

    if (loginMode === '') {
        return (
            <>
                <View style={styles.container}>
                    <Text 
                        style={styles.message}>
                        {props.reduxState.loginMessage}
                    </Text>
                    <Image source={require('../assets/Vibecheque_logo.png')} style={styles.logo}/>
                    <View style={styles.menuContainer}>
                        <TouchableOpacity
                            onPress={() => setLoginMode('phoneNumber')}
                            style={styles.wideButton}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontFamily: 'Rubik-Regular'
                                }}>
                                Continue with phone number
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setLoginMode('email')}
                            style={styles.wideButton}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontFamily: 'Rubik-Regular'
                                }}>
                                Continue with email
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </>
        )
    } else if (loginMode === 'email') {
        return (
            <>
                <View style={styles.container}>
                    <Text 
                        style={styles.message}>
                        {props.reduxState.loginMessage}
                    </Text>
                    <Image source={require('../assets/Vibecheque_logo.png')} style={styles.logo}/>
                    
                    <View style={styles.menuContainer}>
                    
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setEmailInput(text)}
                            placeholder='email'
                            keyboardType='email-address'
                            autoCapitalize='none'
                        />
                        <TextInput
                            style={styles.input}
                            onChangeText={(text) => setPasswordInput(text)}
                            placeholder="password"
                            secureTextEntry={true}
                        />
                        <TouchableOpacity
                            onPress={login}
                            style={styles.regularButton}>
                            {isLoginLoading ?
                                <ActivityIndicator
                                    size={30}
                                    style={styles.wheel}
                                    color='black'
                                /> 
                            :
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Rubik-Regular'
                                    }}>
                                    Login
                                </Text>
                            }
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={register}
                            style={styles.regularButton}>
                            {isRegisterLoading ? 
                                <ActivityIndicator
                                    size={30}
                                    style={styles.wheel}
                                    color='black'
                                /> 
                            :
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Rubik-Regular'
                                    }}>
                                    Register
                                </Text>
                            }  
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => back()}
                            style={styles.backButton}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontFamily: 'Rubik-Regular'
                                }}>
                                Back
                            </Text>
                        </TouchableOpacity>
                        
                    </View>

                </View>
            </>
        )
    } else {
        return (
            <>
                <View style={styles.container}>
                    <Text 
                        style={styles.message}>
                        {props.reduxState.loginMessage}
                    </Text>
                    <Image source={require('../assets/Vibecheque_logo.png')} style={styles.logo}/>

                    <View style={styles.menuContainer}>    

                    {!confirm ?
                    <>    
                        <TextInput
                            style={styles.input}
                            onChangeText={text => setPhoneNumber(text)}
                            placeholder='phone number'
                            keyboardType='phone-pad'
                            autoCapitalize='none'
                        />
                        <TouchableOpacity
                            onPress={sendCode}
                            style={styles.regularButton}>
                            {isLoginLoading ? 
                                <ActivityIndicator
                                    size={30}
                                    style={styles.wheel}
                                    color='black'
                                /> 
                            :
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Rubik-Regular'
                                    }}>
                                    Send Code
                                </Text>
                            }
                        </TouchableOpacity>
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
                        <TouchableOpacity
                            onPress={confirmCode}
                            style={styles.regularButton}>
                            {isLoginLoading ?
                                <ActivityIndicator
                                    size={30}
                                    style={styles.wheel}
                                    color='black'
                                /> 
                            :
                                <Text
                                    style={{
                                        fontSize: 20,
                                        fontFamily: 'Rubik-Regular'
                                    }}>
                                    Login
                                </Text>
                            }
                        </TouchableOpacity>
                    </>
                    }
                    <TouchableOpacity
                        onPress={() => back()}
                        style={styles.backButton}>
                        <Text
                            style={{
                                fontSize: 20,
                                fontFamily: 'Rubik-Regular'
                            }}>
                            Back
                        </Text>
                    </TouchableOpacity>

                    </View>

                </View>
            </>
        )
    }
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

const styles = StyleSheet.create({
    container: { 
        flex: 1,  
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: '#FFFAAC',
    },
    menuContainer: {
        flex: 1,  
        position: 'absolute',
        top: '55%',
        justifyContent: 'center',
        alignItems: 'center', 
        backgroundColor: 'transparent',
        width: '100%'
    },
    message: {
        position: 'absolute',
        top: '25%',
        color: '#CC375E', 
        fontSize: 20, 
        marginHorizontal: '15%', 
        //marginTop: Platform.OS === 'ios' ? '45%' : '35%', 
        textAlign: 'center',
        height: Platform.OS === 'ios' ? '10%' : '12%',
        fontFamily: 'Rubik-Regular'
    },
    logo: {
        resizeMode: Platform.OS === 'ios' ? 'contain' : 'cover', 
        position: 'absolute',
        top: '35%',
        width: '100%',
        height: '18%', // 17% cuts off the q on android and 19% makes the logo wider on android
        //marginTop: '5%',
        marginBottom: '5%'
    },
    input: { 
        marginBottom: 2, 
        fontSize: 20, 
        borderWidth: 2, 
        borderColor: 'black', 
        backgroundColor: 'white', 
        padding: 4, 
        width: '75%',
        marginBottom: '3%',
        fontFamily: 'Rubik-Regular'
    },
    regularButton: {
        width: '50%', 
        height: 40,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    backButton: {
        width: '35%', 
        height: 40,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '10%'
    },
    wideButton: {
        width: '80%',
        height: 40, 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
        //marginBottom: 6
    },
    registerButton: {
        width: '30%', 
        height: 40,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6
    },
    wheel: {
        alignSelf: 'center',
        transform: Platform.OS === 'ios' ? [{ scale: 2 }] : [{ scale: 1 }]
    },
})

export default connect(mapReduxStateToProps)(Login);