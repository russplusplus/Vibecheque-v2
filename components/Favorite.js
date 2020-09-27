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
        deleteFavoriteMode: false
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
        //console.log('history:', this.props.history)
    }
    
    render() {
        console.log('in render(). this.props.reduxState.favoriteUrl:', this.props.reduxState.favoriteUrl.url)
        return (
            <>
                <DeleteFavorite visible={this.state.deleteFavoriteMode} closeDeleteFavoriteModal={this.closeDeleteFavoriteModal} deleteFavorite={this.deleteFavorite}></DeleteFavorite>
                <View style={{ flex: 1 }}>
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/vibecheque-543ff.appspot.com/o/images%2F1597008785959?alt=media&token=4eddc06e-f9a6-42a4-9328-8e0a722908fb' }}>
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
    // favoriteIcon: {
    //     color: this.state.starColor,
    //     fontSize: 44
    // }
});
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(Favorite);