import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    KeyboardAvoidingView
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { connect } from 'react-redux';

// Import custome files here.
import * as actions from '../redux/action';
import { transparentHeaderStyle } from '../styles/navigation';
import colors from '../styles/colors';
import InputField from '../components/form/InputField';
import NextArrowButton from '../components/buttons/NextArrowButton';
import NavBarButton from '../components/buttons/NavBarButton';
import Notification from '../components/Notification';
import Loader from '../components/Loader';
import iPhoneSize from '../helpers/utils';

const size = iPhoneSize();
const headingTextSize = 34;

if (size === 'small') {
    headingTextSize = 28;
}

class LogIn extends Component {

    static navigationOptions = ({ navigation }) => ({
        headerRight: <NavBarButton
          handleButtonPress={() => navigation.navigate('ForgotPassword')}
          location="right"
          color={colors.white}
          text="Forgot Password"
        />,
        headerLeft: <NavBarButton
          handleButtonPress={() => navigation.goBack()}
          location="left"
          icon={<Icon name="angle-left" color={colors.white} size={30} />}
        />,
        headerStyle: transparentHeaderStyle,
        headerTransparent: true,
        headerTintColor: colors.white,
    });

    state = {
        formValid: true,
        validEmail: false,
        emailAddress: '',
        password: '',
        validPassword: false,
        loadingVisible: false
    };

    handleNextButton = () => {
        // Let's simulate a slow server to show notification
        this.setState({ loadingVisible: true });
        const { navigate } = this.props.navigation;

        setTimeout(() => {
            const {
                emailAddress, password
            } = this.state;
            if (this.props.logIn(emailAddress, password)) {
                this.setState({ formValid: true, loadingVisible: false });
                navigate('TurnOnNotifications');
            } else {
                this.setState({ formValid: false, loadingVisible: false });
            }
        }, 2000);
    }

    handleCloseNotification = () => {
        this.setState({ formValid: true });
    }

    handleEmailChange = (email) => {
        const emailCheckRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.setState({ emailAddress: email });

        if(!this.state.validEmail) {
            if (emailCheckRegex.test(email)) {
                this.setState({ validEmail: true });
            }
        } else if(!emailCheckRegex.test(email)) {
            this.setState({ validEmail: false })
        }
    }

    handlePasswordChange = (password) => {
        this.setState({ password });

        if (!this.state.validPassword) {
            if (password.length > 4) {
                // Password has to be at least 4 characters long
                this.setState({ validPassword: true });
            }
        } else if (password.length <= 4) {
            this.setState({ validPassword: false })
        }
    }

    toggleNextButtonState = () => {
        const { validEmail, validPassword } = this.state;
        if (validEmail && validPassword) {
            return false;
        }
        return true;
    }

    render() {
        const { 
            formValid, 
            loadingVisible,
            validEmail,
            validPassword  
        } = this.state;
        const showNotification = formValid ? false : true;
        const background = formValid ? colors.green01 : colors.darkOrange;
        const notificationMarginTop = showNotification ? 10 : 0;

        //console.log(this.props.loggedInStatus);

        return (
            <KeyboardAvoidingView 
                style={[{ backgroundColor: background }, styles.wrapper]}
                behavior="padding"
                enabled
            >
                <View style={styles.scrollViewWrapper}>
                    <ScrollView style={styles.scrollView}>
                        <Text style={styles.loginHeader}>Log In</Text>
                        <InputField 
                            labelText="EMAIL ADDRESS"
                            labelTextSize={14}
                            labelColor={colors.white}
                            textColor={colors.white}
                            borderBottomColor={colors.white}
                            inputType="email"
                            customStyle={{ marginBottom: 30 }}
                            onChangeText={this.handleEmailChange}
                            showCheckmark={validEmail}
                            autoFocus={true}
                        />
                        <InputField 
                            labelText="PASSWORD"
                            labelTextSize={14}
                            labelColor={colors.white}
                            textColor={colors.white}
                            borderBottomColor={colors.white}
                            inputType="password"
                            customStyle={{ marginBottom: 30 }}
                            onChangeText={this.handlePasswordChange}
                            showCheckmark={validPassword}
                        />
                    </ScrollView>
                    <NextArrowButton 
                        handleNextButton={this.handleNextButton}
                        disabled={this.toggleNextButtonState()}
                    />
                    </View>
                    {
                        /*
                            <View style={styles.nextButton}>
                                <NextArrowButton .../>  
                            </View>
                        */
                    }    
                    <View style={[styles.notificationWrapper, { marginTop: notificationMarginTop }]}>
                        <Notification 
                            showNotification={ showNotification }
                            handleCloseNotification={this.handleCloseNotification}
                            type="Error"
                            firstLine="Those credentials don't look right."
                            secondLine="Please try again."
                        />
                    </View>
                    <Loader 
                        animationType="fade"
                        modalVisible={loadingVisible}
                    />
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        display: 'flex',
        flex: 1
    },
    scrollViewWrapper: {
        marginTop: 70,
        flex: 1,
        padding: 0,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
    scrollView: {
        paddingLeft: 30,
        paddingRight: 30,
        paddingTop: 20,
        flex: 1
    },
    loginHeader: {
        fontSize: headingTextSize,
        color: colors.white,
        fontWeight: '300',
        marginBottom: 40
    },
    /*
    nextButton: {
        alignItems: 'flex-end',
        right: 20,
        bottom: 20
    },
    */
    notificationWrapper: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0
    }
});

const mapStateToProps = (state) => {
    return {
        loggedInStatus: state.loggedInStatus
    }
};

export default connect(mapStateToProps, actions)(LogIn);