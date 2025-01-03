import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import Dashboard from "../screens/Dashboard";
import Treatments from "../screens/Treatments";
import Inventory from "../screens/Inventory";
import Reports from "../screens/Reports";
import PredictiveAnalysis from "../screens/PredictiveAnalysis";
import Settings from "../screens/Settings";

// mobile_app/src/components/Navigation.js

// Import Screens

const Drawer = createDrawerNavigator();

function Navigation() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Dashboard">
                <Drawer.Screen name="Dashboard" component={Dashboard} />
                <Drawer.Screen name="Treatments" component={Treatments} />
                <Drawer.Screen name="Inventory" component={Inventory} />
                <Drawer.Screen name="Reports" component={Reports} />
                <Drawer.Screen name="Predictive Analysis" component={PredictiveAnalysis} />
                <Drawer.Screen name="Settings" component={Settings} />
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

export default Navigation;