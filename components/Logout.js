import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground, Modal } from 'react-native';

class Logout extends React.Component {

    render() {
        return (
            <Modal visible={this.props.visible} animationType='slide' transparent={true}>
                <View style={{flex:1, alignItems: 'center', marginLeft:20, marginRight:20, marginTop:120, marginBottom:120, backgroundColor:'#FFFAAC', borderWidth:2, borderColor:'black', borderRadius:10}}>
                        <Text style={{fontSize:48, textAlign:'center', marginTop:120}}>Log out?</Text>
                        <TouchableOpacity 
                            onPress={() => this.props.logout()} 
                            style={{ 
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: '#9EE7FF',
                                justifyContent: 'center',
                                marginTop: 50}}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                Yes
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            onPress={() => this.props.closeLogoutModal()} 
                            style={{ 
                                width: '75%', 
                                borderWidth: 2,
                                borderColor: 'black',
                                borderRadius: 10,
                                backgroundColor: '#CC375E',
                                justifyContent: 'center',
                                marginTop: 10}}>
                            <Text
                                style={{
                                    fontSize: 26,
                                    textAlign: 'center'}}>
                                Cancel
                            </Text>
                        </TouchableOpacity>                    
                </View>  
            </Modal>
        )
    }
}

export default Logout;