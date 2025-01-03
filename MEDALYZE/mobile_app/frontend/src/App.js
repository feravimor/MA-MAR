import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { LanguageProvider } from './src/context/LanguageContext';
import LoginScreen from './src/screens/LoginScreen';
import ProfessionalDashboard from './src/screens/ProfessionalDashboard';
import PatientDashboard from './src/screens/PatientDashboard';
import AppointmentsScreen from './src/screens/AppointmentsScreen';
import RewardsScreen from './src/screens/RewardsScreen';

const Stack = createNativeStackNavigator();

const App = () => {
    return (
        <LanguageProvider>
            <NavigationContainer>
                <Stack.Navigator initialRouteName="Login">
                    <Stack.Screen name="Login" component={LoginScreen} />
                    <Stack.Screen name="ProfessionalDashboard" component={ProfessionalDashboard} />
                    <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
                    <Stack.Screen name="Appointments" component={AppointmentsScreen} />
                    <Stack.Screen name="Rewards" component={RewardsScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </LanguageProvider>
    );
};

export default App;
