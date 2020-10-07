import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-community/async-storage';

import database from '@react-native-firebase/database';

import Report from './Report';
import DeleteFavorite from './DeleteFavorite';

import { connect } from 'react-redux';

AntDesign.loadFont()

class Favorite extends React.Component {

    state = {
        deleteFavoriteMode: false,
        url: 'none'
    }

    deleteFavorite = async () => {
        console.log('in deleteFavorite')
        this.setState({deleteFavoriteMode: true})
    }

    closeDeleteFavoriteModal = () => {
        this.setState({deleteFavoriteMode: false})
    }

    returnToCameraPage = () => {
        this.props.history.push('/camera')
    }

    componentDidMount() {
        this.setState({
            url: JSON.stringify(this.props.reduxState.favoriteUrl).replace(/['"]+/g, '') //This is weird, but necessary because from Redux, the url comes as an object with an unknown key. The object is stringified to get the url, and the quotations are removed.
        })
    }
    
    render() {
        console.log('JSON.stringify(this.props.reduxState.favoriteUrl):', JSON.stringify(this.props.reduxState.favoriteUrl))
        //let url = JSON.stringify(this.props.reduxState.favoriteUrl)
        console.log('type of url:', typeof(this.state.url))
        console.log(this.state.url)        
        return (
            <>
                <DeleteFavorite visible={this.state.deleteFavoriteMode} closeDeleteFavoriteModal={this.closeDeleteFavoriteModal} deleteFavorite={this.deleteFavorite}></DeleteFavorite>
                <View style={{ flex: 1 }}>
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.state.url }}>
                        <View style={styles.iconContainer}>
                            <View style={styles.topIcons}>
                            </View>
                            <View style={styles.bottomIcons}>
                                <TouchableOpacity
                                    style={styles.return}
                                    onPress={this.returnToCameraPage}>
                                    <Ionicons
                                        name='md-return-left'
                                        style={styles.returnIcon}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.deleteFavorite}
                                    onPress={this.deleteFavorite}>
                                    <AntDesign
                                        name='delete'
                                        style={styles.deleteFavoriteIcon}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>

                    </ImageBackground>
                    
                </View>
            </>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 6,
        flexDirection: 'column',
        backgroundColor: 'black',
    },
    iconContainer: {
        display: 'flex',
        flex: 6, 
        flexDirection: 'column', 
        justifyContent: 'space-between',
        margin: '3%',
        marginTop: Platform.OS === 'ios' ? '8%' : '3%',
        marginBottom: Platform.OS === 'ios' ? '5%' : '3%',
    },
    topIcons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    bottomIcons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    return: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#FFFAAC',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    deleteFavorite: {
        justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#9EE7FF',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    returnIcon: {
        color: 'black',
        fontSize: 40
    },
    deleteFavoriteIcon: {
        color: 'black',
        fontSize: 34,
        marginBottom: Platform.OS === 'ios' ? '9%' : '3%'
    }
});
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(Favorite);