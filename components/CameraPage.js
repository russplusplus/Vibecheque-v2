import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, AsyncStorage, Platform, TouchableOpacity, ImageBackground } from 'react-native';

import { connect } from 'react-redux';

const CameraPage = props => {

    return (
        <>
            <Text>Camera Page</Text>
        </>
    )

}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(CameraPage);