import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';

class Logout extends React.Component {

    render() {
        return (
            <Modal visible={this.props.visible} animationType='slide' transparent={true}>
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
                        onPress={() => this.props.setIsLogoutMode()} 
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
        marginTop: '25%', 
        marginBottom: '25%', 
        backgroundColor: '#FFFAAC', 
        borderWidth: 3, 
        borderColor: 'black', 
        borderRadius: 10
    },
    text: {
        fontSize: 48, 
        textAlign: 'center', 
        marginTop: '35%'
    },
    yesButton: {
        width: '75%', 
        borderWidth: 3,
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
        borderWidth: 3,
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

export default Logout;