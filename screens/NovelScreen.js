import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

class NovelScreen extends Component {
    constructor(props) {
        super(props);
        const { novelData } = props.route.params;
        this.state = {
            contentList: novelData || [],
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.text}>Shop Screen</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 20,
    }
});

export default NovelScreen;