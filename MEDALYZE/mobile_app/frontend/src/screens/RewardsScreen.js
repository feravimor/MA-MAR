import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchRewards } from '../utils/api';
import { getToken } from '../utils/auth';

const RewardsScreen = () => {
    const [rewards, setRewards] = useState([]);

    useEffect(() => {
        const loadRewards = async () => {
            const token = await getToken();
            const data = await fetchRewards(token);
            setRewards(data);
        };

        loadRewards();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Rewards</Text>
            <FlatList
                data={rewards}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.reward}>
                        <Text>{item.name} - {item.points} points</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    reward: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default RewardsScreen;
