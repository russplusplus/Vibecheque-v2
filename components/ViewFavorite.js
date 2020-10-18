import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback, Platform } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import database from '@react-native-firebase/database';

import Report from './Report';
import DeleteFavorite from './DeleteFavorite';

import { connect } from 'react-redux';

AntDesign.loadFont()

class Favorite extends React.Component {

    state = {
        deleteFavoriteMode: false,
        //url: 'none'
    }

    deleteFavorite = async () => {
        console.log('in deleteFavorite')
        this.setState({ deleteFavoriteMode: true} )
    }

    closeDeleteFavoriteModal = () => {
        this.setState({deleteFavoriteMode: false})
    }

    returnToCameraPage = () => {
        this.props.history.push('/camera')
    }

    componentDidMount() {
        console.log('in ViewFavorite comonentDidMount.', String(this.props.reduxState.favoriteUrl._ref))
        console.log('type:', typeof(this.props.reduxState.favoriteUrl))
    }
    
    render() {
        // console.log('this.props.reduxState.favoriteUrl:', this.props.reduxState.favoriteUrl._ref)
        // console.log('type of url:', typeof(this.props.reduxState.favoriteUrl))
        // console.log('this should be the url:', this.props.reduxState.favoriteUrl._ref)        
        
        // The below problem was solved. Firebase attached hidden metadata to database objects it returns. The actual data is nested two levels deeper in the object.
        //
        // This is an interesting problem that I do not understand at all, but accessing the '_ref' attribute of the object 
        // returns what should be returned from the 'url' attribute. If the object (this.props.reduxState.favoriteUrl) is 
        // logged, it appears normal with attributes as intended. However, the values of these attributes return undefined
        // when trying to access them with the intended keys. Looping through the object and exposing the true keys provided
        // a solution to the problem, but it is still shrouded in mystery...
        //


        // for (let key in this.props.reduxState.favoriteUrl) {
        //     console.log('key:', key)
        //     console.log('value:', this.props.reduxState.favoriteUrl[key])
        // }
        return (
            <>
                <DeleteFavorite visible={this.state.deleteFavoriteMode} closeDeleteFavoriteModal={this.closeDeleteFavoriteModal} returnToCameraPage={this.returnToCameraPage}></DeleteFavorite>
                <View style={{ flex: 1 }}>
                    <ImageBackground
                    style={{ flex: 1 }}
                    source={{ uri: this.props.reduxState.favoriteUrl.url }}>
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
        backgroundColor: '#CC375E',
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