import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    View,
    Text,
    StyleSheet
} from 'react-native';

// Import custom file(s) here.
import colors from '../styles/colors';

export default class Stars extends Component {
    stars = () => {
        const { votes, size, color } = this.props;
        const starsNumber = parseInt(votes);
        const starElements = [];
        for (let i = 0; i < 5; i++) {
            starElements.push(
                <Icon 
                    name="star"
                    size={size}
                    color={starsNumber > i ? color : colors.gray02}
                    style={styles.star}
                />
            );
        }
        return starElements;
    }

    render() {
        const { votes } = this.props;
        if (!this.stars().length) {
            return <View></View>;
        }
        
        return (
            <View style={styles.wrapper}>
                <View style={styles.stars}>
                    {this.stars()}
                    {votes ? <Text style={styles.votesNumber}>{votes}</Text> : null}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    wrapper: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    star: {
        marginRight: 1
    },
    stars: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    votesNumber: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 1,
        marginLeft: 3
    }
});