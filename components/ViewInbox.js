import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ImageBackground, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage';

import database from '@react-native-firebase/database';

import Report from './Report';
import NewFavorite from './NewFavorite';
import colors from '../assets/colors';

import { connect } from 'react-redux';

class ViewInbox extends React.Component {

    state = {
        reportMode: false,
        newFavoriteMode: false,
        starColor: 'white',
        starBorderColor: 'black',
        dislikeBorderColor: 'black',
        dislikeBackgroundColor: colors.red,
        url: '',
        responseMessage: '',
        isFavorited: false,
        isReported: false
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

    handleFavoritePress = () => {
        console.log('in handleFavoritePress')
        if (!this.state.isFavorited) {
            this.setState({
                newFavoriteMode: true
            })
        }  
    }

    handleReportPress = () => {
        console.log('in handleReportPress')
    
        if (this.state.isFavorited) {
            console.log('report rejected because already favorited')
        } else {
            this.setState({reportMode: true})
        }
    }

    cancelReport = () => {
        this.setState({reportMode: false})
    }

    closeNewFavoriteModal = () => {
        this.setState({newFavoriteMode: false})
    }

    indicateFavorite = async () => {
        let favRef = 'users/' + this.props.reduxState.userID + '/favorite';
        console.log('in indicateFavorite. favRef:', favRef)
        let favObj = {
            name: Object.keys(this.props.reduxState.userData.inbox)[0],
            url: this.props.reduxState.userData.inbox[Object.keys(this.props.reduxState.userData.inbox)[0]].url
        }
        console.log('in indicateFavorite. favObj:', favObj)
        
        await database() 
            .ref(favRef)
            .set(favObj)

        this.setState({
            isFavorited: true,
            starColor: colors.cream,
            starBorderColor: colors.cream,
            dislikeBackgroundColor: 'transparent',
            dislikeBorderColor: 'transparent'
        })
    }

    report = async () => {
        console.log('in report function')
        
        //ban user && set unban time
        let banDays = Math.floor(Math.random() * 45) + 1
        console.log('banDays:', banDays)
        let banMilliSeconds = 86400000 * banDays
        console.log('banMilliSeconds:', banMilliSeconds)
        let time = new Date().getTime()
        console.log('time:', time)
        let unbanTime = time + banMilliSeconds
        console.log('unbanTime:', unbanTime)

        let unbanTimeRef = 'users/' + this.props.reduxState.userData.inbox[Object.keys(this.props.reduxState.userData.inbox)[0]].from + '/unbanTime';
        console.log('unbanTimeRef:', unbanTimeRef)
        await database() //this could maybe be done in one database call
            .ref(unbanTimeRef)
            .set(unbanTime)

        //delete photo from Redux
        this.props.dispatch({    //dispatch is async- if it responds before the page is changed, there will be an error because the background of the page is deleted
            type: 'DELETE_IMAGE',
            payload: {
                isFavorited: this.state.isFavorited
            }
        })
        this.props.dispatch({
            type: 'SET_NOT_RESPONDING'
        })

        this.props.history.push('/camera')
    }

    componentDidMount() {
        // Set response message
        if (this.props.reduxState.userData.inbox[Object.keys(this.props.reduxState.userData.inbox)[0]].isResponse) {
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
                payload: this.props.reduxState.userData.inbox[Object.keys(this.props.reduxState.userData.inbox)[0]].from
            })
        }
        // this issue was solved long ago but I like remembering this nice note I left 
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
        return (
            <>
                <NewFavorite visible={this.state.newFavoriteMode} closeNewFavoriteModal={this.closeNewFavoriteModal} indicateFavorite={this.indicateFavorite}></NewFavorite>
                <Report visible={this.state.reportMode} cancelReport={this.cancelReport} report={this.report}></Report>
                    <TouchableWithoutFeedback onPress={this.handlePressAnywhere}>
                        <View style={{ flex: 1 }}>
                            <ImageBackground
                            style={{ flex: 1 }}
                            source={{ uri: this.props.reduxState.userData.inbox[Object.keys(this.props.reduxState.userData.inbox)[0]].url }}>
                                <View style={styles.iconContainer}>
                                    <View style={styles.topIcons}>
                                        <Text style={{fontFamily: 'Rubik-Regular', fontSize: 32, color: 'white', textAlign: 'center', marginTop: 10}}>{this.state.responseMessage}</Text>
                                    </View>
                                    <View style={styles.bottomIcons}>
                                        <TouchableOpacity
                                            style={{
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                borderColor: this.state.dislikeBorderColor,
                                                borderWidth: 0,
                                                backgroundColor: this.state.dislikeBackgroundColor,
                                                width: '14%',
                                                aspectRatio: 1,
                                                borderRadius: 10
                                            }}
                                            onPress={() => this.handleReportPress()}>
                                            <FontAwesome
                                                name='thumbs-down'
                                                style={{
                                                    color: this.state.dislikeBorderColor,
                                                    fontSize: 40
                                                }}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={{
                                                justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
                                                alignItems: 'center',
                                                borderColor: this.state.starBorderColor,
                                                borderWidth: 0,
                                                backgroundColor: colors.blue,
                                                width: '14%',
                                                aspectRatio: 1,
                                                borderRadius: 10,

                                            }}
                                            onPress={() => this.handleFavoritePress()}>
                                            <Ionicons
                                                name='md-star'
                                                style={{
                                                    color: this.state.starColor,
                                                    fontSize: 44,
                                                    paddingBottom: 1

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
    // badVibes: {
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     borderColor: this.state.dislikeBorderColor,
    //     borderWidth: 2,
    //     backgroundColor: this.state.dislikeBackgroundColor,
    //     width: '14%',
    //     aspectRatio: 1,
    //     borderRadius: 10
    // },
    // favorite: {
    //     justifyContent: Platform.OS === 'ios' ? 'flex-end' : 'center',
    //     alignItems: 'center',
    //     borderColor: this.state.starBorderColor,
    //     borderWidth: 2,
    //     backgroundColor: colors.red,
    //     width: '14%',
    //     aspectRatio: 1,
    //     borderRadius: 10
    // },
    // thumbsDownIcon: {
    //     color: this.state.dislikeBorderColor,
    //     fontSize: 40
    // },
    // favoriteIcon: {
    //     color: this.state.starColor,
    //     fontSize: 44
    // }
});
    
const mapReduxStateToProps = reduxState => ({
    reduxState
});

export default connect(mapReduxStateToProps)(ViewInbox);