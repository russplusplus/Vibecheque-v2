import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import { Switch } from 'react-native-switch';
import colors from '../assets/colors';
import { connect } from 'react-redux';

class Settings extends React.Component {

    state = {
        settings: this.props.reduxState.userData.settings
    }

    componentDidMount() {
        console.log('settings:', this.state.settings)
        console.log('typeOf location:', typeOf(this.state.settings.location))
    }

    render() {
        return (
            <Modal isVisible={this.props.visible} animationIn='slideInDown' animationOut='slideOutUp'>
                <View style={styles.container}>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}>Location:</Text>
                        <Switch 
                            // value={this.state.settings.location}
                            onValueChange={(val) => console.log(val)}
                        ></Switch>
                        {/* <Text style={styles.setting}>{this.state.settings.location ? 'On' : 'Off'}</Text> */}
                    </View>
                    {this.state.settings.location ? 
                        <View style={styles.settingRow}>
                            <Text style={styles.setting}>Location:</Text>
                            {/* <Text style={styles.setting}>{this.state.settings.location ? 'On' : 'Off'}</Text> */}
                        </View>
                    :
                        <View></View>
                    }
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}>Location:</Text>
                        {/* <Text style={styles.setting}>{this.state.settings.location ? 'On' : 'Off'}</Text> */}
                    </View>

                    <TouchableOpacity 
                        onPress={() => this.props.toggleSettingsMode()} 
                        style={styles.yesButton}>
                        <Text
                            style={styles.yesButtonText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.props.toggleSettingsMode()} 
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
        justifyContent: 'center', 
        marginLeft: '5%', 
        marginRight: '5%', 
        marginTop: '40%', 
        marginBottom: '40%', 
        backgroundColor: colors.cream, 
        borderWidth: 0, 
        borderColor: 'black', 
        borderRadius: 10, 
        paddingLeft: '5%', 
        paddingRight: '5%'
    },
    title: {
        fontSize: 36, 
        textAlign: 'center', 
        fontFamily: 'Rubik-Regular',
        paddingBottom: '20%'
    },
    settingRow: {
        width: '75%',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    setting: {
        display: 'flex',
        fontSize: 26,
        textAlign: 'left',
        fontFamily: 'Rubik-Regular'
    },
    yesButton: {
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.blue,
        justifyContent: 'center',
        marginTop: '20%',
        alignItems: 'center'
    },
    yesButtonText: {
        fontSize: 26,
        fontFamily: 'Rubik-Regular'
    },
    cancelButton: { 
        width: '75%',
        height: 40,
        borderWidth: 0,
        borderColor: 'black',
        borderRadius: 10,
        backgroundColor: colors.red,
        justifyContent: 'center',
        marginTop: 10,
        alignItems: 'center'
    },
    cancelButtonText: {
        fontSize: 26,
        fontFamily: 'Rubik-Regular'
    }
})

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(Settings);