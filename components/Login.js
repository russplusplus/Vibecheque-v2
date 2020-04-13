import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ActivityIndicator, Button, AsyncStorage, ImageBackground, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';

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
            }})
        console.log('after dispatch')
        setIsLoginLoading(false)
        
        // Old login
        // fetch('https://murmuring-lake-71708.herokuapp.com/login', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         "username": emailInput,
        //         "password": passwordInput
        //     })
        // })
        //     .then((response) => {
        //         return response.json()
        //     })
        //     .then((myJson) => {
        //         if (myJson.errorMessage) {
        //             console.log('error:', myJson.errorMessage)
        //             setMessage(myJson.errorMessage)
        //         } else {
        //             console.log('token:', myJson)
        //             deviceStorage("access_token", myJson.access_token)
        //             props.history.push('/camera');
        //         }
                
        //     }).catch((error) => {
        //         console.log('in catch, error:', error)
        //     });
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
        }})

        // Old register
        // fetch('https://murmuring-lake-71708.herokuapp.com/register', {
        //     method: 'POST',
        //     headers: {
        //         Accept: 'application/json',
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         "username": usernameInput,
        //         "password": passwordInput
        //     })
        // })
        // .then((response) => {
        //     return response.json()
        // })
        // .then((myJson) => {
        //     setMessage(myJson.registerMessage)
        // })
    }

    return (
        <>
            <ImageBackground
                        style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}
                        source={require('../assets/Vibecheque_6.png')}>
                <Text 
                    style={{ color: '#CC375E', fontSize: 24, marginHorizontal: '15%', marginBottom: '35%', textAlign: 'center'}}>
                    {props.reduxState.loginMessage}
                </Text>
                
                <TextInput
                    style={{ marginBottom: 2, fontSize: 24, borderWidth: 2, borderColor: 'black', backgroundColor: 'white', padding: 4, width: '50%'}}
                    onChangeText={(text) => setEmailInput(text)}
                    placeholder='email'
                    keyboardType='email-address'
                    autoCapitalize='none'    
                />
                <TextInput
                    style={{ marginBottom: '2%', fontSize: 24, borderWidth: 2, borderColor: 'black', backgroundColor: 'white', padding: 4, width: '50%'}}
                    onChangeText={(text) => setPasswordInput(text)}
                    placeholder="password"
                    secureTextEntry={true}
                />
                {isLoginLoading ?
                <ActivityIndicator/> :
                <TouchableOpacity
                    onPress={login}
                    style={{ 
                        width: '30%', 
                        borderWidth: 2,
                        borderColor: 'black',
                        borderRadius: 10,
                        backgroundColor: 'transparent',
                        alignItems: 'center',
                        marginBottom: 6}}>
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
                    style={{ 
                        marginBottom: '52%',
                        width: '30%', 
                        borderWidth: 2,
                        borderColor: 'black',
                        borderRadius: 10,
                        backgroundColor: 'transparent',
                        alignItems: 'center'}}>
                    <Text
                        style={{
                            fontSize: 26}}>
                        Register
                    </Text>
                </TouchableOpacity>
                }
            </ImageBackground>
        </>
    )
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(Login);