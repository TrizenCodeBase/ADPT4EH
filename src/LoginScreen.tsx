import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform, Image, Dimensions } from 'react-native';
import { useNavigation } from './SimpleNavigation';
import { signInWithEmail, signInWithGoogle, resetPassword } from './firebase';

const PRIMARY_YELLOW = '#f9b233';
const PRIMARY_BLUE = '#2563EB';
const DARK = '#222';
const GRAY = '#888';
const LIGHT_BG = '#f8fafc';

// Custom Social Media Icons using PNG images for consistency
const AppleIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/social-svg/icons8-apple-inc-48.png')}
      style={{ width: 24, height: 24 }}
      resizeMode="contain"
    />
  </View>
);

const GoogleIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/social-svg/icons8-google-48.png')}
      style={{ width: 24, height: 24 }}
      resizeMode="contain"
    />
  </View>
);

const FacebookIcon = () => (
  <View style={{ width: 24, height: 24, justifyContent: 'center', alignItems: 'center' }}>
    <Image 
      source={require('../assets/social-svg/icons8-facebook-48.png')}
      style={{ width: 44, height: 54 }}
      resizeMode="contain"
    />
  </View>
);

const EyeIcon = ({ visible }: { visible: boolean }) => (
  <Text style={{ fontSize: 18, color: '#666' }}>
    {visible ? '👁️' : '👁️‍🗨️'}
  </Text>
);

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  // Debug navigation object
  console.log('LoginScreen - Navigation object:', navigation);
  console.log('LoginScreen - Current route:', navigation.currentRoute);

  // Check if we're on mobile web view
  useEffect(() => {
    const checkScreenSize = () => {
      if (Platform.OS === 'web') {
        const { width } = Dimensions.get('window');
        const isMobile = width <= 768;
        console.log('Screen size check - Width:', width, 'isMobile:', isMobile);
        setIsMobileView(isMobile);
      } else {
        console.log('Native platform, setting isMobileView to true');
        setIsMobileView(true); // Always frameless on native mobile
      }
    };

    checkScreenSize();
    if (Platform.OS === 'web') {
      const subscription = Dimensions.addEventListener('change', checkScreenSize);
      return () => subscription?.remove();
    }
  }, []);

  const handleLogin = async () => {
    console.log('Login attempt - Platform:', Platform.OS, 'isMobileView:', isMobileView);
    console.log('Email:', email, 'Password length:', password.length);
    
    if (!email || !password) {
      console.log('Validation failed - missing email or password');
      if (Platform.OS === 'web') {
        alert('Please enter email and password.');
      } else {
        Alert.alert('Error', 'Please enter email and password.');
      }
      return;
    }
    
    setLoading(true);
    console.log('Starting login process...');
    
    try {
      const result = await signInWithEmail(email, password);

      if (result.success) {
        // Navigate based on user role
        const userRole = result.userData?.role || 'performer';
        const targetScreen = userRole === 'performer' ? 'PerformerHome' : 'PosterHome';
        
        console.log('Login successful, navigating to:', targetScreen);
        
        if (Platform.OS === 'web') {
          alert('Logged in successfully!');
        }
        navigation.navigate(targetScreen);
      } else {
        const errorMessage = result.error || 'Failed to log in';
        if (Platform.OS === 'web') {
          alert(errorMessage);
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = 'Something went wrong. Please try again.';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const result = await signInWithGoogle();

      if (result.success) {
        // Navigate based on user role
        const userRole = result.userData?.role || 'performer';
        const targetScreen = userRole === 'performer' ? 'PerformerHome' : 'PosterHome';
        
        if (Platform.OS === 'web') {
          alert('Logged in with Google successfully!');
        }
        navigation.navigate(targetScreen);
      } else {
        const errorMessage = result.error || 'Failed to log in with Google';
        if (Platform.OS === 'web') {
          alert(errorMessage);
        } else {
          Alert.alert('Error', errorMessage);
        }
      }
    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = 'Something went wrong. Please try again.';
      if (Platform.OS === 'web') {
        alert(errorMessage);
      } else {
        Alert.alert('Error', errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (title: string, message: string) => {
    if (Platform.OS === 'web') {
      // eslint-disable-next-line no-alert
      window.alert(`${title}\n\n${message}`);
    } else {
      Alert.alert(title, message);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      showAlert('Enter email', 'Please enter your email address to reset your password.');
      return;
    }
    setLoading(true);
    try {
      const res = await resetPassword(email);
      if (res.success) {
        showAlert('Password reset sent', 'We have emailed you a password reset link. Check your inbox.');
      } else {
        const msg =
          res.code === 'auth/invalid-email'
            ? 'The email address is not valid.'
            : res.code === 'auth/user-not-found'
            ? 'No user found with this email.'
            : 'Failed to send reset email. Please try again.';
        showAlert('Reset failed', msg);
      }
    } catch (e) {
      showAlert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Frameless layout for mobile (Android, iOS, and mobile web)
  if (isMobileView) {
    return (
      <View style={styles.androidContainer}>
        {/* Back Button */}
        <TouchableOpacity style={styles.androidBackButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>‹</Text>
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        {/* Title Section */}
        <View style={styles.androidTitleSection}>
          <Text style={styles.androidHeading}>Sign In</Text>
          <Text style={styles.androidSubtext}>Login to your account</Text>
        </View>

        {/* Form Fields */}
        <View style={styles.androidFormContainer}>
          <View style={styles.androidInputGroup}>
            <Text style={styles.androidLabel}>Email</Text>
            <TextInput
              style={styles.androidInput}
              placeholder="johndoe@gmail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          <View style={styles.androidInputGroup}>
            <Text style={styles.androidLabel}>Password</Text>
            <View style={styles.androidPasswordContainer}>
              <TextInput
                style={styles.androidPasswordInput}
                placeholder="************"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                placeholderTextColor="#999"
              />
              <TouchableOpacity 
                onPress={() => setShowPassword(!showPassword)} 
                style={styles.androidEyeIcon}
              >
                <EyeIcon visible={showPassword} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity style={styles.androidForgotContainer} onPress={handleForgotPassword}>
          <Text style={styles.androidForgotText}>Forgot Password?</Text>
        </TouchableOpacity>

                 {/* Login Button */}
         <TouchableOpacity
           style={styles.androidLoginButton}
           onPress={handleLogin}
           disabled={loading}
         >
           <Text style={styles.androidLoginButtonText}>
             {loading ? 'Logging in...' : 'Login'}
           </Text>
         </TouchableOpacity>

         {/* Test Navigation Button (for debugging) */}
         {/* <TouchableOpacity
           style={[styles.androidLoginButton, { marginTop: 10, backgroundColor: '#007AFF' }]}
           onPress={() => {
             console.log('Test navigation button pressed');
             navigation.navigate('PosterHome');
           }}
         >
           <Text style={styles.androidLoginButtonText}>
             Test Navigation to PosterHome
           </Text>
         </TouchableOpacity> */}

        {/* Social Login */}
        <View style={styles.androidSocialSection}>
          <Text style={styles.androidSocialText}>Or sign up with</Text>
          <View style={styles.androidSocialButtons}>
            <TouchableOpacity style={styles.androidSocialButton}>
              <AppleIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.androidSocialButton} onPress={handleGoogleLogin}>
              <GoogleIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.androidSocialButton}>
              <FacebookIcon />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sign Up Link */}
        <View style={styles.androidSignUpLink}>
          <Text style={styles.androidSignUpText}>
            Don't have an account? <Text style={styles.androidSignUpLinkText} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
          </Text>
        </View>
      </View>
    );
  }

  // Desktop web layout (with form frame)
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.heading}>Sign In</Text>
        <Text style={styles.subtext}>Login to your account</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="johndoe@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          editable={true}
        />
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, { flex: 1, marginBottom: 0 }]}
            placeholder="************"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={true}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
            <EyeIcon visible={showPassword} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.forgotContainer} onPress={handleForgotPassword}>
          <Text style={styles.forgotText}>Forgot Password?</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>{loading ? 'Logging in...' : 'Login'}</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>Or sign up with</Text>
          <View style={styles.divider} />
        </View>
        {/* Social Login Icons */}
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialIconButton}>
            <AppleIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconButton} onPress={handleGoogleLogin}>
            <GoogleIcon />
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialIconButton}>
            <FacebookIcon />
          </TouchableOpacity>
        </View>
        <Text style={styles.footerText}>
          Don't have an account ?{' '}
          <Text style={styles.signupText} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
        </Text>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', // changed from 'flex-start' to 'center' for vertical centering
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
  },
  card: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 32,
    ...(Platform.OS === 'web' ? {
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
    } : {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
      elevation: 4,
    }),
    alignItems: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 4,
    marginTop: 60,
    textAlign: 'center',
  },
  subtext: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 13,
    color: DARK,
    marginBottom: 2,
    marginTop: 6,
    fontWeight: '500',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    fontSize: 16,
    backgroundColor: LIGHT_BG,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  eyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  forgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  forgotText: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 14,
  },
  loginButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: PRIMARY_YELLOW,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: GRAY,
  },
  dividerText: {
    marginHorizontal: 8,
    color: GRAY,
    fontWeight: 'bold',
    fontSize: 13,
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 16,
    gap: 16,
  },
  socialIconButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 10,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  footerText: {
    fontSize: 14,
    color: DARK,
    marginTop: 12,
    textAlign: 'center',
  },
  signupText: {
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  // New styles for Android layout
  androidContainer: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  androidBackButton: {
    position: 'absolute',
    top: 40,
    left: 16,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backArrow: {
    fontSize: 22,
    color: DARK,
    marginRight: 8,
  },
  backText: {
    fontSize: 16,
    color: DARK,
    fontWeight: 'bold',
  },
  androidTitleSection: {
    alignItems: 'center',
    marginTop: 100,
    marginBottom: 20,
  },
  androidHeading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DARK,
    marginBottom: 4,
  },
  androidSubtext: {
    fontSize: 14,
    color: GRAY,
    marginBottom: 20,
  },
  androidFormContainer: {
    width: '100%',
    marginBottom: 16,
  },
  androidInputGroup: {
    marginBottom: 12,
  },
  androidLabel: {
    fontSize: 13,
    color: DARK,
    marginBottom: 2,
    fontWeight: '500',
  },
  androidInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: LIGHT_BG,
  },
  androidPasswordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 8,
  },
  androidPasswordInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: GRAY,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: LIGHT_BG,
  },
  androidEyeIcon: {
    position: 'absolute',
    right: 16,
    padding: 4,
  },
  androidForgotContainer: {
    alignSelf: 'flex-end',
    marginBottom: 16,
  },
  androidForgotText: {
    color: PRIMARY_YELLOW,
    fontWeight: '600',
    fontSize: 14,
  },
  androidLoginButton: {
    width: '100%',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: PRIMARY_YELLOW,
  },
  androidLoginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  androidSocialSection: {
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  androidSocialText: {
    fontSize: 13,
    color: GRAY,
    marginBottom: 12,
  },
  androidSocialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
  },
  androidSocialButton: {
    backgroundColor: '#fff',
    borderRadius: 32,
    padding: 10,
    borderWidth: 0.4,
    borderColor: GRAY,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  androidSignUpLink: {
    alignItems: 'center',
  },
  androidSignUpText: {
    fontSize: 14,
    color: DARK,
  },
  androidSignUpLinkText: {
    color: PRIMARY_BLUE,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
}); 