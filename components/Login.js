import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, ImageBackground, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import { Dimensions } from 'react-native';

const Login = props => {

    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [registerMode, setRegisterMode] = useState(false);
    const [isRegisterLoading, setIsRegisterLoading] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);

    setMessage = (message) => {
        props.dispatch({
            type: 'SET_LOGIN_MESSAGE',
            payload: message
        })
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

    useEffect(() =>  {
        checkIfLoggedIn()
    }, [])

    return (
        <>
            <View
                style={{ flex: 1,  alignItems: 'center', backgroundColor: '#FFFAAC' }}
                >
                <Text 
                    style={styles.message}>
                    {props.reduxState.loginMessage}
                </Text>
                <Image source={require('../assets/Vibecheque_logo.png')} style={styles.logo}/>
                <TextInput
                    style={styles.emailInput}
                    onChangeText={(text) => setEmailInput(text)}
                    placeholder='email'
                    keyboardType='email-address'
                    autoCapitalize='none'    
                />
                <TextInput
                    style={styles.passwordInput}
                    onChangeText={(text) => setPasswordInput(text)}
                    placeholder="password"
                    secureTextEntry={true}
                />
                {isLoginLoading ?
                <ActivityIndicator/> :
                <TouchableOpacity
                    onPress={login}
                    style={styles.loginButton}>
                    <Text
                        style={{
                            fontSize: 26}}>
                        Login
                    </Text>
                </TouchableOpacity>
                }
                {isRegisterLoading ?
                <ActivityIndicator/> :
                <TouchableOpacity
                    onPress={register}
                    style={styles.registerButton}>
                    <Text
                        style={{
                            fontSize: 26}}>
                        Register
                    </Text>
                </TouchableOpacity>
                }
            </View>
        </>
    )
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

const styles = StyleSheet.create({
    message: { 
        color: '#CC375E', 
        fontSize: 24, 
        marginHorizontal: '15%', 
        marginTop: '40%', 
        textAlign: 'center',
        height: '10%'
    },
    logo: {
        resizeMode: 'contain', 
        width: '100%', 
        height: '17%',
        marginTop: '5%'
    },
    emailInput: { 
        marginBottom: 2, 
        fontSize: 24, 
        borderWidth: 2, 
        borderColor: 'black', 
        backgroundColor: 'white', 
        padding: 4, 
        width: '50%'
    },
    passwordInput: { 
        marginBottom: '2%', 
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
        marginBottom: '52%',
        width: '30%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: 'transparent',
        alignItems: 'center'
    }
})

export default connect(mapReduxStateToProps)(Login);