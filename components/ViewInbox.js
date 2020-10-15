import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import database from '@react-native-firebase/database';

import Report from './Report';
import NewFavorite from './NewFavorite';

import { connect } from 'react-redux';

class ViewInbox extends React.Component {

    state = {
        reportMode: false,
        newFavoriteMode: false,
        starColor: 'white',
        starBorderColor: 'black',
        url: '',
        responseMessage: '',
        isFavorited: false
    }
    
    handlePressAnywhere = () => {
        
        //if the recieved image is not a response, prepare for responding by dispatching to redux
        // if (!this.props.reduxState.inbox[0].is_response) {
        //     this.props.dispatch({                 //still need to test if this works
        //         type: 'SET_RESPONDING',
        //         payload: { senderId: senderId }
        //     })
        // }
        
        //console.log('senderId:', this.props.reduxState.senderId)

        this.props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE',
            payload: {
                isFavorited: this.state.isFavorited
            }
        }) // maybe we could shift the redux inbox here so it's updated right when history is pushed. It would redundantly reload but that might not be a problem
        this.props.history.push('/camera')
    }

    handleReportPress = () => {
        console.log('in handleReportPress')
    }

    handleFavoritePress = () => {
        console.log('in handleFavoritePress')
        if (!this.state.isFavorited) {
            this.setState({
                newFavoriteMode: true
            })
        }  
    }

    cancelReport = () => {
        this.setState({reportMode: false})
    }

    closeNewFavoriteModal = () => {
        this.setState({newFavoriteMode: false})
    }

    returnToCameraPage = () => {
        this.props.history.push('/camera')
    }

    indicateFavorite = async () => {
        // send this to the db this.props.reduxState.inbox[0].url

        // we might need to store the filename (timestamp) rather than the url, as it is
        // unclear how long the urls last

        let urlRef = 'users/' + JSON.parse(await AsyncStorage.getItem('user')).uid + '/favorite/url';
        let nameRef = 'users/' + JSON.parse(await AsyncStorage.getItem('user')).uid + '/favorite/name';
        // console.log('urlRef:', urlRef)
        // console.log('nameRef:', nameRef)
        // console.log('this.props.reduxState.inbox[0].url:', this.props.reduxState.inbox[0].url)
        await database()
            .ref(urlRef)
            .set(this.props.reduxState.inbox[0].url)
        await database()
            .ref(nameRef)
            .set(this.props.reduxState.inbox[0].imageName)
        this.setState({
            isFavorited: true,
            starColor: '#FFFAAC',
            starBorderColor: '#FFFAAC'
        })
    }

    

    componentDidMount() {
        // console.log('in ViewInbox componentDidMount')
        // console.log('reduxState.inbox:', this.props.reduxState.inbox)
        //console.log('this.props.reduxState.inbox[0]:'. this.props.reduxState.inbox[0])

        // Set response message
        if (this.props.reduxState.inbox[0].isResponse) {
            this.setState({
                responseMessage: 'Response'
            })
            this.props.dispatch({
                type: 'SET_NOT_RESPONDING'
            })
        } else {
            this.setState({
                responseMessage: ''
            })
            // Set recipient if image is not response
            this.props.dispatch({
                type: 'SET_RESPONDING_TO',
                payload: this.props.reduxState.inbox[0].from
            })
        }

        
        // if (this.props.reduxState.inbox[0].is_response) {
        //     this.setState({responseMessage: 'Response'})
        // }

        //Russ,
        //
        //You need to figure out how to get isResponding from the image.
        //Right now, redux has an array of image names and the url of the
        //first image in the queue. However, since we're gonna need the 
        //isResponse boolean from each image too, it might be best to 
        //change the array of strings to an array of objects, with all
        //the data we'll need for each image. Maybe in the cameraPage 
        //componentDidMount we could load the url for the first image
        //in the queue. But maybe you'll think of a better way.
        //
        //Goodnight,
        //
        //Russ
    }
    
    render() {
        // console.log('in render(). this.state.url:', this.state.url)
        // console.log('this.props.reduxState.inbox[0].url:', this.props.reduxState.inbox[0].url)
        return (
            <>
                <NewFavorite visible={this.state.newFavoriteMode} closeNewFavoriteModal={this.closeNewFavoriteModal} indicateFavorite={this.indicateFavorite}></NewFavorite>
                <Report visible={this.state.reportMode} cancelReport={this.cancelReport} returnToCameraPage={this.returnToCameraPage}></Report>
                    <TouchableWithoutFeedback onPress={this.handlePressAnywhere}>
                        <View style={{ flex: 1 }}>
                            <ImageBackground
                            style={{ flex: 1 }}
                            source={{ uri: this.props.reduxState.inbox[0].url }}>
                                <View style={styles.iconContainer}>
                                    <View style={styles.topIcons}>
                                        <Text style={{fontFamily: 'Rubik-Regular', fontSize: 32, color: 'white', textAlign: 'center', marginTop: 10}}>{this.state.responseMessage}</Text>
                                    </View>
                                    <View style={styles.bottomIcons}>
                                        <TouchableOpacity
                                            style={styles.badVibes}
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
                                            onPress={() => this.handleFavoritePress()}>
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
    badVibes: {
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderWidth: 2,
        backgroundColor: '#CC375E',
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

export default connect(mapReduxStateToProps)(ViewInbox);