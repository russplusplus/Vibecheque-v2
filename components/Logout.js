import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';

class Logout extends React.Component {

    render() {
        return (
            <Modal isVisible={this.props.visible} animationIn='slideInUp' animationOut='slideOutDown'>
                <View style={styles.container}>
                    <Text style={styles.text}>Log out?</Text>
                    <TouchableOpacity 
                        onPress={() => this.props.logout()} 
                        style={styles.yesButton}>
                        <Text
                            style={styles.yesButtonText}>
                            Yes
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.toggleLogoutMode()} 
                        style={styles.cancelButton}>
                        <Text
                            style={styles.cancelButtonText}>
                            Cancel
                        </Text>
                    </TouchableOpacity>                    
                </View>   
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1, 
        alignItems: 'center', 
        marginLeft: '6%', 
        marginRight: '6%', 
        marginTop: Platform.OS === 'ios' ? '55%' : '35%', 
        marginBottom: Platform.OS === 'ios' ? '45%' : '25%', 
        backgroundColor: '#FFFAAC', 
        borderWidth: 2, 
        borderColor: 'black', 
        borderRadius: 10
    },
    text: {
        fontSize: 48, 
        textAlign: 'center', 
        marginTop: '35%',
        fontFamily: 'Rubik-Regular'
    },
    yesButton: {
        width: '75%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#9EE7FF',
        justifyContent: 'center',
        marginTop: '20%',
        alignItems: 'center'
    },
    yesButtonText: {
        fontSize: 30,
        fontFamily: 'Rubik-Regular'
    },
    cancelButton: { 
        width: '75%', 
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: '#CC375E',
        justifyContent: 'center',
        marginTop: '4%',
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 30,
        fontFamily: 'Rubik-Regular'
    }
})

export default Logout;