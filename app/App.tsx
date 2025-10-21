// App.js
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import Home from './pages/_layout';
import SplashScreen from './pages/boostrap/splash';


const Stack = createStackNavigator();

export default function App() {
    return (
        <Stack.Navigator initialRouteName="Home">
            
            <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={Home} />
        </Stack.Navigator>
    );
}

