import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { fetchAppointments } from '../utils/api';
import { getToken } from '../utils/auth';

const AppointmentsScreen = () => {
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        const loadAppointments = async () => {
            const token = await getToken();
            const data = await fetchAppointments(token);
            setAppointments(data);
        };

        loadAppointments();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appointments</Text>
            <FlatList
                data={appointments}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.appointment}>
                        <Text>{item.date} - {item.patientName}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20 },
    title: { fontSize: 24, marginBottom: 20, textAlign: 'center' },
    appointment: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default AppointmentsScreen;
