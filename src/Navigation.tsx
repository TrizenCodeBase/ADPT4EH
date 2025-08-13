import React from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import all screens
import LandingScreen from './LandingScreen';
import SignUpScreen from './SignUpScreen';
import LoginScreen from './LoginScreen';
import OTPVerificationScreen from './OTPVerificationScreen';
import ChooseLocationMethodScreen from './ChooseLocationMethodScreen';
import LocationInputScreen from './LocationInputScreen';
import LocationConfirmationScreen from './LocationConfirmationScreen';
import RoleSelectionScreen from './RoleSelectionScreen';
import PerformerHomeScreen from './PerformerHomeScreen';
import PosterHomeScreen from './PosterHomeScreen';
import SearchLocationScreen from './SearchLocationScreen';

const Stack = createStackNavigator();

// Custom navigation component that handles both web and mobile
const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Landing"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen name="Landing" component={LandingScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
        <Stack.Screen name="ChooseLocationMethod" component={ChooseLocationMethodScreen} />
        <Stack.Screen name="LocationInput" component={LocationInputScreen} />
        <Stack.Screen name="LocationConfirmation" component={LocationConfirmationScreen} />
        <Stack.Screen name="SearchLocation" component={SearchLocationScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="PerformerHome" component={PerformerHomeScreen} />
        <Stack.Screen name="PosterHome" component={PosterHomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation; 