import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Render } from '../components/Renderer';

export default function RendererDemo() {
    const data = require('../data/renderdemo.json');

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Renderer Demo</Text>
            <View style={{ flexDirection: 'row', flex: 1 }}>
                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1 }}>
                        <Text style={styles.content}>{JSON.stringify(data.data[0], null, 4)}</Text>
                    </ScrollView>
                </View>
                <View style={{ flex: 1 }}>
                    <ScrollView style={styles.scrollContainer} contentContainerStyle={{ flexGrow: 1 }}>
                        <Render data={data.data[0]} level={1} />
                    </ScrollView>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    scrollContainer: {
        flex: 1,
        height: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        borderBottomWidth: 2,
        paddingBottom: 16,
        borderBottomColor: '#aaa',
    },
    content: {
        flexGrow: 1,
    },
});