import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import database from '@react-native-firebase/database';

import Report from './Report';
import DeleteFavorite from './DeleteFavorite';

import { connect } from 'react-redux';

class Favorite extends React.Component {

    state = {
        
    }

    deleteFavorite = async () => {
        console.log('in deleteFavorite')
        // send image url to database and replace existing
        
    }

    returnToCameraPage = () => {
        this.props.history.push('/camera')
    }

    

    

    componentDidMount() {
        
    }
    
    render() {
        console.log('in render(). this.state.url:', this.state.url)
        return (
            <>
                <DeleteFavorite visible={this.state.deleteFavoriteMode} closeDeleteFavoriteModal={this.closeDeleteFavoriteModal} deleteFavorite={this.deleteFavorite}></DeleteFavorite>
                    <TouchableWithoutFeedback onPress={this.handlePressAnywhere}>
                        <View style={{ flex: 1 }}>
                            <ImageBackground
                            style={{ flex: 1 }}
                            source={{ uri: this.props.reduxState.favoriteUrl }}>
                                <View style={styles.iconContainer}>
                                    <View style={styles.topIcons}>
                                        <Text style={{fontFamily: 'Rubik-Regular', fontSize: 32, color: 'white', textAlign: 'center', marginTop: 10}}></Text>
                                    </View>
                                    <View style={styles.bottomIcons}>
                                        <TouchableOpacity
                                            style={styles.return}
                                            onPress={() => this.setState({reportMode: true})}>
                                            <FontAwesome
                                                name='thumbs-down'
                                                style={styles.thumbsDownIcon}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
                                                alignItems: 'center',
                                                borderColor: this.state.starBorderColor,
                                                borderWidth: 2,
                                                backgroundColor: '#9EE7FF',
                                                width: '14%',
                                                aspectRatio: 1,
                                                borderRadius: 10
                                            }}
                                            onPress={() => this.setState({deleteFavoriteMode: true})}>
                                            <Ionicons
                                                name='md-star'
                                                style={{
                                                    color: this.state.starColor,
                                                    fontSize: 44
                                                }}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </ImageBackground>
                        </View>
                    </TouchableWithoutFeedback>
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
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#FFFAAC',
        width: '14%',
        aspectRatio: 1,
        borderRadius: 10
    },
    // favorite: {
    //     justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
    //     alignItems: 'center',
    //     borderColor: this.state.starBorderColor,
    //     borderWidth: 2,
    //     backgroundColor: '#9EE7FF',
    //     width: '14%',
    //     aspectRatio: 1,
    //     borderRadius: 10
    // },
    thumbsDownIcon: {
        color: 'black',
        fontSize: 40
    },
    // favoriteIcon: {
    //     color: this.state.starColor,
    //     fontSize: 44
    // }
});
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(Favorite);