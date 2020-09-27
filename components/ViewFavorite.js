import React, { Component, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import database from '@react-native-firebase/database';

import Report from './Report';
import DeleteFavorite from './DeleteFavorite';

import { connect } from 'react-redux';

class ViewFavorite extends Component {
    state = {
        deleteFavoriteMode: false,
        image: { uri: this.props.reduxState.favoriteUrl }
    }

    render() {
        console.log('this.props.reduxState:', this.props.reduxState)
        return (
            <View style={{ flex: 1 }}>
                <ImageBackground
                style={{ flex: 1 }}
                source={this.state.image}>
                </ImageBackground>
            </View>
        )
    }
}

const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewFavorite);