import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from './SimpleNavigation';

export default function LandingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Logo Section */}
      <View style={styles.logoSection}>
        <Image
          source={require('../assets/images/extrahand-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Welcome Text */}
      <Text style={styles.welcomeText}>Welcome</Text>

      {/* Buttons Section */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={styles.signInButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.createAccountButton} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.createAccountButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 410,
    height: 110,
    alignSelf: 'center',
  },
  welcomeText: {
    fontSize: 28,
    color: '#9ca3af',
    marginBottom: 25,
    textAlign: 'center',
    fontWeight: '400',
  },
  buttonsContainer: {
    width: '100%',
    alignItems: 'center',
  },
  signInButton: {
    backgroundColor: '#f9b233',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    marginBottom: 20,
    // React Native Web deprecates shadow*; fall back to elevation and border for web
    elevation: 3,
    borderWidth: 0,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  createAccountButton: {
    borderColor: '#f9b233',
    borderWidth: 2,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '85%',
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 3,
  },
  createAccountButtonText: {
    color: '#f9b233',
    fontSize: 18,
    fontWeight: '600',
  },
});
