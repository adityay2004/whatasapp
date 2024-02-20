import { StatusBar } from 'react-native'
import React from 'react'
import HomeScreen from './src/screens/HomeScreen'
import { Colors } from './src/theme/Colors'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './src/screens/ChatScreen';
import ContactScreen from './src/screens/ContactScreen';
import StartUpScreen from './src/screens/StartUpScreen';
import Auth from './src/screens/Auth';
import AddDetails from './src/screens/AddDetails';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <Stack.Navigator
        initialRouteName='StartUpScreen'
        screenOptions={{
          headerShown: false
        }}>
        <Stack.Screen name='StartUpScreen' component={StartUpScreen} />
        <Stack.Screen name='Auth' component={Auth} />
        <Stack.Screen name='AddDetails' component={AddDetails} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default App