import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screens/Login';
import ProfessionalDashboard from './src/screens/ProfessionalDashboard';
import PatientDashboard from './src/screens/PatientDashboard';
import Treatments from './src/screens/Treatments';
import Inventory from './src/screens/Inventory';
import Reports from './src/screens/Reports';
import PredictiveAnalysis from './src/screens/PredictiveAnalysis';
import Settings from './src/screens/Settings';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="ProfessionalDashboard" component={ProfessionalDashboard} />
        <Stack.Screen name="PatientDashboard" component={PatientDashboard} />
        <Stack.Screen name="Treatments" component={Treatments} />
        <Stack.Screen name="Inventory" component={Inventory} />
        <Stack.Screen name="Reports" component={Reports} />
        <Stack.Screen name="PredictiveAnalysis" component={PredictiveAnalysis} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
