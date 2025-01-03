import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/components/Common/Login';
import RegisterScreen from './src/components/Common/Register';
import ProfessionalDashboard from './src/components/Professional/Dashboard';
import PatientDashboard from './src/components/Patient/Dashboard';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ProfessionalDashboard" component={ProfessionalDashboard} />
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
