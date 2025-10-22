// App.js
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import SplashScreen from './pages/boostrap/splash';
import HomePage from './pages/home/home';

const Stack = createStackNavigator();

export default function App() {
    return (

        <Stack.Navigator initialRouteName="Splash">

            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />

        </Stack.Navigator>

    );
}

