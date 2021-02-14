import React from 'react';
import { View, Text, TextInput, StyleSheet, Button, Platform, TouchableOpacity, ImageBackground } from 'react-native';
import Modal from 'react-native-modal';
import { Switch } from 'react-native-switch';
import colors from '../assets/colors';
import { connect } from 'react-redux';
import database from '@react-native-firebase/database';

class Settings extends React.Component {

    toggleLeftHandedMode = (val) => {
        console.log('in toggleLeftHandedMode. val:', val)
        this.props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: {
                ...this.props.reduxState.newSettings,
                leftHandedMode: val
            }
        })
    }

    toggleLocation = (val) => {
        console.log('in toggleLocation. val:', val)
        this.props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: {
                ...this.props.reduxState.newSettings,
                location: val
            }
        })
    }

    saveSettings = async () => {
        console.log('in saveSettings')

        // update database
        await database()
            .ref(`users/${this.props.reduxState.userID}/settings`)
            .set(this.props.reduxState.newSettings)

        // update redux userData, rather than doing another GET_USER_DATA
        await this.props.dispatch({
            type: 'SET_USER_DATA',
            payload: {
                ...this.props.reduxState.userData,
                settings: this.props.reduxState.newSettings
            }
        })
        this.props.toggleSettingsMode()
    }

    cancel = async () => {
        await this.props.dispatch({
            type: 'SET_NEW_SETTINGS',
            payload: this.props.reduxState.userData.settings
        })
        this.props.toggleSettingsMode()
    }

    componentDidMount() {
       
    }

    render() {
        return (
            <Modal isVisible={this.props.visible} animationIn='slideInDown' animationOut='slideOutUp'>
                <View style={styles.container}>
                    <Text style={styles.title}>Settings</Text>
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}>Left-handed mode:</Text>
                        <Switch 
                            value={this.props.reduxState.newSettings.leftHandedMode}
                            onValueChange={(val) => this.toggleLeftHandedMode(val)}
                            switchWidthMultiplier={2.2} // multipled by the `circleSize` prop to calculate total width of the Switch
                            switchLeftPx={4} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                            switchRightPx={4} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                            backgroundActive={colors.green}
                            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                            outerCircleStyle={styles.outerCircle} // style for outer animated circle
                            renderActiveText={true}
                            renderInActiveText={true}
                            useNativeDriver={true}
                        ></Switch>
                    </View>
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}>Location:</Text>
                        <Switch 
                            value={this.props.reduxState.newSettings.location}
                            onValueChange={(val) => this.toggleLocation(val)}
                            switchWidthMultiplier={2.2} // multipled by the `circleSize` prop to calculate total width of the Switch
                            switchLeftPx={4} // denominator for logic when sliding to TRUE position. Higher number = more space from RIGHT of the circle to END of the slider
                            switchRightPx={4} // denominator for logic when sliding to FALSE position. Higher number = more space from LEFT of the circle to BEGINNING of the slider
                            backgroundActive={colors.green}
                            innerCircleStyle={{ alignItems: "center", justifyContent: "center" }} // style for inner animated circle for what you (may) be rendering inside the circle
                            outerCircleStyle={styles.outerCircle} // style for outer animated circle
                            renderActiveText={true}
                            renderInActiveText={true}
                            useNativeDriver={true}
                        ></Switch>
                    </View>
                    {this.props.reduxState.newSettings.location ?
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}>Max distance:</Text>
                        
                    </View>
                    :
                    <View style={styles.settingRow}>
                        <Text style={styles.setting}> </Text>
                    </View>
                    }
                    <TouchableOpacity 
                        onPress={() => this.saveSettings()} 
                        style={styles.yesButton}>
                        <Text
                            style={styles.yesButtonText}>
                            Save
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        onPress={() => this.cancel()} 
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
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        //borderWidth: 2,
        paddingLeft: 0,
        paddingBottom: 10
    },
    setting: {
        display: 'flex',
        fontSize: 20,
        textAlign: 'left',
        fontFamily: 'Rubik-Regular'
    },
    outerCircle: {
        paddingRight: 0,
        margin: 0,
        //borderWidth: 2,
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